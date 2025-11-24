/**
 * Client-Side API Layer for Registration Form Data
 * Provides HTTP-based API calls to server endpoints
 * NOTE: This file should only contain client-side HTTP requests
 * Database operations are handled on the server side
 */

import { registrationSchema } from '@/lib/validation';

// API Base URL - use environment variable or default to localhost
const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:3001/api';

// Helper function for making HTTP requests
async function apiRequest<T>(endpoint: string, options: RequestInit = {}): Promise<T> {
  const url = `${API_BASE_URL}${endpoint}`;
  
  const config: RequestInit = {
    headers: {
      'Content-Type': 'application/json',
      ...options.headers,
    },
    ...options,
  };

  try {
    const response = await fetch(url, config);
    
    if (!response.ok) {
      const errorData = await response.json().catch(() => ({ message: 'Network error' }));
      throw new Error(errorData.message || `HTTP error! status: ${response.status}`);
    }
    
    return await response.json();
  } catch (error) {
    console.error(`API request failed: ${endpoint}`, error);
    throw error;
  }
}

// Type definitions for API requests and responses
export interface CreateRegistrationRequest {
  firstName: string;
  lastName: string;
  birthDate: string;
  birthPlace: string;
  gender: 'M' | 'F';
  phone: string;
  email: string;
  city: string;
  department: string;
  region: string;
  country: string;
  bacDate: string;
  bacSeries: string;
  bacMention: string;
  bacType: string;
  probDate: string;
  probSeries: string;
  probMention: string;
  probType: string;
  fatherName: string;
  fatherProfession?: string;
  fatherPhone?: string;
  motherName: string;
  motherProfession?: string;
  motherPhone?: string;
  guardianName?: string;
  guardianRelation?: string;
  guardianPhone?: string;
  photoUrl?: string;
}

export interface UpdateRegistrationRequest {
  id: string;
  firstName?: string;
  lastName?: string;
  birthDate?: string;
  birthPlace?: string;
  gender?: 'M' | 'F';
  phone?: string;
  email?: string;
  city?: string;
  department?: string;
  region?: string;
  country?: string;
  bacDate?: string;
  bacSeries?: string;
  bacMention?: string;
  bacType?: string;
  probDate?: string;
  probSeries?: string;
  probMention?: string;
  probType?: string;
  fatherName?: string;
  fatherProfession?: string;
  fatherPhone?: string;
  motherName?: string;
  motherProfession?: string;
  motherPhone?: string;
  guardianName?: string;
  guardianRelation?: string;
  guardianPhone?: string;
  photoUrl?: string;
}

export interface RegistrationResponse {
  id: string;
  registrationNumber: string;
  success: boolean;
  message?: string;
  data?: any;
}

export interface GetRegistrationsQuery {
  page?: number;
  limit?: number;
  search?: string;
  paymentStatus?: string;
  region?: string;
  sortBy?: string;
  sortOrder?: 'asc' | 'desc';
}

export interface PaginatedResponse<T> {
  data: T[];
  total: number;
  page: number;
  limit: number;
  totalPages: number;
}

export class RegistrationAPI {
  /**
   * Create a new registration
   */
  static async createRegistration(data: CreateRegistrationRequest): Promise<RegistrationResponse> {
    try {
      // Validate input data
      const validationResult = registrationSchema.safeParse(data);
      if (!validationResult.success) {
        return {
          id: '',
          registrationNumber: '',
          success: false,
          message: 'Validation failed',
        };
      }

      // Make HTTP POST request to server
      const result = await apiRequest<{
        id: string;
        registrationNumber: string;
        success: boolean;
        message?: string;
      }>('/registrations', {
        method: 'POST',
        body: JSON.stringify(data),
      });

      return {
        id: result.id,
        registrationNumber: result.registrationNumber,
        success: result.success,
        message: result.message,
      };
    } catch (error: any) {
      console.error('Create registration error:', error);
      return {
        id: '',
        registrationNumber: '',
        success: false,
        message: error.message || 'Failed to create registration',
      };
    }
  }

  /**
   * Get a registration by ID
   */
  static async getRegistrationById(id: string): Promise<RegistrationResponse> {
    try {
      if (!id) {
        return {
          id: '',
          registrationNumber: '',
          success: false,
          message: 'Registration ID is required',
        };
      }

      // Make HTTP GET request to server
      const result = await apiRequest<{
        id: string;
        registrationNumber: string;
        success: boolean;
        data?: any;
        message?: string;
      }>(`/registrations/${id}`);

      return {
        id: result.id,
        registrationNumber: result.registrationNumber,
        success: result.success,
        data: result.data,
        message: result.message,
      };
    } catch (error: any) {
      console.error('Get registration error:', error);
      return {
        id,
        registrationNumber: '',
        success: false,
        message: error.message || 'Failed to retrieve registration',
      };
    }
  }

  /**
   * Get registrations with pagination and filtering
   */
  static async getRegistrations(query: GetRegistrationsQuery = {}): Promise<PaginatedResponse<any>> {
    try {
      const params = new URLSearchParams();
      
      if (query.page) params.append('page', query.page.toString());
      if (query.limit) params.append('limit', query.limit.toString());
      if (query.search) params.append('search', query.search);
      if (query.paymentStatus) params.append('paymentStatus', query.paymentStatus);
      if (query.region) params.append('region', query.region);
      if (query.sortBy) params.append('sortBy', query.sortBy);
      if (query.sortOrder) params.append('sortOrder', query.sortOrder);

      // Make HTTP GET request to server
      const result = await apiRequest<{
        data: any[];
        total: number;
        page: number;
        limit: number;
        totalPages: number;
      }>(`/registrations?${params.toString()}`);

      return result;
    } catch (error: any) {
      console.error('Get registrations error:', error);
      return {
        data: [],
        total: 0,
        page: query.page || 1,
        limit: query.limit || 10,
        totalPages: 0,
      };
    }
  }

  /**
   * Update a registration
   */
  static async updateRegistration(data: UpdateRegistrationRequest): Promise<RegistrationResponse> {
    try {
      if (!data.id) {
        return {
          id: '',
          registrationNumber: '',
          success: false,
          message: 'Registration ID is required for update',
        };
      }

      // Make HTTP PUT request to server
      const result = await apiRequest<{
        id: string;
        registrationNumber: string;
        success: boolean;
        data?: any;
        message?: string;
      }>(`/registrations/${data.id}`, {
        method: 'PUT',
        body: JSON.stringify(data),
      });

      return result;
    } catch (error: any) {
      console.error('Update registration error:', error);
      return {
        id: data.id || '',
        registrationNumber: '',
        success: false,
        message: error.message || 'Failed to update registration',
      };
    }
  }

  /**
   * Update payment status
   */
  static async updatePaymentStatus(
    id: string,
    paymentData: {
      paymentStatus: string;
      paymentReference?: string;
      paymentAmount?: number;
      paymentDate?: string;
    }
  ): Promise<{ success: boolean; message: string }> {
    try {
      if (!['pending', 'completed', 'failed', 'refunded'].includes(paymentData.paymentStatus)) {
        return {
          success: false,
          message: 'Invalid payment status',
        };
      }

      // Make HTTP PUT request to server
      const result = await apiRequest<{
        success: boolean;
        message: string;
      }>(`/registrations/${id}/payment`, {
        method: 'PUT',
        body: JSON.stringify(paymentData),
      });

      return result;
    } catch (error: any) {
      console.error('Update payment status error:', error);
      return {
        success: false,
        message: error.message || 'Failed to update payment status',
      };
    }
  }

  /**
   * Delete a registration by ID
   */
  static async deleteRegistration(id: string): Promise<{ success: boolean; message: string }> {
    try {
      if (!id) {
        return {
          success: false,
          message: 'Registration ID is required for deletion',
        };
      }

      // Make HTTP DELETE request to server
      const result = await apiRequest<{
        success: boolean;
        message: string;
      }>(`/registrations/${id}`, {
        method: 'DELETE',
      });

      return result;
    } catch (error: any) {
      console.error('Delete registration error:', error);
      return {
        success: false,
        message: error.message || 'Failed to delete registration',
      };
    }
  }

  /**
   * Get registration statistics
   */
  static async getRegistrationStats(): Promise<{
    total_registrations: number;
    completed_payments: number;
    pending_payments: number;
    failed_payments: number;
    male_count: number;
    female_count: number;
    total_collected: number;
  }> {
    try {
      // Make HTTP GET request to server
      const result = await apiRequest<{
        total_registrations: number;
        completed_payments: number;
        pending_payments: number;
        failed_payments: number;
        male_count: number;
        female_count: number;
        total_collected: number;
      }>('/registrations/stats');

      return result;
    } catch (error: any) {
      console.error('Get registration stats error:', error);
      return {
        total_registrations: 0,
        completed_payments: 0,
        pending_payments: 0,
        failed_payments: 0,
        male_count: 0,
        female_count: 0,
        total_collected: 0,
      };
    }
  }

  /**
   * Search registrations by text
   */
  static async searchRegistrations(searchTerm: string): Promise<any[]> {
    try {
      if (!searchTerm.trim()) {
        return [];
      }

      // Make HTTP GET request to server
      const result = await apiRequest<any[]>(`/registrations/search?q=${encodeURIComponent(searchTerm)}`);
      return result;
    } catch (error: any) {
      console.error('Search registrations error:', error);
      return [];
    }
  }

  /**
   * Export registrations to CSV format
   */
  static async exportRegistrations(format: 'csv' | 'xlsx' = 'csv'): Promise<string> {
    try {
      if (format !== 'csv') {
        throw new Error('Only CSV export is supported in client-side implementation');
      }

      // Make HTTP GET request to server for CSV export
      const result = await apiRequest<{ csvData: string }>('/registrations/export?format=csv');
      return result.csvData;
    } catch (error: any) {
      console.error('Export registrations error:', error);
      throw new Error('Failed to export registrations');
    }
  }

  /**
   * Update contest settings
   */
  static async updateContestSettings(settings: {
    contest_date?: string;
    contest_location?: string;
    payment_amount?: number;
  }): Promise<{ success: boolean; message: string }> {
    try {
      // Make HTTP PUT request to server
      const result = await apiRequest<{
        success: boolean;
        message: string;
      }>('/contest-settings', {
        method: 'PUT',
        body: JSON.stringify(settings),
      });

      return result;
    } catch (error: any) {
      console.error('Update contest settings error:', error);
      return {
        success: false,
        message: error.message || 'Failed to update contest settings',
      };
    }
  }
}

export default RegistrationAPI;