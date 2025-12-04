'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';

export default function LoginPage() {
  const [username, setUsername] = useState('');
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();

  useEffect(() => {
    // Check if user is already logged in
    if (typeof window !== 'undefined') {
      const currentUser = localStorage.getItem('currentUser');
      if (currentUser) {
        router.push('/');
      }
    }
  }, [router]);

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    if (!username.trim()) {
      setError('Username is required');
      return;
    }

    if (username.trim().length < 3) {
      setError('Username must be at least 3 characters');
      return;
    }

    setIsLoading(true);

    // Simulate a brief login process
    setTimeout(() => {
      // Store username in localStorage
      localStorage.setItem('currentUser', username.trim());
      localStorage.setItem('defaultUsername', username.trim());

      // Redirect to dashboard
      router.push('/dashboard');
      setIsLoading(false);
    }, 500);
  };

  const handleQuickLogin = (demoUsername: string) => {
    setUsername(demoUsername);
    localStorage.setItem('currentUser', demoUsername);
    localStorage.setItem('defaultUsername', demoUsername);
    router.push('/dashboard');
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-white px-4 dark:bg-black">
      <main className="w-full max-w-md">
        <div className="mb-8 text-center">
          <h1 className="text-4xl font-bold text-black dark:text-white mb-2">
            Welcome
          </h1>
          <p className="text-black dark:text-white">
            Sign in to manage your todos
          </p>
        </div>

        <form
          onSubmit={handleLogin}
          className="rounded-lg bg-white p-6 shadow-sm border border-black dark:bg-black dark:border-white"
        >
          <div className="mb-6">
            <label
              htmlFor="username"
              className="block mb-2 text-sm font-semibold text-black dark:text-white"
            >
              Username
            </label>
            <input
              id="username"
              type="text"
              placeholder="Enter your username"
              value={username}
              onChange={(e) => {
                setUsername(e.target.value);
                setError('');
              }}
              className="w-full rounded-md border border-black px-4 py-3 text-black placeholder-gray-500 focus:border-black focus:outline-none focus:ring-2 focus:ring-black dark:border-white dark:bg-black dark:text-white dark:placeholder-gray-400"
              disabled={isLoading}
              autoFocus
            />
            {error && (
              <p className="mt-2 text-sm text-black dark:text-white">
                {error}
              </p>
            )}
          </div>

          <button
            type="submit"
            disabled={isLoading}
            className="w-full rounded-md bg-black px-4 py-3 font-medium text-white transition-colors hover:bg-gray-800 disabled:opacity-50 disabled:cursor-not-allowed dark:bg-white dark:text-black dark:hover:bg-gray-200"
          >
            {isLoading ? 'Signing in...' : 'Sign In'}
          </button>

          <div className="mt-4 text-center text-xs text-gray-400 dark:text-gray-500">
            No registration required. Just enter any username to continue.
          </div>
        </form>

        {/* Quick Login Options */}
        <div className="mt-8 rounded-lg bg-white p-6 shadow-sm border border-black dark:bg-black dark:border-white">
          <h2 className="text-sm font-semibold text-black dark:text-white mb-3">
            Quick Login
          </h2>
          <p className="text-xs text-gray-400 dark:text-gray-500 mb-4">
            Try one of these demo accounts
          </p>
          <div className="space-y-2">
            <button
              onClick={() => handleQuickLogin('alice')}
              className="w-full rounded-md bg-white px-4 py-2 text-sm font-medium text-black border border-black transition-colors hover:bg-gray-100 dark:bg-black dark:text-white dark:border-white dark:hover:bg-gray-900"
            >
              Login as Alice
            </button>
            <button
              onClick={() => handleQuickLogin('bob')}
              className="w-full rounded-md bg-white px-4 py-2 text-sm font-medium text-black border border-black transition-colors hover:bg-gray-100 dark:bg-black dark:text-white dark:border-white dark:hover:bg-gray-900"
            >
              Login as Bob
            </button>
            <button
              onClick={() => handleQuickLogin('charlie')}
              className="w-full rounded-md bg-white px-4 py-2 text-sm font-medium text-black border border-black transition-colors hover:bg-gray-100 dark:bg-black dark:text-white dark:border-white dark:hover:bg-gray-900"
            >
              Login as Charlie
            </button>
          </div>
        </div>

        {/* About Section */}
        <div className="mt-6 text-center text-xs text-gray-400 dark:text-gray-500">
          <p>Todo List App with TiDB Cloud</p>
          <p className="mt-1">Built with Next.js</p>
        </div>
      </main>
    </div>
  );
}
