// app/auth/page.tsx
'use client';
import { useState, useContext, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { AuthContext } from '../contexts/AuthContext';

export default function AuthPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [mode, setMode] = useState<'signin' | 'signup'>('signin');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [redirecting, setRedirecting] = useState(false);
  const router = useRouter();
  const authContext = useContext(AuthContext);

  // Redirect if already authenticated
  useEffect(() => {
    if (authContext?.session?.user && !redirecting) {
      setRedirecting(true);
      console.log('User already authenticated, redirecting to dashboard');
      router.push('/dashboard');
    }
  }, [authContext?.session, router, redirecting]);

  if (!authContext) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gradient-to-br from-yellow-300 to-orange-500">
        <div className="text-white">Loading...</div>
      </div>
    );
  }

  // Show redirecting message
  if (redirecting) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gradient-to-br from-yellow-300 to-orange-500">
        <div className="text-white text-xl">Redirecting to dashboard...</div>
      </div>
    );
  }

  // If user is already logged in, show nothing while redirecting
  if (authContext.session?.user) {
    return null;
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      if (mode === 'signin') {
        await authContext.signIn(email, password);
      } else {
        await authContext.signUp(email, password);
      }

      // Wait for session to be established and context to update
      setRedirecting(true);

      // Give some time for the auth context to update with the new session
      await new Promise((resolve) => setTimeout(resolve, 1500));

      // Double check if we have a session before redirecting
      if (authContext.session?.user) {
        console.log('Authentication successful, redirecting to dashboard');
        router.push('/dashboard');
      } else {
        // If no session after waiting, show error
        setError('Authentication completed but session not established. Please try again.');
        setRedirecting(false);
      }
    } catch (err: any) {
      setError(err.message || 'Authentication failed. Please try again.');
      setRedirecting(false);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-gradient-to-br from-yellow-300 to-orange-500">
      <form onSubmit={handleSubmit} className="max-w-md w-full bg-white/90 backdrop-blur rounded-2xl shadow-lg p-8 space-y-4">
        <h2 className="text-4xl font-black text-center drop-shadow-md text-yellow-600">{mode === 'signin' ? 'Sign In' : 'Sign Up'}</h2>

        {error && <div className="bg-red-100 text-red-700 p-3 rounded-lg mb-4">{error}</div>}

        <div className="space-y-3">
          <div>
            <label className="block text-sm font-medium text-gray-700" htmlFor="email">
              Email
            </label>
            <input
              className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-yellow-400 text-black"
              type="email"
              id="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              disabled={loading || redirecting}
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700" htmlFor="password">
              Password
            </label>
            <input
              className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-yellow-400 text-black"
              type="password"
              id="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              disabled={loading || redirecting}
            />
          </div>
        </div>

        <button
          type="submit"
          disabled={loading || redirecting}
          className="w-full bg-black text-yellow-300 font-bold py-3 rounded-lg hover:bg-gray-800 transition disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {loading ? (
            <>
              <span className="animate-spin inline-block w-4 h-4 border-2 border-current border-t-transparent rounded-full mr-2" />
              Processing...
            </>
          ) : redirecting ? (
            <>
              <span className="animate-spin inline-block w-4 h-4 border-2 border-current border-t-transparent rounded-full mr-2" />
              Redirecting...
            </>
          ) : mode === 'signin' ? (
            'Sign In'
          ) : (
            'Sign Up'
          )}
        </button>

        <div className="text-center">
          <button
            className="text-sm text-gray-600 hover:text-gray-800 disabled:opacity-50"
            onClick={() => setMode(mode === 'signin' ? 'signup' : 'signin')}
            type="button"
            disabled={loading || redirecting}
          >
            {mode === 'signin' ? "Don't have an account? Sign Up" : 'Already have an account? Sign In'}
          </button>
        </div>
      </form>
    </div>
  );
}
