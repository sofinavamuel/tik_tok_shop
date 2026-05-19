import { useAuth as useAuthInternal } from '@/components/auth/AuthProvider';

/**
 * React hook for accessing auth context.
 * Must be used within an <AuthProvider> tree.
 */
export function useAuth() {
  const context = useAuthInternal();
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}

export { AuthProvider } from '@/components/auth/AuthProvider';
