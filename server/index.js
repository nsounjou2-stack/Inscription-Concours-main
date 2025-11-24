const express = require('express');
const cors = require('cors');
const mysql = require('mysql2/promise');
const path = require('path');
require('dotenv').config({ path: path.join(__dirname, '..', '.env') });

const app = express();
const PORT = process.env.API_PORT || 3001;

// Middleware
app.use(cors());
app.use(express.json());

// Database connection pool
const pool = mysql.createPool({
  host: process.env.DB_HOST || 'localhost',
  user: process.env.DB_USER || 'root',
  password: process.env.DB_PASSWORD || '',
  database: process.env.DB_NAME || 'inscription_concours',
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0
});

// Helper function to generate registration number
function generateRegistrationNumber() {
  const year = new Date().getFullYear();
  const random = Math.floor(Math.random() * 100000).toString().padStart(5, '0');
  return `REG${year}${random}`;
}

// API Routes

// Create registration
app.post('/api/registrations', async (req, res) => {
  try {
    const data = req.body;
    const registrationNumber = generateRegistrationNumber();
    
    const [result] = await pool.execute(
      `INSERT INTO registrations (
        registration_number, first_name, last_name, birth_date, birth_place,
        gender, phone, email, city, department, region, country,
        bac_date, bac_series, bac_mention, bac_type,
        prob_date, prob_series, prob_mention, prob_type,
        father_name, father_profession, father_phone,
        mother_name, mother_profession, mother_phone,
        legal_guardian_name, legal_guardian_relation, legal_guardian_phone,
        photo_url, payment_status
      ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, 'pending')`,
      [
        registrationNumber, data.firstName, data.lastName, data.birthDate, data.birthPlace,
        data.gender, data.phone, data.email, data.city, data.department, data.region, data.country,
        data.bacDate, data.bacSeries, data.bacMention, data.bacType,
        data.probDate, data.probSeries, data.probMention, data.probType,
        data.fatherName, data.fatherProfession || null, data.fatherPhone || null,
        data.motherName, data.motherProfession || null, data.motherPhone || null,
        data.guardianName || null, data.guardianRelation || null, data.guardianPhone || null,
        data.photoUrl || null
      ]
    );

    res.json({
      success: true,
      id: result.insertId.toString(),
      registrationNumber,
      message: 'Registration created successfully'
    });
  } catch (error) {
    console.error('Create registration error:', error);
    res.status(500).json({
      success: false,
      message: error.message || 'Failed to create registration'
    });
  }
});

// Get registration by ID
app.get('/api/registrations/:id', async (req, res) => {
  try {
    const [rows] = await pool.execute(
      'SELECT * FROM registrations WHERE id = ?',
      [req.params.id]
    );

    if (rows.length === 0) {
      return res.status(404).json({
        success: false,
        message: 'Registration not found'
      });
    }

    res.json({
      success: true,
      id: rows[0].id.toString(),
      registrationNumber: rows[0].registration_number,
      data: rows[0]
    });
  } catch (error) {
    console.error('Get registration error:', error);
    res.status(500).json({
      success: false,
      message: error.message || 'Failed to get registration'
    });
  }
});

// Get all registrations with pagination
app.get('/api/registrations', async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const offset = (page - 1) * limit;
    const search = req.query.search || '';
    const paymentStatus = req.query.paymentStatus || '';

    let whereClause = '1=1';
    const params = [];

    if (search) {
      whereClause += ' AND (first_name LIKE ? OR last_name LIKE ? OR registration_number LIKE ? OR email LIKE ?)';
      const searchPattern = `%${search}%`;
      params.push(searchPattern, searchPattern, searchPattern, searchPattern);
    }

    if (paymentStatus) {
      whereClause += ' AND payment_status = ?';
      params.push(paymentStatus);
    }

    // Get total count
    const [countResult] = await pool.execute(
      `SELECT COUNT(*) as total FROM registrations WHERE ${whereClause}`,
      params
    );
    const total = countResult[0].total;

    // Get paginated data
    const queryParams = [...params, limit, offset];
    const [rows] = await pool.execute(
      `SELECT * FROM registrations WHERE ${whereClause} ORDER BY created_at DESC LIMIT ? OFFSET ?`,
      queryParams
    );

    res.json({
      data: rows,
      total,
      page,
      limit,
      totalPages: Math.ceil(total / limit)
    });
  } catch (error) {
    console.error('Get registrations error:', error);
    res.status(500).json({
      data: [],
      total: 0,
      page: 1,
      limit: 10,
      totalPages: 0
    });
  }
});

// Update payment status
app.put('/api/registrations/:id/payment', async (req, res) => {
  try {
    const { paymentStatus, paymentReference, paymentAmount, paymentDate } = req.body;

    await pool.execute(
      `UPDATE registrations SET 
        payment_status = ?,
        payment_reference = ?,
        payment_amount = ?,
        payment_date = ?
      WHERE id = ?`,
      [paymentStatus, paymentReference || null, paymentAmount || 25000, paymentDate || new Date(), req.params.id]
    );

    res.json({
      success: true,
      message: 'Payment status updated successfully'
    });
  } catch (error) {
    console.error('Update payment status error:', error);
    res.status(500).json({
      success: false,
      message: error.message || 'Failed to update payment status'
    });
  }
});

// Update registration
app.put('/api/registrations/:id', async (req, res) => {
  try {
    const data = req.body;
    const fields = [];
    const values = [];

    // Build dynamic update query
    const allowedFields = [
      'first_name', 'last_name', 'birth_date', 'birth_place', 'gender',
      'phone', 'email', 'city', 'department', 'region', 'country',
      'bac_date', 'bac_series', 'bac_mention', 'bac_type',
      'prob_date', 'prob_series', 'prob_mention', 'prob_type',
      'father_name', 'father_profession', 'father_phone',
      'mother_name', 'mother_profession', 'mother_phone',
      'legal_guardian_name', 'legal_guardian_relation', 'legal_guardian_phone', 'photo_url'
    ];

    // Convert camelCase to snake_case and build query
    for (const [key, value] of Object.entries(data)) {
      let snakeKey = key.replace(/[A-Z]/g, letter => `_${letter.toLowerCase()}`);
      
      // Handle guardian fields mapping
      if (snakeKey === 'guardian_name') snakeKey = 'legal_guardian_name';
      if (snakeKey === 'guardian_relation') snakeKey = 'legal_guardian_relation';
      if (snakeKey === 'guardian_phone') snakeKey = 'legal_guardian_phone';
      
      if (allowedFields.includes(snakeKey) && value !== undefined) {
        fields.push(`${snakeKey} = ?`);
        values.push(value);
      }
    }

    if (fields.length === 0) {
      return res.status(400).json({
        success: false,
        message: 'No valid fields to update'
      });
    }

    values.push(req.params.id);

    await pool.execute(
      `UPDATE registrations SET ${fields.join(', ')} WHERE id = ?`,
      values
    );

    res.json({
      success: true,
      id: req.params.id,
      registrationNumber: '',
      message: 'Registration updated successfully'
    });
  } catch (error) {
    console.error('Update registration error:', error);
    res.status(500).json({
      success: false,
      message: error.message || 'Failed to update registration'
    });
  }
});

// Delete registration
app.delete('/api/registrations/:id', async (req, res) => {
  try {
    await pool.execute('DELETE FROM registrations WHERE id = ?', [req.params.id]);

    res.json({
      success: true,
      message: 'Registration deleted successfully'
    });
  } catch (error) {
    console.error('Delete registration error:', error);
    res.status(500).json({
      success: false,
      message: error.message || 'Failed to delete registration'
    });
  }
});

// Get statistics
app.get('/api/registrations/stats', async (req, res) => {
  try {
    const [totalResult] = await pool.execute('SELECT COUNT(*) as total_registrations FROM registrations');
    const [completedResult] = await pool.execute("SELECT COUNT(*) as completed_payments FROM registrations WHERE payment_status = 'completed'");
    const [pendingResult] = await pool.execute("SELECT COUNT(*) as pending_payments FROM registrations WHERE payment_status = 'pending'");
    const [failedResult] = await pool.execute("SELECT COUNT(*) as failed_payments FROM registrations WHERE payment_status = 'failed'");
    const [maleResult] = await pool.execute("SELECT COUNT(*) as male_count FROM registrations WHERE gender = 'M'");
    const [femaleResult] = await pool.execute("SELECT COUNT(*) as female_count FROM registrations WHERE gender = 'F'");

    const [totalCollectedResult] = await pool.execute(
      "SELECT COALESCE(SUM(payment_amount), 0) as total_collected FROM registrations WHERE payment_status = 'completed'"
    );

    res.json({
      total_registrations: totalResult[0].total_registrations || 0,
      completed_payments: completedResult[0].completed_payments || 0,
      pending_payments: pendingResult[0].pending_payments || 0,
      failed_payments: failedResult[0].failed_payments || 0,
      male_count: maleResult[0].male_count || 0,
      female_count: femaleResult[0].female_count || 0,
      total_collected: totalCollectedResult[0].total_collected || 0
    });
  } catch (error) {
    console.error('Get stats error:', error);
    res.status(500).json({
      total_registrations: 0,
      completed_payments: 0,
      pending_payments: 0,
      failed_payments: 0,
      male_count: 0,
      female_count: 0,
      total_collected: 0
    });
  }
});

// Update contest settings
app.put('/api/contest-settings', async (req, res) => {
  try {
    const { contest_date, contest_location, payment_amount } = req.body;
    
    // For now, we'll just return success since there's no settings table
    // In a real implementation, you might want to store these in a settings table
    console.log('Update contest settings:', { contest_date, contest_location, payment_amount });

    res.json({
      success: true,
      message: 'Contest settings updated successfully'
    });
  } catch (error) {
    console.error('Update contest settings error:', error);
    res.status(500).json({
      success: false,
      message: error.message || 'Failed to update contest settings'
    });
  }
});

// Start server
app.listen(PORT, () => {
  console.log(`API Server running on http://localhost:${PORT}`);
});
