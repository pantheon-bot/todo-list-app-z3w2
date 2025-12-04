'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';

interface Todo {
  id: number;
  title: string;
  description: string | null;
  username: string;
  is_completed: boolean;
  created_at: string;
  updated_at: string;
}

export default function Home() {
  const [todos, setTodos] = useState<Todo[]>([]);
  const [loading, setLoading] = useState(true);
  const [newTodoTitle, setNewTodoTitle] = useState('');
  const [newTodoDescription, setNewTodoDescription] = useState('');
  const [newTodoUsername, setNewTodoUsername] = useState('');
  const [filter, setFilter] = useState<'all' | 'active' | 'completed'>('all');

  // Fetch todos from the API
  const fetchTodos = async () => {
    try {
      setLoading(true);
      const filterParam = filter === 'all' ? '' : `?is_completed=${filter === 'completed'}`;
      const response = await fetch(`/api/todos${filterParam}`);
      const data = await response.json();
      setTodos(data.todos || []);
    } catch (error) {
      console.error('Error fetching todos:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchTodos();
  }, [filter]);

  useEffect(() => {
    // Load default username from localStorage
    if (typeof window !== 'undefined') {
      const savedUsername = localStorage.getItem('defaultUsername');
      if (savedUsername && !newTodoUsername) {
        setNewTodoUsername(savedUsername);
      }
    }
  }, []);

  // Create a new todo
  const handleCreateTodo = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTodoTitle.trim() || !newTodoUsername.trim()) return;

    try {
      const response = await fetch('/api/todos', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          title: newTodoTitle,
          description: newTodoDescription || undefined,
          username: newTodoUsername,
        }),
      });

      if (response.ok) {
        setNewTodoTitle('');
        setNewTodoDescription('');
        setNewTodoUsername('');
        fetchTodos();
      }
    } catch (error) {
      console.error('Error creating todo:', error);
    }
  };

  // Toggle todo completion status
  const handleToggleTodo = async (todo: Todo) => {
    try {
      await fetch(`/api/todos/${todo.id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          is_completed: !todo.is_completed,
        }),
      });
      fetchTodos();
    } catch (error) {
      console.error('Error updating todo:', error);
    }
  };

  // Delete a todo
  const handleDeleteTodo = async (id: number) => {
    try {
      await fetch(`/api/todos/${id}`, {
        method: 'DELETE',
      });
      fetchTodos();
    } catch (error) {
      console.error('Error deleting todo:', error);
    }
  };

  return (
    <div className="flex min-h-screen items-start justify-center bg-white py-12 px-4 dark:bg-black">
      <main className="w-full max-w-2xl">
        <div className="mb-8">
          <div className="flex items-center justify-between mb-4">
            <h1 className="text-4xl font-bold text-black dark:text-white">
              Todo List
            </h1>
            <div className="flex gap-2">
              <Link
                href="/dashboard"
                className="rounded-md bg-black px-4 py-2 text-sm font-medium text-white transition-colors hover:bg-gray-800 border border-black dark:bg-white dark:text-black dark:hover:bg-gray-200 dark:border-white"
              >
                Dashboard
              </Link>
              <Link
                href="/users"
                className="rounded-md bg-black px-4 py-2 text-sm font-medium text-white transition-colors hover:bg-gray-800 border border-black dark:bg-white dark:text-black dark:hover:bg-gray-200 dark:border-white"
              >
                Users
              </Link>
              <Link
                href="/settings"
                className="rounded-md bg-white px-4 py-2 text-sm font-medium text-black transition-colors hover:bg-gray-100 border border-black dark:bg-black dark:text-white dark:hover:bg-gray-900 dark:border-white"
              >
                Settings
              </Link>
            </div>
          </div>
          <p className="text-black dark:text-white">
            Manage your tasks with TiDB Cloud
          </p>
        </div>

        {/* Add Todo Form */}
        <form
          onSubmit={handleCreateTodo}
          className="mb-8 rounded-lg bg-white p-6 shadow-sm border border-black dark:bg-black dark:border-white"
        >
          <div className="mb-4">
            <input
              type="text"
              placeholder="Username (required)"
              value={newTodoUsername}
              onChange={(e) => setNewTodoUsername(e.target.value)}
              className="w-full rounded-md border border-black px-4 py-2 text-black placeholder-gray-500 focus:border-black focus:outline-none focus:ring-1 focus:ring-black dark:border-white dark:bg-black dark:text-white dark:placeholder-gray-400"
              required
            />
          </div>
          <div className="mb-4">
            <input
              type="text"
              placeholder="Todo title (required)"
              value={newTodoTitle}
              onChange={(e) => setNewTodoTitle(e.target.value)}
              className="w-full rounded-md border border-black px-4 py-2 text-black placeholder-gray-500 focus:border-black focus:outline-none focus:ring-1 focus:ring-black dark:border-white dark:bg-black dark:text-white dark:placeholder-gray-400"
              required
            />
          </div>
          <div className="mb-4">
            <textarea
              placeholder="Description (optional)"
              value={newTodoDescription}
              onChange={(e) => setNewTodoDescription(e.target.value)}
              className="w-full rounded-md border border-black px-4 py-2 text-black placeholder-gray-500 focus:border-black focus:outline-none focus:ring-1 focus:ring-black dark:border-white dark:bg-black dark:text-white dark:placeholder-gray-400"
              rows={3}
            />
          </div>
          <button
            type="submit"
            className="w-full rounded-md bg-black px-4 py-2 font-medium text-white transition-colors hover:bg-gray-800 dark:bg-white dark:text-black dark:hover:bg-gray-200"
          >
            Add Todo
          </button>
        </form>

        {/* Filter Tabs */}
        <div className="mb-6 flex gap-2">
          {(['all', 'active', 'completed'] as const).map((filterOption) => (
            <button
              key={filterOption}
              onClick={() => setFilter(filterOption)}
              className={`rounded-md px-4 py-2 text-sm font-medium transition-colors border ${
                filter === filterOption
                  ? 'bg-black text-white border-black dark:bg-white dark:text-black dark:border-white'
                  : 'bg-white text-black border-black hover:bg-gray-100 dark:bg-black dark:text-white dark:border-white dark:hover:bg-gray-900'
              }`}
            >
              {filterOption.charAt(0).toUpperCase() + filterOption.slice(1)}
            </button>
          ))}
        </div>

        {/* Todo List */}
        {loading ? (
          <div className="text-center text-black dark:text-white">
            Loading todos...
          </div>
        ) : todos.length === 0 ? (
          <div className="rounded-lg bg-white p-8 text-center shadow-sm border border-black dark:bg-black dark:border-white">
            <p className="text-black dark:text-white">
              No todos yet. Create one above!
            </p>
          </div>
        ) : (
          <div className="space-y-3">
            {todos.map((todo) => (
              <div
                key={todo.id}
                className="rounded-lg bg-white p-4 shadow-sm border border-black transition-all hover:shadow-md dark:bg-black dark:border-white"
              >
                <div className="flex items-start gap-3">
                  <input
                    type="checkbox"
                    checked={todo.is_completed}
                    onChange={() => handleToggleTodo(todo)}
                    className="mt-1 h-5 w-5 cursor-pointer rounded border-black text-black focus:ring-2 focus:ring-black dark:border-white dark:bg-black"
                  />
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-1">
                      <span className="text-sm font-semibold text-black dark:text-white">
                        @{todo.username}
                      </span>
                    </div>
                    <h3
                      className={`text-lg font-medium ${
                        todo.is_completed
                          ? 'text-gray-400 line-through dark:text-gray-500'
                          : 'text-black dark:text-white'
                      }`}
                    >
                      {todo.title}
                    </h3>
                    {todo.description && (
                      <p
                        className={`mt-1 text-sm ${
                          todo.is_completed
                            ? 'text-gray-400 dark:text-gray-500'
                            : 'text-black dark:text-white'
                        }`}
                      >
                        {todo.description}
                      </p>
                    )}
                    <p className="mt-2 text-xs text-gray-400 dark:text-gray-500">
                      Created: {new Date(todo.created_at).toLocaleString()}
                    </p>
                  </div>
                  <button
                    onClick={() => handleDeleteTodo(todo.id)}
                    className="rounded-md bg-white px-3 py-1 text-sm font-medium text-black border border-black transition-colors hover:bg-gray-100 dark:bg-black dark:text-white dark:border-white dark:hover:bg-gray-900"
                  >
                    Delete
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </main>
    </div>
  );
}
