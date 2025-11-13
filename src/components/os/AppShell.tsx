// src/components/os/AppShell.tsx
"use client";
import React, { ReactNode, useState } from 'react';
import Sidebar from './Sidebar';
import { Menu, X } from 'lucide-react';

interface AppShellProps {
  children: ReactNode;
  userRole: string | null;
}

const AppShell = ({ children, userRole }: AppShellProps) => {
  const [isSidebarOpen, setSidebarOpen] = useState(false);

  const toggleSidebar = () => {
    setSidebarOpen(!isSidebarOpen);
  };

  return (
    <div className="flex h-screen bg-gray-50">
      {/* Sidebar for Desktop */}
      <div className="hidden lg:fixed lg:inset-y-0 lg:z-50 lg:flex lg:w-64 lg:flex-col">
        <Sidebar userRole={userRole} />
      </div>

      {/* Sidebar for Mobile (Overlay) */}
      {isSidebarOpen && (
        <div className="fixed inset-0 z-40 flex lg:hidden">
          {/* Sidebar */}
          <div className="relative flex w-64 max-w-xs flex-1 flex-col bg-white">
            <div className="absolute top-0 right-0 -mr-12 pt-2">
              <button
                type="button"
                className="ml-1 flex h-10 w-10 items-center justify-center rounded-full focus:outline-none focus:ring-2 focus:ring-inset focus:ring-white"
                onClick={toggleSidebar}
              >
                <span className="sr-only">Close sidebar</span>
                <X className="h-6 w-6 text-white" aria-hidden="true" />
              </button>
            </div>
            <Sidebar userRole={userRole} />
          </div>
          {/* Dummy element to close sidebar on click outside */}
          <div className="w-14 flex-shrink-0" onClick={toggleSidebar}></div>
        </div>
      )}

      <div className="flex flex-1 flex-col overflow-hidden lg:pl-64">
        {/* Top bar for mobile with hamburger menu */}
        <div className="relative z-10 flex h-16 flex-shrink-0 border-b border-gray-200 bg-white shadow-sm lg:hidden">
          <button
            type="button"
            className="border-r border-gray-200 px-4 text-gray-500 focus:outline-none focus:ring-2 focus:ring-inset focus:ring-blue-500 lg:hidden"
            onClick={toggleSidebar}
          >
            <span className="sr-only">Open sidebar</span>
            <Menu className="h-6 w-6" aria-hidden="true" />
          </button>
          <div className="flex flex-1 justify-between px-4 sm:px-6 lg:px-8">
            <div className="flex flex-1 items-center">
                {/* Optional: Can add search or other elements here */}
            </div>
          </div>
        </div>

        {/* Main content */}
        <main className="flex-1 overflow-y-auto p-4 md:p-6">
          {children}
        </main>
      </div>
    </div>
  );
};

export default AppShell;
