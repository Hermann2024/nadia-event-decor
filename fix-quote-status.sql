-- Corriger les statuts des devis pour correspondre à l'enum QuoteStatus
-- QuoteStatus: DRAFT, SENT, ACCEPTED, REJECTED, EXPIRED

UPDATE quotes SET status = 'SENT' WHERE status = 'PENDING';

-- Vérifier les statuts corrigés
SELECT quote_number, client_name, status FROM quotes ORDER BY id; 