'use client'

import React, { useEffect, useRef, useState } from 'react';
import FullCalendar from '@fullcalendar/react';
import { CalendarApi } from '@fullcalendar/core'; 
import timeGridPlugin from '@fullcalendar/timegrid';
import interactionPlugin, { Draggable, EventDragStopArg } from '@fullcalendar/interaction';
import api from '../api/axiosInstance';
import { debounce } from 'lodash';
import LoadingSpinner from '@/components/LoadingSpinner';
import { EventDropArg } from '@fullcalendar/core';
import { log } from 'console';
import ConfirmModal from '@/components/ConfirmModal'; // Add this import

export default function Planner() {
  const calendarRef = useRef<FullCalendar>(null);
  type BucketProps = {
    id: number
    name: string
    user_id: number
    bucketItems: BucketItemProps[]
  }

  type BucketItemProps = {
    id: number
    name: string
    bucket_id: number
  }

  const user_id:string = '1';

  const [buckets, setBuckets] = useState<BucketProps[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [isConfirmModalOpen, setIsConfirmModalOpen] = useState(false);
  const [eventToDelete, setEventToDelete] = useState<any>(null);

  // Fetch buckets and their items from the backend
  useEffect(() => {
    async function fetchBuckets() {
      try {
        const response = await api.get(`/users/${user_id}/buckets?include=items`);
        setBuckets(response.data);
      } catch (error) {
        console.error('Error fetching buckets:', error);
        setError('Failed to fetch buckets');
      } finally {
        setLoading(false);
      }
    }

    fetchBuckets();
  }, []);

  useEffect(() => {
    // Initialize draggable elements
    const draggableEl = document.getElementById('draggable-container');
    if (draggableEl) {
      new Draggable(draggableEl, {
        itemSelector: '.fc-event.bucket-item',
        eventData: function(eventEl) {
          return {
            title: eventEl.innerText,
            id: eventEl.getAttribute('data-id'),
          };
        },
      });
    }
  }, [buckets]); // Re-run this effect when buckets change

  const debouncedHandleEventReceive = debounce((info: any) => {
    console.log('handleEventReceive called', info.event.id);

    if (calendarRef.current) {
      const calendarApi = calendarRef.current.getApi();
      
      // Check if an event with this ID already exists
      const existingEvent = calendarApi.getEventById(info.event.id);
      
      if (existingEvent) {
        console.log('Duplicate event detected. Removing the new event.');
        info.event.remove();
      } else {
        console.log('New event added:', info.event);
        // Generate a new unique ID for the event
        const newId = `${info.event.id}-${Date.now()}`;
        
        // Delay the event addition slightly
        setTimeout(() => {
          info.event.setProp('id', newId);
          info.event.remove(); // Remove the original event
          calendarApi.addEvent({ // Add a new event with animation
            ...info.event.toPlainObject(),
            id: newId,
            className: 'scale-in'
          });
        }, 50);
      }
    }
  }, 100); // 100ms debounce time

  const handleEventDrop = (info: any) => {
    console.log('handleEventDrop called', info);

    const calendarApi = calendarRef.current?.getApi();
    if (!calendarApi) {
      console.log('Calendar API not available');
      return;
    }

    const calendarStart = calendarApi.view.activeStart;
    const calendarEnd = calendarApi.view.activeEnd;
    
    console.log('Calendar range:', calendarStart, calendarEnd);
    console.log('Event range:', info.event.start, info.event.end);

    if (info.event.start < calendarStart || info.event.end > calendarEnd) {
      // The event was dropped outside the calendar's time range, so remove it
      info.event.remove();
      console.log('Event removed after dropping outside the calendar');
    } else {
      console.log('Event dropped within the calendar:', info.event);
      // Handle the drop logic here for events within the calendar
    }
  };

  const handleEventDragStop = (info: EventDragStopArg) => {
    const calendarEl = document.querySelector('.fc');
    if (!calendarEl) {
      console.log('Calendar element not found');
      return;
    }

    const rect = calendarEl.getBoundingClientRect();
    const { clientX, clientY } = info.jsEvent;

    if (
      clientX < rect.left ||
      clientX > rect.right ||
      clientY < rect.top ||
      clientY > rect.bottom
    ) {
      console.log('Event dragged outside calendar');
      
      // Remove the event from the calendar
      if (calendarRef.current) {
        const calendarApi = calendarRef.current.getApi();
        const event = calendarApi.getEventById(info.event.id);
        if (event) {
          try {
            event.remove();
            console.log('Event successfully removed from calendar');
            
            // Find the original bucket item and add it back to the bucket
            const itemId = info.event.id.split('-')[0];
            const updatedBuckets = buckets.map(bucket => ({
              ...bucket,
              bucketItems: bucket.bucketItems.some(item => item.id.toString() === itemId)
                ? bucket.bucketItems
                : [...bucket.bucketItems, { id: parseInt(itemId), name: info.event.title, bucket_id: bucket.id }]
            }));
            
            setBuckets(updatedBuckets);
          } catch (error) {
            console.error('Error removing event:', error);
          }
        } else {
          console.log('Event not found in calendar');
        }
      }
    } else {
      console.log('Event dragged inside calendar');
    }
  };

  const handleEventClick = (clickInfo: any) => {
    setEventToDelete(clickInfo.event);
    setIsConfirmModalOpen(true);
  };

  const handleConfirmDelete = () => {
    if (eventToDelete) {
      eventToDelete.remove();
      console.log('Event removed:', eventToDelete);
    }
    setIsConfirmModalOpen(false);
    setEventToDelete(null);
  };

  const handleCloseModal = () => {
    setIsConfirmModalOpen(false);
    setEventToDelete(null);
  };

  return (
    <div className="planner-page">
      {loading ? (
        <LoadingSpinner />
      ) : (
        <>
        <h1 className="text-3xl font-bold text-white mb-6 text-center">My Buckets</h1>
        {error && <p className="text-red-500">{error}</p>}
        <div className="mx-8 bg-gray-800 p-6 rounded-lg mb-6">
          <div id="draggable-container" className="buckets-container flex flex-wrap justify-around w-full m-4">
            {buckets.map((bucket) => (
                <div
                    key={bucket.id}
                    className="bucket bg-gray-100 p-4 rounded-lg m-2"
                >
                    <h2 className="text-lg text-black font-bold mb-2">{bucket.name}</h2>
                    <div className="bucket-items">
                        {bucket.bucketItems.map((item) => (
                            <div
                                key={item.id}
                                className="fc-event bucket-item bg-blue-500 text-white p-2 rounded cursor-pointer mb-2"
                                draggable="true"
                                data-id={item.id}
                            >
                                {item.name}
                            </div>
                        ))}
                    </div>
                </div>
            ))}
          </div>
        </div>
        <div className="border rounded-lg shadow-lg planner-container w-full p-4 mt-6 mx-auto max-w-7xl">
            <FullCalendar
                plugins={[timeGridPlugin, interactionPlugin]}
                initialView="timeGridWeek"
                editable={true}
                droppable={true}
                eventReceive={debouncedHandleEventReceive}
                eventDrop={handleEventDrop}
                eventDragStop={handleEventDragStop}
                eventRemove={(info) => console.log('event removed', info)}
                eventClick={handleEventClick}
                ref={calendarRef}
                events={[]}
                eventDidMount={(info) => {
                  info.el.classList.add('scale-in');
                  info.el.style.opacity = '0';
                  info.el.style.transform = 'scale(0.8)';
                  requestAnimationFrame(() => {
                    info.el.style.opacity = '1';
                    info.el.style.transform = 'scale(1)';
                  });
                }}
                eventColor="#3788d8"
                eventTextColor="#ffffff"
                eventBackgroundColor="#3788d8"
                eventBorderColor="#3788d8"
                eventTimeFormat={{
                  hour: 'numeric',
                  minute: '2-digit',
                  meridiem: 'short'
                }}
                eventDragStart={(info) => console.log('Drag started', info)}
                height="600px"
            />
        </div>
        <ConfirmModal
          isOpen={isConfirmModalOpen}
          onClose={handleCloseModal}
          onConfirm={handleConfirmDelete}
          itemName={eventToDelete ? eventToDelete.title : ''}
        />
        </>
      )
      }
      
    </div>
  );
}
