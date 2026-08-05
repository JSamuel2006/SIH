import React, { createContext, useContext, useState } from 'react';

export type UserRole = 'ROLE_CITIZEN' | 'ROLE_OFFICER' | 'ROLE_ADMIN';

export interface User {
  id: string;
  name: string;
  email: string;
  role: UserRole;
  jurisdiction?: string;
  abhaId?: string;
}

interface AuthContextType {
  user: User | null;
  isAuthenticated: boolean;
  login: (role: UserRole, name?: string, abhaId?: string) => void;
  logout: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(() => {
    const saved = localStorage.getItem('arogya_user');
    if (saved) {
      try {
        return JSON.parse(saved);
      } catch (e) {
        return null;
      }
    }
    // Default demo user (Public Health Officer for instant rich UI access)
    return {
      id: 'usr-901',
      name: 'Dr. Rajesh Sharma',
      email: 'officer.pune@mohfw.gov.in',
      role: 'ROLE_OFFICER',
      jurisdiction: 'Pune District',
      abhaId: 'ABHA-91-8842-1029-4410',
    };
  });

  const login = (role: UserRole, name = 'Rajesh Sharma', abhaId?: string) => {
    const newUser: User = {
      id: `usr-${Math.floor(Math.random() * 1000)}`,
      name,
      email: `${name.toLowerCase().replace(/\s+/g, '.')}@arogyaverse.gov.in`,
      role,
      jurisdiction: role === 'ROLE_OFFICER' ? 'Pune District' : undefined,
      abhaId: abhaId || 'ABHA-91-8842-1029-4410',
    };
    setUser(newUser);
    localStorage.setItem('arogya_user', JSON.stringify(newUser));
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem('arogya_user');
  };

  return (
    <AuthContext.Provider value={{ user, isAuthenticated: !!user, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) throw new Error('useAuth must be used within AuthProvider');
  return context;
}
