// Database Connection Utility (Using MySQL)
import mysql from 'mysql2';

// Database connection configuration
const dbConfig = {
  host: import.meta.env.VITE_DB_HOST || 'localhost',
  port: parseInt(import.meta.env.VITE_DB_PORT) || 3306,
  user: import.meta.env.VITE_DB_USERNAME || 'Nexus',
  password: import.meta.env.VITE_DB_PASSWORD || 'Nuttertools2.0',
  database: import.meta.env.VITE_DB_NAME || 'inscription_concours',
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0
};

// Create connection pool using promise wrapper
const pool = mysql.createPool(dbConfig);

// Interface for registration data
export interface RegistrationInsertData {
  first_name: string;
  last_name: string;
  birth_date: string;
  birth_place: string;
  gender: 'M' | 'F';
  photo_url: string;
  phone: string;
  email: string;
  city: string;
  department: string;
  region: string;
  country: string;
  bac_date: string;
  bac_series: string;
  bac_mention: string;
  bac_type: string;
  bac_exam_center: string;
  prob_date: string;
  prob_series: string;
  prob_mention: string;
  prob_type: string;
  prob_exam_center: string;
  father_name: string;
  father_profession?: string;
  father_phone?: string;
  mother_name: string;
  mother_profession?: string;
  mother_phone?: string;
  legal_guardian_name?: string;
  legal_guardian_relation?: string;
  legal_guardian_phone?: string;
}

// Test database connection
export async function testConnection(): Promise<boolean> {
  try {
    const connection = await pool.getConnection();
    await connection.execute('SELECT 1');
    connection.release();
    console.log('MySQL database connection successful');
    return true;
  } catch (error) {
    console.error('MySQL database connection failed:', error);
    return false;
  }
}

// Function to insert registration data
export async function insertRegistration(data: RegistrationInsertData): Promise<{ id: number; registration_number: string }> {
  let connection;
  try {
    connection = await pool.getConnection();
    
    const query = `
      INSERT INTO registrations (
        first_name, last_name, birth_date, birth_place, gender, photo_url,
        phone, email, city, department, region, country,
        bac_date, bac_series, bac_mention, bac_type, bac_exam_center,
        prob_date, prob_series, prob_mention, prob_type, prob_exam_center,
        father_name, father_profession, father_phone,
        mother_name, mother_profession, mother_phone,
        legal_guardian_name, legal_guardian_relation, legal_guardian_phone
      ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
    `;
    
    const values = [
      data.first_name, data.last_name, data.birth_date, data.birth_place,
      data.gender, data.photo_url, data.phone, data.email, data.city,
      data.department, data.region, data.country, data.bac_date,
      data.bac_series, data.bac_mention, data.bac_type, data.bac_exam_center,
      data.prob_date, data.prob_series, data.prob_mention, data.prob_type,
      data.prob_exam_center, data.father_name, data.father_profession,
      data.father_phone, data.mother_name, data.mother_profession,
      data.mother_phone, data.legal_guardian_name, data.legal_guardian_relation,
      data.legal_guardian_phone
    ];
    
    const [result] = await connection.execute(query, values);
    const insertResult = result as any;
    
    // Get the inserted record with auto-generated registration number
    const [rows] = await connection.execute(
      'SELECT id, registration_number FROM registrations WHERE id = ?',
      [insertResult.insertId]
    );
    
    const record = (rows as any[])[0];
    if (!record) {
      throw new Error('Failed to retrieve inserted registration');
    }
    
    return {
      id: record.id,
      registration_number: record.registration_number
    };
  } catch (error: any) {
    console.error('Registration error:', error);
    throw new Error(`Failed to insert registration: ${error.message}`);
  } finally {
    if (connection) {
      connection.release();
    }
  }
}

// Function to get registration by ID
export async function getRegistrationById(id: string | number) {
  let connection;
  try {
    connection = await pool.getConnection();
    
    const [rows] = await connection.execute(
      'SELECT * FROM registrations WHERE id = ?',
      [id]
    );
    
    const records = rows as any[];
    return records[0] || null;
  } catch (error: any) {
    console.error('Get registration error:', error);
    throw new Error(`Failed to get registration: ${error.message}`);
  } finally {
    if (connection) {
      connection.release();
    }
  }
}

// Function to get all registrations
export async function getAllRegistrations(limit: number = 100, offset: number = 0) {
  let connection;
  try {
    connection = await pool.getConnection();
    
    const [rows] = await connection.execute(
      'SELECT * FROM registrations ORDER BY created_at DESC LIMIT ? OFFSET ?',
      [limit, offset]
    );
    
    return rows as any[];
  } catch (error: any) {
    console.error('Get all registrations error:', error);
    throw new Error(`Failed to get registrations: ${error.message}`);
  } finally {
    if (connection) {
      connection.release();
    }
  }
}

// Function to update payment status
export async function updatePaymentStatus(
  id: number,
  paymentData: {
    payment_status: 'pending' | 'completed' | 'failed' | 'refunded';
    payment_reference?: string;
    payment_date?: string;
    payment_amount?: number;
  }
) {
  let connection;
  try {
    connection = await pool.getConnection();
    
    const [result] = await connection.execute(
      `UPDATE registrations 
       SET payment_status = ?, 
           payment_reference = COALESCE(?, payment_reference),
           payment_date = COALESCE(?, payment_date),
           payment_amount = COALESCE(?, payment_amount),
           updated_at = CURRENT_TIMESTAMP
       WHERE id = ?`,
      [
        paymentData.payment_status,
        paymentData.payment_reference || null,
        paymentData.payment_date || null,
        paymentData.payment_amount || null,
        id
      ]
    );
    
    const updateResult = result as any;
    return updateResult.affectedRows > 0;
  } catch (error: any) {
    console.error('Update payment status error:', error);
    throw new Error(`Failed to update payment status: ${error.message}`);
  } finally {
    if (connection) {
      connection.release();
    }
  }
}

// Function to update contest settings
export async function updateContestSettings(settings: {
  contest_date?: string;
  contest_location?: string;
  payment_amount?: number;
}) {
  let connection;
  try {
    connection = await pool.getConnection();
    
    const updates: string[] = [];
    const values: any[] = [];
    
    if (settings.contest_date) {
      updates.push('contest_date = ?');
      values.push(settings.contest_date);
    }
    
    if (settings.contest_location) {
      updates.push('contest_location = ?');
      values.push(settings.contest_location);
    }
    
    if (settings.payment_amount) {
      updates.push('payment_amount = ?');
      values.push(settings.payment_amount);
    }
    
    if (updates.length === 0) {
      return false;
    }
    
    updates.push('updated_at = CURRENT_TIMESTAMP');
    values.push(...updates);
    
    const [result] = await connection.execute(
      `UPDATE registrations SET ${updates.join(', ')} WHERE contest_date IS NULL`,
      values
    );
    
    const updateResult = result as any;
    return updateResult.affectedRows > 0;
  } catch (error: any) {
    console.error('Update contest settings error:', error);
    throw new Error(`Failed to update contest settings: ${error.message}`);
  } finally {
    if (connection) {
      connection.release();
    }
  }
}

// Function to get registration statistics
export async function getRegistrationStats() {
  let connection;
  try {
    connection = await pool.getConnection();
    
    // Get overall statistics
    const [statsRows] = await connection.execute(`
      SELECT 
        COUNT(*) as total_registrations,
        COUNT(CASE WHEN payment_status = 'completed' THEN 1 END) as completed_payments,
        COUNT(CASE WHEN payment_status = 'pending' THEN 1 END) as pending_payments,
        COUNT(CASE WHEN payment_status = 'failed' THEN 1 END) as failed_payments,
        COUNT(CASE WHEN gender = 'M' THEN 1 END) as male_count,
        COUNT(CASE WHEN gender = 'F' THEN 1 END) as female_count,
        COALESCE(SUM(CASE WHEN payment_status = 'completed' THEN payment_amount END), 0) as total_collected
      FROM registrations
    `);
    
    const stats = (statsRows as any[])[0];
    
    return {
      total_registrations: stats.total_registrations || 0,
      completed_payments: stats.completed_payments || 0,
      pending_payments: stats.pending_payments || 0,
      failed_payments: stats.failed_payments || 0,
      total_collected: parseFloat(stats.total_collected) || 0,
      male_count: stats.male_count || 0,
      female_count: stats.female_count || 0,
    };
  } catch (error: any) {
    console.error('Get registration stats error:', error);
    throw new Error(`Failed to get registration stats: ${error.message}`);
  } finally {
    if (connection) {
      connection.release();
    }
  }
}

// Function for bulk payment status updates
export async function updateBulkPaymentStatus(
  ids: number[], 
  paymentData: {
    payment_status: 'pending' | 'completed' | 'failed' | 'refunded';
    payment_date?: string;
  }
) {
  let connection;
  try {
    connection = await pool.getConnection();
    
    const placeholders = ids.map(() => '?').join(',');
    const [result] = await connection.execute(
      `UPDATE registrations 
       SET payment_status = ?, payment_date = COALESCE(?, payment_date), updated_at = CURRENT_TIMESTAMP
       WHERE id IN (${placeholders})`,
      [paymentData.payment_status, paymentData.payment_date || null, ...ids]
    );
    
    const updateResult = result as any;
    return updateResult.affectedRows;
  } catch (error: any) {
    console.error('Bulk update payment status error:', error);
    throw new Error(`Failed to update bulk payment status: ${error.message}`);
  } finally {
    if (connection) {
      connection.release();
    }
  }
}

// Function to search registrations
export async function searchRegistrations(searchTerm: string, limit: number = 50) {
  let connection;
  try {
    connection = await pool.getConnection();
    
    const [rows] = await connection.execute(
      `SELECT * FROM registrations 
       WHERE first_name LIKE ? 
          OR last_name LIKE ? 
          OR email LIKE ? 
          OR registration_number LIKE ? 
          OR phone LIKE ?
       ORDER BY created_at DESC 
       LIMIT ?`,
      [`%${searchTerm}%`, `%${searchTerm}%`, `%${searchTerm}%`, `%${searchTerm}%`, `%${searchTerm}%`, limit]
    );
    
    return rows as any[];
  } catch (error: any) {
    console.error('Search registrations error:', error);
    throw new Error(`Failed to search registrations: ${error.message}`);
  } finally {
    if (connection) {
      connection.release();
    }
  }
}

// Function to delete registration
export async function deleteRegistration(id: number) {
  let connection;
  try {
    connection = await pool.getConnection();
    
    const [result] = await connection.execute(
      'DELETE FROM registrations WHERE id = ?',
      [id]
    );
    
    const deleteResult = result as any;
    return deleteResult.affectedRows > 0;
  } catch (error: any) {
    console.error('Delete registration error:', error);
    throw new Error(`Failed to delete registration: ${error.message}`);
  } finally {
    if (connection) {
      connection.release();
    }
  }
}

// Initialize database connection on module load
testConnection().then(success => {
  if (!success) {
    console.warn('MySQL database connection failed during initialization');
  }
});

// Graceful shutdown
process.on('SIGINT', async () => {
  console.log('Closing MySQL connection pool...');
  await pool.end();
  process.exit(0);
});

process.on('SIGTERM', async () => {
  console.log('Closing MySQL connection pool...');
  await pool.end();
  process.exit(0);
});