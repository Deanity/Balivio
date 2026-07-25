'use client';

import React, { createContext, useContext, useState, useEffect } from 'react';

interface User {
  email: string;
  name: string;
  avatar?: string;
}

interface AuthContextType {
  user: User | null;
  isLoggedIn: boolean;
  login: (email: string, name?: string) => void;
  loginWithGoogle: () => void;
  logout: () => void;
}

const AuthContext = createContext<AuthContextType>({
  user: null,
  isLoggedIn: false,
  login: () => {},
  loginWithGoogle: () => {},
  logout: () => {},
});

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [isLoaded, setIsLoaded] = useState(false);

  useEffect(() => {
    try {
      const savedUser = localStorage.getItem('balivio_user');
      if (savedUser) {
        setUser(JSON.parse(savedUser));
      }
    } catch {
      // Ignore localStorage read errors
    } finally {
      setIsLoaded(true);
    }
  }, []);

  const login = (email: string, name?: string) => {
    const newUser: User = {
      email,
      name: name || email.split('@')[0],
      avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=200&q=80',
    };
    setUser(newUser);
    localStorage.setItem('balivio_user', JSON.stringify(newUser));
  };

  const loginWithGoogle = () => {
    const googleUser: User = {
      email: 'traveler@gmail.com',
      name: 'Bali Traveler',
      avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=200&q=80',
    };
    setUser(googleUser);
    localStorage.setItem('balivio_user', JSON.stringify(googleUser));
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem('balivio_user');
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        isLoggedIn: !!user,
        login,
        loginWithGoogle,
        logout,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  return useContext(AuthContext);
}
