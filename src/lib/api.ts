const API_URL = import.meta.env.VITE_API_URL;

const api = {
  get: async (path: string) => {
    const response = await fetch(`${API_URL}${path}`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
      credentials: 'include', // Incluir cookies en la solicitud
    });

    if (!response.ok) {
      const errorData = await response.json();
      const errorMessage = errorData.message || `Error fetching ${path}`;
      throw new Error(errorMessage);
    }

    return response.json();
  },
  // Puedes añadir otros métodos como post, put, delete si son necesarios
  // post: async (path: string, data: any) => { ... }
};

export default api;
