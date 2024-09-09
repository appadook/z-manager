'use client'

import React, { useEffect, useRef, useState } from 'react';
import FullCalendar from '@fullcalendar/react';
import { CalendarApi } from '@fullcalendar/core'; 
import timeGridPlugin from '@fullcalendar/timegrid';
import interactionPlugin, { Draggable } from '@fullcalendar/interaction';
import api from '../api/axiosInstance';
import { debounce } from 'lodash';
import LoadingSpinner from '@/components/LoadingSpinner';

export default function Planner() {
  const calendarRef = useRef<FullCalendar>(null);
  type BucketProps = {
    id: number
    name: string
    user_id: number
  }

  const user_id:string = '1';

  const [buckets, setBuckets] = useState<BucketProps[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  // Fetch buckets from the backend
  useEffect(() => {
    async function fetchBuckets() {
      try {
        const response = await api.get(`/users/${user_id}/buckets`);
        setBuckets(response.data);
      } catch (error) {
        console.error('Error fetching buckets:', error);
        setError('Failed to fetch buckets');
      } finally {
        setLoading(false);
      }
    }

    fetchBuckets();

    // Initialize draggable elements
    let draggableEl = document.getElementById('draggable-container');
    if (draggableEl) {
      new Draggable(draggableEl, {
        itemSelector: '.bucket-item', // Class for draggable items
        eventData: function (eventEl) {
          return {
            title: eventEl.innerText.trim(),
            id: eventEl.getAttribute('data-id'),
          };
        },
      });
    }
  }, []);


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

  const handleEventDragStop = (info: any) => {
    console.log('Drag stopped', info.event.title, info.event.start);

    const calendarEl = document.querySelector('.fc');
    if (!calendarEl) {
      console.log('Calendar element not found');
      return;
    }

    const rect = calendarEl.getBoundingClientRect();
    const { clientX, clientY } = info.jsEvent;

    console.log('Calendar rect:', rect);
    console.log('Mouse position:', clientX, clientY);

    if (
      clientX < rect.left ||
      clientX > rect.right ||
      clientY < rect.top ||
      clientY > rect.bottom
    ) {
      console.log('Event dragged outside calendar');
      info.event.remove();
    } else {
      console.log('Event dragged inside calendar');
    }
  };

  return (
    <div className="planner-page">
      {loading ? (
        <LoadingSpinner />
      ) : (
        <>
        <h1>My Buckets</h1>
        {error && <p className="text-red-500">{error}</p>}
        <div id="draggable-container" className="buckets-container flex justify-around w-full my-4">
                      {buckets.map((bucket) => (
                          <div
                              key={bucket.id}
                              className="bucket-item bg-blue-500 text-white p-4 rounded cursor-pointer"
                              draggable="true"
                              data-id={bucket.id}
                          >
                              {bucket.name}
                          </div>
                      ))}
                  </div><div className="p-4 border rounded-lg shadow-lg planner-container w-full p-4 mt-6 mx-auto max-w-7xl">
                          <FullCalendar
                              plugins={[timeGridPlugin, interactionPlugin]}
                              initialView="timeGridWeek"
                              editable={true}
                              droppable={true}
                              eventReceive={debouncedHandleEventReceive}
                              eventDrop={handleEventDrop}
                              eventDragStop={handleEventDragStop}
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
                              height="auto"
                            
                          />
                      </div></>
                      
    )
    }
    
    </div>
  );
}
