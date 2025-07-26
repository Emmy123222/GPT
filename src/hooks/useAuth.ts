import { useState, useEffect } from 'react';
import { AuthClient } from '@dfinity/auth-client';
import { Identity } from '@dfinity/agent';

interface AuthState {
  isAuthenticated: boolean;
  identity: Identity | null;
  principal: string | null;
  loading: boolean;
}

export const useAuth = () => {
  const [authState, setAuthState] = useState<AuthState>({
    isAuthenticated: false,
    identity: null,
    principal: null,
    loading: true,
  });

  const [authClient, setAuthClient] = useState<AuthClient | null>(null);

  useEffect(() => {
    initAuth();
  }, []);

  const initAuth = async () => {
    try {
      const client = await AuthClient.create();
      setAuthClient(client);
      
      const isAuthenticated = await client.isAuthenticated();
      
      if (isAuthenticated) {
        const identity = client.getIdentity();
        const principal = identity.getPrincipal().toString();
        
        setAuthState({
          isAuthenticated: true,
          identity,
          principal,
          loading: false,
        });
      } else {
        setAuthState(prev => ({ ...prev, loading: false }));
      }
    } catch (error) {
      console.error('Auth initialization error:', error);
      setAuthState(prev => ({ ...prev, loading: false }));
    }
  };

  const login = async () => {
    if (!authClient) return;

    try {
      await authClient.login({
        identityProvider: process.env.NODE_ENV === 'development' 
          ? 'https://identity.ic0.app'
          : 'https://identity.ic0.app',
        onSuccess: () => {
          const identity = authClient.getIdentity();
          const principal = identity.getPrincipal().toString();
          
          setAuthState({
            isAuthenticated: true,
            identity,
            principal,
            loading: false,
          });
        },
      });
    } catch (error) {
      console.error('Login error:', error);
    }
  };

  const logout = async () => {
    if (!authClient) return;

    try {
      await authClient.logout();
      setAuthState({
        isAuthenticated: false,
        identity: null,
        principal: null,
        loading: false,
      });
    } catch (error) {
      console.error('Logout error:', error);
    }
  };

  return {
    ...authState,
    login,
    logout,
  };
};