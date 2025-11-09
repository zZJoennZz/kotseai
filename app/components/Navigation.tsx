// components/Navigation.tsx
'use client';
import { useContext } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { AuthContext } from '../contexts/AuthContext';

export default function Navigation() {
  const authContext = useContext(AuthContext);
  const pathname = usePathname();

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 bg-black/80 backdrop-blur-md border-b border-yellow-500/20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Logo/Brand */}
          <Link href="/" className="flex items-center space-x-2">
            <span className="text-yellow-300 text-xl font-bold">KotseAI</span>
          </Link>

          {/* Navigation Links */}
          <div className="flex items-center space-x-4">
            <Link href="/" className="text-yellow-300 hover:text-yellow-200 transition-colors">
              Home
            </Link>

            {authContext?.session?.user ? (
              // Show Dashboard link when logged in
              <Link href="/dashboard" className="bg-yellow-500 text-black font-bold py-2 px-4 rounded-lg hover:bg-yellow-400 transition-colors">
                Dashboard
              </Link>
            ) : (
              // Show Login link when not logged in
              <Link href="/auth" className="bg-yellow-500 text-black font-bold py-2 px-4 rounded-lg hover:bg-yellow-400 transition-colors">
                Login
              </Link>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
}
