import { NextResponse } from 'next/server';
import { adminAuth } from '@/lib/firebaseAdmin';

// GET: Fetch users with pagination (20 records per batch)
export async function GET(request) {
  try {
    const { searchParams } = new URL(request.url);
    const pageToken = searchParams.get('pageToken') || undefined;
    
    // Fetch up to 20 users per page from Firebase Auth
    const listUsersResult = await adminAuth.listUsers(20, pageToken);
    
    const users = listUsersResult.users.map((userRecord) => ({
      uid: userRecord.uid,
      email: userRecord.email,
    }));

    return NextResponse.json({
      users,
      pageToken: listUsersResult.pageToken || null,
    });
  } catch (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

// PUT: Update a user's email or password in Firebase Auth
export async function PUT(request) {
  try {
    const { uid, email, password } = await request.json();
    
    if (!uid) {
      return NextResponse.json({ error: 'UID is required' }, { status: 400 });
    }

    const updateData = {};
    if (email) updateData.email = email;
    if (password) updateData.password = password;

    const userRecord = await adminAuth.updateUser(uid, updateData);
    
    return NextResponse.json({ 
      success: true, 
      user: { uid: userRecord.uid, email: userRecord.email } 
    });
  } catch (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

// DELETE: Delete a user record from Firebase Auth
export async function DELETE(request) {
  try {
    const { searchParams } = new URL(request.url);
    const uid = searchParams.get('uid');

    if (!uid) {
      return NextResponse.json({ error: 'UID is required' }, { status: 400 });
    }

    await adminAuth.deleteUser(uid);
    return NextResponse.json({ success: true });
  } catch (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}