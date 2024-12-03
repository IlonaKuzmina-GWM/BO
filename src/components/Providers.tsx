'use client';

import React, { useEffect } from 'react';
import { useStore } from '../stores/StoreProvider';
import { setupFetchInterceptor } from '@/utils/setupFetchInterceptor';
import { useRouter } from 'next/navigation';

export function FetchProvider({ children }: { children: React.ReactNode }) {
  const { authStore } = useStore();
  const router = useRouter();

  useEffect(() => {
    setupFetchInterceptor(authStore, router);
  }, [authStore, router]);

  return <>{children}</>;
}
