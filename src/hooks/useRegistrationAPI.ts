/**
 * React Hook for Registration API
 * Provides easy-to-use hooks for managing registration data in React components
 */

import { useState, useEffect, useCallback } from 'react';
import { 
  RegistrationAPI, 
  CreateRegistrationRequest, 
  UpdateRegistrationRequest,
  GetRegistrationsQuery 
} from '@/lib/api';

export interface UseRegistrationResult<T> {
  data: T | null;
  loading: boolean;
  error: string | null;
  success: boolean;
}

export interface UseRegistrationsResult<T> {
  data: T[];
  loading: boolean;
  error: string | null;
  success: boolean;
  total: number;
  page: number;
  totalPages: number;
}

export interface UseStatsResult {
  stats: {
    total: number;
    paid: number;
    pending: number;
    male: number;
    female: number;
    general: number;
    technical: number;
  } | null;
  loading: boolean;
  error: string | null;
}

/**
 * Hook for creating a new registration
 */
export const useCreateRegistration = () => {
  const [state, setState] = useState<UseRegistrationResult<any>>({
    data: null,
    loading: false,
    error: null,
    success: false
  });

  const createRegistration = useCallback(async (data: CreateRegistrationRequest) => {
    setState(prev => ({ ...prev, loading: true, error: null }));

    try {
      const result = await RegistrationAPI.createRegistration(data);
      
      setState({
        data: result.data,
        loading: false,
        error: result.success ? null : result.message || 'Failed to create registration',
        success: result.success
      });

      return result;
    } catch (error: any) {
      const errorMessage = error.message || 'An unexpected error occurred';
      setState({
        data: null,
        loading: false,
        error: errorMessage,
        success: false
      });
      
      return { success: false, message: errorMessage };
    }
  }, []);

  return {
    ...state,
    createRegistration,
    reset: () => setState({ data: null, loading: false, error: null, success: false })
  };
};

/**
 * Hook for getting a specific registration by ID
 */
export const useRegistration = (registrationId: string | null, enabled: boolean = true) => {
  const [state, setState] = useState<UseRegistrationResult<any>>({
    data: null,
    loading: false,
    error: null,
    success: false
  });

  const fetchRegistration = useCallback(async (id: string) => {
    setState(prev => ({ ...prev, loading: true, error: null }));

    try {
      const result = await RegistrationAPI.getRegistrationById(id);
      
      setState({
        data: result.data,
        loading: false,
        error: result.success ? null : result.message || 'Failed to fetch registration',
        success: result.success
      });

      return result;
    } catch (error: any) {
      const errorMessage = error.message || 'An unexpected error occurred';
      setState({
        data: null,
        loading: false,
        error: errorMessage,
        success: false
      });
      
      return { success: false, message: errorMessage };
    }
  }, []);

  useEffect(() => {
    if (enabled && registrationId) {
      fetchRegistration(registrationId);
    }
  }, [registrationId, enabled, fetchRegistration]);

  return {
    ...state,
    fetchRegistration,
    refresh: () => registrationId && fetchRegistration(registrationId),
    reset: () => setState({ data: null, loading: false, error: null, success: false })
  };
};

/**
 * Hook for getting multiple registrations with pagination and filtering
 */
export const useRegistrations = (query: GetRegistrationsQuery = {}) => {
  const [state, setState] = useState<UseRegistrationsResult<any>>({
    data: [],
    loading: false,
    error: null,
    success: false,
    total: 0,
    page: 0,
    totalPages: 0
  });

  const fetchRegistrations = useCallback(async (searchQuery?: GetRegistrationsQuery) => {
    setState(prev => ({ ...prev, loading: true, error: null }));

    try {
      const result = await RegistrationAPI.getRegistrations(searchQuery || query);
      
      setState({
        data: result.data,
        loading: false,
        error: result.data ? null : 'Failed to fetch registrations',
        success: true,
        total: result.total,
        page: result.page,
        totalPages: result.totalPages
      });

      return result;
    } catch (error: any) {
      const errorMessage = error.message || 'An unexpected error occurred';
      setState({
        data: [],
        loading: false,
        error: errorMessage,
        success: false,
        total: 0,
        page: 0,
        totalPages: 0
      });
      
      return { data: [], total: 0, page: 0, totalPages: 0 };
    }
  }, [query]);

  useEffect(() => {
    fetchRegistrations();
  }, [fetchRegistrations]);

  return {
    ...state,
    fetchRegistrations,
    refresh: () => fetchRegistrations(),
    reset: () => setState({ data: [], loading: false, error: null, success: false, total: 0, page: 0, totalPages: 0 })
  };
};

/**
 * Hook for updating a registration
 */
export const useUpdateRegistration = () => {
  const [state, setState] = useState<UseRegistrationResult<any>>({
    data: null,
    loading: false,
    error: null,
    success: false
  });

  const updateRegistration = useCallback(async (data: UpdateRegistrationRequest) => {
    setState(prev => ({ ...prev, loading: true, error: null }));

    try {
      const result = await RegistrationAPI.updateRegistration(data);
      
      setState({
        data: result.data,
        loading: false,
        error: result.success ? null : result.message || 'Failed to update registration',
        success: result.success
      });

      return result;
    } catch (error: any) {
      const errorMessage = error.message || 'An unexpected error occurred';
      setState({
        data: null,
        loading: false,
        error: errorMessage,
        success: false
      });
      
      return { success: false, message: errorMessage };
    }
  }, []);

  return {
    ...state,
    updateRegistration,
    reset: () => setState({ data: null, loading: false, error: null, success: false })
  };
};

/**
 * Hook for deleting a registration
 */
export const useDeleteRegistration = () => {
  const [state, setState] = useState<UseRegistrationResult<null>>({
    data: null,
    loading: false,
    error: null,
    success: false
  });

  const deleteRegistration = useCallback(async (id: string) => {
    setState(prev => ({ ...prev, loading: true, error: null }));

    try {
      const result = await RegistrationAPI.deleteRegistration(id);
      
      setState({
        data: null,
        loading: false,
        error: result.success ? null : result.message || 'Failed to delete registration',
        success: result.success
      });

      return result;
    } catch (error: any) {
      const errorMessage = error.message || 'An unexpected error occurred';
      setState({
        data: null,
        loading: false,
        error: errorMessage,
        success: false
      });
      
      return { success: false, message: errorMessage };
    }
  }, []);

  return {
    ...state,
    deleteRegistration,
    reset: () => setState({ data: null, loading: false, error: null, success: false })
  };
};

/**
 * Hook for updating payment status
 */
export const useUpdatePayment = () => {
  const [state, setState] = useState<{ 
    loading: boolean; 
    error: string | null; 
    success: boolean;
  }>({
    loading: false,
    error: null,
    success: false
  });

  const updatePayment = useCallback(async (
    id: string, 
    paymentData: {
      paymentStatus: string;
      paymentReference?: string;
      paymentAmount?: number;
      paymentDate?: string;
    }
  ) => {
    setState(prev => ({ ...prev, loading: true, error: null }));

    try {
      const result = await RegistrationAPI.updatePaymentStatus(id, paymentData);
      
      setState({
        loading: false,
        error: result.success ? null : result.message || 'Failed to update payment status',
        success: result.success
      });

      return result;
    } catch (error: any) {
      const errorMessage = error.message || 'An unexpected error occurred';
      setState({
        loading: false,
        error: errorMessage,
        success: false
      });
      
      return { success: false, message: errorMessage };
    }
  }, []);

  return {
    ...state,
    updatePayment,
    reset: () => setState({ loading: false, error: null, success: false })
  };
};

/**
 * Hook for getting registration statistics
 */
export const useRegistrationStats = (refreshInterval?: number) => {
  const [state, setState] = useState<UseStatsResult>({
    stats: null,
    loading: false,
    error: null
  });

  const fetchStats = useCallback(async () => {
    setState(prev => ({ ...prev, loading: true, error: null }));

    try {
      const stats = await RegistrationAPI.getRegistrationStats();
      
      setState({
        stats,
        loading: false,
        error: null
      });

      return stats;
    } catch (error: any) {
      const errorMessage = error.message || 'An unexpected error occurred';
      setState({
        stats: null,
        loading: false,
        error: errorMessage
      });
      
      return null;
    }
  }, []);

  useEffect(() => {
    fetchStats();

    if (refreshInterval && refreshInterval > 0) {
      const interval = setInterval(fetchStats, refreshInterval);
      return () => clearInterval(interval);
    }
  }, [fetchStats, refreshInterval]);

  return {
    ...state,
    fetchStats,
    refresh: fetchStats,
    reset: () => setState({ stats: null, loading: false, error: null })
  };
};

/**
 * Hook for searching registrations
 */
export const useSearchRegistrations = () => {
  const [results, setResults] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const search = useCallback(async (searchTerm: string) => {
    if (!searchTerm.trim()) {
      setResults([]);
      return;
    }

    setLoading(true);
    setError(null);

    try {
      const searchResults = await RegistrationAPI.searchRegistrations(searchTerm);
      setResults(searchResults);
    } catch (error: any) {
      const errorMessage = error.message || 'An unexpected error occurred';
      setError(errorMessage);
      setResults([]);
    } finally {
      setLoading(false);
    }
  }, []);

  const clearResults = useCallback(() => {
    setResults([]);
    setError(null);
  }, []);

  return {
    results,
    loading,
    error,
    search,
    clearResults
  };
};