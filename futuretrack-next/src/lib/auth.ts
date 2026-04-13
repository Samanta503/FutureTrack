import { getApiUrl } from "./api";

export interface User {
  id: number;
  name: string;
  email: string;
}

export interface AuthResponse {
  status: string;
  message: string;
  data: {
    user: User;
    token: string;
  };
}

export interface AuthError {
  message: string;
  errors?: Record<string, string[]>;
}

const TOKEN_KEY = "auth_token";
const USER_KEY = "auth_user";

/**
 * Register a new user
 */
export async function register(
  name: string,
  email: string,
  password: string,
  passwordConfirmation: string
): Promise<AuthResponse> {
  const response = await fetch(getApiUrl("/auth/register"), {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      name,
      email,
      password,
      password_confirmation: passwordConfirmation,
    }),
  });

  if (!response.ok) {
    const error = await response.json();
    throw error as AuthError;
  }

  const data = (await response.json()) as AuthResponse;
  
  // Store token and user
  localStorage.setItem(TOKEN_KEY, data.data.token);
  localStorage.setItem(USER_KEY, JSON.stringify(data.data.user));

  return data;
}

/**
 * Login user
 */
export async function login(
  email: string,
  password: string
): Promise<AuthResponse> {
  const response = await fetch(getApiUrl("/auth/login"), {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      email,
      password,
    }),
  });

  if (!response.ok) {
    const error = await response.json();
    throw error as AuthError;
  }

  const data = (await response.json()) as AuthResponse;
  
  // Store token and user
  localStorage.setItem(TOKEN_KEY, data.data.token);
  localStorage.setItem(USER_KEY, JSON.stringify(data.data.user));

  return data;
}

/**
 * Logout user
 */
export async function logout(): Promise<void> {
  const token = getToken();
  
  if (token) {
    try {
      await fetch(getApiUrl("/auth/logout"), {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      });
    } catch (error) {
      console.error("Logout error:", error);
    }
  }

  // Remove token and user from storage
  localStorage.removeItem(TOKEN_KEY);
  localStorage.removeItem(USER_KEY);
}

/**
 * Get stored auth token
 */
export function getToken(): string | null {
  if (typeof window === "undefined") return null;
  return localStorage.getItem(TOKEN_KEY);
}

/**
 * Get stored user
 */
export function getStoredUser(): User | null {
  if (typeof window === "undefined") return null;
  const user = localStorage.getItem(USER_KEY);
  return user ? JSON.parse(user) : null;
}

/**
 * Check if user is authenticated
 */
export function isAuthenticated(): boolean {
  return !!getToken();
}

/**
 * Get authorization header for API requests
 */
export function getAuthHeader(): Record<string, string> {
  const token = getToken();
  return token ? { Authorization: `Bearer ${token}` } : {};
}

/**
 * Fetch current user from API
 */
export async function getCurrentUser(): Promise<User | null> {
  const token = getToken();
  
  if (!token) {
    return null;
  }

  try {
    const response = await fetch(getApiUrl("/auth/me"), {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    if (!response.ok) {
      // Token is invalid, clear storage
      localStorage.removeItem(TOKEN_KEY);
      localStorage.removeItem(USER_KEY);
      return null;
    }

    const data = await response.json();
    const user = data.data.user;
    
    // Update stored user
    localStorage.setItem(USER_KEY, JSON.stringify(user));
    
    return user;
  } catch (error) {
    console.error("Error fetching current user:", error);
    return null;
  }
}
