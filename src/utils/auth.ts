// Token management
export const setToken = (token: string): void => {
  localStorage.setItem('auth_token', token);
};

export const getToken = (): string | null => {
  return localStorage.getItem('auth_token');
};

export const removeToken = (): void => {
  localStorage.removeItem('auth_token');
};

// Authentication check
export const isAuthenticated = (): boolean => {
  const token = getToken();
  return !!token; // Returns true if token exists
};

// User data management
export const setUserData = (user: unknown): void => {
  localStorage.setItem('user_data', JSON.stringify(user));
};

export const getUserData = (): unknown => {
  const userData = localStorage.getItem('user_data');
  return userData ? JSON.parse(userData) : null;
};

export const removeUserData = (): void => {
  localStorage.removeItem('user_data');
};

// Logout function
export const logout = (): void => {
  removeToken();
  removeUserData();
  window.location.href = '/login';
};