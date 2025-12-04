import { NextResponse } from 'next/server';
import { getAllUsers, getUserStats } from '@/lib/db/todos';

// GET /api/users - List all users with their stats
export async function GET() {
  try {
    const usernames = await getAllUsers();

    const usersWithStats = await Promise.all(
      usernames.map(username => getUserStats(username))
    );

    return NextResponse.json({ users: usersWithStats }, { status: 200 });
  } catch (error) {
    console.error('Error fetching users:', error);
    return NextResponse.json(
      { error: 'Failed to fetch users' },
      { status: 500 }
    );
  }
}
