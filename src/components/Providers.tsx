'use client';

import React from 'react';
import { StoreProvider } from '../stores/StoreProvider';

export function Providers({ children }: { children: React.ReactNode }) {
  return <StoreProvider>{children}</StoreProvider>;
}
