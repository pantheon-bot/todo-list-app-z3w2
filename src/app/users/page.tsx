'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';

interface UserStats {
  username: string;
  totalTodos: number;
  completedTodos: number;
  activeTodos: number;
}

export default function UsersPage() {
  const [users, setUsers] = useState<UserStats[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchUsers();
  }, []);

  const fetchUsers = async () => {
    try {
      setLoading(true);
      const response = await fetch('/api/users');
      const data = await response.json();
      setUsers(data.users || []);
    } catch (error) {
      console.error('Error fetching users:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex min-h-screen items-start justify-center bg-white py-12 px-4 dark:bg-black">
      <main className="w-full max-w-4xl">
        <div className="mb-8">
          <div className="flex items-center justify-between mb-4">
            <h1 className="text-4xl font-bold text-black dark:text-white">
              Users
            </h1>
            <div className="flex gap-2">
              <Link
                href="/"
                className="rounded-md bg-black px-4 py-2 text-sm font-medium text-white transition-colors hover:bg-gray-800 border border-black dark:bg-white dark:text-black dark:hover:bg-gray-200 dark:border-white"
              >
                Todos
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
            All users and their todo statistics
          </p>
        </div>

        {loading ? (
          <div className="text-center text-black dark:text-white">
            Loading users...
          </div>
        ) : users.length === 0 ? (
          <div className="rounded-lg bg-white p-8 text-center shadow-sm border border-black dark:bg-black dark:border-white">
            <p className="text-black dark:text-white">
              No users found. Create a todo to get started!
            </p>
          </div>
        ) : (
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            {users.map((user) => (
              <div
                key={user.username}
                className="rounded-lg bg-white p-6 shadow-sm border border-black transition-all hover:shadow-md dark:bg-black dark:border-white"
              >
                <div className="mb-4">
                  <h2 className="text-2xl font-bold text-black dark:text-white">
                    @{user.username}
                  </h2>
                </div>
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-black dark:text-white">
                      Total Todos
                    </span>
                    <span className="text-lg font-semibold text-black dark:text-white">
                      {user.totalTodos}
                    </span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-black dark:text-white">
                      Completed
                    </span>
                    <span className="text-lg font-semibold text-black dark:text-white">
                      {user.completedTodos}
                    </span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-black dark:text-white">
                      Active
                    </span>
                    <span className="text-lg font-semibold text-black dark:text-white">
                      {user.activeTodos}
                    </span>
                  </div>
                  <div className="mt-4 pt-4 border-t border-black dark:border-white">
                    <div className="text-xs text-gray-400 dark:text-gray-500">
                      Completion Rate
                    </div>
                    <div className="text-xl font-bold text-black dark:text-white">
                      {user.totalTodos > 0
                        ? Math.round((user.completedTodos / user.totalTodos) * 100)
                        : 0}%
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </main>
    </div>
  );
}
