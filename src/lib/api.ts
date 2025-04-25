const api = {
  get: async (path: string) => {
    const response = await fetch(`${import.meta.env.VITE_API_URL}${path}`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },
      credentials: "include",
    });

    if (!response.ok) {
      const errorData = await response.json();
      const errorMessage = errorData.message || `Error fetching ${path}`;
      throw new Error(errorMessage);
    }

    return response.json();
  },
  post: async (path: string, data: Record<string, any>) => { // eslint-disable-line @typescript-eslint/no-explicit-any
    const response = await fetch(`${import.meta.env.VITE_API_URL}${path}`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(data),
      credentials: "include",
    });

    if (!response.ok) {
      const errorData = await response.json();
      const errorMessage = errorData.message || `Error posting to ${path}`;
      throw new Error(errorMessage);
    }

    return response.json();
  },
  put: async (path: string, data: any): Promise<any> => { // eslint-disable-line @typescript-eslint/no-explicit-any
    const response = await fetch(`${import.meta.env.VITE_API_URL}${path}`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
      },
      body: data instanceof FormData ? data : JSON.stringify(data),
      credentials: "include",
    });

    if (!response.ok) {
      const errorData = await response.json();
      const errorMessage = errorData.message || `Error putting to ${path}`;
      throw new Error(errorMessage);
    }

    return response.json();
  },
  delete: async (path: string): Promise<void> => {
    const response = await fetch(`${import.meta.env.VITE_API_URL}${path}`, {
      method: "DELETE",
      headers: {
        "Content-Type": "application/json",
      },
      credentials: "include",
    });

    if (!response.ok) {
      const errorData = await response.json();
      const errorMessage = errorData.message || `Error deleting ${path}`;
      throw new Error(errorMessage);
    }

    return;
  },
};

export default api;
