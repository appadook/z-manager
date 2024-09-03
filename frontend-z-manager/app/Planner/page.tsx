'use client'

import React from 'react';
import {useState, useEffect} from 'react';
import FullCalendar from '@fullcalendar/react';
import timeGridPlugin from '@fullcalendar/timegrid';
import interactionPlugin from '@fullcalendar/interaction'; // for drag and drop
import styles from './Planner.module.css';
import api from '../api/axiosInstance';


export default function Planner() {

  type BucketProps = {
    id: number
    name: string
    user_id: number
  }

  const user_id:string = '1';

  const [buckets, setBuckets] = useState<BucketProps[]>([]);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchBuckets = async () => {
      try{
        const response = await api.get(`/users/1/buckets`);
        setBuckets(response.data);
      }
      catch(error){
        console.error('Error fetching buckets:', error);
        setError('failed to fetch buckets');
      }
    };

    fetchBuckets();
  }, []);


    return (
        <>
        {error ? (
          <p className="text-red-500">{error}</p>
        ) : (
          <div className='buckets-container'> 
        <h1>My Buckets</h1>
        <div className="buckets-container flex justify-around w-full my-4">
            {buckets.map((bucket) => (
              <div
              key={bucket.id}
              className="bucket-item bg-blue-500 text-white p-4 rounded cursor-pointer"
              draggable="true"
              onDragStart={(e) => {
                console.log('Dragging started:', bucket.name);
                e.dataTransfer.setData(
                  'application/json',
                  JSON.stringify({
                    title: bucket.name,
                    start: new Date(new Date().setHours(new Date().getHours() + 4))
                  })
                );
              }}
            >
              {bucket.name}
            </div>
            ))}
          </div>
        </div>
        )}
        

        <div className={`text-white `}>
        <FullCalendar
        plugins={[timeGridPlugin, interactionPlugin]}
        initialView="timeGridDay"
        editable={true}
        droppable={true}
        eventReceive={(info) => {
          // Here you can save the event to your backend
          const event = info.event;
          console.log('Event received:', event);
          // You may want to send this event to your backend to save it
        }}
        headerToolbar={{
          left: 'prev,next today',
          center: 'title',
          right: 'timeGridDay,timeGridWeek',
        }}
        events={[
          { title: 'Meeting', start: new Date() },
          { title: 'Lunch', start: new Date(new Date().setHours(new Date().getHours() + 4)) },
        ]}
        eventContent={(eventInfo) => (
          <div className={`${styles.customEvent} ${styles.customEventTransition} ${styles.customNoGrid}`}>
            <strong>{eventInfo.timeText}</strong>
            <i>{eventInfo.event.title}</i>
          </div>
        )}
      />
        </div>
      </>
    );
  }