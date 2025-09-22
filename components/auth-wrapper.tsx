'use client';

import { useEffect } from 'react';
import { usePathname } from 'next/navigation';
import { useSession } from '@/lib/auth-client';

interface AuthWrapperProps {
  children: React.ReactNode;
}

export function AuthWrapper({ children }: AuthWrapperProps) {
  const { data: session, isPending } = useSession();
  const pathname = usePathname();

  // Don't show loading on sign-in page or auth routes
  if (pathname === '/sign-in' || pathname.startsWith('/api/auth')) {
    return <>{children}</>;
  }

  // Show loading spinner while checking auth status
  if (isPending) {
    return (
      <div className="min-h-screen w-full bg-background flex items-center justify-center">
        <div className="flex flex-col items-center gap-4">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-orange-500"></div>
          <p className="text-muted-foreground">Loading...</p>
        </div>
      </div>
    );
  }

  return <>{children}</>;
}
