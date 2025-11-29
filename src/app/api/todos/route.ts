import { NextRequest, NextResponse } from 'next/server';
import { getAllTodos, createTodo } from '@/lib/db/todos';

// GET /api/todos - List all todos (optionally filtered)
export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams;
    const isCompletedParam = searchParams.get('is_completed');

    const filter = isCompletedParam !== null
      ? { is_completed: isCompletedParam === 'true' }
      : undefined;

    const todos = await getAllTodos(filter);
    return NextResponse.json({ todos }, { status: 200 });
  } catch (error) {
    console.error('Error fetching todos:', error);
    return NextResponse.json(
      { error: 'Failed to fetch todos' },
      { status: 500 }
    );
  }
}

// POST /api/todos - Create a new todo
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();

    if (!body.title || typeof body.title !== 'string' || body.title.trim().length === 0) {
      return NextResponse.json(
        { error: 'Title is required and must be a non-empty string' },
        { status: 400 }
      );
    }

    const todo = await createTodo({
      title: body.title.trim(),
      description: body.description?.trim() || undefined,
    });

    return NextResponse.json({ todo }, { status: 201 });
  } catch (error) {
    console.error('Error creating todo:', error);
    return NextResponse.json(
      { error: 'Failed to create todo' },
      { status: 500 }
    );
  }
}
