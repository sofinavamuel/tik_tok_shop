'use client';

import { createContext, useContext, useEffect, useState, ReactNode } from 'react';
import { insforge } from '@/lib/insforge';
import type { User } from '@/lib/auth';

interface AuthContextType {
  user: User | null;
  loading: boolean;
  signOut: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType>({
  user: null,
  loading: true,
  signOut: async () => {},
});

function extractUser(raw: Record<string, unknown> | null | undefined): User | null {
  if (!raw) return null;
  const profile = (raw.profile as Record<string, unknown> | undefined) || {};
  return {
    id: raw.id as string,
    email: raw.email as string,
    name: profile.name as string | undefined,
    avatar_url: profile.avatar_url as string | undefined,
  };
}

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    insforge.auth.getCurrentUser().then(({ data }) => {
      if (data?.user) {
        setUser(extractUser(data.user as Record<string, unknown>));
      }
      setLoading(false);
    });
  }, []);

  const handleSignOut = async () => {
    await insforge.auth.signOut();
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{ user, loading, signOut: handleSignOut }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  return useContext(AuthContext);
}
