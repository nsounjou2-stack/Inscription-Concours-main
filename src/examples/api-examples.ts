/**
 * Example usage of the Registration API
 * Demonstrates various API operations
 * NOTE: This file contains examples that should only be used in Node.js/server environments
 * The RegistrationAPI is designed to work through HTTP endpoints, not direct database calls
 */

import { RegistrationAPI } from '@/lib/api';

// Example 1: Create a new registration
export const createRegistrationExample = async () => {
  try {
    const registrationData = {
      firstName: 'Jean',
      lastName: 'Dupont',
      birthDate: '2000-05-15',
      birthPlace: 'Yaoundé',
      gender: 'M' as const,
      phone: '+237123456789',
      email: 'jean.dupont@email.com',
      city: 'Yaoundé',
      department: 'Centre',
      region: 'Centre',
      country: 'Cameroun',
      bacDate: '2019-07-01',
      bacSeries: 'D' as const,
      bacMention: 'Bien' as const,
      bacType: 'Général' as const,
      probDate: '2018-07-01',
      probSeries: 'D' as const,
      probMention: 'Assez Bien' as const,
      probType: 'Général' as const,
      fatherName: 'Pierre Dupont',
      fatherProfession: 'Ingénieur',
      fatherPhone: '+237123456790',
      motherName: 'Marie Dupont',
      motherProfession: 'Professeur',
      motherPhone: '+237123456791',
      guardianName: '',
      guardianRelation: '',
      guardianPhone: '',
      photoUrl: 'https://example.com/photos/jean-dupont.jpg'
    };

    const result = await RegistrationAPI.createRegistration(registrationData);
    
    if (result.success) {
      console.log('Registration created successfully!');
      console.log('ID:', result.id);
      console.log('Registration Number:', result.registrationNumber);
      return result.id;
    } else {
      console.error('Failed to create registration:', result.message);
      return null;
    }
  } catch (error) {
    console.error('Error creating registration:', error);
    return null;
  }
};

// Example 2: Get a specific registration
export const getRegistrationExample = async (registrationId: string) => {
  try {
    const result = await RegistrationAPI.getRegistrationById(registrationId);
    
    if (result.success) {
      console.log('Registration found:', result.data);
      return result.data;
    } else {
      console.error('Registration not found:', result.message);
      return null;
    }
  } catch (error) {
    console.error('Error getting registration:', error);
    return null;
  }
};

// Example 3: Get all registrations with pagination
export const getRegistrationsExample = async () => {
  try {
    const query = {
      page: 1,
      limit: 10,
      sortBy: 'created_at',
      sortOrder: 'desc' as const
    };

    const result = await RegistrationAPI.getRegistrations(query);
    
    console.log('Registrations:', result.data);
    console.log(`Page ${result.page} of ${result.totalPages}`);
    console.log(`Total: ${result.total} registrations`);
    
    return result.data;
  } catch (error) {
    console.error('Error getting registrations:', error);
    return [];
  }
};

// Example 4: Search registrations
export const searchRegistrationsExample = async (searchTerm: string) => {
  try {
    const results = await RegistrationAPI.searchRegistrations(searchTerm);
    
    console.log(`Found ${results.length} results for "${searchTerm}":`);
    results.forEach(reg => {
      console.log(`${reg.registration_number}: ${reg.first_name} ${reg.last_name} (${reg.email})`);
    });
    
    return results;
  } catch (error) {
    console.error('Error searching registrations:', error);
    return [];
  }
};

// Example 5: Update a registration
export const updateRegistrationExample = async (registrationId: string) => {
  try {
    const updateData = {
      id: registrationId,
      phone: '+237123456792',
      city: 'Douala',
      department: 'Littoral'
    };

    const result = await RegistrationAPI.updateRegistration(updateData);
    
    if (result.success) {
      console.log('Registration updated successfully!');
      console.log('Updated data:', result.data);
      return result.data;
    } else {
      console.error('Failed to update registration:', result.message);
      return null;
    }
  } catch (error) {
    console.error('Error updating registration:', error);
    return null;
  }
};

// Example 6: Update payment status
export const updatePaymentStatusExample = async (registrationId: string) => {
  try {
    const paymentData = {
      paymentStatus: 'completed' as const,
      paymentReference: 'TXN123456789',
      paymentAmount: 25000,
      paymentDate: new Date().toISOString()
    };

    const result = await RegistrationAPI.updatePaymentStatus(registrationId, paymentData);
    
    if (result.success) {
      console.log('Payment status updated successfully!');
      return true;
    } else {
      console.error('Failed to update payment status:', result.message);
      return false;
    }
  } catch (error) {
    console.error('Error updating payment status:', error);
    return false;
  }
};

// Example 7: Get registration statistics
export const getStatisticsExample = async () => {
  try {
    const stats = await RegistrationAPI.getRegistrationStats();
    
    console.log('Registration Statistics:');
    console.log(`Total Registrations: ${stats.total}`);
    console.log(`Paid: ${stats.paid}, Pending: ${stats.pending}`);
    console.log(`Male: ${stats.male}, Female: ${stats.female}`);
    console.log(`General Bac: ${stats.general}, Technical Bac: ${stats.technical}`);
    
    return stats;
  } catch (error) {
    console.error('Error getting statistics:', error);
    return null;
  }
};

// Example 8: Export registrations to CSV
export const exportRegistrationsExample = async () => {
  try {
    const csvData = await RegistrationAPI.exportRegistrations('csv');
    
    console.log('CSV Data generated successfully!');
    console.log('Sample data:', csvData.substring(0, 200) + '...');
    
    // In a real application, you would download this file
    const blob = new Blob([csvData], { type: 'text/csv' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `registrations_${new Date().toISOString().split('T')[0]}.csv`;
    a.click();
    URL.revokeObjectURL(url);
    
    return true;
  } catch (error) {
    console.error('Error exporting registrations:', error);
    return false;
  }
};

// Example 9: Filter registrations by region and payment status
export const filterRegistrationsExample = async () => {
  try {
    const query = {
      page: 1,
      limit: 20,
      region: 'Centre',
      paymentStatus: 'completed' as const,
      sortBy: 'first_name',
      sortOrder: 'asc' as const
    };

    const result = await RegistrationAPI.getRegistrations(query);
    
    console.log(`Found ${result.data.length} completed registrations from Centre region`);
    result.data.forEach(reg => {
      console.log(`${reg.first_name} ${reg.last_name} - ${reg.registration_number}`);
    });
    
    return result.data;
  } catch (error) {
    console.error('Error filtering registrations:', error);
    return [];
  }
};

// Example 10: Complete workflow
export const completeWorkflowExample = async () => {
  console.log('Starting complete registration workflow...');
  
  // Step 1: Create a new registration
  const registrationId = await createRegistrationExample();
  if (!registrationId) return;
  
  // Step 2: Get the created registration
  const registration = await getRegistrationExample(registrationId);
  if (!registration) return;
  
  // Step 3: Update the registration
  const updatedReg = await updateRegistrationExample(registrationId);
  if (!updatedReg) return;
  
  // Step 4: Update payment status
  await updatePaymentStatusExample(registrationId);
  
  // Step 5: Get statistics
  const stats = await getStatisticsExample();
  
  console.log('Complete workflow finished successfully!');
  console.log('Final statistics:', stats);
};

// Demo function for testing
export const runApiExamples = async () => {
  console.log('=== Registration API Examples ===\n');
  
  // Run individual examples
  console.log('1. Creating registration...');
  const regId = await createRegistrationExample();
  
  if (regId) {
    console.log('\n2. Getting registration...');
    await getRegistrationExample(regId);
    
    console.log('\n3. Updating registration...');
    await updateRegistrationExample(regId);
    
    console.log('\n4. Updating payment status...');
    await updatePaymentStatusExample(regId);
  }
  
  console.log('\n5. Getting all registrations...');
  await getRegistrationsExample();
  
  console.log('\n6. Getting statistics...');
  await getStatisticsExample();
  
  console.log('\n7. Searching registrations...');
  await searchRegistrationsExample('Jean');
  
  console.log('\n8. Filtering registrations...');
  await filterRegistrationsExample();
  
  console.log('\n9. Exporting registrations...');
  await exportRegistrationsExample();
  
  console.log('\n=== Examples Complete ===');
};