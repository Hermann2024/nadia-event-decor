-- Script d'initialisation de la base de données Nadia Events Decor
-- Créé pour MySQL 8.0+

-- Création de la base de données
CREATE DATABASE IF NOT EXISTS nadia_events_decor
CHARACTER SET utf8mb4
COLLATE utf8mb4_unicode_ci;

USE nadia_events_decor;

-- Table des produits
CREATE TABLE IF NOT EXISTS products (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    description TEXT,
    price DECIMAL(10,2) NOT NULL,
    category VARCHAR(100),
    image_url VARCHAR(500),
    available BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

-- Table des utilisateurs
CREATE TABLE IF NOT EXISTS users (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    username VARCHAR(50) UNIQUE NOT NULL,
    email VARCHAR(100) UNIQUE NOT NULL,
    password VARCHAR(255) NOT NULL,
    first_name VARCHAR(50),
    last_name VARCHAR(50),
    phone VARCHAR(20),
    role ENUM('ADMIN', 'USER') DEFAULT 'USER',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

-- Table des devis
CREATE TABLE IF NOT EXISTS quotes (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    user_id BIGINT,
    total_amount DECIMAL(10,2) NOT NULL,
    status ENUM('PENDING', 'APPROVED', 'REJECTED', 'PAID') DEFAULT 'PENDING',
    event_date DATE,
    event_type VARCHAR(100),
    notes TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES users(id)
);

-- Table des éléments de devis
CREATE TABLE IF NOT EXISTS quote_items (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    quote_id BIGINT NOT NULL,
    product_id BIGINT NOT NULL,
    quantity INT NOT NULL,
    unit_price DECIMAL(10,2) NOT NULL,
    total_price DECIMAL(10,2) NOT NULL,
    FOREIGN KEY (quote_id) REFERENCES quotes(id),
    FOREIGN KEY (product_id) REFERENCES products(id)
);

-- Table des paiements
CREATE TABLE IF NOT EXISTS payments (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    quote_id BIGINT NOT NULL,
    amount DECIMAL(10,2) NOT NULL,
    payment_method VARCHAR(50),
    payment_link VARCHAR(500),
    status ENUM('PENDING', 'COMPLETED', 'FAILED') DEFAULT 'PENDING',
    transaction_id VARCHAR(100),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (quote_id) REFERENCES quotes(id)
);

-- Table des messages
CREATE TABLE IF NOT EXISTS messages (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    user_id BIGINT,
    subject VARCHAR(200),
    message TEXT NOT NULL,
    email VARCHAR(100),
    phone VARCHAR(20),
    status ENUM('NEW', 'READ', 'REPLIED') DEFAULT 'NEW',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES users(id)
);

-- Table des avis
CREATE TABLE IF NOT EXISTS reviews (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    user_id BIGINT,
    product_id BIGINT,
    rating INT CHECK (rating >= 1 AND rating <= 5),
    comment TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES users(id),
    FOREIGN KEY (product_id) REFERENCES products(id)
);

-- Table des annonces
CREATE TABLE IF NOT EXISTS announcements (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    title VARCHAR(200) NOT NULL,
    content TEXT NOT NULL,
    active BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

-- Table du personnel (Admin Service)
CREATE TABLE IF NOT EXISTS staff (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    first_name VARCHAR(50) NOT NULL,
    last_name VARCHAR(50) NOT NULL,
    email VARCHAR(100) UNIQUE NOT NULL,
    phone VARCHAR(20) NOT NULL,
    position VARCHAR(100) NOT NULL,
    department VARCHAR(100) NOT NULL,
    salary DECIMAL(10,2) NOT NULL,
    hire_date DATETIME NOT NULL,
    termination_date DATETIME,
    status ENUM('ACTIVE', 'INACTIVE', 'ON_LEAVE', 'TERMINATED') DEFAULT 'ACTIVE',
    address TEXT,
    emergency_contact VARCHAR(100),
    emergency_phone VARCHAR(20),
    notes TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

-- Table des factures (Admin Service)
CREATE TABLE IF NOT EXISTS invoices (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    invoice_number VARCHAR(50) UNIQUE NOT NULL,
    client_name VARCHAR(200) NOT NULL,
    client_email VARCHAR(100) NOT NULL,
    client_phone VARCHAR(20) NOT NULL,
    client_address TEXT NOT NULL,
    invoice_date DATETIME NOT NULL,
    due_date DATETIME NOT NULL,
    subtotal DECIMAL(10,2) NOT NULL,
    tax_amount DECIMAL(10,2) NOT NULL,
    total_amount DECIMAL(10,2) NOT NULL,
    paid_amount DECIMAL(10,2) DEFAULT 0.00,
    status ENUM('DRAFT', 'PENDING', 'PAID', 'OVERDUE', 'CANCELLED', 'REFUNDED') DEFAULT 'PENDING',
    event_type VARCHAR(100) NOT NULL,
    event_date DATETIME NOT NULL,
    event_location VARCHAR(200),
    description TEXT,
    terms TEXT,
    payment_method VARCHAR(50),
    payment_reference VARCHAR(100),
    payment_date DATETIME,
    notes TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

-- Table des posts (Admin Service)
CREATE TABLE IF NOT EXISTS posts (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    title VARCHAR(200) NOT NULL,
    content TEXT NOT NULL,
    image_url VARCHAR(500),
    video_url VARCHAR(500),
    type ENUM('ANNOUNCEMENT', 'NEWS', 'EVENT', 'PROMOTION', 'TESTIMONIAL', 'GALLERY', 'BLOG') DEFAULT 'ANNOUNCEMENT',
    status ENUM('DRAFT', 'PUBLISHED', 'SCHEDULED', 'ARCHIVED', 'DELETED') DEFAULT 'DRAFT',
    author VARCHAR(100) NOT NULL,
    tags VARCHAR(500),
    category VARCHAR(100),
    publish_date DATETIME,
    expiry_date DATETIME,
    priority INT DEFAULT 0,
    meta_description VARCHAR(500),
    meta_keywords VARCHAR(500),
    featured BOOLEAN DEFAULT FALSE,
    view_count INT DEFAULT 0,
    like_count INT DEFAULT 0,
    share_count INT DEFAULT 0,
    social_media_links TEXT,
    notes TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

-- Insertion de données de test
INSERT INTO products (name, description, price, category, image_url) VALUES
('Décoration de table élégante', 'Ensemble de décoration de table avec nappe, serviettes et centre de table', 150.00, 'Tables', '/assets/images/decorations/table-elegante.jpg'),
('Arches de mariage', 'Arches décoratives pour cérémonies de mariage', 300.00, 'Arches', '/assets/images/decorations/arches-mariage.jpg'),
('Bougies décoratives', 'Lot de 50 bougies décoratives pour ambiance romantique', 80.00, 'Éclairage', '/assets/images/decorations/bougies.jpg'),
('Ballons de fête', 'Lot de 100 ballons colorés pour événements', 45.00, 'Ballons', '/assets/images/decorations/ballons.jpg'),
('Drapeaux de fête', 'Drapeaux colorés pour décorer les espaces', 60.00, 'Drapeaux', '/assets/images/decorations/drapeaux.jpg');

-- Insertion d'un utilisateur admin
INSERT INTO users (username, email, password, first_name, last_name, role) VALUES
('admin', 'admin@nadiaevents.com', '$2a$10$rDmFN6ZqG8XqG8XqG8XqG8XqG8XqG8XqG8XqG8XqG8XqG8XqG8XqG8', 'Admin', 'Nadia Events', 'ADMIN');

-- Insertion d'une annonce de test
INSERT INTO announcements (title, content) VALUES
('Bienvenue chez Nadia Events Decor', 'Découvrez notre nouvelle collection de décorations pour vos événements !');

-- Insertion de personnel de test
INSERT INTO staff (first_name, last_name, email, phone, position, department, salary, hire_date, status) VALUES
('Nadine', 'Kechiamen Nganou', 'nadine@nadiaevents.com', '00237680207496', 'Directrice Générale', 'Direction', 500000.00, '2023-01-01 00:00:00', 'ACTIVE'),
('Marie', 'Dupont', 'marie@nadiaevents.com', '657759510', 'Responsable Événementiel', 'Événementiel', 350000.00, '2023-02-01 00:00:00', 'ACTIVE'),
('Jean', 'Martin', 'jean@nadiaevents.com', '699275786', 'Décorateur Principal', 'Décoration', 300000.00, '2023-03-01 00:00:00', 'ACTIVE');

-- Insertion de factures de test
INSERT INTO invoices (invoice_number, client_name, client_email, client_phone, client_address, invoice_date, due_date, subtotal, tax_amount, total_amount, status, event_type, event_date, description) VALUES
('INV-20241228-0001', 'Mariage Dupont', 'mariage.dupont@email.com', '00237680207496', '123 Rue de la Paix, Yaoundé', '2024-12-28 10:00:00', '2025-01-28 10:00:00', 150000.00, 30000.00, 180000.00, 'PENDING', 'Mariage', '2025-02-15 18:00:00', 'Décoration complète pour mariage'),
('INV-20241228-0002', 'Entreprise ABC', 'contact@abc.com', '657759510', '456 Avenue des Affaires, Douala', '2024-12-28 11:00:00', '2025-01-28 11:00:00', 80000.00, 16000.00, 96000.00, 'PAID', 'Événement d\'entreprise', '2025-01-20 09:00:00', 'Décoration pour événement corporate');

-- Insertion de posts de test
INSERT INTO posts (title, content, type, status, author, category, featured, meta_description) VALUES
('Nouvelle Collection Hiver 2024', 'Découvrez notre nouvelle collection de décorations d\'hiver pour vos événements de fin d\'année...', 'ANNOUNCEMENT', 'PUBLISHED', 'Nadine Kechiamen', 'Collections', TRUE, 'Nouvelle collection de décorations d\'hiver 2024'),
('Conseils pour un mariage réussi', 'Voici nos meilleurs conseils pour organiser un mariage inoubliable avec les bonnes décorations...', 'BLOG', 'PUBLISHED', 'Marie Dupont', 'Conseils', FALSE, 'Conseils pour organiser un mariage réussi'),
('Événements d\'entreprise', 'Nous proposons des solutions de décoration professionnelles pour vos événements d\'entreprise...', 'PROMOTION', 'PUBLISHED', 'Jean Martin', 'Entreprise', TRUE, 'Solutions de décoration pour événements d\'entreprise'); 