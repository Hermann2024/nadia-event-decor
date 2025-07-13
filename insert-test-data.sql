-- Script d'insertion de données de test pour Nadia Events Decor
-- Dates dynamiques basées sur la date actuelle

-- Nettoyer les données existantes (optionnel)
-- DELETE FROM invoice_items;
-- DELETE FROM quote_items;
-- DELETE FROM invoices;
-- DELETE FROM quotes;

-- Insérer des données de test pour les factures (événements futurs)
INSERT INTO invoices (invoice_number, client_name, client_email, client_phone, event_date, event_type, event_location, subtotal, tax_amount, total_amount, status, payment_method, payment_date, due_date, notes, created_at, updated_at) VALUES 
('INV-2024-001', 'Mariage Dupont', 'dupont@email.com', '+237 6 11 11 11 11', (CURRENT_DATE + INTERVAL '15 days'), 'Mariage', 'Hotel Hilton, Douala', 2200.0, 300.0, 2500.0, 'PAID', 'Virement bancaire', CURRENT_DATE - INTERVAL '5 days', CURRENT_DATE + INTERVAL '10 days', 'Mariage de luxe avec decoration complete', NOW(), NOW()),
('INV-2024-002', 'Entreprise ABC', 'contact@abc.com', '+237 6 22 22 22 22', (CURRENT_DATE + INTERVAL '25 days'), 'Evenement d''entreprise', 'Centre de conferences, Douala', 1500.0, 300.0, 1800.0, 'SENT', 'Cheque', NULL, CURRENT_DATE + INTERVAL '20 days', 'Seminaire annuel', NOW(), NOW()),
('INV-2024-003', 'Anniversaire Martin', 'martin@email.com', '+237 6 33 33 33 33', (CURRENT_DATE + INTERVAL '8 days'), 'Anniversaire', 'Residence privee, Douala', 800.0, 150.0, 950.0, 'PAID', 'Especes', CURRENT_DATE - INTERVAL '2 days', CURRENT_DATE + INTERVAL '5 days', 'Anniversaire 50 ans', NOW(), NOW()),
('INV-2024-004', 'Evenement Corp', 'events@corp.com', '+237 6 44 44 44 44', (CURRENT_DATE + INTERVAL '30 days'), 'Lancement produit', 'Palais des Congres, Yaounde', 2800.0, 400.0, 3200.0, 'SENT', 'Carte bancaire', NULL, CURRENT_DATE + INTERVAL '25 days', 'Lancement nouveau produit', NOW(), NOW()),
('INV-2024-005', 'Bapteme Rodriguez', 'rodriguez@email.com', '+237 6 55 55 55 55', (CURRENT_DATE + INTERVAL '12 days'), 'Bapteme', 'Eglise Saint-Pierre, Douala', 1200.0, 200.0, 1400.0, 'PENDING', 'Virement bancaire', NULL, CURRENT_DATE + INTERVAL '7 days', 'Bapteme traditionnel', NOW(), NOW()),
('INV-2024-006', 'Conference Tech', 'tech@conference.com', '+237 6 66 66 66 66', (CURRENT_DATE + INTERVAL '45 days'), 'Conference', 'Hotel Mont Febe, Yaounde', 3500.0, 500.0, 4000.0, 'SENT', 'Carte bancaire', NULL, CURRENT_DATE + INTERVAL '40 days', 'Conference internationale tech', NOW(), NOW()),
('INV-2024-007', 'Mariage Garcia', 'garcia@email.com', '+237 6 77 77 77 77', (CURRENT_DATE + INTERVAL '60 days'), 'Mariage', 'Chateau de la Benoue, Garoua', 4500.0, 600.0, 5100.0, 'DRAFT', 'Virement bancaire', NULL, CURRENT_DATE + INTERVAL '55 days', 'Mariage de luxe avec 200 invites', NOW(), NOW()),
('INV-2024-008', 'Exposition Art', 'art@expo.com', '+237 6 88 88 88 88', (CURRENT_DATE + INTERVAL '20 days'), 'Exposition', 'Musee National, Douala', 1800.0, 250.0, 2050.0, 'PAID', 'Cheque', CURRENT_DATE - INTERVAL '3 days', CURRENT_DATE + INTERVAL '15 days', 'Exposition artistique', NOW(), NOW());

-- Insérer des données de test pour les devis (événements futurs)
INSERT INTO quotes (quote_number, client_name, client_email, client_phone, event_date, event_type, event_location, subtotal, tax_amount, total_amount, status, valid_until, accepted_date, rejected_date, rejection_reason, notes, created_at, updated_at) VALUES 
('QT-2024-001', 'Mariage Garcia', 'garcia@email.com', '+237 6 55 55 55 55', (CURRENT_DATE + INTERVAL '75 days'), 'Mariage', 'Chateau de la Benoue, Garoua', 3000.0, 500.0, 3500.0, 'SENT', (CURRENT_DATE + INTERVAL '45 days'), NULL, NULL, NULL, 'Mariage de luxe avec 200 invites', NOW(), NOW()),
('QT-2024-002', 'Entreprise XYZ', 'contact@xyz.com', '+237 6 66 66 66 66', (CURRENT_DATE + INTERVAL '35 days'), 'Conference', 'Hotel Mont Febe, Yaounde', 1800.0, 300.0, 2100.0, 'ACCEPTED', (CURRENT_DATE + INTERVAL '25 days'), CURRENT_DATE - INTERVAL '5 days', NULL, NULL, 'Conference internationale', NOW(), NOW()),
('QT-2024-003', 'Anniversaire Lopez', 'lopez@email.com', '+237 6 77 77 77 77', (CURRENT_DATE + INTERVAL '18 days'), 'Anniversaire', 'Residence privee, Douala', 1000.0, 200.0, 1200.0, 'SENT', (CURRENT_DATE + INTERVAL '8 days'), NULL, NULL, NULL, 'Anniversaire surprise', NOW(), NOW()),
('QT-2024-004', 'Bapteme Silva', 'silva@email.com', '+237 6 88 88 88 88', (CURRENT_DATE + INTERVAL '40 days'), 'Bapteme', 'Eglise Sainte-Marie, Douala', 1500.0, 250.0, 1750.0, 'PENDING', (CURRENT_DATE + INTERVAL '30 days'), NULL, NULL, NULL, 'Bapteme traditionnel', NOW(), NOW()),
('QT-2024-005', 'Lancement Produit', 'launch@product.com', '+237 6 99 99 99 99', (CURRENT_DATE + INTERVAL '50 days'), 'Lancement produit', 'Centre des Congres, Douala', 2500.0, 400.0, 2900.0, 'SENT', (CURRENT_DATE + INTERVAL '40 days'), NULL, NULL, NULL, 'Lancement nouveau produit tech', NOW(), NOW()),
('QT-2024-006', 'Seminaire Formation', 'formation@seminar.com', '+237 6 10 10 10 10', (CURRENT_DATE + INTERVAL '28 days'), 'Seminaire', 'Institut de Formation, Yaounde', 1200.0, 200.0, 1400.0, 'ACCEPTED', (CURRENT_DATE + INTERVAL '18 days'), CURRENT_DATE - INTERVAL '2 days', NULL, NULL, 'Seminaire de formation professionnelle', NOW(), NOW()),
('QT-2024-007', 'Exposition Mode', 'mode@expo.com', '+237 6 11 11 11 11', (CURRENT_DATE + INTERVAL '65 days'), 'Exposition', 'Palais des Expositions, Douala', 3200.0, 450.0, 3650.0, 'DRAFT', (CURRENT_DATE + INTERVAL '55 days'), NULL, NULL, NULL, 'Exposition de mode africaine', NOW(), NOW()),
('QT-2024-008', 'Evenement Culturel', 'culture@event.com', '+237 6 12 12 12 12', (CURRENT_DATE + INTERVAL '22 days'), 'Evenement culturel', 'Centre Culturel, Yaounde', 900.0, 150.0, 1050.0, 'SENT', (CURRENT_DATE + INTERVAL '12 days'), NULL, NULL, NULL, 'Festival culturel', NOW(), NOW());

-- Insérer les éléments de facture
INSERT INTO invoice_items (invoice_id, product_name, product_description, quantity, unit_price, total_price, notes) VALUES 
(1, 'Decoration florale', 'Bouquets et arrangements floraux', 10, 150.0, 1500.0, 'Fleurs de saison'),
(1, 'Eclairage d''ambiance', 'Installation eclairage LED', 1, 500.0, 500.0, 'Eclairage programmable'),
(1, 'Mobilier evenementiel', 'Chaises et tables de reception', 1, 200.0, 200.0, 'Mobilier premium'),
(2, 'Decoration corporate', 'Bannieres et affichage', 5, 200.0, 1000.0, 'Design personnalise'),
(2, 'Systeme sonorisation', 'Installation audio professionnelle', 1, 500.0, 500.0, 'Son surround'),
(3, 'Decoration anniversaire', 'Ballons et accessoires', 1, 600.0, 600.0, 'Theme dore'),
(3, 'Gateau decoratif', 'Gateau personnalise', 1, 200.0, 200.0, 'Gateau 3 etages'),
(4, 'Stand d''exposition', 'Stand modulaire 3x3m', 1, 1500.0, 1500.0, 'Stand avec eclairage'),
(4, 'Decoration corporate', 'Bannieres et roll-up', 8, 150.0, 1200.0, 'Identite visuelle'),
(4, 'Service technique', 'Installation et demontage', 1, 100.0, 100.0, 'Service complet'),
(5, 'Decoration baptismale', 'Arcs et fleurs blanches', 1, 800.0, 800.0, 'Theme traditionnel'),
(5, 'Photographie', 'Service photo complet', 1, 400.0, 400.0, 'Photos professionnelles'),
(6, 'Systeme audiovisuel', 'Projection et sonorisation', 1, 2000.0, 2000.0, 'Equipement HD'),
(6, 'Decoration conference', 'Bannieres et affichage', 10, 150.0, 1500.0, 'Design professionnel'),
(7, 'Decoration mariage', 'Arcs et fleurs exotiques', 15, 200.0, 3000.0, 'Fleurs exotiques'),
(7, 'Eclairage architectural', 'Eclairage du chateau', 1, 800.0, 800.0, 'Eclairage d''accent'),
(7, 'Service traiteur', 'Buffet de luxe', 1, 700.0, 700.0, 'Service complet'),
(8, 'Stand d''exposition', 'Stand modulaire 2x2m', 1, 1200.0, 1200.0, 'Stand artistique'),
(8, 'Eclairage d''exposition', 'Eclairage specialise', 1, 600.0, 600.0, 'Eclairage musee');

-- Insérer les éléments de devis
INSERT INTO quote_items (quote_id, product_name, product_description, quantity, unit_price, total_price, notes) VALUES 
(1, 'Decoration florale premium', 'Bouquets et arrangements luxueux', 15, 180.0, 2700.0, 'Fleurs exotiques'),
(1, 'Eclairage architectural', 'Eclairage du chateau', 1, 300.0, 300.0, 'Eclairage d''accent'),
(2, 'Decoration conference', 'Bannieres et affichage corporate', 10, 150.0, 1500.0, 'Design professionnel'),
(2, 'Systeme audiovisuel', 'Projection et sonorisation', 1, 300.0, 300.0, 'Equipement HD'),
(3, 'Decoration anniversaire', 'Ballons et accessoires festifs', 1, 800.0, 800.0, 'Theme colore'),
(3, 'Animation', 'DJ et eclairage', 1, 200.0, 200.0, 'Animation 4h'),
(4, 'Decoration baptismale', 'Arcs et fleurs blanches', 1, 1000.0, 1000.0, 'Theme traditionnel'),
(4, 'Photographie', 'Service photo complet', 1, 500.0, 500.0, 'Photos professionnelles'),
(4, 'Gateau baptismal', 'Gateau personnalise', 1, 250.0, 250.0, 'Gateau traditionnel'),
(5, 'Stand d''exposition', 'Stand modulaire 4x4m', 1, 1800.0, 1800.0, 'Stand premium'),
(5, 'Systeme audiovisuel', 'Projection et sonorisation', 1, 700.0, 700.0, 'Equipement HD'),
(6, 'Decoration seminaire', 'Bannieres et affichage', 8, 120.0, 960.0, 'Design educatif'),
(6, 'Systeme sonorisation', 'Installation audio', 1, 240.0, 240.0, 'Son professionnel'),
(7, 'Stand d''exposition', 'Stand modulaire 5x5m', 1, 2500.0, 2500.0, 'Stand luxueux'),
(7, 'Decoration exposition', 'Eclairage et affichage', 1, 700.0, 700.0, 'Eclairage specialise'),
(8, 'Decoration culturelle', 'Arcs et accessoires', 1, 600.0, 600.0, 'Theme africain'),
(8, 'Animation culturelle', 'Danseurs traditionnels', 1, 300.0, 300.0, 'Animation 2h'),
(8, 'Systeme sonorisation', 'Installation audio', 1, 150.0, 150.0, 'Son traditionnel');

-- Insérer des données de test pour le personnel
INSERT INTO staff (first_name, last_name, email, phone, position, department, salary, hire_date, status, address, emergency_contact, emergency_phone, notes, created_at, updated_at) VALUES 
('Nadine', 'Kechiamen Nganou', 'nadine@nadiaevents.com', '+237 6 12 34 56 78', 'Fondatrice et Directrice Creative', 'Direction', 500000.0, '2020-01-15 09:00:00', 'ACTIVE', 'Douala, Cameroun', 'Jean Kechiamen', '+237 6 98 76 54 32', 'Fondatrice de l''entreprise', NOW(), NOW()),
('Marie', 'Tchokouani', 'marie@nadiaevents.com', '+237 6 11 22 33 44', 'Decoratrice Senior', 'Decoration', 350000.0, '2020-03-20 09:00:00', 'ACTIVE', 'Douala, Cameroun', 'Pierre Tchokouani', '+237 6 55 44 33 22', 'Specialiste decoration evenementielle', NOW(), NOW()),
('Sarah', 'Mbangue', 'sarah@nadiaevents.com', '+237 6 22 33 44 55', 'Coordinatrice Evenements', 'Evenementiel', 300000.0, '2020-06-10 09:00:00', 'ACTIVE', 'Douala, Cameroun', 'Paul Mbangue', '+237 6 66 55 44 33', 'Coordination et planification', NOW(), NOW()),
('David', 'Etoa', 'david@nadiaevents.com', '+237 6 33 44 55 66', 'Technicien Eclairage', 'Technique', 250000.0, '2021-01-15 09:00:00', 'ACTIVE', 'Douala, Cameroun', 'Anne Etoa', '+237 6 77 66 55 44', 'Installation et maintenance eclairage', NOW(), NOW()),
('Claire', 'Nguemo', 'claire@nadiaevents.com', '+237 6 44 55 66 77', 'Commerciale', 'Commercial', 280000.0, '2021-03-01 09:00:00', 'ACTIVE', 'Douala, Cameroun', 'Marc Nguemo', '+237 6 88 77 66 55', 'Developpement commercial', NOW(), NOW()),
('Pierre', 'Nguemo', 'pierre@nadiaevents.com', '+237 6 55 66 77 88', 'Technicien Audio', 'Technique', 220000.0, '2021-05-15 09:00:00', 'ACTIVE', 'Douala, Cameroun', 'Sophie Nguemo', '+237 6 99 88 77 66', 'Installation systemes audio', NOW(), NOW()),
('Aline', 'Mvondo', 'aline@nadiaevents.com', '+237 6 66 77 88 99', 'Decoratrice Junior', 'Decoration', 200000.0, '2021-08-01 09:00:00', 'ACTIVE', 'Douala, Cameroun', 'Jean Mvondo', '+237 6 10 99 88 77', 'Decoration evenementielle', NOW(), NOW()),
('Marc', 'Fotsing', 'marc@nadiaevents.com', '+237 6 77 88 99 00', 'Responsable Technique', 'Technique', 320000.0, '2021-10-01 09:00:00', 'ACTIVE', 'Douala, Cameroun', 'Marie Fotsing', '+237 6 11 00 99 88', 'Supervision technique', NOW(), NOW());

-- Insérer des données de test pour les produits
INSERT INTO products (name, description, price, category, available, created_at, updated_at) VALUES 
('Decoration florale', 'Bouquets et arrangements floraux personnalises', 150.0, 'Decoration', TRUE, NOW(), NOW()),
('Eclairage LED', 'Systeme d''eclairage LED programmable', 500.0, 'Eclairage', TRUE, NOW(), NOW()),
('Mobilier evenementiel', 'Chaises et tables de reception', 200.0, 'Mobilier', TRUE, NOW(), NOW()),
('Systeme sonorisation', 'Installation audio professionnelle', 500.0, 'Audio', TRUE, NOW(), NOW()),
('Bannieres personnalisees', 'Bannieres et affichage sur mesure', 200.0, 'Affichage', TRUE, NOW(), NOW()),
('Gateau decoratif', 'Gateaux personnalises pour evenements', 200.0, 'Traiteur', TRUE, NOW(), NOW()),
('Stand d''exposition', 'Stand modulaire 3x3m avec eclairage', 1500.0, 'Exposition', TRUE, NOW(), NOW()),
('Animation DJ', 'Service DJ avec eclairage', 300.0, 'Animation', TRUE, NOW(), NOW()),
('Photographie', 'Service photo professionnel', 400.0, 'Photo', TRUE, NOW(), NOW()),
('Service traiteur', 'Buffet complet pour evenements', 250.0, 'Traiteur', TRUE, NOW(), NOW());

-- Insérer des données de test pour les transactions comptables
INSERT INTO accounting_transactions (transaction_type, amount, description, transaction_date, category, reference, status, created_at, updated_at) VALUES 
('INCOME', 1500000.0, 'Mariage Douala - Decoration complete', CURRENT_DATE - INTERVAL '15 days', 'SALES', 'EVT-2024-001', 'COMPLETED', NOW(), NOW()),
('EXPENSE', 250000.0, 'Achat materiel decoration', CURRENT_DATE - INTERVAL '20 days', 'PURCHASES', 'MAT-2024-001', 'COMPLETED', NOW(), NOW()),
('INCOME', 800000.0, 'Anniversaire entreprise - Eclairage', CURRENT_DATE - INTERVAL '10 days', 'SALES', 'EVT-2024-002', 'COMPLETED', NOW(), NOW()),
('EXPENSE', 120000.0, 'Salaires personnel janvier', CURRENT_DATE - INTERVAL '5 days', 'SALARY', 'SAL-2024-001', 'COMPLETED', NOW(), NOW()),
('INCOME', 2000000.0, 'Conference internationale - Setup complet', CURRENT_DATE - INTERVAL '3 days', 'SALES', 'EVT-2024-003', 'PENDING', NOW(), NOW()),
('EXPENSE', 180000.0, 'Transport materiel', CURRENT_DATE - INTERVAL '8 days', 'OTHER', 'TRP-2024-001', 'COMPLETED', NOW(), NOW()),
('INCOME', 600000.0, 'Bapteme - Decoration simple', CURRENT_DATE - INTERVAL '12 days', 'SALES', 'EVT-2024-004', 'COMPLETED', NOW(), NOW()),
('EXPENSE', 95000.0, 'Maintenance equipements', CURRENT_DATE - INTERVAL '7 days', 'MAINTENANCE', 'MNT-2024-001', 'COMPLETED', NOW(), NOW()),
('INCOME', 1200000.0, 'Exposition art - Installation', CURRENT_DATE - INTERVAL '5 days', 'SALES', 'EVT-2024-005', 'PENDING', NOW(), NOW()),
('EXPENSE', 150000.0, 'Salaires personnel fevrier', CURRENT_DATE - INTERVAL '2 days', 'SALARY', 'SAL-2024-002', 'PENDING', NOW(), NOW());

-- Afficher un résumé des données insérées
SELECT 'Factures insérées' as type, COUNT(*) as count FROM invoices
UNION ALL
SELECT 'Devis insérés' as type, COUNT(*) as count FROM quotes
UNION ALL
SELECT 'Personnel inséré' as type, COUNT(*) as count FROM staff
UNION ALL
SELECT 'Produits insérés' as type, COUNT(*) as count FROM products
UNION ALL
SELECT 'Transactions insérées' as type, COUNT(*) as count FROM accounting_transactions; 