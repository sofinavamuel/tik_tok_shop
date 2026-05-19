import { insforge } from './insforge';

export interface User {
  id: string;
  email: string;
  name?: string;
  role?: string;
  avatar_url?: string;
}

// Sign in with email/password
export async function signIn(email: string, password: string) {
  const { data, error } = await insforge.auth.signInWithPassword({
    email,
    password,
  });
  if (error) return { user: null, error: error.message };
  return { user: (data?.user as User) || null, error: null };
}

// Sign up with email/password
export async function signUp(email: string, password: string, name?: string) {
  const { data, error } = await insforge.auth.signUp({
    email,
    password,
    name,
  });
  if (error) return { user: null, error: error.message };
  return { user: (data?.user as User) || null, error: null };
}

// Sign out
export async function signOut() {
  const { error } = await insforge.auth.signOut();
  if (error) return { error: error.message };
  return { error: null };
}

// Get current user (server-safe)
export async function getCurrentUser() {
  const { data, error } = await insforge.auth.getCurrentUser();
  if (error || !data?.user) return { user: null, error: null };
  return { user: data.user as User, error: null };
}

// OAuth sign in (Google, GitHub)
export function signInWithOAuth(provider: 'google' | 'github') {
  return insforge.auth.signInWithOAuth({
    provider,
    redirectTo: `${process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000'}/shop/auth/callback`,
  });
}
