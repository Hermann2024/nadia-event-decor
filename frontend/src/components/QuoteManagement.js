import React, { useState, useEffect } from 'react';
import './QuoteManagement.css';
import jsPDF from 'jspdf';
import 'jspdf-autotable';
import axios from 'axios';
import { formatCurrency } from '../utils/currencyFormatter';
import { toast } from 'react-toastify';

const QuoteManagement = () => {
  const [quotes, setQuotes] = useState([]);
  const [showNewQuoteForm, setShowNewQuoteForm] = useState(false);
  const [error, setError] = useState(null);
  const [newQuote, setNewQuote] = useState({
    clientName: '',
    clientEmail: '',
    clientPhone: '',
    eventDate: '',
    eventType: '',
    eventLocation: '',
    items: [{ description: '', quantity: 1, unitPrice: 0 }],
    totalAmount: 0,
    status: 'DRAFT',
    validUntil: '',
    notes: ''
  });
  const [editingQuote, setEditingQuote] = useState(null);
  const [showEditModal, setShowEditModal] = useState(false);
  const [stats, setStats] = useState({
    events: { count: 0, change: 0 },
    products: { count: 0, change: 0 },
    staff: { count: 0, change: 0 },
    revenue: { amount: 0, change: 0 }
  });
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    fetchQuotes();
  }, []);

  const fetchQuotes = async () => {
    try {
      const response = await fetch('http://localhost:8082/api/admin/quotes');
      if (response.ok) {
        const data = await response.json();
        setQuotes(data);
      } else {
        console.error('Erreur lors de la récupération des devis:', response.status);
      }
    } catch (error) {
      console.error('Erreur lors de la récupération des devis:', error);
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setNewQuote(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleItemChange = (index, field, value) => {
    setNewQuote(prev => ({
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
    setNewQuote(prev => ({
      ...prev,
      items: [...prev.items, { description: '', quantity: 1, unitPrice: 0 }]
    }));
  };

  const removeItem = (index) => {
    setNewQuote(prev => ({
      ...prev,
      items: prev.items.filter((_, i) => i !== index)
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      for (const item of newQuote.items) {
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
      
      // ⚠️ VALIDATION : Vérifier que les données obligatoires sont présentes
      if (!newQuote.clientName || newQuote.clientName.trim() === '') {
        setError("Le nom du client est obligatoire");
        return;
      }
      
      if (!newQuote.clientEmail || newQuote.clientEmail.trim() === '') {
        setError("L'email du client est obligatoire");
        return;
      }
      
      // ⚠️ CORRECTION : Préparer les données pour le serveur (sans items pour l'instant)
      const itemsToSend = newQuote.items.map(item => ({
        productName: item.description || '',
        productDescription: item.description || '',
        quantity: Number(item.quantity),
        unitPrice: Number(item.unitPrice),
        totalPrice: Number(item.quantity) * Number(item.unitPrice)
      }));
      const dataToSend = {
        clientName: newQuote.clientName.trim(),
        clientEmail: newQuote.clientEmail.trim(),
        clientPhone: newQuote.clientPhone || '',
        eventDate: newQuote.eventDate ? new Date(newQuote.eventDate).toISOString() : null,
        eventType: newQuote.eventType || '',
        eventLocation: newQuote.eventLocation || '',
        totalAmount: calculateTotal(),
        status: newQuote.status,
        validUntil: newQuote.validUntil ? new Date(newQuote.validUntil).toISOString().split('T')[0] : null,
        notes: `Articles: ${itemsToSend.map(item => 
          `${item.productName} (${item.quantity}x${item.unitPrice})`
        ).join(', ')}`,
        items: itemsToSend
      };

      console.log('Données envoyées:', dataToSend); // Debug
      
      const response = await fetch('http://localhost:8082/api/admin/quotes', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(dataToSend),
      });

      if (!response.ok) {
        const errorData = await response.json();
        console.error('Erreur serveur:', errorData); // Debug
        throw new Error(errorData.error || 'Erreur lors de la création du devis');
      }

      const createdQuote = await response.json();
      console.log('Réponse serveur:', createdQuote); // Debug
      
      setQuotes([...quotes, createdQuote]);
      setShowNewQuoteForm(false);
      setNewQuote({
        clientName: '',
        clientEmail: '',
        clientPhone: '',
        eventDate: '',
        eventType: '',
        eventLocation: '',
        items: [{ description: '', quantity: 1, unitPrice: 0 }],
        totalAmount: 0,
        status: 'DRAFT',
        validUntil: '',
        notes: ''
      });
      setError(null); // Effacer les erreurs précédentes
      toast.success('Devis créé avec succès !');
    } catch (error) {
      console.error('Erreur complète:', error); // Debug
      setError(error.message);
      toast.error('Erreur lors de la création du devis');
    }
  };

  const calculateTotal = () => {
    return newQuote.items.reduce((total, item) => 
      total + ((parseInt(item.quantity) || 0) * (parseFloat(item.unitPrice) || 0)), 0
    );
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'ACCEPTED': return '#28a745';
      case 'PENDING': return '#ffc107';
      case 'REJECTED': return '#dc3545';
      case 'EXPIRED': return '#6c757d';
      case 'DRAFT': return '#17a2b8';
      default: return '#6c757d';
    }
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('fr-FR');
  };



  const calculateValidUntil = () => {
    const today = new Date();
    const validUntil = new Date(today);
    validUntil.setDate(today.getDate() + 30); // Valide 30 jours
    return validUntil.toISOString().split('T')[0];
  };

  // Fonction pour générer le PDF d'un devis avec un design raffiné
  const generateQuotePDF = (quote) => {
    const doc = new jsPDF();
    
    // ✅ EN-TÊTE AMÉLIORÉE AVEC NADIA EVENT'S DECOR
    doc.setFontSize(24);
    doc.setTextColor(40, 167, 69); // Vert raffiné pour les devis
    doc.text("Nadia Event's Decor", 105, 20, { align: 'center' });
    
    // Ligne décorative sous le titre
    doc.setDrawColor(40, 167, 69);
    doc.setLineWidth(1);
    doc.line(20, 25, 190, 25);
    
    // Sous-titre
    doc.setFontSize(16);
    doc.setTextColor(44, 62, 80);
    doc.text('DEVIS', 105, 35, { align: 'center' });
    
    // Informations de l'entreprise (gauche)
    doc.setFontSize(10);
    doc.setTextColor(44, 62, 80);
    doc.text("Nadia Event's Decor", 20, 45);
    doc.text("Décoration d'événements professionnelle", 20, 51);
    doc.text("Yaoundé, Cameroun", 20, 57);
    doc.text("Téléphone : +237 680 207 496", 20, 63);
    doc.text("Email : nadiaeventsdecor@gmail.com", 20, 69);
    
    // Informations du devis (droite)
    doc.text(`Numéro : ${quote.quoteNumber || ''}`, 140, 45);
    doc.text(`Date : ${quote.createdAt ? formatDate(quote.createdAt) : ''}`, 140, 51);
    doc.text(`Statut : ${quote.status || ''}`, 140, 57);
    doc.text(`Client : ${quote.clientName || ''}`, 140, 63);
    doc.text(`Email : ${quote.clientEmail || ''}`, 140, 69);
    doc.text(`Téléphone : ${quote.clientPhone || ''}`, 140, 75);
    
    // Tableau des articles
    let items = [];
    if (quote.items && quote.items.length > 0) {
      items = quote.items.map(item => [
        item.productName || item.description || '',
        item.productDescription || '',
        item.quantity || '',
        formatCurrency(item.unitPrice || 0),
        formatCurrency(item.totalPrice || 0)
      ]);
    } else if (quote.notes) {
      items = [[quote.notes, '', '', '', '']];
    }
    
    doc.autoTable({
      head: [['Produit', 'Description', 'Quantité', 'Prix unitaire', 'Total']],
      body: items,
      startY: 85,
      headStyles: { 
        fillColor: [40, 167, 69], 
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
    const totalAmount = quote.items
      ? quote.items.reduce((sum, item) => sum + ((parseInt(item.quantity) || 0) * (parseFloat(item.unitPrice) || 0)), 0)
      : (quote.totalAmount || 0);
    doc.text(`Montant total : ${formatCurrency(totalAmount)}`, 140, finalY + 10);
    
    // Pied de page avec logo
    doc.setFontSize(10);
    doc.setTextColor(150);
    doc.text("Nadia Event's Decor - Décoration d'événements professionnelle", 105, 285, { align: 'center' });
    doc.text("Yaoundé, Cameroun | +237 680 207 496", 105, 290, { align: 'center' });
    doc.text("Merci pour votre confiance !", 105, 295, { align: 'center' });
    
    doc.save(`Devis_${quote.quoteNumber || quote.id}.pdf`);
  };

  // Ouvrir la modale d'édition avec le devis sélectionné
  const handleEditClick = (quote) => {
    setEditingQuote(quote);
    setShowEditModal(true);
  };

  // Gérer la modification des champs dans la modale d'édition
  const handleEditInputChange = (e) => {
    const { name, value } = e.target;
    setEditingQuote(prev => ({
      ...prev,
      [name]: value
    }));
  };

  // Gérer la modification des articles dans la modale d'édition
  const handleEditItemChange = (index, field, value) => {
    setEditingQuote(prev => ({
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
      for (const item of editingQuote.items) {
        if (!item.description || String(item.description).trim() === '' || Number(item.quantity) <= 0 || Number(item.unitPrice) <= 0) {
          setError("Chaque article doit avoir une description, une quantité > 0 et un prix unitaire > 0");
          alert("Chaque article doit avoir une description, une quantité > 0 et un prix unitaire > 0");
          return;
        }
      }
      const totalEdit = editingQuote.items.reduce((total, item) => total + ((parseInt(item.quantity) || 0) * (parseFloat(item.unitPrice) || 0)), 0);
      if (totalEdit <= 0) {
        setError("Le montant total doit être supérieur à 0");
        alert("Le montant total doit être supérieur à 0");
        return;
      }
      const itemsToSendEdit = editingQuote.items.map(item => ({
        productName: item.description || '',
        productDescription: item.description || '',
        quantity: Number(item.quantity),
        unitPrice: Number(item.unitPrice),
        totalPrice: Number(item.quantity) * Number(item.unitPrice)
      }));
      const dataToSend = {
        ...editingQuote,
        totalAmount: totalEdit,
        items: itemsToSendEdit
      };
      const response = await fetch(`http://localhost:8082/api/admin/quotes/${editingQuote.id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(dataToSend)
      });
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Erreur lors de la modification du devis');
      }
      const updatedQuote = await response.json();
      setQuotes(quotes.map(q => q.id === updatedQuote.id ? updatedQuote : q));
      setShowEditModal(false);
      setEditingQuote(null);
      toast.success('Devis modifié avec succès !');
    } catch (error) {
      toast.error('Erreur lors de la modification');
    }
  };

  const fetchDashboardData = async () => {
    try {
      setLoading(true);
      setError(null);

      let statsResponse;
      try {
        statsResponse = await axios.get('http://localhost:8082/api/admin/dashboard/stats');
        console.log('Stats response:', statsResponse.data);

        if (statsResponse.data) {
          setStats({
            events: { 
              count: statsResponse.data.totalEvents || 0, 
              change: statsResponse.data.eventsGrowth || 0 
            },
            products: { 
              count: statsResponse.data.totalProducts || 0, 
              change: statsResponse.data.productsGrowth || 0 
            },
            staff: { 
              count: statsResponse.data.totalStaff || 0, 
              change: statsResponse.data.staffGrowth || 0 
            },
            revenue: { 
              amount: statsResponse.data.totalRevenue || 0, 
              change: statsResponse.data.revenueGrowth || 0 
            }
          });
        }
      } catch (error) {
        // ...
      }
      // ...
    } catch (error) {
      // ...
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="quote-management">
      <div className="section-header">
        <h2>Gestion des Devis</h2>
        <button 
          className="btn-primary"
          onClick={() => setShowNewQuoteForm(true)}
        >
          Nouveau Devis
        </button>
      </div>

      {/* Affichage des erreurs */}
      {error && (
        <div className="error-message">
          <p>Erreur: {error}</p>
        </div>
      )}

      {/* Liste des devis */}
      <div className="quotes-list">
        <h3>Devis existants</h3>
        {quotes.length === 0 ? (
          <p>Aucun devis trouvé</p>
        ) : (
          <div className="quotes-grid">
            {quotes.map((quote) => {
              // Calcul du montant total dynamique
              const totalAmount = quote.items && quote.items.length > 0
                ? quote.items.reduce((sum, item) => sum + ((parseInt(item.quantity) || 0) * (parseFloat(item.unitPrice) || 0)), 0)
                : (quote.totalAmount || 0);
              return (
                <div key={quote.id} className="quote-card">
                  <h4>Devis #{quote.quoteNumber}</h4>
                  <p><strong>Client:</strong> {quote.clientName}</p>
                  <p><strong>Email:</strong> {quote.clientEmail}</p>
                  <p><strong>Montant:</strong> {formatCurrency(totalAmount)}</p>
                  <p><strong>Statut:</strong> {quote.status}</p>
                  <button className="btn-secondary" onClick={() => generateQuotePDF(quote)}>
                    Télécharger en PDF
                  </button>
                  <button className="btn-primary" onClick={() => handleEditClick(quote)}>
                    Voir / Modifier
                  </button>
                </div>
              );
            })}
          </div>
        )}
      </div>

      {/* Modal pour nouveau devis */}
      {showNewQuoteForm && (
        <div className="modal-overlay">
          <div className="modal-content">
            <div className="modal-header">
              <div className="quote-header">
                <h1>Nadia Event's Decor</h1>
                <p>Décoration d'événements professionnelle</p>
                <div className="quote-company-info">
                  <div className="company-details">
                    <h3>Informations de l'entreprise</h3>
                    <p>Yaoundé, Cameroun</p>
                    <p>+237 680 207 496</p>
                    <p>nadiaeventsdecor@gmail.com</p>
                  </div>
                  <div className="quote-details">
                    <h3>Nouveau Devis</h3>
                    <p>Date: {new Date().toLocaleDateString('fr-FR')}</p>
                    <p>Statut: Brouillon</p>
                  </div>
                </div>
              </div>
              <button 
                className="btn-close"
                onClick={() => { setShowNewQuoteForm(false); setError(null); }}
              >
                ×
              </button>
            </div>
            <form onSubmit={handleSubmit} className="quote-form">
              <div className="form-row">
                <div className="form-group">
                  <label>Nom du client *</label>
                  <input
                    type="text"
                    name="clientName"
                    value={newQuote.clientName}
                    onChange={handleInputChange}
                    required
                  />
                </div>
                <div className="form-group">
                  <label>Email du client *</label>
                  <input
                    type="email"
                    name="clientEmail"
                    value={newQuote.clientEmail}
                    onChange={handleInputChange}
                    required
                  />
                </div>
              </div>

              <div className="form-row">
                <div className="form-group">
                  <label>Téléphone</label>
                  <input
                    type="text"
                    name="clientPhone"
                    value={newQuote.clientPhone}
                    onChange={handleInputChange}
                  />
                </div>
                <div className="form-group">
                  <label>Date de l'événement</label>
                  <input
                    type="datetime-local"
                    name="eventDate"
                    value={newQuote.eventDate}
                    onChange={handleInputChange}
                  />
                </div>
              </div>

              <div className="form-row">
                <div className="form-group">
                  <label>Type d'événement</label>
                  <select
                    name="eventType"
                    value={newQuote.eventType}
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
                  <label>Lieu de l'événement</label>
                  <input
                    type="text"
                    name="eventLocation"
                    value={newQuote.eventLocation}
                    onChange={handleInputChange}
                  />
                </div>
              </div>

              <div className="form-group">
                <label>Date de validité</label>
                <input
                  type="date"
                  name="validUntil"
                  value={newQuote.validUntil}
                  onChange={handleInputChange}
                />
              </div>

              <div className="form-group">
                <label>Notes</label>
                <textarea
                  name="notes"
                  value={newQuote.notes}
                  onChange={handleInputChange}
                  rows="3"
                />
              </div>

              <div className="form-group">
                <label>Articles</label>
                {newQuote.items.map((item, index) => (
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
                <button type="button" className="btn-secondary" onClick={() => { setShowNewQuoteForm(false); setError(null); }}>
                  Annuler
                </button>
                <button type="submit" className="btn-primary">
                  Créer le devis
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {showEditModal && editingQuote && (
        <div className="modal-overlay">
          <div className="modal-content">
            <div className="modal-header">
              <h3>Voir / Modifier le Devis</h3>
              <button className="btn-close" onClick={() => setShowEditModal(false)}>×</button>
            </div>
            <form onSubmit={handleEditSubmit} className="quote-form">
              <div className="form-row">
                <div className="form-group">
                  <label>Nom du client *</label>
                  <input
                    type="text"
                    name="clientName"
                    value={editingQuote.clientName}
                    onChange={handleEditInputChange}
                    required
                  />
                </div>
                <div className="form-group">
                  <label>Email du client</label>
                  <input
                    type="email"
                    name="clientEmail"
                    value={editingQuote.clientEmail}
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
                    value={editingQuote.clientPhone}
                    onChange={handleEditInputChange}
                  />
                </div>
                <div className="form-group">
                  <label>Date de l'événement</label>
                  <input
                    type="date"
                    name="eventDate"
                    value={editingQuote.eventDate ? editingQuote.eventDate.split('T')[0] : ''}
                    onChange={handleEditInputChange}
                  />
                </div>
              </div>
              <div className="form-group">
                <label>Type d'événement</label>
                <select
                  name="eventType"
                  value={editingQuote.eventType}
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
                {editingQuote.items.map((item, index) => (
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
                      editingQuote.items.reduce(
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

export default QuoteManagement; 