'use client';

import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { ReactNode, useState, createContext, useContext } from 'react';

// 1. Create Context
const QueryClientContext = createContext<QueryClient | null>(null);

// 2. Export Hook
export const useQueryClientInstance = () => {
  const context = useContext(QueryClientContext);
  if (!context) throw new Error('useQueryClientInstance must be used within ReactQueryProvider');
  return context;
};

export default function ReactQueryProvider({ children }: { children: ReactNode }) {
  const [queryClient] = useState(() => new QueryClient());

  return (
    <QueryClientContext.Provider value={queryClient}>
      <QueryClientProvider client={queryClient}>
        {children}
      </QueryClientProvider>
    </QueryClientContext.Provider>
  );
}
