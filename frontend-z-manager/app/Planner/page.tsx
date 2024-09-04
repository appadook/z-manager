'use client'

import React, { useEffect, useRef, useState } from 'react';
import FullCalendar from '@fullcalendar/react';
import { CalendarApi } from '@fullcalendar/core'; 
import timeGridPlugin from '@fullcalendar/timegrid';
import interactionPlugin, { Draggable } from '@fullcalendar/interaction';
import api from '../api/axiosInstance';


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

  // Fetch buckets from the backend
  useEffect(() => {
    async function fetchBuckets() {
      try {
        const response = await api.get(`/users/${user_id}/buckets`);
        setBuckets(response.data);
      } catch (error) {
        console.error('Error fetching buckets:', error);
        setError('failed to fetch buckets')
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


  const handleEventReceive = (info: any) => {
    if (calendarRef.current) {
      const calendarApi = calendarRef.current.getApi();
      const existingEvents = calendarApi.getEvents(); // Get all existing events
      
  
      // Check if the event is already present (compare by id or another unique identifier)
      const isDuplicate = existingEvents.some(event => event.id === info.event.id);
  
      if (isDuplicate) {
        console.log('Duplicate event detected. Removing the new event.');
        // info.event.remove(); // Remove the duplicate event
      } else {
        console.log('New event added:', info.event);
        // Add your event handling logic here
      }
    }
  };

  const handleEventDrop = (info: any) => {
    console.log('Event dropped:', info.event);
    // Handle the drop logic here
  };

  const handleEventDragStop = (info: any) => {
    
    const calendarEl = document.querySelector('.fc'); // Query the calendar DOM
    if (calendarEl) {
      const rect = calendarEl.getBoundingClientRect();
      if (
        info.jsEvent.pageX < rect.left ||
        info.jsEvent.pageX > rect.right ||
        info.jsEvent.pageY < rect.top ||
        info.jsEvent.pageY > rect.bottom
      ) {
        // The event was dragged out of the calendar, so remove it
        info.event.remove();
        console.log('Event removed after dragging out of the calendar');
      }
    }
    
  };

  return (
    <div className="planner-page">
    {error?(
        <p className="" >{error}</p>
    ) : (
        <>
        <h1>My Buckets</h1>
        <><div id="draggable-container" className="buckets-container flex justify-around w-full my-4">
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
                  </div><div className="planner-container w-full">
                          <FullCalendar
                              plugins={[timeGridPlugin, interactionPlugin]}
                              initialView="timeGridWeek"
                              editable={true}
                              droppable={true}
                              eventReceive={handleEventReceive}
                              eventDrop={handleEventDrop}
                              eventDragStop={handleEventDragStop}
                              ref={calendarRef}
                              events={[]}
                          />
                      </div></>
                      </>
    )
    }
    
    </div>
  );
}
