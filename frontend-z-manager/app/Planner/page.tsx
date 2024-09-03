'use client'

import React, { useEffect, useRef, useState } from 'react';
import FullCalendar from '@fullcalendar/react';
import timeGridPlugin from '@fullcalendar/timegrid';
import interactionPlugin, { Draggable } from '@fullcalendar/interaction';
import api from '../api/axiosInstance';


export default function Planner() {
  const calendarRef = useRef(null);
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
        const response = await api.get('/users/1/buckets');
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
    console.log('Event received:', info.event);
    // Here you can save the event to your backend or update the UI
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
                              ref={calendarRef}
                              events={[]} // Load events from your backend if needed
                          />
                      </div></>
                      </>
    )
    }
    
    </div>
  );
}
