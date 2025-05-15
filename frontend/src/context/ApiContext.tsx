import { createContext, useContext, ReactNode, useEffect, useMemo } from 'react';
import client from '../api/client';
import { useAuth } from '@clerk/clerk-expo';

type ApiContextType = {
  client: typeof client;
};

const ApiContext = createContext<ApiContextType | undefined>(undefined);

export const ApiProvider = ({ children }: { children: ReactNode }) => {
  const { getToken } = useAuth();

  useEffect(() => {
    getToken()
      .then((token) => {
        client.defaults.headers.common['Authorization'] = `Bearer ${token}`;
      })
      .catch(() => {
        delete client.defaults.headers.common['Authorization'];
      });
  }, [getToken]);

  const contextValue = useMemo(() => ({ client }), []);

  return (
    <ApiContext value={contextValue}>{children}</ApiContext>
  )
};

export const useApiContext = () => {
  const context = useContext(ApiContext);
  if (!context) {
    throw new Error('useApiContext must be used within ApiProvider');
  }
  return context.client;
};
