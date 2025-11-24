# Registration API Documentation

This document provides comprehensive documentation for the Registration API that handles form data retrieval and storage for the contest registration system.

## Overview

The Registration API provides RESTful endpoints for managing contest registrations. It integrates with Supabase database and includes validation, error handling, and data transformation capabilities.

## Base URL

```
/api/registrations
```

## Authentication

The API uses Supabase's built-in authentication system. API endpoints can be called anonymously for public operations (registration creation) or with authentication tokens for admin operations.

## API Endpoints

### 1. Create Registration

Creates a new contest registration.

**Endpoint:** `POST /api/registrations`

**Request Body:**
```typescript
{
  // Personal information
  firstName: string;
  lastName: string;
  birthDate: string; // ISO date format
  birthPlace: string;
  gender: 'M' | 'F';
  phone: string;
  email: string;
  
  // Address information
  city: string;
  department: string;
  region: string;
  country: string;
  
  // Academic information - Baccalauréat
  bacDate: string; // ISO date format
  bacSeries: string; // 'A' | 'C' | 'D' | 'E' | 'F' | 'G' | 'H' | 'other'
  bacMention: string; // 'Passable' | 'Assez Bien' | 'Bien' | 'Très Bien'
  bacType: string; // 'Général' | 'Technique'
  
  // Academic information - Probatoire
  probDate: string; // ISO date format
  probSeries: string; // 'A' | 'C' | 'D' | 'E' | 'F' | 'G' | 'H' | 'other'
  probMention: string; // 'Passable' | 'Assez Bien' | 'Bien' | 'Très Bien'
  probType: string; // 'Général' | 'Technique'
  
  // Parent information
  fatherName: string;
  fatherProfession?: string;
  fatherPhone?: string;
  motherName: string;
  motherProfession?: string;
  motherPhone?: string;
  
  // Optional legal guardian
  guardianName?: string;
  guardianRelation?: string;
  guardianPhone?: string;
  
  // Documents (URLs)
  photoUrl?: string;
}
```

**Response:**
```typescript
{
  id: string;
  registrationNumber: string;
  success: boolean;
  message?: string;
  data?: {
    // Complete registration object
    id: string;
    registration_number: string;
    first_name: string;
    last_name: string;
    // ... all other fields
  };
}
```

**Example Usage:**
```typescript
import { RegistrationAPI } from '@/lib/api';

const registrationData = {
  firstName: 'John',
  lastName: 'Doe',
  birthDate: '2000-01-01',
  birthPlace: 'Yaoundé',
  gender: 'M',
  phone: '+237123456789',
  email: 'john.doe@email.com',
  city: 'Yaoundé',
  department: 'Centre',
  region: 'Centre',
  country: 'Cameroun',
  bacDate: '2019-07-01',
  bacSeries: 'D',
  bacMention: 'Bien',
  bacType: 'Général',
  probDate: '2018-07-01',
  probSeries: 'D',
  probMention: 'Assez Bien',
  probType: 'Général',
  fatherName: 'Jean Doe',
  fatherProfession: 'Ingénieur',
  fatherPhone: '+237123456789',
  motherName: 'Marie Doe',
  motherProfession: 'Professeur',
  motherPhone: '+237123456790',
  photoUrl: 'https://example.com/photo.jpg'
};

const result = await RegistrationAPI.createRegistration(registrationData);
console.log(result);
```

### 2. Get Registration by ID

Retrieves a specific registration by its ID.

**Endpoint:** `GET /api/registrations/{id}`

**Parameters:**
- `id` (string, required): Registration ID

**Response:**
```typescript
{
  id: string;
  registrationNumber: string;
  success: boolean;
  message?: string;
  data?: {
    // Complete registration object
  };
}
```

**Example Usage:**
```typescript
const result = await RegistrationAPI.getRegistrationById('registration-uuid');
console.log(result);
```

### 3. Get Registrations (Paginated)

Retrieves a list of registrations with pagination and filtering options.

**Endpoint:** `GET /api/registrations`

**Query Parameters:**
```typescript
{
  page?: number;      // Default: 1
  limit?: number;     // Default: 10, Max: 100
  search?: string;    // Search in name, email, registration number
  status?: string;    // Filter by status
  paymentStatus?: string; // 'pending' | 'completed' | 'failed'
  region?: string;    // Filter by region
  sortBy?: string;    // 'created_at' | 'registration_number' | 'first_name' | 'last_name'
  sortOrder?: 'asc' | 'desc'; // Default: 'desc'
}
```

**Response:**
```typescript
{
  data: Array<{
    // Complete registration objects
  }>;
  total: number;
  page: number;
  limit: number;
  totalPages: number;
}
```

**Example Usage:**
```typescript
const query = {
  page: 1,
  limit: 20,
  search: 'John',
  paymentStatus: 'completed',
  sortBy: 'created_at',
  sortOrder: 'desc'
};

const result = await RegistrationAPI.getRegistrations(query);
console.log(result.data);
console.log(`Page ${result.page} of ${result.totalPages}`);
```

### 4. Update Registration

Updates an existing registration.

**Endpoint:** `PUT /api/registrations/{id}`

**Request Body:**
```typescript
{
  id: string; // Required
  // Any subset of CreateRegistrationRequest fields as optional
  firstName?: string;
  lastName?: string;
  // ... other fields
}
```

**Response:**
```typescript
{
  id: string;
  registrationNumber: string;
  success: boolean;
  message?: string;
  data?: {
    // Updated registration object
  };
}
```

**Example Usage:**
```typescript
const updateData = {
  id: 'registration-uuid',
  phone: '+237123456791',
  city: 'Douala'
};

const result = await RegistrationAPI.updateRegistration(updateData);
console.log(result);
```

### 5. Delete Registration

Deletes a registration (admin only).

**Endpoint:** `DELETE /api/registrations/{id}`

**Parameters:**
- `id` (string, required): Registration ID

**Response:**
```typescript
{
  success: boolean;
  message: string;
}
```

**Example Usage:**
```typescript
const result = await RegistrationAPI.deleteRegistration('registration-uuid');
console.log(result.success ? 'Deleted successfully' : 'Failed to delete');
```

### 6. Update Payment Status

Updates the payment status of a registration.

**Endpoint:** `PUT /api/registrations/{id}/payment`

**Request Body:**
```typescript
{
  id: string; // Required
  paymentStatus: 'pending' | 'completed' | 'failed';
  paymentReference?: string;
  paymentAmount?: number;
  paymentDate?: string; // ISO date format
}
```

**Response:**
```typescript
{
  success: boolean;
  message: string;
}
```

**Example Usage:**
```typescript
const paymentData = {
  id: 'registration-uuid',
  paymentStatus: 'completed',
  paymentReference: 'TXN123456',
  paymentAmount: 25000,
  paymentDate: new Date().toISOString()
};

const result = await RegistrationAPI.updatePaymentStatus('registration-uuid', paymentData);
console.log(result);
```

### 7. Get Registration Statistics

Retrieves registration statistics.

**Endpoint:** `GET /api/registrations/stats`

**Response:**
```typescript
{
  total: number;
  paid: number;
  pending: number;
  male: number;
  female: number;
  general: number;
  technical: number;
}
```

**Example Usage:**
```typescript
const stats = await RegistrationAPI.getRegistrationStats();
console.log(`Total registrations: ${stats.total}`);
console.log(`Paid: ${stats.paid}, Pending: ${stats.pending}`);
console.log(`Male: ${stats.male}, Female: ${stats.female}`);
```

### 8. Search Registrations

Searches registrations by text across multiple fields.

**Endpoint:** `GET /api/registrations/search`

**Parameters:**
- `searchTerm` (string, required): Search term

**Response:**
```typescript
Array<{
  // Complete registration objects matching the search
}>
```

**Example Usage:**
```typescript
const searchTerm = 'John Doe';
const results = await RegistrationAPI.searchRegistrations(searchTerm);
console.log(`Found ${results.length} results`);
```

### 9. Export Registrations

Exports registration data in CSV format.

**Endpoint:** `GET /api/registrations/export`

**Query Parameters:**
- `format` (string, optional): 'csv' | 'xlsx' (default: 'csv')

**Response:**
```typescript
string // CSV formatted data
```

**Example Usage:**
```typescript
const csvData = await RegistrationAPI.exportRegistrations('csv');
console.log(csvData);

// Save to file
const blob = new Blob([csvData], { type: 'text/csv' });
const url = URL.createObjectURL(blob);
const a = document.createElement('a');
a.href = url;
a.download = 'registrations.csv';
a.click();
```

## Error Handling

All API methods return consistent error responses:

```typescript
{
  success: false;
  message: string; // Error description
  // Additional error details may be included
}
```

**Common Error Scenarios:**

1. **Validation Error**: When input data doesn't match the schema
2. **Not Found**: When a registration with the specified ID doesn't exist
3. **Database Error**: When database operations fail
4. **Authentication Error**: When required authentication is missing

## Data Validation

The API uses Zod for input validation. All data is validated before processing. Invalid data will result in a validation error response.

## Rate Limiting

Rate limiting is handled by Supabase. For production usage, consider implementing additional rate limiting on your frontend.

## CORS

CORS is configured through Supabase. The API can be called from any domain with appropriate CORS headers.

## Database Schema

The API works with the following database structure:

- **Primary Table**: `registrations`
- **Fields**: See the complete database schema in `complete_database_schema.sql`
- **Auto-generation**: Registration numbers are auto-generated by database triggers
- **UUIDs**: All IDs use UUID format for security and scalability

## Integration Examples

### React Component Usage

```typescript
import React, { useState, useEffect } from 'react';
import { RegistrationAPI } from '@/lib/api';

interface RegistrationFormProps {
  registrationId?: string;
}

export const RegistrationForm: React.FC<RegistrationFormProps> = ({ registrationId }) => {
  const [registration, setRegistration] = useState<any>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (registrationId) {
      loadRegistration();
    }
  }, [registrationId]);

  const loadRegistration = async () => {
    setLoading(true);
    setError(null);
    
    const result = await RegistrationAPI.getRegistrationById(registrationId!);
    
    if (result.success) {
      setRegistration(result.data);
    } else {
      setError(result.message);
    }
    
    setLoading(false);
  };

  const handleSubmit = async (formData: any) => {
    setLoading(true);
    setError(null);
    
    let result;
    if (registrationId) {
      result = await RegistrationAPI.updateRegistration({ id: registrationId, ...formData });
    } else {
      result = await RegistrationAPI.createRegistration(formData);
    }
    
    if (result.success) {
      console.log('Success:', result.message);
    } else {
      setError(result.message);
    }
    
    setLoading(false);
  };

  if (loading) return <div>Loading...</div>;
  if (error) return <div>Error: {error}</div>;

  return (
    <div>
      {/* Your form JSX here */}
    </div>
  );
};
```

### Admin Dashboard Usage

```typescript
import React, { useState, useEffect } from 'react';
import { RegistrationAPI } from '@/lib/api';

export const AdminDashboard: React.FC = () => {
  const [registrations, setRegistrations] = useState<any[]>([]);
  const [stats, setStats] = useState<any>(null);
  const [filters, setFilters] = useState({
    page: 1,
    limit: 20,
    paymentStatus: 'pending'
  });

  useEffect(() => {
    loadRegistrations();
    loadStats();
  }, [filters]);

  const loadRegistrations = async () => {
    const result = await RegistrationAPI.getRegistrations(filters);
    if (result.data) {
      setRegistrations(result.data);
    }
  };

  const loadStats = async () => {
    const statsData = await RegistrationAPI.getRegistrationStats();
    setStats(statsData);
  };

  const handlePaymentUpdate = async (id: string, status: string) => {
    const result = await RegistrationAPI.updatePaymentStatus(id, {
      paymentStatus: status as any
    });
    
    if (result.success) {
      // Refresh data
      loadRegistrations();
      loadStats();
    }
  };

  return (
    <div>
      {/* Statistics */}
      <div className="grid grid-cols-4 gap-4 mb-8">
        <div className="stat-card">
          <h3>Total Registrations</h3>
          <p>{stats?.total || 0}</p>
        </div>
        <div className="stat-card">
          <h3>Paid</h3>
          <p>{stats?.paid || 0}</p>
        </div>
        <div className="stat-card">
          <h3>Pending</h3>
          <p>{stats?.pending || 0}</p>
        </div>
        <div className="stat-card">
          <h3>Male/Female</h3>
          <p>{stats?.male || 0} / {stats?.female || 0}</p>
        </div>
      </div>

      {/* Registrations Table */}
      <table>
        <thead>
          <tr>
            <th>Registration Number</th>
            <th>Name</th>
            <th>Email</th>
            <th>Payment Status</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {registrations.map(reg => (
            <tr key={reg.id}>
              <td>{reg.registration_number}</td>
              <td>{reg.first_name} {reg.last_name}</td>
              <td>{reg.email}</td>
              <td>
                <select
                  value={reg.payment_status || 'pending'}
                  onChange={(e) => handlePaymentUpdate(reg.id, e.target.value)}
                >
                  <option value="pending">Pending</option>
                  <option value="completed">Completed</option>
                  <option value="failed">Failed</option>
                </select>
              </td>
              <td>
                <button onClick={() => {/* View details */}}>
                  View
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};
```

## Best Practices

1. **Error Handling**: Always check the `success` property of API responses
2. **Validation**: Input data is validated automatically, but you can also validate on the frontend
3. **Pagination**: Use pagination for large datasets to improve performance
4. **Search**: Use the search functionality instead of fetching all records
5. **Statistics**: Cache statistics data to reduce database load
6. **Export**: Use export functionality for bulk data operations

## Support

For questions or issues with the Registration API, please refer to:
- API source code in `src/lib/api.ts`
- Database schema in `complete_database_schema.sql`
- Supabase documentation at https://supabase.com/docs