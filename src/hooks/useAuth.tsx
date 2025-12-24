import { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { User } from '@/types/strengths';

interface AuthContextType {
  user: User | null;
  isLoading: boolean;
  login: (email: string, password: string) => Promise<{ success: boolean; error?: string }>;
  signup: (email: string, password: string, name: string) => Promise<{ success: boolean; error?: string }>;
  logout: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

const USERS_KEY = 'strengths_insight_users';
const CURRENT_USER_KEY = 'strengths_insight_current_user';

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Check for existing session
    const storedUser = localStorage.getItem(CURRENT_USER_KEY);
    if (storedUser) {
      try {
        setUser(JSON.parse(storedUser));
      } catch {
        localStorage.removeItem(CURRENT_USER_KEY);
      }
    }
    setIsLoading(false);
  }, []);

  const getUsers = (): Record<string, { user: User; passwordHash: string }> => {
    try {
      const stored = localStorage.getItem(USERS_KEY);
      return stored ? JSON.parse(stored) : {};
    } catch {
      return {};
    }
  };

  const saveUsers = (users: Record<string, { user: User; passwordHash: string }>) => {
    localStorage.setItem(USERS_KEY, JSON.stringify(users));
  };

  // Simple hash function (not secure, but good for demo)
  const hashPassword = (password: string): string => {
    let hash = 0;
    for (let i = 0; i < password.length; i++) {
      const char = password.charCodeAt(i);
      hash = ((hash << 5) - hash) + char;
      hash = hash & hash;
    }
    return hash.toString(16);
  };

  const login = async (email: string, password: string): Promise<{ success: boolean; error?: string }> => {
    const users = getUsers();
    const userEntry = users[email.toLowerCase()];

    if (!userEntry) {
      return { success: false, error: 'No account found with this email' };
    }

    if (userEntry.passwordHash !== hashPassword(password)) {
      return { success: false, error: 'Incorrect password' };
    }

    setUser(userEntry.user);
    localStorage.setItem(CURRENT_USER_KEY, JSON.stringify(userEntry.user));
    return { success: true };
  };

  const signup = async (email: string, password: string, name: string): Promise<{ success: boolean; error?: string }> => {
    const users = getUsers();
    const emailLower = email.toLowerCase();

    if (users[emailLower]) {
      return { success: false, error: 'An account with this email already exists' };
    }

    if (password.length < 6) {
      return { success: false, error: 'Password must be at least 6 characters' };
    }

    const newUser: User = {
      id: crypto.randomUUID(),
      email: emailLower,
      name: name.trim(),
      createdAt: new Date().toISOString(),
    };

    users[emailLower] = {
      user: newUser,
      passwordHash: hashPassword(password),
    };

    saveUsers(users);
    setUser(newUser);
    localStorage.setItem(CURRENT_USER_KEY, JSON.stringify(newUser));
    return { success: true };
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem(CURRENT_USER_KEY);
  };

  return (
    <AuthContext.Provider value={{ user, isLoading, login, signup, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}
