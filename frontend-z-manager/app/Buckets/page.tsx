'use client'

import React, { useEffect, useState } from 'react';
import api from '../api/axiosInstance';
import ConfirmModal from '@/components/ConfirmModal';
import LoadingSpinner from '@/components/LoadingSpinner';

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
  const [newBucketName, setNewBucketName] = useState<string>('');
  const [isAddingBucket, setIsAddingBucket] = useState<boolean>(false);
  const [bucketToDelete, setBucketToDelete] = useState<{ id: number; name: string } | null>(null);

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
    setBucketToDelete(null);
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

  const handleAddBucket = async () => {
    if (!newBucketName.trim()) {
      setError('Bucket name cannot be empty');
      return;
    }

    try {
      const response = await api.post(`/users/${user_id}/buckets`, {
        name: newBucketName.trim(),
        user_id: parseInt(user_id)
      });

      const newBucket = response.data;
      setBuckets(prevBuckets => 
        prevBuckets ? [...prevBuckets, { ...newBucket, bucketItems: [] }] : [{ ...newBucket, bucketItems: [] }]
      );

      setNewBucketName('');
      setIsAddingBucket(false);
      setError(null);
    } catch (error: any) {
      let errorMessage = 'Failed to add new bucket';
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

  const handleDeleteBucket = async (bucketId: number, bucketName: string) => {
    setBucketToDelete({ id: bucketId, name: bucketName });
    setIsModalOpen(true);
  };

  const confirmDeleteBucket = async () => {
    if (!bucketToDelete) return;

    try {
      await api.delete(`/users/${user_id}/buckets/${bucketToDelete.id}`);
      setBuckets(prevBuckets => 
        prevBuckets ? prevBuckets.filter(bucket => bucket.id !== bucketToDelete.id) : []
      );
      setIsModalOpen(false);
      setBucketToDelete(null);
    } catch (error: any) {
      console.error('Error deleting bucket:', error);
      let errorMessage = 'Failed to delete bucket';
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

  return (
    <div className="min-h-screen bg-black py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        <h1 className="text-4xl font-bold text-white mb-8">My Buckets</h1>
        {isLoading ? (
          <LoadingSpinner />
        ) : error ? (
          <p className="text-red-500 bg-red-100 border border-red-400 rounded-lg p-4 mb-4">{error}</p>
        ) : buckets === null ? (
          <p className="text-gray-500">Loading buckets...</p>
        ) : (
          <>
            <div className="mb-8">
              {isAddingBucket ? (
                <div className="flex items-center space-x-2">
                  <input
                    type="text"
                    value={newBucketName}
                    onChange={(e) => setNewBucketName(e.target.value)}
                    className="flex-grow border border-gray-300 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                    placeholder="New bucket name"
                  />
                  <button
                    onClick={handleAddBucket}
                    className="bg-blue-500 hover:bg-blue-600 text-white font-semibold py-2 px-4 rounded-lg transition duration-150 ease-in-out"
                  >
                    Add Bucket
                  </button>
                  <button
                    onClick={() => {
                      setIsAddingBucket(false);
                      setNewBucketName('');
                    }}
                    className="bg-gray-300 hover:bg-gray-400 text-gray-800 font-semibold py-2 px-4 rounded-lg transition duration-150 ease-in-out"
                  >
                    Cancel
                  </button>
                </div>
              ) : (
                <button
                  onClick={() => setIsAddingBucket(true)}
                  className="bg-blue-500 hover:bg-blue-600 text-white font-semibold py-2 px-4 rounded-lg transition duration-150 ease-in-out"
                >
                  Add New Bucket
                </button>
              )}
            </div>
            {buckets.length === 0 ? (
              <p className="text-gray-500">No buckets found.</p>
            ) : (
              <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
                {buckets.map((bucket) => (
                  <div key={bucket.id} className="bg-white overflow-hidden shadow-lg rounded-lg transition duration-150 ease-in-out hover:shadow-xl">
                    <div className="px-6 py-5">
                      <div className="flex justify-between items-center mb-4">
                        <h2 className="text-2xl font-semibold text-gray-900">{bucket.name}</h2>
                        <button 
                          className="bg-red-500 hover:bg-red-600 text-white font-semibold py-1 px-3 rounded-lg transition duration-150 ease-in-out"
                          onClick={() => handleDeleteBucket(bucket.id, bucket.name)}
                        >
                          Delete Bucket
                        </button>
                      </div>
                      {bucket.bucketItems && bucket.bucketItems.length > 0 ? (
                        <ul className="space-y-3">
                          {bucket.bucketItems.map((item) => (
                            <li key={item.id} className="bg-gray-50 px-4 py-3 rounded-lg flex justify-between items-center hover:bg-gray-100 transition duration-150 ease-in-out">
                              <h3 className="text-sm font-medium text-gray-900">{item.name}</h3>
                              <button 
                                className="bg-red-100 hover:bg-red-200 text-red-600 font-semibold py-1 px-3 rounded-lg transition duration-150 ease-in-out"
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
                        <div className="mt-4 flex items-center space-x-2">
                          <input
                            type="text"
                            value={newItemName}
                            onChange={(e) => setNewItemName(e.target.value)}
                            className="flex-grow border border-gray-300 rounded-lg px-3 py-1 focus:outline-none focus:ring-2 focus:ring-blue-500"
                            placeholder="New item name"
                          />
                          <button
                            onClick={() => handleAddItem(bucket.id)}
                            className="bg-green-500 hover:bg-green-600 text-white font-semibold py-1 px-3 rounded-lg transition duration-150 ease-in-out"
                          >
                            Add
                          </button>
                          <button
                            onClick={() => {
                              setAddingItemToBucketId(null);
                              setNewItemName('');
                            }}
                            className="bg-gray-300 hover:bg-gray-400 text-gray-800 font-semibold py-1 px-3 rounded-lg transition duration-150 ease-in-out"
                          >
                            Cancel
                          </button>
                        </div>
                      ) : (
                        <button
                          onClick={() => setAddingItemToBucketId(bucket.id)}
                          className="mt-4 bg-blue-500 hover:bg-blue-600 text-white font-semibold py-2 px-4 rounded-lg transition duration-150 ease-in-out"
                        >
                          Add New Item
                        </button>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </>
        )}
      </div>
      <ConfirmModal
        isOpen={isModalOpen}
        onClose={closeModal}
        onConfirm={bucketToDelete ? confirmDeleteBucket : confirmDelete}
        itemName={bucketToDelete ? bucketToDelete.name : (itemToDelete?.name || '')}
      />
    </div>
  );

}