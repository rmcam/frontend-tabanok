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
};

export default api;
