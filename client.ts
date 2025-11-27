const API_BASE_URL = '/api';

export interface LoginResponse {
  user: any;
}

export interface ApiError {
  error: string;
}

async function fetchAPI<T>(endpoint: string, options?: RequestInit): Promise<T> {
  const response = await fetch(`${API_BASE_URL}${endpoint}`, {
    headers: {
      'Content-Type': 'application/json',
      ...options?.headers,
    },
    ...options,
  });

  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.error || 'Error en el servidor');
  }

  return response.json();
}

export const authAPI = {
  login: (email: string, password: string) =>
    fetchAPI<LoginResponse>('/auth/login', {
      method: 'POST',
      body: JSON.stringify({ email, password }),
    }),

  changePassword: (userId: number, newPassword: string) =>
    fetchAPI<{ success: boolean }>('/auth/change-password', {
      method: 'POST',
      body: JSON.stringify({ userId, newPassword }),
    }),

  forgotPassword: (email: string) =>
    fetchAPI<{ success: boolean; message: string; token: string }>('/auth/forgot-password', {
      method: 'POST',
      body: JSON.stringify({ email }),
    }),

  resetPassword: (token: string, newPassword: string) =>
    fetchAPI<{ success: boolean }>('/auth/reset-password', {
      method: 'POST',
      body: JSON.stringify({ token, newPassword }),
    }),
};

export const usersAPI = {
  getAll: () => fetchAPI<any[]>('/users'),
  
  create: (user: any) =>
    fetchAPI<any>('/users', {
      method: 'POST',
      body: JSON.stringify(user),
    }),

  update: (id: number, user: any) =>
    fetchAPI<any>(`/users/${id}`, {
      method: 'PUT',
      body: JSON.stringify(user),
    }),

  delete: (id: number) =>
    fetchAPI<{ success: boolean }>(`/users/${id}`, {
      method: 'DELETE',
    }),
};

export const tasksAPI = {
  getAll: () => fetchAPI<any[]>('/tasks'),
  
  create: (task: any) =>
    fetchAPI<any>('/tasks', {
      method: 'POST',
      body: JSON.stringify(task),
    }),

  update: (id: number, task: any) =>
    fetchAPI<any>(`/tasks/${id}`, {
      method: 'PUT',
      body: JSON.stringify(task),
    }),

  delete: (id: number) =>
    fetchAPI<{ success: boolean }>(`/tasks/${id}`, {
      method: 'DELETE',
    }),
};

export const meetingsAPI = {
  getAll: () => fetchAPI<any[]>('/meetings'),
  
  create: (meeting: any) =>
    fetchAPI<any>('/meetings', {
      method: 'POST',
      body: JSON.stringify(meeting),
    }),

  update: (id: number, meeting: any) =>
    fetchAPI<any>(`/meetings/${id}`, {
      method: 'PUT',
      body: JSON.stringify(meeting),
    }),

  delete: (id: number) =>
    fetchAPI<{ success: boolean }>(`/meetings/${id}`, {
      method: 'DELETE',
    }),
};

export const leadsAPI = {
  getAll: () => fetchAPI<any[]>('/leads'),
  
  create: (lead: any) =>
    fetchAPI<any>('/leads', {
      method: 'POST',
      body: JSON.stringify(lead),
    }),

  update: (id: number, lead: any) =>
    fetchAPI<any>(`/leads/${id}`, {
      method: 'PUT',
      body: JSON.stringify(lead),
    }),

  delete: (id: number) =>
    fetchAPI<{ success: boolean }>(`/leads/${id}`, {
      method: 'DELETE',
    }),
};

export const activeClientsAPI = {
  getAll: () => fetchAPI<any[]>('/active-clients'),
  
  create: (client: any) =>
    fetchAPI<any>('/active-clients', {
      method: 'POST',
      body: JSON.stringify(client),
    }),

  update: (id: number, client: any) =>
    fetchAPI<any>(`/active-clients/${id}`, {
      method: 'PUT',
      body: JSON.stringify(client),
    }),

  delete: (id: number) =>
    fetchAPI<{ success: boolean }>(`/active-clients/${id}`, {
      method: 'DELETE',
    }),
};

export const botVersionsAPI = {
  getAll: () => fetchAPI<any[]>('/bot-versions'),
  
  create: (version: any) =>
    fetchAPI<any>('/bot-versions', {
      method: 'POST',
      body: JSON.stringify(version),
    }),

  update: (id: number, version: any) =>
    fetchAPI<any>(`/bot-versions/${id}`, {
      method: 'PUT',
      body: JSON.stringify(version),
    }),

  delete: (id: number) =>
    fetchAPI<{ success: boolean }>(`/bot-versions/${id}`, {
      method: 'DELETE',
    }),
};

export const tutorialsAPI = {
  getAll: () => fetchAPI<any[]>('/tutorials'),
  
  create: (tutorial: any) =>
    fetchAPI<any>('/tutorials', {
      method: 'POST',
      body: JSON.stringify(tutorial),
    }),

  update: (id: number, tutorial: any) =>
    fetchAPI<any>(`/tutorials/${id}`, {
      method: 'PUT',
      body: JSON.stringify(tutorial),
    }),

  delete: (id: number) =>
    fetchAPI<{ success: boolean }>(`/tutorials/${id}`, {
      method: 'DELETE',
    }),
};

export const notificationsAPI = {
  getAll: () => fetchAPI<any[]>('/notifications'),
  
  create: (notification: any) =>
    fetchAPI<any>('/notifications', {
      method: 'POST',
      body: JSON.stringify(notification),
    }),

  markAsRead: (id: number) =>
    fetchAPI<any>(`/notifications/${id}/read`, {
      method: 'PUT',
    }),

  delete: (id: number) =>
    fetchAPI<{ success: boolean }>(`/notifications/${id}`, {
      method: 'DELETE',
    }),
};

export const droppedClientsAPI = {
  getAll: () => fetchAPI<any[]>('/dropped-clients'),
  
  create: (client: any) =>
    fetchAPI<any>('/dropped-clients', {
      method: 'POST',
      body: JSON.stringify(client),
    }),

  update: (id: number, client: any) =>
    fetchAPI<any>(`/dropped-clients/${id}`, {
      method: 'PUT',
      body: JSON.stringify(client),
    }),

  delete: (id: number) =>
    fetchAPI<{ success: boolean }>(`/dropped-clients/${id}`, {
      method: 'DELETE',
    }),
};

export const demosAPI = {
  getAll: () => fetchAPI<any[]>('/demos'),
  
  create: (demo: any) =>
    fetchAPI<any>('/demos', {
      method: 'POST',
      body: JSON.stringify(demo),
    }),

  update: (id: number, demo: any) =>
    fetchAPI<any>(`/demos/${id}`, {
      method: 'PUT',
      body: JSON.stringify(demo),
    }),

  delete: (id: number) =>
    fetchAPI<{ success: boolean }>(`/demos/${id}`, {
      method: 'DELETE',
    }),
};
