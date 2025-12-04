'use client';

import { useState } from 'react';
import Link from 'next/link';

export default function SettingsPage() {
  const [defaultUsername, setDefaultUsername] = useState('');
  const [theme, setTheme] = useState<'light' | 'dark' | 'system'>('system');
  const [saved, setSaved] = useState(false);

  const handleSaveSettings = (e: React.FormEvent) => {
    e.preventDefault();

    // Save to localStorage
    if (defaultUsername) {
      localStorage.setItem('defaultUsername', defaultUsername);
    } else {
      localStorage.removeItem('defaultUsername');
    }
    localStorage.setItem('theme', theme);

    // Apply theme
    if (theme === 'dark') {
      document.documentElement.classList.add('dark');
    } else if (theme === 'light') {
      document.documentElement.classList.remove('dark');
    } else {
      // System theme
      if (window.matchMedia('(prefers-color-scheme: dark)').matches) {
        document.documentElement.classList.add('dark');
      } else {
        document.documentElement.classList.remove('dark');
      }
    }

    setSaved(true);
    setTimeout(() => setSaved(false), 3000);
  };

  const handleLoadSettings = () => {
    const savedUsername = localStorage.getItem('defaultUsername') || '';
    const savedTheme = (localStorage.getItem('theme') as 'light' | 'dark' | 'system') || 'system';

    setDefaultUsername(savedUsername);
    setTheme(savedTheme);
  };

  // Load settings on mount
  useState(() => {
    if (typeof window !== 'undefined') {
      handleLoadSettings();
    }
  });

  return (
    <div className="flex min-h-screen items-start justify-center bg-white py-12 px-4 dark:bg-black">
      <main className="w-full max-w-2xl">
        <div className="mb-8 flex items-center justify-between">
          <div>
            <h1 className="text-4xl font-bold text-black dark:text-white">
              Settings
            </h1>
            <p className="mt-2 text-black dark:text-white">
              Customize your todo app preferences
            </p>
          </div>
          <Link
            href="/"
            className="rounded-md bg-black px-4 py-2 text-sm font-medium text-white transition-colors hover:bg-gray-800 border border-black dark:bg-white dark:text-black dark:hover:bg-gray-200 dark:border-white"
          >
            Back to Todos
          </Link>
        </div>

        <form
          onSubmit={handleSaveSettings}
          className="rounded-lg bg-white p-6 shadow-sm border border-black dark:bg-black dark:border-white"
        >
          {/* Default Username */}
          <div className="mb-6">
            <label
              htmlFor="defaultUsername"
              className="block mb-2 text-sm font-semibold text-black dark:text-white"
            >
              Default Username
            </label>
            <input
              id="defaultUsername"
              type="text"
              placeholder="Enter your default username"
              value={defaultUsername}
              onChange={(e) => setDefaultUsername(e.target.value)}
              className="w-full rounded-md border border-black px-4 py-2 text-black placeholder-gray-500 focus:border-black focus:outline-none focus:ring-1 focus:ring-black dark:border-white dark:bg-black dark:text-white dark:placeholder-gray-400"
            />
            <p className="mt-2 text-xs text-gray-400 dark:text-gray-500">
              This username will be pre-filled when creating new todos
            </p>
          </div>

          {/* Theme Selection */}
          <div className="mb-6">
            <label className="block mb-2 text-sm font-semibold text-black dark:text-white">
              Theme
            </label>
            <div className="space-y-2">
              {(['light', 'dark', 'system'] as const).map((themeOption) => (
                <label
                  key={themeOption}
                  className="flex items-center gap-3 p-3 rounded-md border border-black cursor-pointer hover:bg-gray-50 dark:border-white dark:hover:bg-gray-900"
                >
                  <input
                    type="radio"
                    name="theme"
                    value={themeOption}
                    checked={theme === themeOption}
                    onChange={(e) => setTheme(e.target.value as 'light' | 'dark' | 'system')}
                    className="w-4 h-4 cursor-pointer"
                  />
                  <div>
                    <div className="text-sm font-medium text-black dark:text-white">
                      {themeOption.charAt(0).toUpperCase() + themeOption.slice(1)}
                    </div>
                    <div className="text-xs text-gray-400 dark:text-gray-500">
                      {themeOption === 'light' && 'Always use light mode'}
                      {themeOption === 'dark' && 'Always use dark mode'}
                      {themeOption === 'system' && 'Follow system preference'}
                    </div>
                  </div>
                </label>
              ))}
            </div>
          </div>

          {/* App Information */}
          <div className="mb-6 p-4 rounded-md border border-black dark:border-white">
            <h3 className="text-sm font-semibold text-black dark:text-white mb-2">
              About This App
            </h3>
            <div className="space-y-1 text-xs text-gray-400 dark:text-gray-500">
              <p>Todo List App with TiDB Cloud</p>
              <p>Version: 1.0.0</p>
              <p>Built with Next.js and Tailwind CSS</p>
            </div>
          </div>

          {/* Save Button */}
          <div className="flex items-center gap-4">
            <button
              type="submit"
              className="flex-1 rounded-md bg-black px-4 py-2 font-medium text-white transition-colors hover:bg-gray-800 dark:bg-white dark:text-black dark:hover:bg-gray-200"
            >
              Save Settings
            </button>
            <button
              type="button"
              onClick={handleLoadSettings}
              className="rounded-md bg-white px-4 py-2 font-medium text-black border border-black transition-colors hover:bg-gray-100 dark:bg-black dark:text-white dark:border-white dark:hover:bg-gray-900"
            >
              Reset
            </button>
          </div>

          {saved && (
            <div className="mt-4 p-3 rounded-md bg-black text-white text-sm text-center dark:bg-white dark:text-black">
              Settings saved successfully!
            </div>
          )}
        </form>

        {/* Quick Links */}
        <div className="mt-8 rounded-lg bg-white p-6 shadow-sm border border-black dark:bg-black dark:border-white">
          <h2 className="text-lg font-bold text-black dark:text-white mb-4">
            Quick Links
          </h2>
          <div className="space-y-2">
            <Link
              href="/"
              className="block p-3 rounded-md border border-black text-black hover:bg-gray-50 dark:border-white dark:text-white dark:hover:bg-gray-900"
            >
              <div className="font-medium">Todo List</div>
              <div className="text-xs text-gray-400 dark:text-gray-500">
                View and manage your todos
              </div>
            </Link>
            <Link
              href="/users"
              className="block p-3 rounded-md border border-black text-black hover:bg-gray-50 dark:border-white dark:text-white dark:hover:bg-gray-900"
            >
              <div className="font-medium">Users</div>
              <div className="text-xs text-gray-400 dark:text-gray-500">
                View all users and statistics
              </div>
            </Link>
          </div>
        </div>
      </main>
    </div>
  );
}
