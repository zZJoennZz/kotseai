// app/dashboard/page.tsx
'use client';
import { useState, useEffect, useContext } from 'react';
import { useRouter } from 'next/navigation';
import { supabase } from '../lib/supabase';
import { AuthContext } from '../contexts/AuthContext';

export default function DashboardPage() {
  const [checklists, setChecklists] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const router = useRouter();
  const authContext = useContext(AuthContext);

  useEffect(() => {
    if (!authContext) return;

    const checkAuth = async () => {
      setIsLoading(true);
      await new Promise((resolve) => setTimeout(resolve, 100));

      if (!authContext.session?.user) {
        console.log('No user session, redirecting to auth');
        router.push('/auth');
        return;
      }

      await fetchChecklists();
      setIsLoading(false);
    };

    checkAuth();
  }, [authContext, router]);

  const fetchChecklists = async () => {
    if (!authContext?.session?.user) return;

    try {
      const { data, error } = await supabase
        .from('checklists')
        .select('*')
        .eq('user_id', authContext.session.user.id)
        .order('created_at', { ascending: false });

      if (error) {
        console.error('Error fetching checklists:', error);
        return;
      }

      setChecklists(data || []);
    } catch (error) {
      console.error('Error in fetchChecklists:', error);
    }
  };

  const handleViewChecklist = (checklist: any) => {
    // Ensure the data structure matches what the maintenance page expects
    const payload = {
      make: checklist.make || '',
      model: checklist.model || '',
      year: checklist.year || '',
      transmission: checklist.transmission || '',
      mileage: checklist.mileage || 0,
      checklist: {
        immediate: checklist.data?.immediate || [],
        soon: checklist.data?.soon || [],
        later: checklist.data?.later || [],
      },
    };

    // Validate that we have the required data
    if (!payload.make || !payload.model || !payload.year) {
      console.error('Missing required checklist data');
      return;
    }

    router.push(`/maintenance-result?data=${encodeURIComponent(JSON.stringify(payload))}`);
  };

  const handleLogout = async () => {
    await authContext?.signOut();
    router.push('/auth');
  };

  if (!authContext || isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-yellow-300 to-orange-500 flex items-center justify-center">
        <div className="text-white text-xl">Loading...</div>
      </div>
    );
  }

  if (!authContext.session?.user) {
    return null;
  }

  return (
    <main className="min-h-screen bg-gradient-to-br from-yellow-300 to-orange-500 text-gray-900 p-6">
      <div className="max-w-4xl mx-auto">
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-4xl font-black">Your Checklists</h1>
          <button className="bg-black text-yellow-300 font-bold py-3 px-6 rounded-lg hover:bg-gray-800 transition" onClick={() => router.push('/')}>
            Create New Checklist
          </button>
        </div>

        <div className="bg-white/90 backdrop-blur rounded-2xl shadow-lg p-6">
          {checklists.length === 0 ? (
            <div className="text-center py-12">
              <p className="text-xl text-gray-600 mb-4">No checklists yet.</p>
              <button
                className="bg-black text-yellow-300 font-bold py-2 px-6 rounded-lg hover:bg-gray-800 transition"
                onClick={() => router.push('/')}
              >
                Create Your First Checklist
              </button>
            </div>
          ) : (
            <div className="grid gap-4">
              {checklists.map((checklist) => (
                <div key={checklist.id} className="bg-white border border-yellow-200 rounded-xl p-6 shadow-sm hover:shadow-md transition">
                  <div className="flex justify-between items-start">
                    <div>
                      <h2 className="text-2xl font-bold text-gray-800">
                        {checklist.year} {checklist.make} {checklist.model}
                      </h2>
                      <p className="text-gray-600 mt-2">
                        <span className="font-semibold">Mileage:</span> {checklist.mileage?.toLocaleString()} km
                      </p>
                      <p className="text-gray-600">
                        <span className="font-semibold">Location:</span> {checklist.location}
                      </p>
                      <p className="text-sm text-gray-500 mt-2">Created: {new Date(checklist.created_at).toLocaleDateString()}</p>
                    </div>
                    <button
                      className="bg-yellow-500 hover:bg-yellow-600 text-white font-bold py-2 px-4 rounded-lg transition"
                      onClick={() => handleViewChecklist(checklist)}
                    >
                      View Checklist
                    </button>
                  </div>

                  {/* Show summary of maintenance items */}
                  {checklist.data && (
                    <div className="flex gap-4 mt-4 text-sm">
                      {checklist.data.immediate && (
                        <span className="bg-red-100 text-red-800 px-3 py-1 rounded-full font-semibold">
                          🚨 {checklist.data.immediate.length} Urgent
                        </span>
                      )}
                      {checklist.data.soon && (
                        <span className="bg-orange-100 text-orange-800 px-3 py-1 rounded-full font-semibold">
                          📅 {checklist.data.soon.length} Soon
                        </span>
                      )}
                      {checklist.data.later && (
                        <span className="bg-gray-100 text-gray-800 px-3 py-1 rounded-full font-semibold">🗓️ {checklist.data.later.length} Later</span>
                      )}
                    </div>
                  )}
                </div>
              ))}
            </div>
          )}
        </div>

        <div className="text-center mt-8">
          <button
            className="cursor-pointer bg-gray-700 hover:bg-gray-800 text-white font-bold py-3 px-6 rounded-lg transition"
            onClick={handleLogout}
          >
            Logout
          </button>
        </div>
      </div>
    </main>
  );
}
