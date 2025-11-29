"use client";
import { useRouter } from 'next/navigation';
import { ShieldX, Home } from 'lucide-react';
import { SoundButton } from '@/components/ui/SoundButton';

export default function UnauthorizedPage() {
  const router = useRouter();

  return (
    <div className="min-h-screen bg-gray-08 text-white-99 flex items-center justify-center p-4">
      <div className="text-center max-w-md">
        <div className="w-20 h-20 bg-red-500/20 rounded-full flex items-center justify-center mx-auto mb-6">
          <ShieldX className="w-10 h-10 text-red-400" />
        </div>
        <h1 className="text-3xl font-bold mb-4">Unauthorized Access</h1>
        <p className="text-gray-60 mb-8">
          You don't have permission to access this page. Please contact your administrator if you believe this is an error.
        </p>
        <SoundButton
          onClick={() => router.push('/')}
          className="inline-flex items-center gap-2 px-6 py-3 bg-purple-60 hover:bg-purple-70 text-white rounded-lg transition-all"
        >
          <Home className="w-5 h-5" />
          Go to Dashboard
        </SoundButton>
      </div>
    </div>
  );
}

