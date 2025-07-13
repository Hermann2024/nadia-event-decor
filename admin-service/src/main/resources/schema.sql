-- Schema pour Nadia Event's Decor Admin Service

-- Table des employés
CREATE TABLE IF NOT EXISTS staff (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    first_name VARCHAR(100) NOT NULL,
    last_name VARCHAR(100) NOT NULL,
    email VARCHAR(255) UNIQUE NOT NULL,
    phone VARCHAR(20),
    position VARCHAR(100),
    department VARCHAR(100),
    salary DECIMAL(10,2),
    hire_date TIMESTAMP,
    status VARCHAR(20),
    address TEXT,
    emergency_contact VARCHAR(100),
    emergency_phone VARCHAR(20),
    notes TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Table des demandes de devis
CREATE TABLE IF NOT EXISTS quote_requests (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    request_number VARCHAR(50) UNIQUE NOT NULL,
    client_name VARCHAR(255) NOT NULL,
    client_email VARCHAR(255) NOT NULL,
    client_phone VARCHAR(20),
    event_date TIMESTAMP,
    event_type VARCHAR(100),
    event_location TEXT,
    guest_count INT,
    budget_range VARCHAR(100),
    description TEXT,
    status VARCHAR(20) DEFAULT 'NEW',
    assigned_to BIGINT,
    priority VARCHAR(20) DEFAULT 'MEDIUM',
    estimated_completion_date TIMESTAMP,
    completed_date TIMESTAMP,
    notes TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (assigned_to) REFERENCES staff(id)
);

-- Table des notifications
CREATE TABLE IF NOT EXISTS notifications (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    title VARCHAR(255) NOT NULL,
    message TEXT NOT NULL,
    type VARCHAR(50) NOT NULL,
    status VARCHAR(20) DEFAULT 'UNREAD',
    recipient_id BIGINT,
    related_entity_type VARCHAR(50),
    related_entity_id BIGINT,
    read_at TIMESTAMP,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (recipient_id) REFERENCES staff(id)
);

-- Table des factures
CREATE TABLE IF NOT EXISTS invoices (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    invoice_number VARCHAR(50) UNIQUE NOT NULL,
    client_name VARCHAR(255) NOT NULL,
    client_email VARCHAR(255),
    client_phone VARCHAR(20),
    event_date TIMESTAMP,
    event_type VARCHAR(100),
    event_location TEXT,
    subtotal DECIMAL(10,2),
    tax_amount DECIMAL(10,2),
    total_amount DECIMAL(10,2) NOT NULL,
    status VARCHAR(20),
    payment_method VARCHAR(50),
    payment_date TIMESTAMP,
    due_date TIMESTAMP,
    notes TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Table des éléments de facture
CREATE TABLE IF NOT EXISTS invoice_items (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    invoice_id BIGINT NOT NULL,
    product_name VARCHAR(255) NOT NULL,
    product_description TEXT,
    quantity INT,
    unit_price DECIMAL(10,2) NOT NULL,
    total_price DECIMAL(10,2) NOT NULL,
    notes TEXT,
    FOREIGN KEY (invoice_id) REFERENCES invoices(id) ON DELETE CASCADE
);

-- Table des devis
CREATE TABLE IF NOT EXISTS quotes (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    quote_number VARCHAR(50) UNIQUE NOT NULL,
    client_name VARCHAR(255) NOT NULL,
    client_email VARCHAR(255),
    client_phone VARCHAR(20),
    event_date TIMESTAMP,
    event_type VARCHAR(100),
    event_location TEXT,
    subtotal DECIMAL(10,2),
    tax_amount DECIMAL(10,2),
    total_amount DECIMAL(10,2) NOT NULL,
    status VARCHAR(20),
    valid_until TIMESTAMP,
    accepted_date TIMESTAMP,
    rejected_date TIMESTAMP,
    rejection_reason TEXT,
    notes TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Table des éléments de devis
CREATE TABLE IF NOT EXISTS quote_items (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    quote_id BIGINT NOT NULL,
    product_name VARCHAR(255) NOT NULL,
    product_description TEXT,
    quantity INT,
    unit_price DECIMAL(10,2) NOT NULL,
    total_price DECIMAL(10,2) NOT NULL,
    notes TEXT,
    FOREIGN KEY (quote_id) REFERENCES quotes(id) ON DELETE CASCADE
);

-- Table des transactions comptables
CREATE TABLE IF NOT EXISTS accounting_transactions (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    transaction_number VARCHAR(50) UNIQUE NOT NULL,
    transaction_date TIMESTAMP NOT NULL,
    type VARCHAR(20),
    amount DECIMAL(10,2) NOT NULL,
    description VARCHAR(255) NOT NULL,
    category VARCHAR(50),
    reference_number VARCHAR(100),
    payment_method VARCHAR(50),
    related_invoice_id BIGINT,
    related_quote_id BIGINT,
    status VARCHAR(20),
    notes TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Table des produits (pour référence)
CREATE TABLE IF NOT EXISTS products (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    description TEXT,
    price DECIMAL(10,2),
    category VARCHAR(100),
    available BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Table des posts (pour le blog/actualités)
CREATE TABLE IF NOT EXISTS posts (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    title VARCHAR(255) NOT NULL,
    content TEXT,
    author VARCHAR(100),
    published BOOLEAN DEFAULT FALSE,
    published_at TIMESTAMP,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Index pour améliorer les performances
CREATE INDEX IF NOT EXISTS idx_staff_email ON staff(email);
CREATE INDEX IF NOT EXISTS idx_staff_status ON staff(status);
CREATE INDEX IF NOT EXISTS idx_staff_department ON staff(department);

CREATE INDEX IF NOT EXISTS idx_quote_requests_number ON quote_requests(request_number);
CREATE INDEX IF NOT EXISTS idx_quote_requests_status ON quote_requests(status);
CREATE INDEX IF NOT EXISTS idx_quote_requests_client_email ON quote_requests(client_email);
CREATE INDEX IF NOT EXISTS idx_quote_requests_assigned_to ON quote_requests(assigned_to);
CREATE INDEX IF NOT EXISTS idx_quote_requests_priority ON quote_requests(priority);
CREATE INDEX IF NOT EXISTS idx_quote_requests_event_date ON quote_requests(event_date);

CREATE INDEX IF NOT EXISTS idx_notifications_recipient ON notifications(recipient_id);
CREATE INDEX IF NOT EXISTS idx_notifications_status ON notifications(status);
CREATE INDEX IF NOT EXISTS idx_notifications_type ON notifications(type);
CREATE INDEX IF NOT EXISTS idx_notifications_created_at ON notifications(created_at);
CREATE INDEX IF NOT EXISTS idx_notifications_related_entity ON notifications(related_entity_type, related_entity_id);

CREATE INDEX IF NOT EXISTS idx_invoices_number ON invoices(invoice_number);
CREATE INDEX IF NOT EXISTS idx_invoices_status ON invoices(status);
CREATE INDEX IF NOT EXISTS idx_invoices_client_email ON invoices(client_email);
CREATE INDEX IF NOT EXISTS idx_invoices_due_date ON invoices(due_date);

CREATE INDEX IF NOT EXISTS idx_quotes_number ON quotes(quote_number);
CREATE INDEX IF NOT EXISTS idx_quotes_status ON quotes(status);
CREATE INDEX IF NOT EXISTS idx_quotes_client_email ON quotes(client_email);
CREATE INDEX IF NOT EXISTS idx_quotes_valid_until ON quotes(valid_until);

CREATE INDEX IF NOT EXISTS idx_transactions_number ON accounting_transactions(transaction_number);
CREATE INDEX IF NOT EXISTS idx_transactions_type ON accounting_transactions(type);
CREATE INDEX IF NOT EXISTS idx_transactions_category ON accounting_transactions(category);
CREATE INDEX IF NOT EXISTS idx_transactions_date ON accounting_transactions(transaction_date);

CREATE INDEX IF NOT EXISTS idx_products_category ON products(category);
CREATE INDEX IF NOT EXISTS idx_products_available ON products(available);

CREATE INDEX IF NOT EXISTS idx_posts_published ON posts(published); 