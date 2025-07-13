import React, { useState, useEffect } from 'react';
import './InvoiceManagement.css';
import jsPDF from 'jspdf';
import 'jspdf-autotable';
import { formatCurrency } from '../utils/currencyFormatter';

const InvoiceManagement = () => {
  const [invoices, setInvoices] = useState([]);
  const [showNewInvoiceForm, setShowNewInvoiceForm] = useState(false);
  const [error, setError] = useState(null);
  const [newInvoice, setNewInvoice] = useState({
    clientName: '',
    clientEmail: '',
    clientPhone: '',
    eventDate: '',
    eventType: '',
    eventLocation: '',
    items: [{ description: '', quantity: 1, unitPrice: 0 }],
    totalAmount: 0,
    status: 'DRAFT'
  });
  const [editingInvoice, setEditingInvoice] = useState(null);
  const [showEditModal, setShowEditModal] = useState(false);

  useEffect(() => {
    fetchInvoices();
  }, []);

  const fetchInvoices = async () => {
    try {
      const response = await fetch('http://localhost:8082/api/admin/invoices');
      if (response.ok) {
        const data = await response.json();
        setInvoices(data);
      } else {
        console.error('Erreur lors de la récupération des factures:', response.status);
      }
    } catch (error) {
      console.error('Erreur lors de la récupération des factures:', error);
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setNewInvoice(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleItemChange = (index, field, value) => {
    setNewInvoice(prev => ({
      ...prev,
      items: prev.items.map((item, i) =>
        i === index
          ? {
              ...item,
              [field]: field === 'quantity' ? Number(value) : field === 'unitPrice' ? Number(value) : value
            }
          : item
      )
    }));
  };

  const addItem = () => {
    setNewInvoice(prev => ({
      ...prev,
      items: [...prev.items, { description: '', quantity: 1, unitPrice: 0 }]
    }));
  };

  const removeItem = (index) => {
    setNewInvoice(prev => ({
      ...prev,
      items: prev.items.filter((_, i) => i !== index)
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      // Validation renforcée
      for (const item of newInvoice.items) {
        if (!item.description || String(item.description).trim() === '' || Number(item.quantity) <= 0 || Number(item.unitPrice) <= 0) {
          setError("Chaque article doit avoir une description, une quantité > 0 et un prix unitaire > 0");
          alert("Chaque article doit avoir une description, une quantité > 0 et un prix unitaire > 0");
          return;
        }
      }
      if (calculateTotal() <= 0) {
        setError("Le montant total doit être supérieur à 0");
        alert("Le montant total doit être supérieur à 0");
        return;
      }
      if (!newInvoice.clientName || newInvoice.clientName.trim() === '') {
        setError("Le nom du client est obligatoire");
        alert("Le nom du client est obligatoire");
        return;
      }
      if (!newInvoice.clientEmail || newInvoice.clientEmail.trim() === '') {
        setError("L'email du client est obligatoire");
        alert("L'email du client est obligatoire");
        return;
      }
      // Préparer les données pour le serveur
      const itemsToSend = newInvoice.items.map(item => ({
        productName: item.description || '',
        productDescription: item.description || '',
        quantity: Number(item.quantity),
        unitPrice: Number(item.unitPrice),
        totalPrice: Number(item.quantity) * Number(item.unitPrice)
      }));
      const dataToSend = {
        clientName: newInvoice.clientName.trim(),
        clientEmail: newInvoice.clientEmail.trim(),
        clientPhone: newInvoice.clientPhone || '',
        eventDate: newInvoice.eventDate ? new Date(newInvoice.eventDate).toISOString() : null,
        eventType: newInvoice.eventType || '',
        eventLocation: newInvoice.eventLocation || '',
        totalAmount: calculateTotal(),
        status: newInvoice.status,
        notes: `Articles: ${itemsToSend.map(item => `${item.productName} (${item.quantity}x${item.unitPrice})`).join(', ')}`,
        items: itemsToSend
      };

      console.log('Données envoyées:', dataToSend); // Debug
      
      const response = await fetch('http://localhost:8082/api/admin/invoices', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(dataToSend),
      });

      if (!response.ok) {
        const errorData = await response.json();
        console.error('Erreur serveur:', errorData); // Debug
        throw new Error(errorData.error || 'Erreur lors de la création de la facture');
      }

      const createdInvoice = await response.json();
      console.log('Réponse serveur:', createdInvoice); // Debug
      
      setInvoices([...invoices, createdInvoice]);
      setShowNewInvoiceForm(false);
      setNewInvoice({
        clientName: '',
        clientEmail: '',
        clientPhone: '',
        eventDate: '',
        eventType: '',
        eventLocation: '',
        items: [{ description: '', quantity: 1, unitPrice: 0 }],
        totalAmount: 0,
        status: 'DRAFT'
      });
      setError(null); // Effacer les erreurs précédentes
      alert('Facture créée avec succès !');
    } catch (error) {
      console.error('Erreur complète:', error); // Debug
      setError(error.message);
      alert('Erreur lors de la création de la facture: ' + error.message);
    }
  };

  const calculateTotal = () => {
    return newInvoice.items.reduce((total, item) => 
      total + ((parseInt(item.quantity) || 0) * (parseFloat(item.unitPrice) || 0)), 0
    );
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'PAID': return '#28a745';
      case 'PENDING': return '#ffc107';
      case 'OVERDUE': return '#dc3545';
      case 'DRAFT': return '#6c757d';
      default: return '#6c757d';
    }
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('fr-FR');
  };

  // Fonction pour générer le PDF d'une facture avec un design raffiné
  const generateInvoicePDF = (invoice) => {
    const doc = new jsPDF();
    
    // ✅ EN-TÊTE AMÉLIORÉE AVEC NADIA EVENT'S DECOR
    doc.setFontSize(24);
    doc.setTextColor(40, 116, 166); // Bleu raffiné
    doc.text("Nadia Event's Decor", 105, 20, { align: 'center' });
    
    // Ligne décorative sous le titre
    doc.setDrawColor(40, 116, 166);
    doc.setLineWidth(1);
    doc.line(20, 25, 190, 25);
    
    // Sous-titre
    doc.setFontSize(16);
    doc.setTextColor(44, 62, 80);
    doc.text('FACTURE', 105, 35, { align: 'center' });
    
    // Informations de l'entreprise (gauche)
    doc.setFontSize(10);
    doc.setTextColor(44, 62, 80);
    doc.text("Nadia Event's Decor", 20, 45);
    doc.text("Décoration d'événements professionnelle", 20, 51);
    doc.text("Yaoundé, Cameroun", 20, 57);
    doc.text("Téléphone : +237 680 207 496", 20, 63);
    doc.text("Email : nadiaeventsdecor@gmail.com", 20, 69);
    
    // Informations de la facture (droite)
    doc.text(`Numéro : ${invoice.invoiceNumber || ''}`, 140, 45);
    doc.text(`Date : ${invoice.createdAt ? formatDate(invoice.createdAt) : ''}`, 140, 51);
    doc.text(`Statut : ${invoice.status || ''}`, 140, 57);
    doc.text(`Client : ${invoice.clientName || ''}`, 140, 63);
    doc.text(`Email : ${invoice.clientEmail || ''}`, 140, 69);
    doc.text(`Téléphone : ${invoice.clientPhone || ''}`, 140, 75);
    
    // Tableau des articles
    let items = [];
    if (invoice.items && invoice.items.length > 0) {
      items = invoice.items.map(item => [
        item.productName || item.description || '',
        item.productDescription || '',
        item.quantity || '',
        formatCurrency(item.unitPrice || 0),
        formatCurrency(item.totalPrice || 0)
      ]);
    } else if (invoice.notes) {
      items = [[invoice.notes, '', '', '', '']];
    }
    
    doc.autoTable({
      head: [['Produit', 'Description', 'Quantité', 'Prix unitaire', 'Total']],
      body: items,
      startY: 85,
      headStyles: { 
        fillColor: [40, 116, 166], 
        textColor: 255, 
        fontStyle: 'bold' 
      },
      styles: { 
        fontSize: 10, 
        cellPadding: 2 
      },
      alternateRowStyles: { 
        fillColor: [240, 248, 255] 
      }
    });
    
    // Total
    const finalY = doc.lastAutoTable.finalY || 100;
    doc.setFontSize(14);
    doc.setTextColor(44, 62, 80);
    const totalAmount = invoice.items
      ? invoice.items.reduce((sum, item) => sum + ((parseInt(item.quantity) || 0) * (parseFloat(item.unitPrice) || 0)), 0)
      : (invoice.totalAmount || 0);
    doc.text(`Montant total : ${formatCurrency(totalAmount)}`, 140, finalY + 10);
    
    // Pied de page avec logo
    doc.setFontSize(10);
    doc.setTextColor(150);
    doc.text("Nadia Event's Decor - Décoration d'événements professionnelle", 105, 285, { align: 'center' });
    doc.text("Yaoundé, Cameroun | +237 680 207 496", 105, 290, { align: 'center' });
    doc.text("Merci pour votre confiance !", 105, 295, { align: 'center' });
    
    doc.save(`Facture_${invoice.invoiceNumber || invoice.id}.pdf`);
  };

  // Ouvrir la modale d'édition avec la facture sélectionnée
  const handleEditClick = (invoice) => {
    setEditingInvoice(invoice);
    setShowEditModal(true);
  };

  // Gérer la modification des champs dans la modale d'édition
  const handleEditInputChange = (e) => {
    const { name, value } = e.target;
    setEditingInvoice(prev => ({
      ...prev,
      [name]: value
    }));
  };

  // Gérer la modification des articles dans la modale d'édition
  const handleEditItemChange = (index, field, value) => {
    setEditingInvoice(prev => ({
      ...prev,
      items: prev.items.map((item, i) =>
        i === index
          ? {
              ...item,
              [field]: field === 'quantity' ? Number(value) : field === 'unitPrice' ? Number(value) : value
            }
          : item
      )
    }));
  };

  // Soumettre la modification (PUT)
  const handleEditSubmit = async (e) => {
    e.preventDefault();
    try {
      // Validation renforcée
      for (const item of editingInvoice.items) {
        if (!item.description || String(item.description).trim() === '' || Number(item.quantity) <= 0 || Number(item.unitPrice) <= 0) {
          setError("Chaque article doit avoir une description, une quantité > 0 et un prix unitaire > 0");
          alert("Chaque article doit avoir une description, une quantité > 0 et un prix unitaire > 0");
          return;
        }
      }
      const totalEdit = editingInvoice.items.reduce((total, item) => total + ((parseInt(item.quantity) || 0) * (parseFloat(item.unitPrice) || 0)), 0);
      if (totalEdit <= 0) {
        setError("Le montant total doit être supérieur à 0");
        alert("Le montant total doit être supérieur à 0");
        return;
      }
      const itemsToSendEdit = editingInvoice.items.map(item => ({
        productName: item.description || '',
        productDescription: item.description || '',
        quantity: Number(item.quantity),
        unitPrice: Number(item.unitPrice),
        totalPrice: Number(item.quantity) * Number(item.unitPrice)
      }));
      const dataToSend = {
        ...editingInvoice,
        totalAmount: totalEdit,
        items: itemsToSendEdit
      };
      const response = await fetch(`http://localhost:8082/api/admin/invoices/${editingInvoice.id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(dataToSend)
      });
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Erreur lors de la modification de la facture');
      }
      const updatedInvoice = await response.json();
      setInvoices(invoices.map(inv => inv.id === updatedInvoice.id ? updatedInvoice : inv));
      setShowEditModal(false);
      setEditingInvoice(null);
      alert('Facture modifiée avec succès !');
    } catch (error) {
      alert('Erreur lors de la modification : ' + error.message);
    }
  };

  return (
    <div className="invoice-management">
      <div className="section-header">
        <h2>Gestion des Factures</h2>
        <button 
          className="btn-primary"
          onClick={() => setShowNewInvoiceForm(true)}
        >
          Nouvelle Facture
        </button>
      </div>

      {/* Affichage des erreurs */}
      {error && (
        <div className="error-message">
          <p>Erreur: {error}</p>
        </div>
      )}

      <div className="invoices-list">
        <h3>Factures existantes</h3>
        {invoices.length === 0 ? (
          <p>Aucune facture trouvée. Cliquez sur "Nouvelle Facture" pour en créer une.</p>
        ) : (
          <div className="invoices-grid">
            {invoices.map((invoice) => {
              // Calcul du montant total dynamique
              const totalAmount = invoice.items && invoice.items.length > 0
                ? invoice.items.reduce((sum, item) => sum + ((parseInt(item.quantity) || 0) * (parseFloat(item.unitPrice) || 0)), 0)
                : (invoice.totalAmount || 0);
              return (
                <div key={invoice.id} className="invoice-card">
                  <h4>Facture #{invoice.invoiceNumber}</h4>
                  <p><strong>Client:</strong> {invoice.clientName}</p>
                  <p><strong>Email:</strong> {invoice.clientEmail}</p>
                  <p><strong>Montant:</strong> {formatCurrency(totalAmount)}</p>
                  <p><strong>Statut:</strong> {invoice.status}</p>
                  <button className="btn-secondary" onClick={() => generateInvoicePDF(invoice)}>
                    Télécharger en PDF
                  </button>
                  <button className="btn-primary" onClick={() => handleEditClick(invoice)}>
                    Voir / Modifier
                  </button>
                </div>
              );
            })}
          </div>
        )}
      </div>

      {showNewInvoiceForm && (
        <div className="modal-overlay">
          <div className="modal-content">
            <div className="modal-header">
              <div className="invoice-header">
                <h1>Nadia Event's Decor</h1>
                <p>Décoration d'événements professionnelle</p>
                <div className="invoice-company-info">
                  <div className="company-details">
                    <h3>Informations de l'entreprise</h3>
                    <p>Yaoundé, Cameroun</p>
                    <p>+237 680 207 496</p>
                    <p>nadiaeventsdecor@gmail.com</p>
                  </div>
                  <div className="invoice-details">
                    <h3>Nouvelle Facture</h3>
                    <p>Date: {new Date().toLocaleDateString('fr-FR')}</p>
                    <p>Statut: Brouillon</p>
                  </div>
                </div>
              </div>
              <button 
                className="btn-close"
                onClick={() => { setShowNewInvoiceForm(false); setError(null); }}
              >
                ×
              </button>
            </div>
            <form onSubmit={handleSubmit} className="invoice-form">
              <div className="form-row">
                <div className="form-group">
                  <label>Nom du client *</label>
                  <input
                    type="text"
                    name="clientName"
                    value={newInvoice.clientName}
                    onChange={handleInputChange}
                    required
                  />
                </div>
                <div className="form-group">
                  <label>Email du client</label>
                  <input
                    type="email"
                    name="clientEmail"
                    value={newInvoice.clientEmail}
                    onChange={handleInputChange}
                  />
                </div>
              </div>

              <div className="form-row">
                <div className="form-group">
                  <label>Téléphone</label>
                  <input
                    type="text"
                    name="clientPhone"
                    value={newInvoice.clientPhone}
                    onChange={handleInputChange}
                  />
                </div>
                <div className="form-group">
                  <label>Date de l'événement</label>
                  <input
                    type="datetime-local"
                    name="eventDate"
                    value={newInvoice.eventDate}
                    onChange={handleInputChange}
                  />
                </div>
              </div>

              <div className="form-group">
                <label>Type d'événement</label>
                <select
                  name="eventType"
                  value={newInvoice.eventType}
                  onChange={handleInputChange}
                >
                  <option value="">Sélectionner un type</option>
                  <option value="Mariage">Mariage</option>
                  <option value="Anniversaire">Anniversaire</option>
                  <option value="Baptême">Baptême</option>
                  <option value="Conférence">Conférence</option>
                  <option value="Autre">Autre</option>
                </select>
              </div>

              <div className="form-group">
                <label>Articles</label>
                {newInvoice.items.map((item, index) => (
                  <div key={index} className="item-row">
                    <input
                      type="text"
                      placeholder="Description"
                      value={item.description}
                      onChange={(e) => handleItemChange(index, 'description', e.target.value)}
                      required
                    />
                    <input
                      type="number"
                      placeholder="Quantité"
                      value={item.quantity}
                      onChange={(e) => handleItemChange(index, 'quantity', parseInt(e.target.value) || 0)}
                      min="1"
                      required
                    />
                    <input
                      type="number"
                      placeholder="Prix unitaire"
                      value={item.unitPrice}
                      onChange={(e) => handleItemChange(index, 'unitPrice', parseFloat(e.target.value) || 0)}
                      min="0"
                      step="0.01"
                      className="price-input"
                      required
                    />
                    <div className="item-total">
                      {formatCurrency((parseInt(item.quantity) || 0) * (parseFloat(item.unitPrice) || 0))}
                    </div>
                    <button
                      type="button"
                      className="btn-remove"
                      onClick={() => removeItem(index)}
                    >
                      Supprimer
                    </button>
                  </div>
                ))}
                <button type="button" className="btn-secondary" onClick={addItem}>
                  Ajouter un article
                </button>
              </div>

              <div className="form-group">
                <label>Montant total:</label>
                <div className="total-amount">
                  {formatCurrency(calculateTotal())}
                </div>
              </div>

              <div className="form-actions">
                <button type="button" className="btn-secondary" onClick={() => { setShowNewInvoiceForm(false); setError(null); }}>
                  Annuler
                </button>
                <button type="submit" className="btn-primary">
                  Créer la facture
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {showEditModal && editingInvoice && (
        <div className="modal-overlay">
          <div className="modal-content">
            <div className="modal-header">
              <h3>Voir / Modifier la Facture</h3>
              <button className="btn-close" onClick={() => setShowEditModal(false)}>×</button>
            </div>
            <form onSubmit={handleEditSubmit} className="invoice-form">
              <div className="form-row">
                <div className="form-group">
                  <label>Nom du client *</label>
                  <input
                    type="text"
                    name="clientName"
                    value={editingInvoice.clientName}
                    onChange={handleEditInputChange}
                    required
                  />
                </div>
                <div className="form-group">
                  <label>Email du client</label>
                  <input
                    type="email"
                    name="clientEmail"
                    value={editingInvoice.clientEmail}
                    onChange={handleEditInputChange}
                  />
                </div>
              </div>
              <div className="form-row">
                <div className="form-group">
                  <label>Téléphone du client</label>
                  <input
                    type="text"
                    name="clientPhone"
                    value={editingInvoice.clientPhone}
                    onChange={handleEditInputChange}
                  />
                </div>
                <div className="form-group">
                  <label>Date de l'événement</label>
                  <input
                    type="date"
                    name="eventDate"
                    value={editingInvoice.eventDate ? editingInvoice.eventDate.split('T')[0] : ''}
                    onChange={handleEditInputChange}
                  />
                </div>
              </div>
              <div className="form-group">
                <label>Type d'événement</label>
                <select
                  name="eventType"
                  value={editingInvoice.eventType}
                  onChange={handleEditInputChange}
                >
                  <option value="">Sélectionner un type</option>
                  <option value="Mariage">Mariage</option>
                  <option value="Anniversaire">Anniversaire</option>
                  <option value="Baptême">Baptême</option>
                  <option value="Conférence">Conférence</option>
                  <option value="Autre">Autre</option>
                </select>
              </div>
              <div className="form-group">
                <label>Articles</label>
                {editingInvoice.items.map((item, index) => (
                  <div key={index} className="item-row">
                    <input
                      type="text"
                      placeholder="Description"
                      value={item.description}
                      onChange={(e) => handleEditItemChange(index, 'description', e.target.value)}
                      required
                    />
                    <input
                      type="number"
                      placeholder="Quantité"
                      value={item.quantity}
                      onChange={(e) => handleEditItemChange(index, 'quantity', parseInt(e.target.value) || 0)}
                      min="1"
                      required
                    />
                    <input
                      type="number"
                      placeholder="Prix unitaire"
                      value={item.unitPrice}
                      onChange={(e) => handleEditItemChange(index, 'unitPrice', parseFloat(e.target.value) || 0)}
                      min="0"
                      step="0.01"
                      className="price-input"
                      required
                    />
                    <div className="item-total">
                      {formatCurrency((parseInt(item.quantity) || 0) * (parseFloat(item.unitPrice) || 0))}
                    </div>
                  </div>
                ))}
              </div>
              <div className="form-group">
                <label>
                  Montant total: {
                    formatCurrency(
                      editingInvoice.items.reduce(
                        (sum, item) => sum + ((parseInt(item.quantity) || 0) * (parseFloat(item.unitPrice) || 0)),
                        0
                      )
                    )
                  }
                </label>
              </div>
              <div className="form-actions">
                <button type="button" className="btn-secondary" onClick={() => setShowEditModal(false)}>
                  Annuler
                </button>
                <button type="submit" className="btn-primary">
                  Enregistrer les modifications
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default InvoiceManagement; 