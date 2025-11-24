-- =====================================================
-- COMPLETE DATABASE SCHEMA FOR CONCOURS D'INSCRIPTION
-- =====================================================
-- Database: PostgreSQL
-- Connection: Nexus/Nuttertools2.0
-- Database Name: inscription_concours

-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";
CREATE EXTENSION IF NOT EXISTS "pgcrypto";

-- =====================================================
-- ENUM TYPES
-- =====================================================

CREATE TYPE gender_type AS ENUM ('M', 'F');
CREATE TYPE bac_series AS ENUM ('A', 'C', 'D', 'E', 'F', 'G', 'H', 'other');
CREATE TYPE mention_type AS ENUM ('Passable', 'Assez Bien', 'Bien', 'Très Bien');
CREATE TYPE academic_type AS ENUM ('Général', 'Technique');
CREATE TYPE payment_status AS ENUM ('pending', 'completed', 'failed', 'refunded');
CREATE TYPE registration_status AS ENUM ('draft', 'submitted', 'confirmed', 'rejected');
CREATE TYPE app_role AS ENUM ('admin', 'user', 'viewer');
CREATE TYPE document_type AS ENUM ('photo', 'bac_diploma', 'prob_diploma', 'birth_certificate', 'id_document');

-- =====================================================
-- CORE TABLES
-- =====================================================

-- Registrations table (main registration data)
CREATE TABLE registrations (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    registration_number TEXT UNIQUE NOT NULL,
    
    -- Personal information
    first_name TEXT NOT NULL,
    last_name TEXT NOT NULL,
    birth_date DATE NOT NULL,
    birth_place TEXT NOT NULL,
    gender gender_type NOT NULL,
    photo_url TEXT NOT NULL,
    phone TEXT NOT NULL,
    email TEXT NOT NULL,
    
    -- Address information
    city TEXT NOT NULL,
    department TEXT NOT NULL,
    region TEXT NOT NULL,
    country TEXT NOT NULL DEFAULT 'Cameroun',
    
    -- Academic information - Baccalauréat
    bac_date DATE NOT NULL,
    bac_series bac_series NOT NULL,
    bac_mention mention_type NOT NULL,
    bac_type academic_type NOT NULL,
    bac_exam_center TEXT DEFAULT 'N/A',
    bac_diploma_url TEXT,
    
    -- Academic information - Probatoire
    prob_date DATE NOT NULL,
    prob_series bac_series NOT NULL,
    prob_mention mention_type NOT NULL,
    prob_type academic_type NOT NULL,
    prob_exam_center TEXT DEFAULT 'N/A',
    prob_diploma_url TEXT,
    
    -- Parent information
    father_name TEXT NOT NULL,
    father_profession TEXT,
    father_phone TEXT,
    mother_name TEXT NOT NULL,
    mother_profession TEXT,
    mother_phone TEXT,
    
    -- Legal guardian (optional)
    legal_guardian_name TEXT,
    legal_guardian_relation TEXT,
    legal_guardian_phone TEXT,
    
    -- Status and metadata
    status registration_status DEFAULT 'submitted',
    is_validated BOOLEAN DEFAULT FALSE,
    validation_notes TEXT,
    
    -- Payment information
    payment_status payment_status DEFAULT 'pending',
    payment_reference TEXT,
    payment_amount DECIMAL(10, 2) DEFAULT 25000.00,
    payment_date TIMESTAMP WITH TIME ZONE,
    payment_method TEXT,
    
    -- Contest information
    contest_date DATE DEFAULT '2025-12-15',
    contest_location TEXT DEFAULT 'Campus Universitaire',
    exam_center TEXT,
    
    -- Timestamps
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    validated_at TIMESTAMP WITH TIME ZONE,
    submitted_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- User roles table for authentication and authorization
CREATE TABLE user_roles (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID NOT NULL, -- References auth.users(id) if using Supabase Auth
    email TEXT NOT NULL,
    username TEXT UNIQUE,
    role app_role NOT NULL DEFAULT 'user',
    is_active BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    
    UNIQUE(user_id, role)
);

-- Document storage table
CREATE TABLE documents (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    registration_id UUID REFERENCES registrations(id) ON DELETE CASCADE,
    document_type document_type NOT NULL,
    file_name TEXT NOT NULL,
    file_path TEXT NOT NULL,
    file_size INTEGER,
    mime_type TEXT,
    uploaded_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    is_verified BOOLEAN DEFAULT FALSE,
    verification_notes TEXT
);

-- Payment transactions table
CREATE TABLE payment_transactions (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    registration_id UUID REFERENCES registrations(id) ON DELETE CASCADE,
    transaction_reference TEXT UNIQUE NOT NULL,
    amount DECIMAL(10, 2) NOT NULL,
    currency TEXT DEFAULT 'XAF',
    payment_method TEXT NOT NULL,
    payment_status payment_status DEFAULT 'pending',
    payment_date TIMESTAMP WITH TIME ZONE,
    gateway_response TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Application settings table
CREATE TABLE application_settings (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    setting_key TEXT UNIQUE NOT NULL,
    setting_value TEXT NOT NULL,
    description TEXT,
    is_public BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Audit log table for tracking changes
CREATE TABLE audit_log (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    table_name TEXT NOT NULL,
    record_id UUID NOT NULL,
    action TEXT NOT NULL, -- INSERT, UPDATE, DELETE
    old_values JSONB,
    new_values JSONB,
    changed_by TEXT,
    changed_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

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

-- Documents indexes
CREATE INDEX idx_documents_registration_id ON documents(registration_id);
CREATE INDEX idx_documents_type ON documents(document_type);

-- Payment transactions indexes
CREATE INDEX idx_payment_transactions_registration_id ON payment_transactions(registration_id);
CREATE INDEX idx_payment_transactions_reference ON payment_transactions(transaction_reference);
CREATE INDEX idx_payment_transactions_status ON payment_transactions(payment_status);

-- Audit log indexes
CREATE INDEX idx_audit_log_table_record ON audit_log(table_name, record_id);
CREATE INDEX idx_audit_log_changed_at ON audit_log(changed_at);

-- =====================================================
-- TRIGGERS AND FUNCTIONS
-- =====================================================

-- Function to generate registration number
CREATE OR REPLACE FUNCTION generate_registration_number()
RETURNS TEXT
LANGUAGE plpgsql
AS $$
DECLARE
    next_num INTEGER;
    reg_number TEXT;
    year_part TEXT;
BEGIN
    year_part := EXTRACT(YEAR FROM NOW())::TEXT;
    SELECT COUNT(*) + 1 INTO next_num FROM public.registrations;
    reg_number := 'CONC' || year_part || '-' || LPAD(next_num::TEXT, 4, '0');
    RETURN reg_number;
END;
$$;

-- Function to auto-generate registration number
CREATE OR REPLACE FUNCTION set_registration_number()
RETURNS TRIGGER
LANGUAGE plpgsql
AS $$
BEGIN
    IF NEW.registration_number IS NULL THEN
        NEW.registration_number := generate_registration_number();
    END IF;
    RETURN NEW;
END;
$$;

-- Function to update updated_at column
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER
LANGUAGE plpgsql
AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$;

-- Function to generate transaction reference
CREATE OR REPLACE FUNCTION generate_transaction_reference()
RETURNS TEXT
LANGUAGE plpgsql
AS $$
DECLARE
    next_num INTEGER;
    ref_number TEXT;
BEGIN
    SELECT COUNT(*) + 1 INTO next_num FROM public.payment_transactions;
    ref_number := 'TXN' || EXTRACT(YEAR FROM NOW())::TEXT || LPAD(next_num::TEXT, 6, '0');
    RETURN ref_number;
END;
$$;

-- Create triggers
CREATE TRIGGER before_insert_registration
    BEFORE INSERT ON registrations
    FOR EACH ROW
    EXECUTE FUNCTION set_registration_number();

CREATE TRIGGER update_registrations_updated_at
    BEFORE UPDATE ON registrations
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER before_insert_transaction
    BEFORE INSERT ON payment_transactions
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_user_roles_updated_at
    BEFORE UPDATE ON user_roles
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER before_insert_transaction_reference
    BEFORE INSERT ON payment_transactions
    FOR EACH ROW
    WHEN (NEW.transaction_reference IS NULL)
    EXECUTE FUNCTION generate_transaction_reference();

-- =====================================================
-- SECURITY AND PERMISSIONS
-- =====================================================

-- Enable Row Level Security (if using Supabase Auth)
ALTER TABLE registrations ENABLE ROW LEVEL SECURITY;
ALTER TABLE user_roles ENABLE ROW LEVEL SECURITY;
ALTER TABLE documents ENABLE ROW LEVEL SECURITY;
ALTER TABLE payment_transactions ENABLE ROW LEVEL SECURITY;

-- Create role checking function
CREATE OR REPLACE FUNCTION has_role(_user_id UUID, _role app_role)
RETURNS BOOLEAN
LANGUAGE SQL
STABLE
SECURITY DEFINER
AS $$
    SELECT EXISTS (
        SELECT 1
        FROM public.user_roles
        WHERE user_id = _user_id
          AND role = _role
          AND is_active = TRUE
    );
$$;

-- RLS Policies for registrations
DROP POLICY IF EXISTS "Anyone can register" ON registrations;
DROP POLICY IF EXISTS "Anyone can view registration" ON registrations;
DROP POLICY IF EXISTS "Users can view own registration" ON registrations;
DROP POLICY IF EXISTS "Admins can update registrations" ON registrations;
DROP POLICY IF EXISTS "Admins can delete registrations" ON registrations;

CREATE POLICY "Anyone can create registration"
    ON registrations
    FOR INSERT
    WITH CHECK (true);

CREATE POLICY "Anyone can read registration"
    ON registrations
    FOR SELECT
    USING (true);

CREATE POLICY "Users can update own registration"
    ON registrations
    FOR UPDATE
    USING (email = auth.jwt() ->> 'email' OR has_role(auth.uid(), 'admin'));

CREATE POLICY "Admins can delete registrations"
    ON registrations
    FOR DELETE
    USING (has_role(auth.uid(), 'admin'));

-- RLS Policies for user_roles
DROP POLICY IF EXISTS "Admins can view all roles" ON user_roles;
DROP POLICY IF EXISTS "Admins can manage roles" ON user_roles;
DROP POLICY IF EXISTS "Anyone can create admin role" ON user_roles;

CREATE POLICY "Users can view own roles"
    ON user_roles
    FOR SELECT
    USING (user_id = auth.uid() OR has_role(auth.uid(), 'admin'));

CREATE POLICY "Admins can manage roles"
    ON user_roles
    FOR ALL
    USING (has_role(auth.uid(), 'admin'));

CREATE POLICY "Anyone can create admin role"
    ON user_roles
    FOR INSERT
    WITH CHECK (role = 'admin');

-- RLS Policies for documents
CREATE POLICY "Anyone can upload documents"
    ON documents
    FOR INSERT
    WITH CHECK (true);

CREATE POLICY "Anyone can read documents"
    ON documents
    FOR SELECT
    USING (true);

CREATE POLICY "Admins can update documents"
    ON documents
    FOR UPDATE
    USING (has_role(auth.uid(), 'admin'));

-- RLS Policies for payment_transactions
CREATE POLICY "Anyone can create payments"
    ON payment_transactions
    FOR INSERT
    WITH CHECK (true);

CREATE POLICY "Anyone can read payments"
    ON payment_transactions
    FOR SELECT
    USING (true);

CREATE POLICY "Admins can update payments"
    ON payment_transactions
    FOR UPDATE
    USING (has_role(auth.uid(), 'admin'));

-- =====================================================
-- DEFAULT DATA
-- =====================================================

-- Insert default application settings
INSERT INTO application_settings (setting_key, setting_value, description, is_public) VALUES
('contest_year', '2025', 'Current contest year', true),
('registration_fee', '25000', 'Registration fee in XAF', true),
('contest_date', '2025-12-15', 'Contest date', true),
('contest_location', 'Campus Universitaire', 'Contest location', true),
('max_registrations', '1000', 'Maximum number of registrations', false),
('registration_deadline', '2025-11-30', 'Registration deadline', true),
('allow_late_registration', 'false', 'Allow late registrations', false);

-- Create default admin user
INSERT INTO user_roles (user_id, email, username, role, is_active) VALUES
('00000000-0000-0000-0000-000000000000', 'admin@concours.com', 'admin', 'admin', true);

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
LEFT JOIN (
    SELECT DISTINCT ON (registration_id) *
    FROM payment_transactions
    ORDER BY registration_id, created_at DESC
) pt ON r.id = pt.registration_id;

-- =====================================================
-- STORED PROCEDURES
-- =====================================================

-- Procedure to validate registration
CREATE OR REPLACE FUNCTION validate_registration(
    reg_id UUID,
    validator_notes TEXT DEFAULT NULL
)
RETURNS BOOLEAN
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
BEGIN
    -- Check if user has admin role
    IF NOT has_role(auth.uid(), 'admin') THEN
        RAISE EXCEPTION 'Access denied: Admin role required';
    END IF;
    
    UPDATE registrations 
    SET 
        is_validated = TRUE,
        status = 'confirmed',
        validation_notes = validator_notes,
        validated_at = NOW()
    WHERE id = reg_id;
    
    RETURN FOUND;
END;
$$;

-- Procedure to reject registration
CREATE OR REPLACE FUNCTION reject_registration(
    reg_id UUID,
    rejection_reason TEXT
)
RETURNS BOOLEAN
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
BEGIN
    -- Check if user has admin role
    IF NOT has_role(auth.uid(), 'admin') THEN
        RAISE EXCEPTION 'Access denied: Admin role required';
    END IF;
    
    UPDATE registrations 
    SET 
        status = 'rejected',
        validation_notes = rejection_reason,
        validated_at = NOW()
    WHERE id = reg_id;
    
    RETURN FOUND;
END;
$$;

-- =====================================================
-- COMMENTS FOR DOCUMENTATION
-- =====================================================

COMMENT ON TABLE registrations IS 'Main table storing contest registration data';
COMMENT ON TABLE user_roles IS 'User authentication and role management';
COMMENT ON TABLE documents IS 'Document storage and verification';
COMMENT ON TABLE payment_transactions IS 'Payment transaction records';
COMMENT ON TABLE application_settings IS 'Application configuration settings';
COMMENT ON TABLE audit_log IS 'Audit trail for all database changes';

COMMENT ON COLUMN registrations.registration_number IS 'Auto-generated unique registration identifier';
COMMENT ON COLUMN registrations.status IS 'Registration workflow status';
COMMENT ON COLUMN registrations.payment_status IS 'Payment processing status';
COMMENT ON COLUMN registrations.is_validated IS 'Whether registration has been validated by admin';

-- Schema completed successfully!
-- To run this schema:
-- 1. Create database: createdb inscription_concours
-- 2. Run this file: psql -d inscription_concours -f complete_schema.sql