'use client';

import { useEffect, useState } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { insforge } from '@/lib/insforge';

export default function AuthCallbackPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function handleCallback() {
      try {
        // The SDK automatically detects the callback `insforge_code` from the URL
        // and exchanges it for a session. We just need to verify the session exists.
        const { data, error: err } = await insforge.auth.getCurrentUser();

        if (err || !data?.user) {
          setError('Authentication failed. Please try again.');
          return;
        }

        // Check for OAuth error params in URL
        const status = searchParams.get('insforge_status');
        const errorMsg = searchParams.get('insforge_error');

        if (status === 'error') {
          setError(errorMsg || 'Authentication failed.');
          return;
        }

        // Success — redirect to shop
        router.push('/shop');
      } catch {
        setError('An unexpected error occurred.');
      }
    }

    handleCallback();
  }, [router, searchParams]);

  if (error) {
    return (
      <div className="flex min-h-[60vh] items-center justify-center">
        <div className="text-center">
          <div className="mx-auto mb-4 h-12 w-12 rounded-full bg-red-100 flex items-center justify-center">
            <svg className="h-6 w-6 text-red-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </div>
          <p className="text-sm text-red-600">{error}</p>
          <a
            href="/shop/auth/login"
            className="mt-4 inline-block text-sm font-medium text-black hover:underline"
          >
            Back to login
          </a>
        </div>
      </div>
    );
  }

  return (
    <div className="flex min-h-[60vh] items-center justify-center">
      <div className="text-center">
        <div className="mx-auto h-12 w-12 animate-spin rounded-full border-4 border-gray-200 border-t-black" />
        <p className="mt-4 text-sm text-gray-600">
          Signing you in...
        </p>
      </div>
    </div>
  );
}
