import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './AdminDashboard.css';
import API_CONFIG from '../config/api';

const AdminDashboard = () => {
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState({
    events: { count: 0, change: 0 },
    products: { count: 0, change: 0 },
    staff: { count: 0, change: 0 },
    revenue: { amount: 0, change: 0 }
  });
  const [invoices, setInvoices] = useState([]);
  const [quotes, setQuotes] = useState([]);
  const [showQuoteModal, setShowQuoteModal] = useState(false);
  const [showInvoiceModal, setShowInvoiceModal] = useState(false);
  const [showViewInvoiceModal, setShowViewInvoiceModal] = useState(false);
  const [showEditInvoiceModal, setShowEditInvoiceModal] = useState(false);
  const [showViewQuoteModal, setShowViewQuoteModal] = useState(false);
  const [showEditQuoteModal, setShowEditQuoteModal] = useState(false);
  const [editingInvoice, setEditingInvoice] = useState(null);
  const [editingQuote, setEditingQuote] = useState(null);
  const [newQuote, setNewQuote] = useState({
    clientName: '',
    clientEmail: '',
    clientPhone: '',
    eventDate: '',
    eventType: '',
    eventLocation: '',
    items: [{ productName: '', quantity: 1, unitPrice: 0 }],
    notes: ''
  });
  const [newInvoice, setNewInvoice] = useState({
    clientName: '',
    clientEmail: '',
    clientPhone: '',
    eventDate: '',
    eventType: '',
    eventLocation: '',
    items: [{ productName: '', quantity: 1, unitPrice: 0 }],
    notes: ''
  });

  const fetchDashboardData = async () => {
    try {
      console.log('Début de fetchDashboardData');
      
      // Récupérer les statistiques
      const statsResponse = await axios.get(`${API_CONFIG.BASE_URL}/dashboard/stats`);
      console.log('Stats response:', statsResponse.data);
      setStats(statsResponse.data);

      // Récupérer les factures
      const invoicesResponse = await axios.get(`${API_CONFIG.BASE_URL}/invoices`);
      console.log('Invoices response:', invoicesResponse.data);
      setInvoices(invoicesResponse.data);

      // Récupérer les devis
      const quotesResponse = await axios.get(`${API_CONFIG.BASE_URL}/quotes`);
      console.log('Quotes response:', quotesResponse.data);
      setQuotes(quotesResponse.data);

      setLoading(false);
    } catch (error) {
      console.error('Erreur lors du chargement des données:', error);
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const refreshData = () => {
    fetchDashboardData();
  };

  const handleNewQuoteClick = () => {
    setShowQuoteModal(true);
  };

  const handleNewInvoiceClick = () => {
    setShowInvoiceModal(true);
  };

  const handleCloseQuoteModal = () => {
    setShowQuoteModal(false);
    setNewQuote({
      clientName: '',
      clientEmail: '',
      clientPhone: '',
      eventDate: '',
      eventType: '',
      eventLocation: '',
      items: [{ productName: '', quantity: 1, unitPrice: 0 }],
      notes: ''
    });
  };

  const handleCloseInvoiceModal = () => {
    setShowInvoiceModal(false);
    setNewInvoice({
      clientName: '',
      clientEmail: '',
      clientPhone: '',
      eventDate: '',
      eventType: '',
      eventLocation: '',
      items: [{ productName: '', quantity: 1, unitPrice: 0 }],
      notes: ''
    });
  };

  const handleQuoteInputChange = (e) => {
    const { name, value } = e.target;
    setNewQuote(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleInvoiceInputChange = (e) => {
    const { name, value } = e.target;
    setNewInvoice(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleQuoteItemChange = (index, field, value) => {
    const updatedItems = [...newQuote.items];
    updatedItems[index] = { ...updatedItems[index], [field]: value };
    setNewQuote(prev => ({ ...prev, items: updatedItems }));
  };

  const handleInvoiceItemChange = (index, field, value) => {
    const updatedItems = [...newInvoice.items];
    updatedItems[index] = { ...updatedItems[index], [field]: value };
    setNewInvoice(prev => ({ ...prev, items: updatedItems }));
  };

  const addNewQuoteItem = () => {
    setNewQuote(prev => ({
      ...prev,
      items: [...prev.items, { productName: '', quantity: 1, unitPrice: 0 }]
    }));
  };

  const addNewInvoiceItem = () => {
    setNewInvoice(prev => ({
      ...prev,
      items: [...prev.items, { productName: '', quantity: 1, unitPrice: 0 }]
    }));
  };

  const removeNewQuoteItem = (index) => {
    setNewQuote(prev => ({
      ...prev,
      items: prev.items.filter((_, i) => i !== index)
    }));
  };

  const removeNewInvoiceItem = (index) => {
    setNewInvoice(prev => ({
      ...prev,
      items: prev.items.filter((_, i) => i !== index)
    }));
  };

  const calculateNewQuoteTotal = () => {
    return newQuote.items.reduce((total, item) => total + (Number(item.quantity) * Number(item.unitPrice)), 0);
  };

  const calculateNewInvoiceTotal = () => {
    return newInvoice.items.reduce((total, item) => total + (Number(item.quantity) * Number(item.unitPrice)), 0);
  };

  const handleQuoteSubmit = async (e) => {
    e.preventDefault();
    try {
      const itemsToSend = newQuote.items.map(item => ({
        productName: item.productName || '',
        productDescription: item.productName || '',
        quantity: Number(item.quantity),
        unitPrice: Number(item.unitPrice),
        totalPrice: Number(item.quantity) * Number(item.unitPrice)
      }));

      const dataToSend = {
        ...newQuote,
        items: itemsToSend,
        totalAmount: calculateNewQuoteTotal()
      };

      console.log('Données envoyées:', dataToSend);

      const response = await axios.post(`${API_CONFIG.BASE_URL}/quotes`, dataToSend);
      console.log('Réponse serveur:', response.data);

      if (response.status === 201) {
        await fetchDashboardData();
        handleCloseQuoteModal();
        alert('Devis créé avec succès !');
      }
    } catch (error) {
      console.error('Erreur lors de la création du devis:', error);
      alert('Erreur lors de la création du devis: ' + error.message);
    }
  };

  const handleInvoiceSubmit = async (e) => {
    e.preventDefault();
    try {
      const itemsToSend = newInvoice.items.map(item => ({
        productName: item.productName || '',
        productDescription: item.productName || '',
        quantity: Number(item.quantity),
        unitPrice: Number(item.unitPrice),
        totalPrice: Number(item.quantity) * Number(item.unitPrice)
      }));

      const dataToSend = {
        ...newInvoice,
        items: itemsToSend,
        totalAmount: calculateNewInvoiceTotal()
      };

      console.log('Données envoyées facture:', dataToSend);

      const response = await axios.post(`${API_CONFIG.BASE_URL}/invoices`, dataToSend);
      console.log('Réponse serveur facture:', response.data);

      if (response.status === 201) {
        await fetchDashboardData();
        handleCloseInvoiceModal();
        alert('Facture créée avec succès !');
      }
    } catch (error) {
      console.error('Erreur lors de la création de la facture:', error);
      alert('Erreur lors de la création de la facture: ' + error.message);
    }
  };

  const handleEditInvoiceInputChange = (e) => {
    const { name, value } = e.target;
    console.log('Changement de champ facture:', name, value);
    setEditingInvoice(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleEditInvoiceItemChange = (index, field, value) => {
    const updatedItems = [...editingInvoice.items];
    updatedItems[index] = { ...updatedItems[index], [field]: value };
    setEditingInvoice(prev => ({ ...prev, items: updatedItems }));
  };

  const addEditInvoiceItem = () => {
    setEditingInvoice(prev => ({
      ...prev,
      items: [...prev.items, { productName: '', quantity: 1, unitPrice: 0 }]
    }));
  };

  const removeEditInvoiceItem = (index) => {
    setEditingInvoice(prev => ({
      ...prev,
      items: prev.items.filter((_, i) => i !== index)
    }));
  };

  const calculateInvoiceTotal = () => {
    return editingInvoice.items.reduce((total, item) => total + (Number(item.quantity) * Number(item.unitPrice)), 0);
  };

  const handleEditQuoteInputChange = (e) => {
    const { name, value } = e.target;
    console.log('Changement de champ devis:', name, value);
    setEditingQuote(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleEditQuoteItemChange = (index, field, value) => {
    const updatedItems = [...editingQuote.items];
    updatedItems[index] = { ...updatedItems[index], [field]: value };
    setEditingQuote(prev => ({ ...prev, items: updatedItems }));
  };

  const addEditQuoteItem = () => {
    setEditingQuote(prev => ({
      ...prev,
      items: [...prev.items, { productName: '', quantity: 1, unitPrice: 0 }]
    }));
  };

  const removeEditQuoteItem = (index) => {
    setEditingQuote(prev => ({
      ...prev,
      items: prev.items.filter((_, i) => i !== index)
    }));
  };

  const calculateQuoteTotal = () => {
    return editingQuote.items.reduce((total, item) => total + (Number(item.quantity) * Number(item.unitPrice)), 0);
  };

  const handleViewInvoice = (invoice) => {
    setEditingInvoice(invoice);
    setShowViewInvoiceModal(true);
  };

  const handleEditInvoice = (invoice) => {
    setEditingInvoice(invoice);
    setShowEditInvoiceModal(true);
  };

  const handleViewQuote = (quote) => {
    setEditingQuote(quote);
    setShowViewQuoteModal(true);
  };

  const handleEditQuote = (quote) => {
    setEditingQuote(quote);
    setShowEditQuoteModal(true);
  };

  const handleCloseViewInvoiceModal = () => {
    setShowViewInvoiceModal(false);
    setEditingInvoice(null);
  };

  const handleCloseEditInvoiceModal = () => {
    setShowEditInvoiceModal(false);
    setEditingInvoice(null);
  };

  const handleCloseViewQuoteModal = () => {
    setShowViewQuoteModal(false);
    setEditingQuote(null);
  };

  const handleCloseEditQuoteModal = () => {
    setShowEditQuoteModal(false);
    setEditingQuote(null);
  };

  const handleSaveInvoice = async () => {
    try {
      console.log('=== DEBUG SAUVEGARDE FACTURE ===');
      console.log('Statut facture avant sauvegarde:', editingInvoice.status);
      console.log('Toutes les données facture:', editingInvoice);
      
      const itemsToSend = editingInvoice.items.map(item => ({
        productName: item.productName || item.description || '',
        productDescription: item.productDescription || item.description || '',
        quantity: Number(item.quantity),
        unitPrice: Number(item.unitPrice),
        totalPrice: Number(item.quantity) * Number(item.unitPrice)
      }));

      const dataToSend = {
        ...editingInvoice,
        items: itemsToSend,
        totalAmount: calculateInvoiceTotal(),
        status: editingInvoice.status
      };

      console.log('Données envoyées facture:', dataToSend);

      const response = await axios.put(`${API_CONFIG.BASE_URL}/invoices/${editingInvoice.id}`, dataToSend);
      
      console.log('Réponse serveur facture:', response.data);
      
      if (response.status === 200) {
        await fetchDashboardData();
        handleCloseEditInvoiceModal();
        alert('Facture mise à jour avec succès !');
      }
    } catch (error) {
      console.error('Erreur lors de la sauvegarde facture:', error);
      alert('Erreur lors de la mise à jour de la facture: ' + error.message);
    }
  };

  const handleSaveQuote = async () => {
    try {
      console.log('=== DEBUG SAUVEGARDE DEVIS ===');
      console.log('Statut devis avant sauvegarde:', editingQuote.status);
      console.log('Toutes les données devis:', editingQuote);
      
      const itemsToSend = editingQuote.items.map(item => ({
        productName: item.productName || item.description || '',
        productDescription: item.productDescription || item.description || '',
        quantity: Number(item.quantity),
        unitPrice: Number(item.unitPrice),
        totalPrice: Number(item.quantity) * Number(item.unitPrice)
      }));

      const dataToSend = {
        ...editingQuote,
        items: itemsToSend,
        totalAmount: calculateQuoteTotal(),
        status: editingQuote.status
      };

      console.log('Données envoyées devis:', dataToSend);

      const response = await axios.put(`${API_CONFIG.BASE_URL}/quotes/${editingQuote.id}`, dataToSend);
      
      console.log('Réponse serveur devis:', response.data);
      
      if (response.status === 200) {
        await fetchDashboardData();
        handleCloseEditQuoteModal();
        alert('Devis mis à jour avec succès !');
      }
    } catch (error) {
      console.error('Erreur lors de la sauvegarde devis:', error);
      alert('Erreur lors de la mise à jour du devis: ' + error.message);
    }
  };

  const handleDeleteInvoice = async () => {
    if (window.confirm('Êtes-vous sûr de vouloir supprimer cette facture ?')) {
      try {
        await axios.delete(`${API_CONFIG.BASE_URL}/invoices/${editingInvoice.id}`);
        await fetchDashboardData();
        handleCloseEditInvoiceModal();
        alert('Facture supprimée avec succès !');
      } catch (error) {
        console.error('Erreur lors de la suppression:', error);
        alert('Erreur lors de la suppression de la facture');
      }
    }
  };

  const handleDeleteQuote = async () => {
    if (window.confirm('Êtes-vous sûr de vouloir supprimer ce devis ?')) {
      try {
        await axios.delete(`${API_CONFIG.BASE_URL}/quotes/${editingQuote.id}`);
        await fetchDashboardData();
        handleCloseEditQuoteModal();
        alert('Devis supprimé avec succès !');
      } catch (error) {
        console.error('Erreur lors de la suppression:', error);
        alert('Erreur lors de la suppression du devis');
      }
    }
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('fr-FR');
  };

  const getStatusBadge = (status) => {
    const statusConfig = {
      'PAID': { class: 'badge-success', text: 'Payée' },
      'SENT': { class: 'badge-warning', text: 'En attente' },
      'ACCEPTED': { class: 'badge-success', text: 'Accepté' },
      'REJECTED': { class: 'badge-danger', text: 'Rejeté' }
    };
    
    const config = statusConfig[status] || { class: 'badge-secondary', text: status };
    return <span className={`badge ${config.class}`}>{config.text}</span>;
  };

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('fr-FR', {
      style: 'currency',
      currency: 'XOF'
    }).format(amount);
  };

  if (loading) {
    return (
      <div className="admin-dashboard">
        <div className="loading">Chargement...</div>
      </div>
    );
  }

  return (
    <div className="admin-dashboard">
      <header className="dashboard-header">
        <div className="header-title">
          <h1>Administration</h1>
          <div className="subtitle">Gestion complète de vos événements et décorations</div>
        </div>
        <div className="header-actions">
          <button className="btn btn-primary" onClick={handleNewInvoiceClick}>
            📄 Nouvelle facture
          </button>
          <button className="btn btn-secondary" onClick={handleNewQuoteClick}>
            📋 Nouveau devis
          </button>
        </div>
      </header>

      {/* Statistiques */}
      <section className="stats-section">
        <div className="stats-grid">
          <div className="stat-card">
            <div className="stat-icon">📅</div>
            <div className="stat-content">
              <h3>Événements en cours</h3>
              <div className="stat-value">{stats.events.count}</div>
              <div className="stat-change positive">+{stats.events.change}%</div>
            </div>
          </div>
          
          <div className="stat-card">
            <div className="stat-icon">🎨</div>
            <div className="stat-content">
              <h3>Produits disponibles</h3>
              <div className="stat-value">{stats.products.count}</div>
              <div className="stat-change positive">+{stats.products.change}%</div>
            </div>
          </div>
          
          <div className="stat-card">
            <div className="stat-icon">👥</div>
            <div className="stat-content">
              <h3>Employés actifs</h3>
              <div className="stat-value">{stats.staff.count}</div>
              <div className="stat-change positive">+{stats.staff.change}%</div>
            </div>
          </div>
          
          <div className="stat-card">
            <div className="stat-icon">💰</div>
            <div className="stat-content">
              <h3>Chiffre d'affaires</h3>
              <div className="stat-value">{formatCurrency(stats.revenue.amount)}</div>
              <div className="stat-change positive">+{stats.revenue.change}%</div>
            </div>
          </div>
        </div>
      </section>

      {/* Contenu principal */}
      <section className="main-content">
        <div className="content-grid">
          {/* Section vide pour l'instant - peut être utilisée pour d'autres widgets */}
          <div className="content-card">
            <div className="card-header">
              <h2>Tableau de bord</h2>
            </div>
            <div className="card-body">
              <p>Bienvenue dans votre tableau de bord d'administration.</p>
              <p>Utilisez les boutons en haut pour créer de nouvelles factures ou devis.</p>
            </div>
          </div>
        </div>
      </section>

      {/* Modals pour les devis */}
      {showQuoteModal && (
        <div className="modal-overlay">
          <div className="modal-content">
            <div className="modal-header">
              <h3>Nouveau Devis</h3>
              <button className="btn-close" onClick={handleCloseQuoteModal}>×</button>
            </div>
            <div className="modal-body">
              <form className="modal-form" onSubmit={handleQuoteSubmit}>
                <div className="form-row">
                  <div className="form-group">
                    <label>Nom du client *</label>
                    <input 
                      type="text" 
                      name="clientName" 
                      value={newQuote.clientName} 
                      onChange={handleQuoteInputChange} 
                      required 
                    />
                  </div>
                  <div className="form-group">
                    <label>Email du client</label>
                    <input 
                      type="email" 
                      name="clientEmail" 
                      value={newQuote.clientEmail} 
                      onChange={handleQuoteInputChange} 
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
                      onChange={handleQuoteInputChange} 
                    />
                  </div>
                  <div className="form-group">
                    <label>Date de l'événement</label>
                    <input 
                      type="datetime-local" 
                      name="eventDate" 
                      value={newQuote.eventDate} 
                      onChange={handleQuoteInputChange} 
                    />
                  </div>
                </div>

                <div className="form-row">
                  <div className="form-group">
                    <label>Type d'événement</label>
                    <select 
                      name="eventType" 
                      value={newQuote.eventType} 
                      onChange={handleQuoteInputChange}
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
                      onChange={handleQuoteInputChange} 
                    />
                  </div>
                </div>

                <div className="form-group">
                  <label>Articles</label>
                  {newQuote.items.map((item, index) => (
                    <div key={index} className="item-row">
                      <input
                        type="text"
                        placeholder="Description"
                        value={item.productName}
                        onChange={(e) => handleQuoteItemChange(index, 'productName', e.target.value)}
                        required
                      />
                      <input
                        type="number"
                        placeholder="Quantité"
                        value={item.quantity}
                        onChange={(e) => handleQuoteItemChange(index, 'quantity', parseInt(e.target.value) || 0)}
                        min="1"
                        required
                      />
                      <input
                        type="number"
                        placeholder="Prix unitaire"
                        value={item.unitPrice}
                        onChange={(e) => handleQuoteItemChange(index, 'unitPrice', parseFloat(e.target.value) || 0)}
                        min="0"
                        step="0.01"
                        className="price-input"
                        required
                      />
                      <div className="item-total">
                        {formatCurrency(item.quantity * item.unitPrice)}
                      </div>
                      <button
                        type="button"
                        className="btn-remove"
                        onClick={() => removeNewQuoteItem(index)}
                      >
                        Supprimer
                      </button>
                    </div>
                  ))}
                  <button type="button" className="btn-secondary" onClick={addNewQuoteItem}>
                    Ajouter un article
                  </button>
                </div>

                <div className="form-group">
                  <label>Notes</label>
                  <textarea 
                    name="notes" 
                    value={newQuote.notes} 
                    onChange={handleQuoteInputChange}
                    rows="3"
                  />
                </div>

                <div className="form-group">
                  <label>Montant total:</label>
                  <div className="total-amount">
                    {formatCurrency(calculateNewQuoteTotal())}
                  </div>
                </div>

                <div className="form-actions">
                  <button type="button" className="btn-secondary" onClick={handleCloseQuoteModal}>Annuler</button>
                  <button type="submit" className="btn-primary">Créer le devis</button>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}

      {/* Modals pour les factures */}
      {showInvoiceModal && (
        <div className="modal-overlay">
          <div className="modal-content">
            <div className="modal-header">
              <h3>Nouvelle Facture</h3>
              <button className="btn-close" onClick={handleCloseInvoiceModal}>×</button>
            </div>
            <div className="modal-body">
              <form className="modal-form" onSubmit={handleInvoiceSubmit}>
                <div className="form-row">
                  <div className="form-group">
                    <label>Nom du client *</label>
                    <input 
                      type="text" 
                      name="clientName" 
                      value={newInvoice.clientName} 
                      onChange={handleInvoiceInputChange} 
                      required 
                    />
                  </div>
                  <div className="form-group">
                    <label>Email du client</label>
                    <input 
                      type="email" 
                      name="clientEmail" 
                      value={newInvoice.clientEmail} 
                      onChange={handleInvoiceInputChange} 
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
                      onChange={handleInvoiceInputChange} 
                    />
                  </div>
                  <div className="form-group">
                    <label>Date de l'événement</label>
                    <input 
                      type="datetime-local" 
                      name="eventDate" 
                      value={newInvoice.eventDate} 
                      onChange={handleInvoiceInputChange} 
                    />
                  </div>
                </div>

                <div className="form-row">
                  <div className="form-group">
                    <label>Type d'événement</label>
                    <select 
                      name="eventType" 
                      value={newInvoice.eventType} 
                      onChange={handleInvoiceInputChange}
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
                      value={newInvoice.eventLocation} 
                      onChange={handleInvoiceInputChange} 
                    />
                  </div>
                </div>

                <div className="form-group">
                  <label>Articles</label>
                  {newInvoice.items.map((item, index) => (
                    <div key={index} className="item-row">
                      <input
                        type="text"
                        placeholder="Description"
                        value={item.productName}
                        onChange={(e) => handleInvoiceItemChange(index, 'productName', e.target.value)}
                        required
                      />
                      <input
                        type="number"
                        placeholder="Quantité"
                        value={item.quantity}
                        onChange={(e) => handleInvoiceItemChange(index, 'quantity', parseInt(e.target.value) || 0)}
                        min="1"
                        required
                      />
                      <input
                        type="number"
                        placeholder="Prix unitaire"
                        value={item.unitPrice}
                        onChange={(e) => handleInvoiceItemChange(index, 'unitPrice', parseFloat(e.target.value) || 0)}
                        min="0"
                        step="0.01"
                        className="price-input"
                        required
                      />
                      <div className="item-total">
                        {formatCurrency(item.quantity * item.unitPrice)}
                      </div>
                      <button
                        type="button"
                        className="btn-remove"
                        onClick={() => removeNewInvoiceItem(index)}
                      >
                        Supprimer
                      </button>
                    </div>
                  ))}
                  <button type="button" className="btn-secondary" onClick={addNewInvoiceItem}>
                    Ajouter un article
                  </button>
                </div>

                <div className="form-group">
                  <label>Notes</label>
                  <textarea 
                    name="notes" 
                    value={newInvoice.notes} 
                    onChange={handleInvoiceInputChange}
                    rows="3"
                  />
                </div>

                <div className="form-group">
                  <label>Montant total:</label>
                  <div className="total-amount">
                    {formatCurrency(calculateNewInvoiceTotal())}
                  </div>
                </div>

                <div className="form-actions">
                  <button type="button" className="btn-secondary" onClick={handleCloseInvoiceModal}>Annuler</button>
                  <button type="submit" className="btn-primary">Créer la facture</button>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}

      {/* Modal de visualisation des factures */}
      {showViewInvoiceModal && editingInvoice && (
        <div className="modal-overlay">
          <div className="modal-content large-modal">
            <div className="modal-header">
              <h3>Facture #{editingInvoice.invoiceNumber}</h3>
              <button className="btn-close" onClick={handleCloseViewInvoiceModal}>×</button>
            </div>
            <div className="modal-body">
              <div className="invoice-header">
                <div>
                  <strong>Client :</strong> {editingInvoice.clientName}<br/>
                  <strong>Email :</strong> {editingInvoice.clientEmail}<br/>
                  <strong>Téléphone :</strong> {editingInvoice.clientPhone}<br/>
                  <strong>Événement :</strong> {editingInvoice.eventType} le {formatDate(editingInvoice.eventDate)}<br/>
                  <strong>Lieu :</strong> {editingInvoice.eventLocation}
                </div>
                <div style={{textAlign:'right'}}>
                  <strong>Date de création :</strong> {formatDate(editingInvoice.createdAt)}<br/>
                  <strong>Statut :</strong> {getStatusBadge(editingInvoice.status)}<br/>
                  <strong>Montant total :</strong> {formatCurrency(editingInvoice.totalAmount)}
                </div>
              </div>
              <hr/>
              <h4>Articles</h4>
              <table className="items-table">
                <thead>
                  <tr>
                    <th>Description</th>
                    <th>Quantité</th>
                    <th>Prix unitaire</th>
                    <th>Total</th>
                  </tr>
                </thead>
                <tbody>
                  {(editingInvoice.items || []).map((item, idx) => (
                    <tr key={idx}>
                      <td>{item.productName || item.description}</td>
                      <td>{item.quantity}</td>
                      <td>{formatCurrency(item.unitPrice)}</td>
                      <td>{formatCurrency(item.totalPrice)}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
              <div className="invoice-totals">
                <div><strong>Total :</strong> {formatCurrency(editingInvoice.totalAmount)}</div>
              </div>
              {editingInvoice.notes && (
                <div className="invoice-notes"><strong>Notes :</strong> {editingInvoice.notes}</div>
              )}
            </div>
            <div className="modal-footer">
              <button className="btn btn-primary" onClick={() => { handleCloseViewInvoiceModal(); handleEditInvoice(editingInvoice); }}>Modifier</button>
              <button className="btn btn-secondary" onClick={handleCloseViewInvoiceModal}>Fermer</button>
            </div>
          </div>
        </div>
      )}

      {/* Modal d'édition des factures */}
      {showEditInvoiceModal && editingInvoice && (
        <div className="modal-overlay">
          <div className="modal-content large-modal">
            <div className="modal-header">
              <h3>Modifier la Facture #{editingInvoice.invoiceNumber}</h3>
              <button className="btn-close" onClick={handleCloseEditInvoiceModal}>×</button>
            </div>
            <div className="modal-body">
              <form className="edit-form" onSubmit={e => { e.preventDefault(); handleSaveInvoice(); }}>
                <div className="form-row">
                  <div className="form-group">
                    <label>Nom du client *</label>
                    <input 
                      type="text" 
                      name="clientName" 
                      value={editingInvoice.clientName || ''} 
                      onChange={handleEditInvoiceInputChange} 
                      required 
                    />
                  </div>
                  <div className="form-group">
                    <label>Email du client</label>
                    <input 
                      type="email" 
                      name="clientEmail" 
                      value={editingInvoice.clientEmail || ''} 
                      onChange={handleEditInvoiceInputChange} 
                    />
                  </div>
                </div>

                <div className="form-row">
                  <div className="form-group">
                    <label>Téléphone</label>
                    <input 
                      type="text" 
                      name="clientPhone" 
                      value={editingInvoice.clientPhone || ''} 
                      onChange={handleEditInvoiceInputChange} 
                    />
                  </div>
                  <div className="form-group">
                    <label>Date de l'événement</label>
                    <input 
                      type="datetime-local" 
                      name="eventDate" 
                      value={editingInvoice.eventDate ? editingInvoice.eventDate.split('T')[0] : ''} 
                      onChange={handleEditInvoiceInputChange} 
                    />
                  </div>
                </div>

                <div className="form-row">
                  <div className="form-group">
                    <label>Type d'événement</label>
                    <select 
                      name="eventType" 
                      value={editingInvoice.eventType || ''} 
                      onChange={handleEditInvoiceInputChange}
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
                      value={editingInvoice.eventLocation || ''} 
                      onChange={handleEditInvoiceInputChange} 
                    />
                  </div>
                </div>

                <div className="form-group">
                  <label>Articles</label>
                  {(editingInvoice.items || []).map((item, index) => (
                    <div key={index} className="item-row">
                      <input
                        type="text"
                        placeholder="Description"
                        value={item.productName || item.description || ''}
                        onChange={(e) => handleEditInvoiceItemChange(index, 'productName', e.target.value)}
                        required
                      />
                      <input
                        type="number"
                        placeholder="Quantité"
                        value={item.quantity || 1}
                        onChange={(e) => handleEditInvoiceItemChange(index, 'quantity', parseInt(e.target.value) || 0)}
                        min="1"
                        required
                      />
                      <input
                        type="number"
                        placeholder="Prix unitaire"
                        value={item.unitPrice || 0}
                        onChange={(e) => handleEditInvoiceItemChange(index, 'unitPrice', parseFloat(e.target.value) || 0)}
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
                        onClick={() => removeEditInvoiceItem(index)}
                        style={{
                          display: 'inline-block',
                          visibility: 'visible',
                          backgroundColor: '#dc3545',
                          color: 'white',
                          border: 'none',
                          padding: '8px 12px',
                          borderRadius: '4px',
                          cursor: 'pointer',
                          fontSize: '12px',
                          fontWeight: 'bold'
                        }}
                      >
                        🗑️ Supprimer
                      </button>
                    </div>
                  ))}
                  <button type="button" className="btn-secondary" onClick={addEditInvoiceItem}>
                    Ajouter un article
                  </button>
                </div>

                <div className="form-group">
                  <label>Montant total:</label>
                  <div className="total-amount">
                    {formatCurrency(calculateInvoiceTotal())}
                  </div>
                </div>

                {/* ✅ CORRECTION : Menu déroulant des statuts des factures avec style forcé */}
                <div className="form-group" style={{ 
                  display: 'block', 
                  visibility: 'visible', 
                  marginBottom: '15px',
                  padding: '10px',
                  backgroundColor: '#f8f9fa',
                  border: '2px solid #28a745',
                  borderRadius: '8px'
                }}>
                  <label style={{ 
                    display: 'block', 
                    marginBottom: '8px',
                    fontWeight: 'bold',
                    color: '#333'
                  }}>
                    Statut de la facture
                  </label>
                  <select 
                    name="status" 
                    value={editingInvoice.status || 'DRAFT'} 
                    onChange={handleEditInvoiceInputChange}
                    style={{ 
                      display: 'block', 
                      visibility: 'visible', 
                      width: '100%',
                      padding: '10px',
                      border: '2px solid #28a745',
                      borderRadius: '6px',
                      fontSize: '14px',
                      backgroundColor: 'white'
                    }}
                  >
                    <option value="DRAFT">📝 Brouillon</option>
                    <option value="SENT">📤 Envoyée</option>
                    <option value="PAID">💰 Payée</option>
                    <option value="OVERDUE">⏰ En retard</option>
                    <option value="CANCELLED">❌ Annulée</option>
                  </select>
                </div>

                <div className="form-actions">
                  <button type="button" className="btn-danger" onClick={handleDeleteInvoice}>Supprimer</button>
                  <button type="button" className="btn-secondary" onClick={handleCloseEditInvoiceModal}>Annuler</button>
                  <button type="submit" className="btn-primary">Sauvegarder</button>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}

      {/* Modal de visualisation des devis */}
      {showViewQuoteModal && editingQuote && (
        <div className="modal-overlay">
          <div className="modal-content large-modal">
            <div className="modal-header">
              <h3>Devis #{editingQuote.quoteNumber}</h3>
              <button className="btn-close" onClick={handleCloseViewQuoteModal}>×</button>
            </div>
            <div className="modal-body">
              <div className="invoice-header">
                <div>
                  <strong>Client :</strong> {editingQuote.clientName}<br/>
                  <strong>Email :</strong> {editingQuote.clientEmail}<br/>
                  <strong>Téléphone :</strong> {editingQuote.clientPhone}<br/>
                  <strong>Événement :</strong> {editingQuote.eventType} le {formatDate(editingQuote.eventDate)}<br/>
                  <strong>Lieu :</strong> {editingQuote.eventLocation}
                </div>
                <div style={{textAlign:'right'}}>
                  <strong>Date de création :</strong> {formatDate(editingQuote.createdAt)}<br/>
                  <strong>Statut :</strong> {getStatusBadge(editingQuote.status)}<br/>
                  <strong>Montant total :</strong> {formatCurrency(editingQuote.totalAmount)}
                </div>
              </div>
              <hr/>
              <h4>Articles</h4>
              <table className="items-table">
                <thead>
                  <tr>
                    <th>Description</th>
                    <th>Quantité</th>
                    <th>Prix unitaire</th>
                    <th>Total</th>
                  </tr>
                </thead>
                <tbody>
                  {(editingQuote.items || []).map((item, idx) => (
                    <tr key={idx}>
                      <td>{item.productName || item.description}</td>
                      <td>{item.quantity}</td>
                      <td>{formatCurrency(item.unitPrice)}</td>
                      <td>{formatCurrency(item.totalPrice)}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
              <div className="invoice-totals">
                <div><strong>Total :</strong> {formatCurrency(editingQuote.totalAmount)}</div>
              </div>
              {editingQuote.notes && (
                <div className="invoice-notes"><strong>Notes :</strong> {editingQuote.notes}</div>
              )}
            </div>
            <div className="modal-footer">
              <button className="btn btn-primary" onClick={() => { handleCloseViewQuoteModal(); handleEditQuote(editingQuote); }}>Modifier</button>
              <button className="btn btn-secondary" onClick={handleCloseViewQuoteModal}>Fermer</button>
            </div>
          </div>
        </div>
      )}

      {/* Modal d'édition des devis */}
      {showEditQuoteModal && editingQuote && (
        <div className="modal-overlay">
          <div className="modal-content large-modal">
            <div className="modal-header">
              <h3>Modifier le Devis #{editingQuote.quoteNumber}</h3>
              <button className="btn-close" onClick={handleCloseEditQuoteModal}>×</button>
            </div>
            <div className="modal-body">
              <form className="edit-form" onSubmit={e => { e.preventDefault(); handleSaveQuote(); }}>
                <div className="form-row">
                  <div className="form-group">
                    <label>Nom du client *</label>
                    <input 
                      type="text" 
                      name="clientName" 
                      value={editingQuote.clientName || ''} 
                      onChange={handleEditQuoteInputChange} 
                      required 
                    />
                  </div>
                  <div className="form-group">
                    <label>Email du client</label>
                    <input 
                      type="email" 
                      name="clientEmail" 
                      value={editingQuote.clientEmail || ''} 
                      onChange={handleEditQuoteInputChange} 
                    />
                  </div>
                </div>

                <div className="form-row">
                  <div className="form-group">
                    <label>Téléphone</label>
                    <input 
                      type="text" 
                      name="clientPhone" 
                      value={editingQuote.clientPhone || ''} 
                      onChange={handleEditQuoteInputChange} 
                    />
                  </div>
                  <div className="form-group">
                    <label>Date de l'événement</label>
                    <input 
                      type="datetime-local" 
                      name="eventDate" 
                      value={editingQuote.eventDate ? editingQuote.eventDate.split('T')[0] : ''} 
                      onChange={handleEditQuoteInputChange} 
                    />
                  </div>
                </div>

                <div className="form-row">
                  <div className="form-group">
                    <label>Type d'événement</label>
                    <select 
                      name="eventType" 
                      value={editingQuote.eventType || ''} 
                      onChange={handleEditQuoteInputChange}
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
                      value={editingQuote.eventLocation || ''} 
                      onChange={handleEditQuoteInputChange} 
                    />
                  </div>
                </div>

                <div className="form-group">
                  <label>Articles</label>
                  {(editingQuote.items || []).map((item, index) => (
                    <div key={index} className="item-row">
                      <input
                        type="text"
                        placeholder="Description"
                        value={item.productName || item.description || ''}
                        onChange={(e) => handleEditQuoteItemChange(index, 'productName', e.target.value)}
                        required
                      />
                      <input
                        type="number"
                        placeholder="Quantité"
                        value={item.quantity || 1}
                        onChange={(e) => handleEditQuoteItemChange(index, 'quantity', parseInt(e.target.value) || 0)}
                        min="1"
                        required
                      />
                      <input
                        type="number"
                        placeholder="Prix unitaire"
                        value={item.unitPrice || 0}
                        onChange={(e) => handleEditQuoteItemChange(index, 'unitPrice', parseFloat(e.target.value) || 0)}
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
                        onClick={() => removeEditQuoteItem(index)}
                        style={{
                          display: 'inline-block',
                          visibility: 'visible',
                          backgroundColor: '#dc3545',
                          color: 'white',
                          border: 'none',
                          padding: '8px 12px',
                          borderRadius: '4px',
                          cursor: 'pointer',
                          fontSize: '12px',
                          fontWeight: 'bold'
                        }}
                      >
                        🗑️ Supprimer
                      </button>
                    </div>
                  ))}
                  <button type="button" className="btn-secondary" onClick={addEditQuoteItem}>
                    Ajouter un article
                  </button>
                </div>

                <div className="form-group">
                  <label>Montant total:</label>
                  <div className="total-amount">
                    {formatCurrency(calculateQuoteTotal())}
                  </div>
                </div>

                <div className="form-actions">
                  <button type="button" className="btn-secondary" onClick={handleCloseEditQuoteModal}>Annuler</button>
                  <button type="submit" className="btn-primary">Sauvegarder</button>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminDashboard; 