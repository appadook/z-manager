import { NextResponse } from 'next/server';
import api from '../axiosInstance'; // Adjust the path based on your directory structure

// GET: Fetch all buckets for a specific user
export async function GET(request: Request, { params }: { params: { userId: string } }) {
  const { userId } = params;

  try {
    // Fetch buckets for the specific user
    const response = await api.get(`/users/${userId}/buckets`);
    return NextResponse.json(response.data);
  } catch (error) {
    console.error('Error fetching buckets:', error);
    return NextResponse.json({ error: 'Failed to fetch buckets' }, { status: 500 });
  }
}

// POST: Create a new bucket for a specific user
export async function POST(request: Request, { params }: { params: { userId: string } }) {
  const { userId } = params;

  try {
    const body = await request.json();
    const response = await api.post(`/users/${userId}/buckets`, body);
    return NextResponse.json(response.data, { status: 201 });
  } catch (error) {
    console.error('Error creating bucket:', error);
    return NextResponse.json({ error: 'Failed to create bucket' }, { status: 500 });
  }
}

// PUT: Update a bucket for a specific user
export async function PUT(request: Request, { params }: { params: { userId: string; bucketId: string } }) {
  const { userId, bucketId } = params;

  try {
    const body = await request.json();
    const response = await api.put(`/users/${userId}/buckets/${bucketId}`, body);
    return NextResponse.json(response.data);
  } catch (error) {
    console.error('Error updating bucket:', error);
    return NextResponse.json({ error: 'Failed to update bucket' }, { status: 500 });
  }
}

// DELETE: Delete a bucket for a specific user
export async function DELETE(request: Request, { params }: { params: { userId: string; bucketId: string } }) {
  const { userId, bucketId } = params;

  try {
    const response = await api.delete(`/users/${userId}/buckets/${bucketId}`);
    return NextResponse.json({ message: 'Bucket deleted successfully' });
  } catch (error) {
    console.error('Error deleting bucket:', error);
    return NextResponse.json({ error: 'Failed to delete bucket' }, { status: 500 });
  }
}
