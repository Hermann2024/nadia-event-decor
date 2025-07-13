import React, { useState, useEffect } from 'react';
import './QuoteRequestManagement.css';

const QuoteRequestManagement = () => {
    const [quoteRequests, setQuoteRequests] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [selectedRequest, setSelectedRequest] = useState(null);
    const [showModal, setShowModal] = useState(false);
    const [stats, setStats] = useState({});
    const [filter, setFilter] = useState('all');
    const [staff, setStaff] = useState([]);

    const API_BASE_URL = 'http://localhost:8082/api';

    useEffect(() => {
        fetchQuoteRequests();
        fetchStats();
        fetchStaff();
    }, []);

    const fetchQuoteRequests = async () => {
        try {
            setLoading(true);
            const response = await fetch(`${API_BASE_URL}/admin/quote-requests`);
            if (!response.ok) throw new Error('Erreur lors de la récupération des demandes');
            const data = await response.json();
            setQuoteRequests(data);
        } catch (err) {
            setError(err.message);
        } finally {
            setLoading(false);
        }
    };

    const fetchStats = async () => {
        try {
            const response = await fetch(`${API_BASE_URL}/admin/quote-requests/stats`);
            if (response.ok) {
                const data = await response.json();
                setStats(data.stats);
            }
        } catch (err) {
            console.error('Erreur lors de la récupération des statistiques:', err);
        }
    };

    const fetchStaff = async () => {
        try {
            const response = await fetch(`${API_BASE_URL}/admin/staff`);
            if (response.ok) {
                const data = await response.json();
                setStaff(data);
            }
        } catch (err) {
            console.error('Erreur lors de la récupération du personnel:', err);
        }
    };

    const updateRequestStatus = async (requestId, status) => {
        try {
            const response = await fetch(`${API_BASE_URL}/admin/quote-requests/${requestId}/status/${status}`, {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json' }
            });
            if (response.ok) {
                fetchQuoteRequests();
                fetchStats();
            }
        } catch (err) {
            setError('Erreur lors de la mise à jour du statut');
        }
    };

    const assignRequest = async (requestId, staffId) => {
        try {
            const response = await fetch(`${API_BASE_URL}/admin/quote-requests/${requestId}/assign/${staffId}`, {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json' }
            });
            if (response.ok) {
                fetchQuoteRequests();
                setShowModal(false);
            }
        } catch (err) {
            setError('Erreur lors de l\'assignation');
        }
    };

    const getStatusColor = (status) => {
        const colors = {
            'NEW': '#ff9800',
            'ASSIGNED': '#2196f3',
            'IN_PROGRESS': '#9c27b0',
            'QUOTE_PREPARED': '#4caf50',
            'SENT': '#00bcd4',
            'ACCEPTED': '#4caf50',
            'REJECTED': '#f44336',
            'CANCELLED': '#9e9e9e'
        };
        return colors[status] || '#666';
    };

    const getPriorityColor = (priority) => {
        const colors = {
            'LOW': '#4caf50',
            'MEDIUM': '#ff9800',
            'HIGH': '#f44336',
            'URGENT': '#9c27b0'
        };
        return colors[priority] || '#666';
    };

    const formatDate = (dateString) => {
        if (!dateString) return 'Non définie';
        return new Date(dateString).toLocaleDateString('fr-FR');
    };

    const filteredRequests = quoteRequests.filter(request => {
        if (filter === 'all') return true;
        return request.status === filter;
    });

    if (loading) return <div className="loading">Chargement des demandes de devis...</div>;
    if (error) return <div className="error">Erreur: {error}</div>;

    return (
        <div className="quote-request-management">
            <div className="header">
                <h1>Gestion des Demandes de Devis</h1>
                <div className="stats-grid">
                    <div className="stat-card">
                        <h3>Nouvelles</h3>
                        <span className="stat-number">{stats.new || 0}</span>
                    </div>
                    <div className="stat-card">
                        <h3>Assignées</h3>
                        <span className="stat-number">{stats.assigned || 0}</span>
                    </div>
                    <div className="stat-card">
                        <h3>En cours</h3>
                        <span className="stat-number">{stats.inProgress || 0}</span>
                    </div>
                    <div className="stat-card">
                        <h3>Devis préparés</h3>
                        <span className="stat-number">{stats.quotePrepared || 0}</span>
                    </div>
                    <div className="stat-card">
                        <h3>En retard</h3>
                        <span className="stat-number urgent">{stats.overdue || 0}</span>
                    </div>
                </div>
            </div>

            <div className="filters">
                <select value={filter} onChange={(e) => setFilter(e.target.value)}>
                    <option value="all">Toutes les demandes</option>
                    <option value="NEW">Nouvelles</option>
                    <option value="ASSIGNED">Assignées</option>
                    <option value="IN_PROGRESS">En cours</option>
                    <option value="QUOTE_PREPARED">Devis préparés</option>
                    <option value="SENT">Envoyés</option>
                    <option value="ACCEPTED">Acceptés</option>
                    <option value="REJECTED">Rejetés</option>
                    <option value="CANCELLED">Annulés</option>
                </select>
                <button onClick={fetchQuoteRequests} className="refresh-btn">
                    🔄 Actualiser
                </button>
            </div>

            <div className="requests-grid">
                {filteredRequests.map(request => (
                    <div key={request.id} className="request-card">
                        <div className="request-header">
                            <h3>{request.requestNumber}</h3>
                            <div className="status-badge" style={{ backgroundColor: getStatusColor(request.status) }}>
                                {request.status}
                            </div>
                        </div>
                        
                        <div className="request-details">
                            <p><strong>Client:</strong> {request.clientName}</p>
                            <p><strong>Email:</strong> {request.clientEmail}</p>
                            <p><strong>Téléphone:</strong> {request.clientPhone}</p>
                            <p><strong>Type d'événement:</strong> {request.eventType}</p>
                            <p><strong>Date:</strong> {formatDate(request.eventDate)}</p>
                            <p><strong>Lieu:</strong> {request.eventLocation}</p>
                            <p><strong>Invités:</strong> {request.guestCount || 'Non défini'}</p>
                            <p><strong>Budget:</strong> {request.budgetRange}</p>
                            <p><strong>Priorité:</strong> 
                                <span className="priority-badge" style={{ backgroundColor: getPriorityColor(request.priority) }}>
                                    {request.priority}
                                </span>
                            </p>
                            <p><strong>Assigné à:</strong> {request.assignedTo ? `${request.assignedTo.firstName} ${request.assignedTo.lastName}` : 'Non assigné'}</p>
                            <p><strong>Créé le:</strong> {formatDate(request.createdAt)}</p>
                        </div>

                        {request.description && (
                            <div className="description">
                                <strong>Description:</strong>
                                <p>{request.description}</p>
                            </div>
                        )}

                        <div className="request-actions">
                            <button 
                                onClick={() => {
                                    setSelectedRequest(request);
                                    setShowModal(true);
                                }}
                                className="action-btn assign-btn"
                            >
                                Assigner
                            </button>
                            <button
                                className="action-btn"
                                style={{ background: '#667eea', color: 'white' }}
                                onClick={async () => {
                                    try {
                                        const response = await fetch(`${API_BASE_URL}/admin/quotes/from-request/${request.id}`, {
                                            method: 'POST',
                                            headers: { 'Content-Type': 'application/json' }
                                        });
                                        if (response.ok) {
                                            alert('Devis créé avec succès !');
                                            // Optionnel : rafraîchir la liste des devis si besoin
                                        } else {
                                            alert('Erreur lors de la création du devis');
                                        }
                                    } catch (e) {
                                        alert('Erreur lors de la création du devis');
                                    }
                                }}
                            >
                                Créer un devis
                            </button>
                            <select 
                                value={request.status} 
                                onChange={(e) => updateRequestStatus(request.id, e.target.value)}
                                className="status-select"
                            >
                                <option value="NEW">Nouvelle</option>
                                <option value="ASSIGNED">Assignée</option>
                                <option value="IN_PROGRESS">En cours</option>
                                <option value="QUOTE_PREPARED">Devis préparé</option>
                                <option value="SENT">Envoyé</option>
                                <option value="ACCEPTED">Accepté</option>
                                <option value="REJECTED">Rejeté</option>
                                <option value="CANCELLED">Annulé</option>
                            </select>
                        </div>
                    </div>
                ))}
            </div>

            {showModal && selectedRequest && (
                <div className="modal-overlay">
                    <div className="modal">
                        <h2>Assigner la demande {selectedRequest.requestNumber}</h2>
                        <div className="staff-list">
                            {staff.map(member => (
                                <button
                                    key={member.id}
                                    onClick={() => assignRequest(selectedRequest.id, member.id)}
                                    className="staff-member-btn"
                                >
                                    {member.firstName} {member.lastName} - {member.department}
                                </button>
                            ))}
                        </div>
                        <button onClick={() => setShowModal(false)} className="close-btn">
                            Annuler
                        </button>
                    </div>
                </div>
            )}
        </div>
    );
};

export default QuoteRequestManagement; 