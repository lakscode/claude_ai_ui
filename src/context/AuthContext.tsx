import { createContext, useContext, useState, useEffect, type ReactNode } from 'react';

interface User {
  email: string;
  name: string;
  token?: string;
}

interface LoginResponse {
  success?: boolean;
  user?: {
    email: string;
    name?: string;
  };
  token?: string;
  message?: string;
}

interface AuthContextType {
  user: User | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  error: string | null;
  login: (email: string, password: string) => Promise<boolean>;
  logout: () => void;
  clearError: () => void;
}

const AUTH_API_URL = 'http://localhost:5000/auth/login';

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    // Check for stored auth on mount
    const storedUser = localStorage.getItem('user');
    const storedToken = localStorage.getItem('token');
    if (storedUser && storedToken) {
      setUser(JSON.parse(storedUser));
    }
    setIsLoading(false);
  }, []);

  const login = async (email: string, password: string): Promise<boolean> => {
    setIsLoading(true);
    setError(null);

    try {
      const response = await fetch(AUTH_API_URL, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email, password }),
      });

      const data: LoginResponse = await response.json();

      if (response.ok && (data.success !== false)) {
        const userData: User = {
          email: data.user?.email || email,
          name: data.user?.name || email.split('@')[0],
          token: data.token
        };

        setUser(userData);
        localStorage.setItem('user', JSON.stringify(userData));
        if (data.token) {
          localStorage.setItem('token', data.token);
        }
        return true;
      } else {
        setError(data.message || 'Login failed. Please check your credentials.');
        return false;
      }
    } catch (err) {
      console.error('Login error:', err);
      setError('Unable to connect to the server. Please try again later.');
      return false;
    } finally {
      setIsLoading(false);
    }
  };

  const logout = () => {
    setUser(null);
    setError(null);
    localStorage.removeItem('user');
    localStorage.removeItem('token');
  };

  const clearError = () => {
    setError(null);
  };

  return (
    <AuthContext.Provider value={{
      user,
      isAuthenticated: !!user,
      isLoading,
      error,
      login,
      logout,
      clearError
    }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = (): AuthContextType => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
