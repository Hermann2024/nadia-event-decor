-- Script d'insertion de données de test pour la comptabilité
-- Nettoyer les données existantes
DELETE FROM accounting_transactions;

-- Insérer des transactions de revenus (INCOME)
INSERT INTO accounting_transactions (description, amount, type, category, status, transaction_date, transaction_number, reference_number, notes, created_at, updated_at) VALUES 
('Vente Mariage Dupont', 2500000.00, 'INCOME', 'SALES', 'COMPLETED', CURRENT_DATE - INTERVAL '30 days', 'TRX-2024-001', 'INV-2024-001', 'Paiement facture mariage', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
('Vente Anniversaire Martin', 1800000.00, 'INCOME', 'SALES', 'COMPLETED', CURRENT_DATE - INTERVAL '25 days', 'TRX-2024-002', 'INV-2024-002', 'Paiement facture anniversaire', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
('Vente Baptême Johnson', 1200000.00, 'INCOME', 'SALES', 'COMPLETED', CURRENT_DATE - INTERVAL '20 days', 'TRX-2024-003', 'INV-2024-003', 'Paiement facture baptême', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
('Vente Conférence Tech', 3500000.00, 'INCOME', 'SALES', 'COMPLETED', CURRENT_DATE - INTERVAL '15 days', 'TRX-2024-004', 'INV-2024-004', 'Paiement facture conférence', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
('Vente Mariage Wilson', 2800000.00, 'INCOME', 'SALES', 'COMPLETED', CURRENT_DATE - INTERVAL '10 days', 'TRX-2024-005', 'INV-2024-005', 'Paiement facture mariage', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
('Vente Anniversaire Brown', 950000.00, 'INCOME', 'SALES', 'COMPLETED', CURRENT_DATE - INTERVAL '5 days', 'TRX-2024-006', 'INV-2024-006', 'Paiement facture anniversaire', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
('Vente Baptême Davis', 1500000.00, 'INCOME', 'SALES', 'COMPLETED', CURRENT_DATE - INTERVAL '2 days', 'TRX-2024-007', 'INV-2024-007', 'Paiement facture baptême', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
('Vente Mariage Garcia', 3200000.00, 'INCOME', 'SALES', 'COMPLETED', CURRENT_DATE - INTERVAL '1 day', 'TRX-2024-008', 'INV-2024-008', 'Paiement facture mariage', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP);

-- Insérer des transactions de dépenses (EXPENSE)
INSERT INTO accounting_transactions (description, amount, type, category, status, transaction_date, transaction_number, reference_number, notes, created_at, updated_at) VALUES 
('Achat fleurs et décorations', 450000.00, 'EXPENSE', 'OTHER', 'COMPLETED', CURRENT_DATE - INTERVAL '28 days', 'TRX-2024-101', 'SUP-2024-001', 'Achat fournitures décorations', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
('Salaire employé décorateur', 180000.00, 'EXPENSE', 'SALARY', 'COMPLETED', CURRENT_DATE - INTERVAL '25 days', 'TRX-2024-102', 'SAL-2024-001', 'Salaire mensuel', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
('Achat matériel éclairage', 320000.00, 'EXPENSE', 'OTHER', 'COMPLETED', CURRENT_DATE - INTERVAL '22 days', 'TRX-2024-103', 'SUP-2024-002', 'Achat équipements éclairage', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
('Marketing et publicité', 150000.00, 'EXPENSE', 'MARKETING', 'COMPLETED', CURRENT_DATE - INTERVAL '20 days', 'TRX-2024-104', 'MKT-2024-001', 'Campagne publicitaire', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
('Maintenance véhicule', 85000.00, 'EXPENSE', 'MAINTENANCE', 'COMPLETED', CURRENT_DATE - INTERVAL '18 days', 'TRX-2024-105', 'MAINT-2024-001', 'Entretien véhicule de service', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
('Achat tissus et accessoires', 280000.00, 'EXPENSE', 'OTHER', 'COMPLETED', CURRENT_DATE - INTERVAL '15 days', 'TRX-2024-106', 'SUP-2024-003', 'Achat tissus pour décoration', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
('Salaire employé logistique', 160000.00, 'EXPENSE', 'SALARY', 'COMPLETED', CURRENT_DATE - INTERVAL '12 days', 'TRX-2024-107', 'SAL-2024-002', 'Salaire mensuel', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
('Achat équipements audio', 420000.00, 'EXPENSE', 'OTHER', 'COMPLETED', CURRENT_DATE - INTERVAL '10 days', 'TRX-2024-108', 'SUP-2024-004', 'Achat système audio', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
('Marketing réseaux sociaux', 95000.00, 'EXPENSE', 'MARKETING', 'COMPLETED', CURRENT_DATE - INTERVAL '8 days', 'TRX-2024-109', 'MKT-2024-002', 'Publicité Facebook/Instagram', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
('Maintenance équipements', 120000.00, 'EXPENSE', 'MAINTENANCE', 'COMPLETED', CURRENT_DATE - INTERVAL '5 days', 'TRX-2024-110', 'MAINT-2024-002', 'Réparation équipements', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
('Achat fournitures bureau', 65000.00, 'EXPENSE', 'OTHER', 'COMPLETED', CURRENT_DATE - INTERVAL '3 days', 'TRX-2024-111', 'SUP-2024-005', 'Achat fournitures de bureau', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
('Salaire employé administratif', 140000.00, 'EXPENSE', 'SALARY', 'COMPLETED', CURRENT_DATE - INTERVAL '1 day', 'TRX-2024-112', 'SAL-2024-003', 'Salaire mensuel', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP);

-- Vérifier les données insérées
SELECT 
  'Revenus totaux' as type,
  SUM(amount) as total
FROM accounting_transactions 
WHERE type = 'INCOME' AND status = 'COMPLETED'
UNION ALL
SELECT 
  'Dépenses totales' as type,
  SUM(amount) as total
FROM accounting_transactions 
WHERE type = 'EXPENSE' AND status = 'COMPLETED'; 