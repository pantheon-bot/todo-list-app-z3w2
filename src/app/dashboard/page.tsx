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

interface DashboardStats {
  totalTodos: number;
  completedTodos: number;
  activeTodos: number;
  totalUsers: number;
  recentTodos: Todo[];
  completionRate: number;
}

export default function DashboardPage() {
  const [stats, setStats] = useState<DashboardStats | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchDashboardStats();
  }, []);

  const fetchDashboardStats = async () => {
    try {
      setLoading(true);
      const response = await fetch('/api/dashboard');
      const data = await response.json();
      setStats(data.stats);
    } catch (error) {
      console.error('Error fetching dashboard stats:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex min-h-screen items-start justify-center bg-white py-12 px-4 dark:bg-black">
      <main className="w-full max-w-6xl">
        <div className="mb-8">
          <div className="flex items-center justify-between mb-4">
            <h1 className="text-4xl font-bold text-black dark:text-white">
              Dashboard
            </h1>
            <div className="flex gap-2">
              <Link
                href="/"
                className="rounded-md bg-black px-4 py-2 text-sm font-medium text-white transition-colors hover:bg-gray-800 border border-black dark:bg-white dark:text-black dark:hover:bg-gray-200 dark:border-white"
              >
                Todos
              </Link>
              <Link
                href="/users"
                className="rounded-md bg-white px-4 py-2 text-sm font-medium text-black transition-colors hover:bg-gray-100 border border-black dark:bg-black dark:text-white dark:hover:bg-gray-900 dark:border-white"
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
            Overview of your todo list statistics
          </p>
        </div>

        {loading ? (
          <div className="text-center text-black dark:text-white">
            Loading dashboard...
          </div>
        ) : !stats ? (
          <div className="rounded-lg bg-white p-8 text-center shadow-sm border border-black dark:bg-black dark:border-white">
            <p className="text-black dark:text-white">
              Failed to load dashboard statistics
            </p>
          </div>
        ) : (
          <div className="space-y-6">
            {/* Statistics Grid */}
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
              {/* Total Todos */}
              <div className="rounded-lg bg-white p-6 shadow-sm border border-black dark:bg-black dark:border-white">
                <div className="text-sm text-gray-400 dark:text-gray-500 mb-2">
                  Total Todos
                </div>
                <div className="text-3xl font-bold text-black dark:text-white">
                  {stats.totalTodos}
                </div>
              </div>

              {/* Active Todos */}
              <div className="rounded-lg bg-white p-6 shadow-sm border border-black dark:bg-black dark:border-white">
                <div className="text-sm text-gray-400 dark:text-gray-500 mb-2">
                  Active Todos
                </div>
                <div className="text-3xl font-bold text-black dark:text-white">
                  {stats.activeTodos}
                </div>
              </div>

              {/* Completed Todos */}
              <div className="rounded-lg bg-white p-6 shadow-sm border border-black dark:bg-black dark:border-white">
                <div className="text-sm text-gray-400 dark:text-gray-500 mb-2">
                  Completed Todos
                </div>
                <div className="text-3xl font-bold text-black dark:text-white">
                  {stats.completedTodos}
                </div>
              </div>

              {/* Total Users */}
              <div className="rounded-lg bg-white p-6 shadow-sm border border-black dark:bg-black dark:border-white">
                <div className="text-sm text-gray-400 dark:text-gray-500 mb-2">
                  Total Users
                </div>
                <div className="text-3xl font-bold text-black dark:text-white">
                  {stats.totalUsers}
                </div>
              </div>
            </div>

            {/* Completion Rate */}
            <div className="rounded-lg bg-white p-6 shadow-sm border border-black dark:bg-black dark:border-white">
              <h2 className="text-xl font-bold text-black dark:text-white mb-4">
                Overall Completion Rate
              </h2>
              <div className="flex items-center gap-4">
                <div className="flex-1">
                  <div className="w-full h-8 rounded-full bg-gray-200 dark:bg-gray-800 overflow-hidden">
                    <div
                      className="h-full bg-black dark:bg-white transition-all"
                      style={{ width: `${stats.completionRate}%` }}
                    />
                  </div>
                </div>
                <div className="text-3xl font-bold text-black dark:text-white">
                  {stats.completionRate}%
                </div>
              </div>
              <div className="mt-4 grid grid-cols-2 gap-4 text-sm">
                <div>
                  <span className="text-gray-400 dark:text-gray-500">Completed: </span>
                  <span className="font-semibold text-black dark:text-white">
                    {stats.completedTodos}
                  </span>
                </div>
                <div>
                  <span className="text-gray-400 dark:text-gray-500">Remaining: </span>
                  <span className="font-semibold text-black dark:text-white">
                    {stats.activeTodos}
                  </span>
                </div>
              </div>
            </div>

            {/* Recent Todos */}
            <div className="rounded-lg bg-white p-6 shadow-sm border border-black dark:bg-black dark:border-white">
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-xl font-bold text-black dark:text-white">
                  Recent Todos
                </h2>
                <Link
                  href="/"
                  className="text-sm text-black hover:underline dark:text-white"
                >
                  View all
                </Link>
              </div>

              {stats.recentTodos.length === 0 ? (
                <p className="text-center text-gray-400 dark:text-gray-500 py-4">
                  No todos yet
                </p>
              ) : (
                <div className="space-y-3">
                  {stats.recentTodos.map((todo) => (
                    <div
                      key={todo.id}
                      className="flex items-start gap-3 p-3 rounded-md border border-black dark:border-white"
                    >
                      <input
                        type="checkbox"
                        checked={todo.is_completed}
                        readOnly
                        className="mt-1 h-4 w-4 rounded border-black dark:border-white"
                      />
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2 mb-1">
                          <span className="text-xs font-semibold text-black dark:text-white">
                            @{todo.username}
                          </span>
                        </div>
                        <h3
                          className={`text-sm font-medium ${
                            todo.is_completed
                              ? 'text-gray-400 line-through dark:text-gray-500'
                              : 'text-black dark:text-white'
                          }`}
                        >
                          {todo.title}
                        </h3>
                        {todo.description && (
                          <p className="text-xs text-gray-400 dark:text-gray-500 mt-1 truncate">
                            {todo.description}
                          </p>
                        )}
                      </div>
                      <span className="text-xs text-gray-400 dark:text-gray-500 whitespace-nowrap">
                        {new Date(todo.created_at).toLocaleDateString()}
                      </span>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Quick Actions */}
            <div className="grid gap-4 md:grid-cols-3">
              <Link
                href="/"
                className="block p-6 rounded-lg bg-white border border-black hover:bg-gray-50 dark:bg-black dark:border-white dark:hover:bg-gray-900"
              >
                <h3 className="text-lg font-bold text-black dark:text-white mb-2">
                  Manage Todos
                </h3>
                <p className="text-sm text-gray-400 dark:text-gray-500">
                  View, create, and manage your todo items
                </p>
              </Link>

              <Link
                href="/users"
                className="block p-6 rounded-lg bg-white border border-black hover:bg-gray-50 dark:bg-black dark:border-white dark:hover:bg-gray-900"
              >
                <h3 className="text-lg font-bold text-black dark:text-white mb-2">
                  View Users
                </h3>
                <p className="text-sm text-gray-400 dark:text-gray-500">
                  See all users and their statistics
                </p>
              </Link>

              <Link
                href="/settings"
                className="block p-6 rounded-lg bg-white border border-black hover:bg-gray-50 dark:bg-black dark:border-white dark:hover:bg-gray-900"
              >
                <h3 className="text-lg font-bold text-black dark:text-white mb-2">
                  Settings
                </h3>
                <p className="text-sm text-gray-400 dark:text-gray-500">
                  Customize your app preferences
                </p>
              </Link>
            </div>
          </div>
        )}
      </main>
    </div>
  );
}
