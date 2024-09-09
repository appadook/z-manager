import { NextResponse } from 'next/server';
import api from '../axiosInstance'; // Adjust the path based on your directory structure

// GET: Fetch all bucket items for a specific user and bucket
export async function GET(
  request: Request,
  { params }: { params: { userId: string; bucketId: string } }
) {
  const userId = params.userId;
  const bucketId = params.bucketId;

  if (!userId || !bucketId) {
    return NextResponse.json({ error: 'Missing userId or bucketId' }, { status: 400 });
  }

  try {
    const response = await api.get(`/users/${userId}/buckets/${bucketId}/items`);
    return NextResponse.json(response.data);
  } catch (error: any) {
    console.error('Error fetching bucket items:', error);
    if (error.response) {
      // The request was made and the server responded with a status code
      // that falls out of the range of 2xx
      return NextResponse.json({ error: error.response.data }, { status: error.response.status });
    } else {
      return NextResponse.json({ error: 'Failed to fetch bucket items' }, { status: 500 });
    }
  }
}

// POST: Create a new bucket item for a specific user and bucket
export async function POST(
  request: Request,
  { params }: { params: { userId: string; bucketId: string } }
) {
  const userId = params.userId;
  const bucketId = params.bucketId;

  if (!userId || !bucketId) {
    return NextResponse.json({ error: 'Missing userId or bucketId' }, { status: 400 });
  }

  try {
    const body = await request.json();
    const response = await api.post(`/users/${userId}/buckets/${bucketId}/items`, body);
    return NextResponse.json(response.data, { status: 201 });
  } catch (error: any) {
    console.error('Error creating bucket item:', error);
    if (error.response) {
      return NextResponse.json({ error: error.response.data }, { status: error.response.status });
    } else {
      return NextResponse.json({ error: 'Failed to create bucket item' }, { status: 500 });
    }
  }
}

// PUT: Update a bucket item for a specific user and bucket
export async function PUT(
  request: Request,
  { params }: { params: { userId: string; bucketId: string; itemId: string } }
) {
  const { userId, bucketId, itemId } = params;

  if (!userId || !bucketId || !itemId) {
    return NextResponse.json({ error: 'Missing userId, bucketId, or itemId' }, { status: 400 });
  }

  try {
    const body = await request.json();
    const response = await api.put(`/users/${userId}/buckets/${bucketId}/items/${itemId}`, body);
    return NextResponse.json(response.data);
  } catch (error: any) {
    console.error('Error updating bucket item:', error);
    if (error.response) {
      return NextResponse.json({ error: error.response.data }, { status: error.response.status });
    } else {
      return NextResponse.json({ error: 'Failed to update bucket item' }, { status: 500 });
    }
  }
}

// DELETE: Delete a bucket item for a specific user and bucket
export async function DELETE(
  request: Request,
  { params }: { params: { userId: string; bucketId: string; itemId: string } }
) {
  const { userId, bucketId, itemId } = params;

  if (!userId || !bucketId || !itemId) {
    return NextResponse.json({ error: 'Missing userId, bucketId, or itemId' }, { status: 400 });
  }

  try {
    await api.delete(`/users/${userId}/buckets/${bucketId}/items/${itemId}`);
    return NextResponse.json({ message: 'Bucket item deleted successfully' });
  } catch (error: any) {
    console.error('Error deleting bucket item:', error);
    if (error.response) {
      return NextResponse.json({ error: error.response.data }, { status: error.response.status });
    } else {
      return NextResponse.json({ error: 'Failed to delete bucket item' }, { status: 500 });
    }
  }
}

