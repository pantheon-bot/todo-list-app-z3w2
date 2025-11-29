'use client';

import { useState, useEffect } from 'react';

interface Todo {
  id: number;
  title: string;
  description: string | null;
  is_completed: boolean;
  created_at: string;
  updated_at: string;
}

export default function Home() {
  const [todos, setTodos] = useState<Todo[]>([]);
  const [loading, setLoading] = useState(true);
  const [newTodoTitle, setNewTodoTitle] = useState('');
  const [newTodoDescription, setNewTodoDescription] = useState('');
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

  // Create a new todo
  const handleCreateTodo = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTodoTitle.trim()) return;

    try {
      const response = await fetch('/api/todos', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          title: newTodoTitle,
          description: newTodoDescription || undefined,
        }),
      });

      if (response.ok) {
        setNewTodoTitle('');
        setNewTodoDescription('');
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
    <div className="flex min-h-screen items-start justify-center bg-zinc-50 py-12 px-4 dark:bg-zinc-900">
      <main className="w-full max-w-2xl">
        <div className="mb-8 text-center">
          <h1 className="text-4xl font-bold text-zinc-900 dark:text-zinc-50">
            Todo List
          </h1>
          <p className="mt-2 text-zinc-600 dark:text-zinc-400">
            Manage your tasks with TiDB Cloud
          </p>
        </div>

        {/* Add Todo Form */}
        <form
          onSubmit={handleCreateTodo}
          className="mb-8 rounded-lg bg-white p-6 shadow-sm dark:bg-zinc-800"
        >
          <div className="mb-4">
            <input
              type="text"
              placeholder="Todo title (required)"
              value={newTodoTitle}
              onChange={(e) => setNewTodoTitle(e.target.value)}
              className="w-full rounded-md border border-zinc-300 px-4 py-2 text-zinc-900 placeholder-zinc-500 focus:border-zinc-500 focus:outline-none focus:ring-1 focus:ring-zinc-500 dark:border-zinc-600 dark:bg-zinc-700 dark:text-zinc-50 dark:placeholder-zinc-400"
              required
            />
          </div>
          <div className="mb-4">
            <textarea
              placeholder="Description (optional)"
              value={newTodoDescription}
              onChange={(e) => setNewTodoDescription(e.target.value)}
              className="w-full rounded-md border border-zinc-300 px-4 py-2 text-zinc-900 placeholder-zinc-500 focus:border-zinc-500 focus:outline-none focus:ring-1 focus:ring-zinc-500 dark:border-zinc-600 dark:bg-zinc-700 dark:text-zinc-50 dark:placeholder-zinc-400"
              rows={3}
            />
          </div>
          <button
            type="submit"
            className="w-full rounded-md bg-zinc-900 px-4 py-2 font-medium text-white transition-colors hover:bg-zinc-700 dark:bg-zinc-50 dark:text-zinc-900 dark:hover:bg-zinc-200"
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
              className={`rounded-md px-4 py-2 text-sm font-medium transition-colors ${
                filter === filterOption
                  ? 'bg-zinc-900 text-white dark:bg-zinc-50 dark:text-zinc-900'
                  : 'bg-white text-zinc-700 hover:bg-zinc-100 dark:bg-zinc-800 dark:text-zinc-300 dark:hover:bg-zinc-700'
              }`}
            >
              {filterOption.charAt(0).toUpperCase() + filterOption.slice(1)}
            </button>
          ))}
        </div>

        {/* Todo List */}
        {loading ? (
          <div className="text-center text-zinc-600 dark:text-zinc-400">
            Loading todos...
          </div>
        ) : todos.length === 0 ? (
          <div className="rounded-lg bg-white p-8 text-center shadow-sm dark:bg-zinc-800">
            <p className="text-zinc-600 dark:text-zinc-400">
              No todos yet. Create one above!
            </p>
          </div>
        ) : (
          <div className="space-y-3">
            {todos.map((todo) => (
              <div
                key={todo.id}
                className="rounded-lg bg-white p-4 shadow-sm transition-all hover:shadow-md dark:bg-zinc-800"
              >
                <div className="flex items-start gap-3">
                  <input
                    type="checkbox"
                    checked={todo.is_completed}
                    onChange={() => handleToggleTodo(todo)}
                    className="mt-1 h-5 w-5 cursor-pointer rounded border-zinc-300 text-zinc-900 focus:ring-2 focus:ring-zinc-500 dark:border-zinc-600 dark:bg-zinc-700"
                  />
                  <div className="flex-1">
                    <h3
                      className={`text-lg font-medium ${
                        todo.is_completed
                          ? 'text-zinc-400 line-through dark:text-zinc-500'
                          : 'text-zinc-900 dark:text-zinc-50'
                      }`}
                    >
                      {todo.title}
                    </h3>
                    {todo.description && (
                      <p
                        className={`mt-1 text-sm ${
                          todo.is_completed
                            ? 'text-zinc-400 dark:text-zinc-500'
                            : 'text-zinc-600 dark:text-zinc-400'
                        }`}
                      >
                        {todo.description}
                      </p>
                    )}
                    <p className="mt-2 text-xs text-zinc-400 dark:text-zinc-500">
                      Created: {new Date(todo.created_at).toLocaleString()}
                    </p>
                  </div>
                  <button
                    onClick={() => handleDeleteTodo(todo.id)}
                    className="rounded-md bg-red-100 px-3 py-1 text-sm font-medium text-red-700 transition-colors hover:bg-red-200 dark:bg-red-900/30 dark:text-red-400 dark:hover:bg-red-900/50"
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
