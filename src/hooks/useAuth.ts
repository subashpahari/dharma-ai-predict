import { useState, useEffect } from 'react';
import { api } from '@/lib/api';

export interface User {
  id: string;
  email: string;
  display_name?: string;
}

export function useAuth() {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const token = localStorage.getItem('access_token');
    const storedUser = localStorage.getItem('user_data');
    if (token && storedUser) {
      setUser(JSON.parse(storedUser));
      setLoading(false);
      // Optional: Verify token with /api/users/me
      api.get('/users/me').then(u => {
        setUser(u as User);
        localStorage.setItem('user_data', JSON.stringify(u));
      }).catch(() => {
        signOut();
      });
    } else {
      setLoading(false);
    }
  }, []);

  const storeSession = (token: string, userData: User) => {
    localStorage.setItem('access_token', token);
    localStorage.setItem('user_data', JSON.stringify(userData));
    setUser(userData);
  }

  const signIn = async (email: string, password: string) => {
    try {
      const res = await api.post('/users/login', { email, password });
      storeSession(res.access_token, res.user);
      return { error: null };
    } catch (error: any) {
      return { error };
    }
  };

  const signUp = async (email: string, password: string) => {
    try {
      await api.post('/users/register', { email, password });
      return { error: null };
    } catch (error: any) {
      return { error };
    }
  };

  const signOut = async () => {
    localStorage.removeItem('access_token');
    localStorage.removeItem('user_data');
    setUser(null);
  };

  const handleGoogleSuccess = async (tokenResponse: any) => {
    try {
      const res = await api.post('/users/google', { token: tokenResponse.credential || tokenResponse.access_token });
      storeSession(res.access_token, res.user);
      return { error: null };
    } catch (error: any) {
      return { error };
    }
  };

  return { user, loading, signIn, signUp, signOut, handleGoogleSuccess };
}
