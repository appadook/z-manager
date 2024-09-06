'use client'

import React, { useEffect, useState } from 'react';
import api from '../api/axiosInstance';

type BucketItem = {
  id: number;
  name: string;
  description: string;
}

type Bucket = {
  id: number;
  name: string;
  items: BucketItem[];
}

export default function Buckets() {
  const [buckets, setBuckets] = useState<Bucket[]>([]);
  const [error, setError] = useState<string | null>(null);
  const user_id = '1'; // Replace with actual user ID or authentication logic

  useEffect(() => {
    async function fetchBuckets() {
      try {
        const response = await api.get(`/users/${user_id}/buckets`);
        setBuckets(response.data);
      } catch (error) {
        console.error('Error fetching buckets:', error);
        setError('Failed to fetch buckets');
      }
    }

    fetchBuckets();
  }, []);

  return (
    <div className="min-h-screen bg-gray-100 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        <h1 className="text-3xl font-bold text-gray-900 mb-8">My Buckets</h1>
        {error ? (
          <p className="text-red-500">{error}</p>
        ) : (
          <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {buckets.map((bucket) => (
              <div key={bucket.id} className="bg-white overflow-hidden shadow-sm rounded-lg">
                <div className="px-4 py-5 sm:p-6">
                  <h2 className="text-xl font-semibold text-gray-900 mb-4">{bucket.name}</h2>
                  <ul className="space-y-3">
                    {bucket.items.map((item) => (
                      <li key={item.id} className="bg-gray-50 px-4 py-3 rounded-md">
                        <h3 className="text-sm font-medium text-gray-900">{item.name}</h3>
                        <p className="mt-1 text-sm text-gray-500">{item.description}</p>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
