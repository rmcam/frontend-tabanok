import { useAuth } from '@/auth/hooks/useAuth';
import { useEffect, useState, useCallback } from 'react';
import api from '../lib/api';

export interface Unit {
  id: string;
  name: string;
  url: string;
}

interface UnityResponse {
  id: string;
  name: string;
  description?: string;
  order?: number;
  requiredPoints?: number;
  metadata?: unknown;
  isActive?: boolean;
}

export const useFetchUnits = () => {
  const [units, setUnits] = useState<Unit[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const { user } = useAuth();

  const fetchUnits = useCallback(async () => {
    if (!user) {
      setLoading(false);
      return;
    }

    try {
      const cachedUnits = sessionStorage.getItem('units');
      if (cachedUnits) {
        setUnits(JSON.parse(cachedUnits));
        setLoading(false);
        return;
      }
      const response = await api.get('/unity');
      const fetchedUnits = response.map((unit: UnityResponse) => ({
        id: unit.id,
        name: unit.name,
        url: `/units/${unit.id}`,
      }));
      setUnits(fetchedUnits);
      sessionStorage.setItem('units', JSON.stringify(fetchedUnits));
    } catch (error: unknown) {
      console.error('Error fetching units:', error);
      setError('Error al obtener las unidades.');
    } finally {
      setLoading(false);
    }
  }, [user]);

  useEffect(() => {
    fetchUnits();
  }, [fetchUnits]);

  const refetch = () => {
    sessionStorage.removeItem('units');
    setLoading(true);
    fetchUnits();
  };

  return { units, loading, error, refetch };
};

export default useFetchUnits;
