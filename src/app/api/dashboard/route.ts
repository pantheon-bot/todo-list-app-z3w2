import { NextResponse } from 'next/server';
import { getDashboardStats } from '@/lib/db/todos';

// GET /api/dashboard - Get dashboard statistics
export async function GET() {
  try {
    const stats = await getDashboardStats();
    return NextResponse.json({ stats }, { status: 200 });
  } catch (error) {
    console.error('Error fetching dashboard stats:', error);
    return NextResponse.json(
      { error: 'Failed to fetch dashboard statistics' },
      { status: 500 }
    );
  }
}
