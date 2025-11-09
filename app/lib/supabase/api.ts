// lib/supabase/server-client.ts
import { createServerClient } from '@supabase/ssr';
import { cookies } from 'next/headers';

// Make this function async
export async function createClient() {
  // Await the cookies() call
  const cookieStore = await cookies();

  return createServerClient(process.env.NEXT_PUBLIC_SUPABASE_URL!, process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!, {
    cookies: {
      getAll() {
        return cookieStore.getAll();
      },
      setAll(cookiesToSet) {
        try {
          cookiesToSet.forEach(({ name, value, options }) => cookieStore.set(name, value, options));
        } catch (error) {
          // Can be ignored in Server Components
        }
      },
    },
  });
}
