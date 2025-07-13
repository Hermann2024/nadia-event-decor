-- Corriger les statuts des factures pour correspondre à l'enum InvoiceStatus
-- InvoiceStatus: DRAFT, SENT, PAID, OVERDUE, CANCELLED

UPDATE invoices SET status = 'SENT' WHERE status = 'PENDING';
UPDATE invoices SET status = 'DRAFT' WHERE status = 'DRAFT';

-- Vérifier les statuts corrigés
SELECT invoice_number, client_name, status FROM invoices ORDER BY id; 