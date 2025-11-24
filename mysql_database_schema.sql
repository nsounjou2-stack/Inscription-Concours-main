-- =====================================================
-- MYSQL DATABASE SCHEMA FOR CONCOURSE REGISTRATION
-- =====================================================
-- Database: MySQL 8.0+
-- Connection: MySQL Server
-- Database Name: inscription_concours

-- =====================================================
-- ENUM TYPES (converted to ENUM or separate tables)
-- =====================================================

-- Create enum-like structures using ENUM
CREATE TABLE IF NOT EXISTS gender_types (
    id TINYINT PRIMARY KEY AUTO_INCREMENT,
    gender_type VARCHAR(10) NOT NULL UNIQUE
) ENGINE=InnoDB;

CREATE TABLE IF NOT EXISTS bac_series_types (
    id TINYINT PRIMARY KEY AUTO_INCREMENT,
    series VARCHAR(10) NOT NULL UNIQUE
) ENGINE=InnoDB;

CREATE TABLE IF NOT EXISTS mention_types (
    id TINYINT PRIMARY KEY AUTO_INCREMENT,
    mention VARCHAR(20) NOT NULL UNIQUE
) ENGINE=InnoDB;

CREATE TABLE IF NOT EXISTS academic_types (
    id TINYINT PRIMARY KEY AUTO_INCREMENT,
    academic_type VARCHAR(20) NOT NULL UNIQUE
) ENGINE=InnoDB;

CREATE TABLE IF NOT EXISTS payment_status_types (
    id TINYINT PRIMARY KEY AUTO_INCREMENT,
    status VARCHAR(20) NOT NULL UNIQUE
) ENGINE=InnoDB;

CREATE TABLE IF NOT EXISTS registration_status_types (
    id TINYINT PRIMARY KEY AUTO_INCREMENT,
    status VARCHAR(20) NOT NULL UNIQUE
) ENGINE=InnoDB;

CREATE TABLE IF NOT EXISTS app_role_types (
    id TINYINT PRIMARY KEY AUTO_INCREMENT,
    role VARCHAR(20) NOT NULL UNIQUE
) ENGINE=InnoDB;

CREATE TABLE IF NOT EXISTS document_types (
    id TINYINT PRIMARY KEY AUTO_INCREMENT,
    doc_type VARCHAR(50) NOT NULL UNIQUE
) ENGINE=InnoDB;

-- Insert enum values
INSERT INTO gender_types (gender_type) VALUES ('M'), ('F');
INSERT INTO bac_series_types (series) VALUES ('A'), ('C'), ('D'), ('E'), ('F'), ('G'), ('H'), ('other');
INSERT INTO mention_types (mention) VALUES ('Passable'), ('Assez Bien'), ('Bien'), ('Très Bien');
INSERT INTO academic_types (academic_type) VALUES ('Général'), ('Technique');
INSERT INTO payment_status_types (status) VALUES ('pending'), ('completed'), ('failed'), ('refunded');
INSERT INTO registration_status_types (status) VALUES ('draft'), ('submitted'), ('confirmed'), ('rejected');
INSERT INTO app_role_types (role) VALUES ('admin'), ('user'), ('viewer');
INSERT INTO document_types (doc_type) VALUES ('photo'), ('bac_diploma'), ('prob_diploma'), ('birth_certificate'), ('id_document');

-- =====================================================
-- CORE TABLES
-- =====================================================

-- Registrations table (main registration data)
CREATE TABLE registrations (
    id INT PRIMARY KEY AUTO_INCREMENT,
    registration_number VARCHAR(50) UNIQUE NOT NULL,
    
    -- Personal information
    first_name VARCHAR(100) NOT NULL,
    last_name VARCHAR(100) NOT NULL,
    birth_date DATE NOT NULL,
    birth_place VARCHAR(100) NOT NULL,
    gender ENUM('M', 'F') NOT NULL,
    photo_url VARCHAR(255) NOT NULL,
    phone VARCHAR(20) NOT NULL,
    email VARCHAR(100) NOT NULL,
    
    -- Address information
    city VARCHAR(100) NOT NULL,
    department VARCHAR(100) NOT NULL,
    region VARCHAR(100) NOT NULL,
    country VARCHAR(50) NOT NULL DEFAULT 'Cameroun',
    
    -- Academic information - Baccalauréat
    bac_date DATE NOT NULL,
    bac_series ENUM('A', 'C', 'D', 'E', 'F', 'G', 'H', 'other') NOT NULL,
    bac_mention ENUM('Passable', 'Assez Bien', 'Bien', 'Très Bien') NOT NULL,
    bac_type ENUM('Général', 'Technique') NOT NULL,
    bac_exam_center VARCHAR(100) DEFAULT 'N/A',
    bac_diploma_url VARCHAR(255),
    
    -- Academic information - Probatoire
    prob_date DATE NOT NULL,
    prob_series ENUM('A', 'C', 'D', 'E', 'F', 'G', 'H', 'other') NOT NULL,
    prob_mention ENUM('Passable', 'Assez Bien', 'Bien', 'Très Bien') NOT NULL,
    prob_type ENUM('Général', 'Technique') NOT NULL,
    prob_exam_center VARCHAR(100) DEFAULT 'N/A',
    prob_diploma_url VARCHAR(255),
    
    -- Parent information
    father_name VARCHAR(150) NOT NULL,
    father_profession VARCHAR(100),
    father_phone VARCHAR(20),
    mother_name VARCHAR(150) NOT NULL,
    mother_profession VARCHAR(100),
    mother_phone VARCHAR(20),
    
    -- Legal guardian (optional)
    legal_guardian_name VARCHAR(150),
    legal_guardian_relation VARCHAR(50),
    legal_guardian_phone VARCHAR(20),
    
    -- Status and metadata
    status ENUM('draft', 'submitted', 'confirmed', 'rejected') DEFAULT 'submitted',
    is_validated BOOLEAN DEFAULT FALSE,
    validation_notes TEXT,
    
    -- Payment information
    payment_status ENUM('pending', 'completed', 'failed', 'refunded') DEFAULT 'pending',
    payment_reference VARCHAR(100),
    payment_amount DECIMAL(10, 2) DEFAULT 25000.00,
    payment_date TIMESTAMP NULL,
    payment_method VARCHAR(50),
    
    -- Contest information
    contest_date DATE DEFAULT '2025-12-15',
    contest_location VARCHAR(150) DEFAULT 'Campus Universitaire',
    exam_center VARCHAR(100),
    
    -- Timestamps
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    validated_at TIMESTAMP NULL,
    submitted_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- User roles table for authentication and authorization
CREATE TABLE user_roles (
    id INT PRIMARY KEY AUTO_INCREMENT,
    user_id VARCHAR(36) NOT NULL, -- UUID as string
    email VARCHAR(100) NOT NULL,
    username VARCHAR(50) UNIQUE,
    role ENUM('admin', 'user', 'viewer') NOT NULL DEFAULT 'user',
    is_active BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    
    UNIQUE KEY unique_user_role (user_id, role)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Document storage table
CREATE TABLE documents (
    id INT PRIMARY KEY AUTO_INCREMENT,
    registration_id INT NOT NULL,
    document_type ENUM('photo', 'bac_diploma', 'prob_diploma', 'birth_certificate', 'id_document') NOT NULL,
    file_name VARCHAR(255) NOT NULL,
    file_path VARCHAR(500) NOT NULL,
    file_size INT,
    mime_type VARCHAR(100),
    uploaded_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    is_verified BOOLEAN DEFAULT FALSE,
    verification_notes TEXT,
    
    INDEX idx_documents_registration_id (registration_id),
    INDEX idx_documents_type (document_type),
    
    FOREIGN KEY (registration_id) REFERENCES registrations(id) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Payment transactions table
CREATE TABLE payment_transactions (
    id INT PRIMARY KEY AUTO_INCREMENT,
    registration_id INT NOT NULL,
    transaction_reference VARCHAR(100) UNIQUE NOT NULL,
    amount DECIMAL(10, 2) NOT NULL,
    currency VARCHAR(10) DEFAULT 'XAF',
    payment_method VARCHAR(50) NOT NULL,
    payment_status ENUM('pending', 'completed', 'failed', 'refunded') DEFAULT 'pending',
    payment_date TIMESTAMP NULL,
    gateway_response TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    
    INDEX idx_payment_transactions_registration_id (registration_id),
    INDEX idx_payment_transactions_reference (transaction_reference),
    INDEX idx_payment_transactions_status (payment_status),
    
    FOREIGN KEY (registration_id) REFERENCES registrations(id) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Application settings table
CREATE TABLE application_settings (
    id INT PRIMARY KEY AUTO_INCREMENT,
    setting_key VARCHAR(100) UNIQUE NOT NULL,
    setting_value TEXT NOT NULL,
    description TEXT,
    is_public BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Audit log table for tracking changes
CREATE TABLE audit_log (
    id INT PRIMARY KEY AUTO_INCREMENT,
    table_name VARCHAR(50) NOT NULL,
    record_id INT NOT NULL,
    action VARCHAR(20) NOT NULL, -- INSERT, UPDATE, DELETE
    old_values JSON,
    new_values JSON,
    changed_by VARCHAR(100),
    changed_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    
    INDEX idx_audit_log_table_record (table_name, record_id),
    INDEX idx_audit_log_changed_at (changed_at)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- =====================================================
-- INDEXES FOR PERFORMANCE
-- =====================================================

-- Registrations indexes
CREATE INDEX idx_registrations_registration_number ON registrations(registration_number);
CREATE INDEX idx_registrations_email ON registrations(email);
CREATE INDEX idx_registrations_phone ON registrations(phone);
CREATE INDEX idx_registrations_status ON registrations(status);
CREATE INDEX idx_registrations_created_at ON registrations(created_at);
CREATE INDEX idx_registrations_region ON registrations(region);
CREATE INDEX idx_registrations_department ON registrations(department);
CREATE INDEX idx_registrations_payment_status ON registrations(payment_status);

-- User roles indexes
CREATE INDEX idx_user_roles_user_id ON user_roles(user_id);
CREATE INDEX idx_user_roles_email ON user_roles(email);
CREATE INDEX idx_user_roles_role ON user_roles(role);

-- =====================================================
-- STORED PROCEDURES AND FUNCTIONS
-- =====================================================

-- Function to generate registration number
DELIMITER //
CREATE FUNCTION generate_registration_number() 
RETURNS VARCHAR(50)
READS SQL DATA
DETERMINISTIC
BEGIN
    DECLARE next_num INT DEFAULT 0;
    DECLARE reg_number VARCHAR(50);
    DECLARE year_part VARCHAR(4);
    
    SET year_part = YEAR(NOW());
    
    SELECT COUNT(*) + 1 INTO next_num FROM registrations;
    SET reg_number = CONCAT('CONC', year_part, '-', LPAD(next_num, 4, '0'));
    
    RETURN reg_number;
END//
DELIMITER ;

-- Function to generate transaction reference
DELIMITER //
CREATE FUNCTION generate_transaction_reference() 
RETURNS VARCHAR(50)
READS SQL DATA
DETERMINISTIC
BEGIN
    DECLARE next_num INT DEFAULT 0;
    DECLARE ref_number VARCHAR(50);
    
    SELECT COUNT(*) + 1 INTO next_num FROM payment_transactions;
    SET ref_number = CONCAT('TXN', YEAR(NOW()), LPAD(next_num, 6, '0'));
    
    RETURN ref_number;
END//
DELIMITER ;

-- Procedure to auto-generate registration number and transaction reference
DELIMITER //
CREATE TRIGGER before_insert_registration
    BEFORE INSERT ON registrations
    FOR EACH ROW
BEGIN
    IF NEW.registration_number IS NULL OR NEW.registration_number = '' THEN
        SET NEW.registration_number = generate_registration_number();
    END IF;
END//

CREATE TRIGGER before_insert_transaction_reference
    BEFORE INSERT ON payment_transactions
    FOR EACH ROW
BEGIN
    IF NEW.transaction_reference IS NULL OR NEW.transaction_reference = '' THEN
        SET NEW.transaction_reference = generate_transaction_reference();
    END IF;
END//
DELIMITER ;

-- =====================================================
-- VIEWS FOR COMMON QUERIES
-- =====================================================

-- View for registration statistics
CREATE VIEW registration_statistics AS
SELECT 
    COUNT(*) as total_registrations,
    COUNT(CASE WHEN payment_status = 'completed' THEN 1 END) as paid_registrations,
    COUNT(CASE WHEN status = 'confirmed' THEN 1 END) as confirmed_registrations,
    COUNT(CASE WHEN status = 'rejected' THEN 1 END) as rejected_registrations,
    COUNT(CASE WHEN gender = 'M' THEN 1 END) as male_count,
    COUNT(CASE WHEN gender = 'F' THEN 1 END) as female_count,
    COUNT(CASE WHEN bac_type = 'Général' THEN 1 END) as general_bac_count,
    COUNT(CASE WHEN bac_type = 'Technique' THEN 1 END) as technical_bac_count
FROM registrations;

-- View for registrations with payment status
CREATE VIEW registrations_with_payments AS
SELECT 
    r.*,
    COALESCE(pt.payment_status, 'pending') as current_payment_status,
    pt.transaction_reference,
    pt.payment_date
FROM registrations r
LEFT JOIN payment_transactions pt ON r.id = pt.registration_id
WHERE pt.id = (
    SELECT MAX(id) 
    FROM payment_transactions 
    WHERE registration_id = r.id
);

-- =====================================================
-- STORED PROCEDURES
-- =====================================================

-- Procedure to validate registration
DELIMITER //
CREATE PROCEDURE validate_registration(
    IN reg_id INT,
    IN validator_notes TEXT
)
BEGIN
    UPDATE registrations 
    SET 
        is_validated = TRUE,
        status = 'confirmed',
        validation_notes = validator_notes,
        validated_at = NOW()
    WHERE id = reg_id;
END//

-- Procedure to reject registration
DELIMITER //
CREATE PROCEDURE reject_registration(
    IN reg_id INT,
    IN rejection_reason TEXT
)
BEGIN
    UPDATE registrations 
    SET 
        status = 'rejected',
        validation_notes = rejection_reason,
        validated_at = NOW()
    WHERE id = reg_id;
END//
DELIMITER ;

-- =====================================================
-- COMMENTS FOR DOCUMENTATION
-- =====================================================

ALTER TABLE registrations COMMENT = 'Main table storing contest registration data';
ALTER TABLE user_roles COMMENT = 'User authentication and role management';
ALTER TABLE documents COMMENT = 'Document storage and verification';
ALTER TABLE payment_transactions COMMENT = 'Payment transaction records';
ALTER TABLE application_settings COMMENT = 'Application configuration settings';
ALTER TABLE audit_log COMMENT = 'Audit trail for all database changes';

-- Schema completed successfully!
-- To run this schema:
-- 1. Create database: CREATE DATABASE inscription_concours CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
-- 2. Run this file: mysql -u username -p inscription_concours < mysql_schema.sql