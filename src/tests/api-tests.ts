/**
 * Test file for Registration API
 * This file demonstrates how to test the API functionality
 */

import { RegistrationAPI } from '@/lib/api';

// Mock data for testing
const testRegistrationData = {
  firstName: 'Test',
  lastName: 'User',
  birthDate: '2000-01-01',
  birthPlace: 'Test City',
  gender: 'M' as const,
  phone: '+237123456789',
  email: 'test@example.com',
  city: 'Test City',
  department: 'Test Department',
  region: 'Test Region',
  country: 'Cameroun',
  bacDate: '2019-07-01',
  bacSeries: 'D' as const,
  bacMention: 'Bien' as const,
  bacType: 'Général' as const,
  probDate: '2018-07-01',
  probSeries: 'D' as const,
  probMention: 'Assez Bien' as const,
  probType: 'Général' as const,
  fatherName: 'Test Father',
  fatherProfession: 'Engineer',
  fatherPhone: '+237123456790',
  motherName: 'Test Mother',
  motherProfession: 'Teacher',
  motherPhone: '+237123456791',
  guardianName: '',
  guardianRelation: '',
  guardianPhone: '',
  photoUrl: 'https://example.com/test-photo.jpg'
};

/**
 * Test suite for Registration API
 */
export class APITest {
  private static testResults: string[] = [];

  /**
   * Log test result
   */
  private static log(testName: string, success: boolean, message?: string) {
    const status = success ? '✅ PASS' : '❌ FAIL';
    const logMessage = `${status} ${testName}${message ? ': ' + message : ''}`;
    this.testResults.push(logMessage);
    console.log(logMessage);
  }

  /**
   * Run all tests
   */
  static async runAllTests() {
    console.log('🚀 Starting Registration API Tests...\n');
    this.testResults = [];

    try {
      // Test 1: Create Registration
      await this.testCreateRegistration();
      
      // Test 2: Get Registration by ID
      await this.testGetRegistrationById();
      
      // Test 3: Get Registrations (Paginated)
      await this.testGetRegistrations();
      
      // Test 4: Search Registrations
      await this.testSearchRegistrations();
      
      // Test 5: Get Registration Stats
      await this.testGetStats();
      
      // Test 6: Update Registration
      await this.testUpdateRegistration();
      
      // Test 7: Update Payment Status
      await this.testUpdatePaymentStatus();

    } catch (error) {
      console.error('Test suite error:', error);
    }

    this.printSummary();
  }

  /**
   * Test: Create Registration
   */
  private static async testCreateRegistration() {
    try {
      const result = await RegistrationAPI.createRegistration(testRegistrationData);
      
      if (result.success && result.id && result.registrationNumber) {
        this.log('Create Registration', true, `ID: ${result.id}`);
        return result.id;
      } else {
        this.log('Create Registration', false, result.message || 'Unknown error');
        return null;
      }
    } catch (error: any) {
      this.log('Create Registration', false, error.message);
      return null;
    }
  }

  /**
   * Test: Get Registration by ID
   */
  private static async testGetRegistrationById() {
    try {
      // First create a registration to get an ID
      const createResult = await RegistrationAPI.createRegistration(testRegistrationData);
      
      if (!createResult.success) {
        this.log('Get Registration by ID', false, 'Failed to create test registration');
        return;
      }

      // Test getting the registration
      const result = await RegistrationAPI.getRegistrationById(createResult.id);
      
      if (result.success && result.data) {
        this.log('Get Registration by ID', true, `Found: ${result.data.first_name} ${result.data.last_name}`);
      } else {
        this.log('Get Registration by ID', false, result.message || 'Not found');
      }
    } catch (error: any) {
      this.log('Get Registration by ID', false, error.message);
    }
  }

  /**
   * Test: Get Registrations (Paginated)
   */
  private static async testGetRegistrations() {
    try {
      const query = {
        page: 1,
        limit: 10,
        sortBy: 'created_at',
        sortOrder: 'desc' as const
      };

      const result = await RegistrationAPI.getRegistrations(query);
      
      if (result.data && Array.isArray(result.data)) {
        this.log('Get Registrations (Paginated)', true, `Found ${result.data.length} registrations (Page ${result.page}/${result.totalPages})`);
      } else {
        this.log('Get Registrations (Paginated)', false, 'No data returned');
      }
    } catch (error: any) {
      this.log('Get Registrations (Paginated)', false, error.message);
    }
  }

  /**
   * Test: Search Registrations
   */
  private static async testSearchRegistrations() {
    try {
      const results = await RegistrationAPI.searchRegistrations('Test');
      
      if (Array.isArray(results)) {
        this.log('Search Registrations', true, `Found ${results.length} results`);
      } else {
        this.log('Search Registrations', false, 'No results returned');
      }
    } catch (error: any) {
      this.log('Search Registrations', false, error.message);
    }
  }

  /**
   * Test: Get Registration Stats
   */
  private static async testGetStats() {
    try {
      const stats = await RegistrationAPI.getRegistrationStats();
      
      if (stats && typeof stats.total === 'number') {
        this.log('Get Registration Stats', true, `Total: ${stats.total}, Paid: ${stats.paid}, Pending: ${stats.pending}`);
      } else {
        this.log('Get Registration Stats', false, 'Invalid stats data');
      }
    } catch (error: any) {
      this.log('Get Registration Stats', false, error.message);
    }
  }

  /**
   * Test: Update Registration
   */
  private static async testUpdateRegistration() {
    try {
      // First create a registration
      const createResult = await RegistrationAPI.createRegistration(testRegistrationData);
      
      if (!createResult.success) {
        this.log('Update Registration', false, 'Failed to create test registration');
        return;
      }

      // Test updating the registration
      const updateData = {
        id: createResult.id,
        phone: '+237987654321',
        city: 'Updated City'
      };

      const result = await RegistrationAPI.updateRegistration(updateData);
      
      if (result.success && result.data) {
        this.log('Update Registration', true, `Updated phone to: ${result.data.phone}`);
      } else {
        this.log('Update Registration', false, result.message || 'Update failed');
      }
    } catch (error: any) {
      this.log('Update Registration', false, error.message);
    }
  }

  /**
   * Test: Update Payment Status
   */
  private static async testUpdatePaymentStatus() {
    try {
      // First create a registration
      const createResult = await RegistrationAPI.createRegistration(testRegistrationData);
      
      if (!createResult.success) {
        this.log('Update Payment Status', false, 'Failed to create test registration');
        return;
      }

      // Test updating payment status
      const paymentData = {
        paymentStatus: 'completed' as const,
        paymentReference: 'TEST-TXN-123',
        paymentAmount: 25000
      };

      const result = await RegistrationAPI.updatePaymentStatus(createResult.id, paymentData);
      
      if (result.success) {
        this.log('Update Payment Status', true, 'Payment status updated successfully');
      } else {
        this.log('Update Payment Status', false, result.message || 'Update failed');
      }
    } catch (error: any) {
      this.log('Update Payment Status', false, error.message);
    }
  }

  /**
   * Print test summary
   */
  private static printSummary() {
    console.log('\n📊 Test Summary:');
    console.log('='.repeat(50));
    
    this.testResults.forEach(result => console.log(result));
    
    const passedTests = this.testResults.filter(result => result.includes('✅ PASS')).length;
    const totalTests = this.testResults.length;
    const failedTests = totalTests - passedTests;
    
    console.log('='.repeat(50));
    console.log(`📈 Results: ${passedTests}/${totalTests} tests passed, ${failedTests} failed`);
    
    if (failedTests === 0) {
      console.log('🎉 All tests passed! API is working correctly.');
    } else {
      console.log('⚠️ Some tests failed. Please check the implementation.');
    }
  }
}

/**
 * Individual test functions for manual testing
 */
export const individualTests = {
  testCreate: () => RegistrationAPI.createRegistration(testRegistrationData),
  
  testGetAll: () => RegistrationAPI.getRegistrations({ page: 1, limit: 10 }),
  
  testStats: () => RegistrationAPI.getRegistrationStats(),
  
  testSearch: (term: string) => RegistrationAPI.searchRegistrations(term),
  
  testExport: () => RegistrationAPI.exportRegistrations('csv')
};

// Run tests if this file is executed directly
if (typeof window !== 'undefined') {
  // Browser environment
  (window as any).APITest = APITest;
  (window as any).individualTests = individualTests;
}

// For Node.js environment
if (typeof module !== 'undefined' && module.exports) {
  module.exports = { APITest, individualTests };
}