import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Authenticating...',
};

export default function AuthCallbackPage() {
  return (
    <div className="flex min-h-[60vh] items-center justify-center">
      <div className="text-center">
        <div className="mx-auto h-12 w-12 animate-spin rounded-full border-4 border-gray-200 border-t-black" />
        <p className="mt-4 text-sm text-gray-600">
          Completing authentication...
        </p>
      </div>
    </div>
  );
}
