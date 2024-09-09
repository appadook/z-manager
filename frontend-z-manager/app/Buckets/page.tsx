'use client'

import React, { useEffect, useState } from 'react';
import api from '../api/axiosInstance';
import ConfirmModal from '@/components/ConfirmModal';
import LoadingSpinner from '@/components/LoadingSpinner'; // You'll need to create this component

type BucketItem = {
  id: number;
  name: string;
  user_id: number;
  bucket_id: number;
};

type Bucket = {
  id: number;
  name: string;
  bucketItems: BucketItem[]; 
}

export default function Buckets() {
  const [buckets, setBuckets] = useState<Bucket[] | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const user_id = '1'; // Replace with actual user ID or authentication logic
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [itemToDelete, setItemToDelete] = useState<{ bucketId: number; itemId: number; name: string } | null>(null);
  const [newItemName, setNewItemName] = useState<string>('');
  const [addingItemToBucketId, setAddingItemToBucketId] = useState<number | null>(null);

  useEffect(() => {
    async function fetchBuckets() {
      setIsLoading(true);
      setError(null);
      try {
        const response = await api.get(`/users/${user_id}/buckets`);
        const fetchedBuckets = response.data;
        if (Array.isArray(fetchedBuckets)) {
          setBuckets(fetchedBuckets);
        } else {
          setError('Received invalid data format from server');
          setBuckets([]); // Set to empty array to avoid rendering issues
        }
      } catch (error: any) {
        let errorMessage = 'Failed to fetch buckets';
        if (error.response) {
          errorMessage = `Server error: ${error.response.status} - ${error.response.data.message || error.response.statusText}`;
        } else if (error.request) {
          errorMessage = 'No response received from server';
        } else {
          errorMessage = error.message;
        }
        setError(errorMessage);
        setBuckets([]); // Set to empty array to avoid rendering issues
      } finally {
        setIsLoading(false);
      }
    }

    fetchBuckets();
  }, []);

  const handleDeleteItem = async (bucketId: number, itemId: number, itemName: string) => {
    setItemToDelete({ bucketId, itemId, name: itemName });
    setIsModalOpen(true);
  };

  const confirmDelete = async () => {
    if (!itemToDelete) return;

    try {
      await api.delete(`/users/${user_id}/buckets/${itemToDelete.bucketId}/items/${itemToDelete.itemId}`);
      setBuckets(prevBuckets => 
        prevBuckets ? prevBuckets.map(bucket => 
          bucket.id === itemToDelete.bucketId
            ? { ...bucket, bucketItems: bucket.bucketItems.filter(item => item.id !== itemToDelete.itemId) }
            : bucket
        ) : []
      );
      setIsModalOpen(false);
      setItemToDelete(null);
    } catch (error: any) {
      console.error('Error deleting item:', error);
      let errorMessage = 'Failed to delete item';
      if (error.response) {
        errorMessage = `Server error: ${error.response.status} - ${error.response.data.message || error.response.statusText}`;
      } else if (error.request) {
        errorMessage = 'No response received from server';
      } else {
        errorMessage = error.message;
      }
      setError(errorMessage);
      setIsModalOpen(false);
    }
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setItemToDelete(null);
  };

  const handleAddItem = async (bucketId: number) => {
    if (!newItemName.trim()) {
      setError('Item name cannot be empty');
      return;
    }

    try {
      const response = await api.post(`/users/${user_id}/buckets/${bucketId}/items`, {
        name: newItemName.trim(),
        user_id: parseInt(user_id),
        bucket_id: bucketId
      });

      const newItem = response.data;
      console.log(newItem);

      setBuckets(prevBuckets => 
        prevBuckets ? prevBuckets.map(bucket => 
          bucket.id === bucketId
            ? { ...bucket, bucketItems: [...bucket.bucketItems, newItem] }
            : bucket
        ) : []
      );

      setNewItemName('');
      setAddingItemToBucketId(null);
      setError(null);
    } catch (error: any) {
      let errorMessage = 'Failed to add new item';
      if (error.response) {
        errorMessage = `Server error: ${error.response.status} - ${error.response.data.message || error.response.statusText}`;
      } else if (error.request) {
        errorMessage = 'No response received from server';
      } else {
        errorMessage = error.message;
      }
      setError(errorMessage);
    }
  };

  return (
    <div className="min-h-screen py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        <h1 className="text-3xl font-bold text-white mb-8">My Buckets</h1>
        {isLoading ? (
          <LoadingSpinner />
        ) : error ? (
          <p className="text-red-500 bg-red-100 border border-red-400 rounded p-4 mb-4">{error}</p>
        ) : buckets === null ? (
          <p className="text-gray-500">Loading buckets...</p>
        ) : buckets.length === 0 ? (
          <p className="text-gray-500">No buckets found.</p>
        ) : (
          <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {buckets.map((bucket) => (
              <div key={bucket.id} className="bg-white overflow-hidden shadow-sm rounded-lg">
                <div className="px-4 py-5 sm:p-6">
                  <h2 className="text-xl font-semibold text-gray-900 mb-4">{bucket.name}</h2>
                  {bucket.bucketItems && bucket.bucketItems.length > 0 ? (
                    <ul className="space-y-3">
                      {bucket.bucketItems.map((item) => (
                        <li key={item.id} className="bg-gray-50 px-4 py-3 rounded-md flex justify-between items-center">
                          <div>
                            <h3 className="text-sm font-medium text-gray-900">{item.name}</h3>
                          </div>
                          <button 
                            className="bg-red-500 hover:bg-red-600 text-white font-bold py-1 px-2 rounded"
                            onClick={() => handleDeleteItem(bucket.id, item.id, item.name)}
                          >
                            Delete
                          </button>
                        </li>
                      ))}
                    </ul>
                  ) : (
                    <p className="text-gray-500">No items in this bucket.</p>
                  )}
                  {addingItemToBucketId === bucket.id ? (
                    <div className="mt-4">
                      <input
                        type="text"
                        value={newItemName}
                        onChange={(e) => setNewItemName(e.target.value)}
                        className="border rounded px-2 py-1 mr-2 text-black" // Added text-black class
                        placeholder="New item name"
                      />
                      <button
                        onClick={() => handleAddItem(bucket.id)}
                        className="bg-green-500 hover:bg-green-600 text-white font-bold py-1 px-2 rounded"
                      >
                        Add
                      </button>
                      <button
                        onClick={() => {
                          setAddingItemToBucketId(null);
                          setNewItemName('');
                        }}
                        className="ml-2 bg-gray-300 hover:bg-gray-400 text-gray-800 font-bold py-1 px-2 rounded"
                      >
                        Cancel
                      </button>
                    </div>
                  ) : (
                    <button
                      onClick={() => setAddingItemToBucketId(bucket.id)}
                      className="mt-4 bg-blue-500 hover:bg-blue-600 text-white font-bold py-2 px-4 rounded"
                    >
                      Add New Item
                    </button>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
      <ConfirmModal
        isOpen={isModalOpen}
        onClose={closeModal}
        onConfirm={confirmDelete}
        itemName={itemToDelete?.name || ''}
      />
    </div>
  );
}
