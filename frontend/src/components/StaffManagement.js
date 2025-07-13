import React, { useState, useEffect } from 'react';
import { toast } from 'react-toastify';
import './StaffManagement.css';
import API_CONFIG from '../config/api';

const StaffManagement = () => {
  const [staff, setStaff] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [showForm, setShowForm] = useState(false);
  const [editingStaff, setEditingStaff] = useState(null);
  const [stats, setStats] = useState({});
  const [searchQuery, setSearchQuery] = useState('');
  const [filterDepartment, setFilterDepartment] = useState('');
  const [filterStatus, setFilterStatus] = useState('');

  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
    position: '',
    department: '',
    salary: '',
    hireDate: new Date().toISOString().split('T')[0],
    status: 'ACTIVE',
    address: '',
    emergencyContact: '',
    emergencyPhone: '',
    notes: ''
  });

  const departments = ['Direction', 'Décoration', 'Événementiel', 'Technique', 'Commercial', 'Administration'];
  const positions = ['Directeur', 'Décorateur', 'Coordonnateur', 'Technicien', 'Commercial', 'Assistant'];
  const statuses = ['ACTIVE', 'INACTIVE', 'ON_LEAVE', 'TERMINATED'];

  useEffect(() => {
    fetchStaff();
    fetchStats();
  }, []);

  const fetchStaff = async () => {
    try {
      setLoading(true);
      const response = await fetch(`${API_CONFIG.BASE_URL}/staff`);
      if (!response.ok) throw new Error('Erreur lors du chargement du personnel');
      const data = await response.json();
      setStaff(data);
    } catch (err) {
      toast.error('Erreur lors du chargement du personnel');
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const fetchStats = async () => {
    try {
      const response = await fetch(`${API_CONFIG.BASE_URL}/staff/stats`);
      if (response.ok) {
        const data = await response.json();
        setStats(data);
      }
    } catch (err) {
      console.error('Erreur lors du chargement des statistiques:', err);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const dataToSend = {
        ...formData,
        salary: formData.salary ? formData.salary.toString() : null,
        hireDate: formData.hireDate ? `${formData.hireDate}T00:00:00` : null
      };

      if (!dataToSend.salary || parseFloat(dataToSend.salary) <= 0) {
        toast.error("Le salaire doit être supérieur à 0");
        return;
      }

      const url = editingStaff 
        ? `${API_CONFIG.BASE_URL}/staff/${editingStaff.id}`
        : `${API_CONFIG.BASE_URL}/staff`;
      
      const method = editingStaff ? 'PUT' : 'POST';
      
      const response = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(dataToSend)
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Erreur lors de la sauvegarde');
      }

      const result = await response.json();
      
      if (editingStaff) {
        toast.success('Membre du personnel modifié avec succès !');
      } else {
        toast.success('Membre du personnel ajouté avec succès !');
      }

      await fetchStaff();
      await fetchStats();
      resetForm();
      setShowForm(false);
      setError(null);
    } catch (err) {
      toast.error(err.message);
      setError(err.message);
    }
  };

  const handleDelete = async (id) => {
    const confirmed = window.confirm('Êtes-vous sûr de vouloir supprimer ce membre du personnel ?');
    if (!confirmed) return;
    
    try {
      const response = await fetch(`${API_CONFIG.BASE_URL}/staff/${id}`, {
        method: 'DELETE'
      });
      
      if (!response.ok) throw new Error('Erreur lors de la suppression');
      
      toast.success('Membre du personnel supprimé avec succès !');
      await fetchStaff();
      await fetchStats();
    } catch (err) {
      toast.error('Erreur lors de la suppression');
      setError(err.message);
    }
  };

  const handleEdit = (staffMember) => {
    setEditingStaff(staffMember);
    setFormData({
      firstName: staffMember.firstName,
      lastName: staffMember.lastName,
      email: staffMember.email,
      phone: staffMember.phone,
      position: staffMember.position,
      department: staffMember.department,
      salary: staffMember.salary?.toString() || '',  // Convertir en chaîne pour l'input
      hireDate: staffMember.hireDate ? staffMember.hireDate.split('T')[0] : new Date().toISOString().split('T')[0],
      status: staffMember.status,
      address: staffMember.address || '',
      emergencyContact: staffMember.emergencyContact || '',
      emergencyPhone: staffMember.emergencyPhone || '',
      notes: staffMember.notes || ''
    });
    setShowForm(true);
  };

  const resetForm = () => {
    setFormData({
      firstName: '',
      lastName: '',
      email: '',
      phone: '',
      position: '',
      department: '',
      salary: '',
      hireDate: new Date().toISOString().split('T')[0],
      status: 'ACTIVE',
      address: '',
      emergencyContact: '',
      emergencyPhone: '',
      notes: ''
    });
    setEditingStaff(null);
  };

  const filteredStaff = staff.filter(member => {
    const matchesSearch = member.firstName.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         member.lastName.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         member.email.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesDepartment = !filterDepartment || member.department === filterDepartment;
    const matchesStatus = !filterStatus || member.status === filterStatus;
    
    return matchesSearch && matchesDepartment && matchesStatus;
  });

  if (loading) return <div className="loading">Chargement du personnel...</div>;
  if (error) return <div className="error">Erreur: {error}</div>;

  return (
    <div className="staff-management">
      <div className="staff-header">
        <h2>Gestion du Personnel</h2>
        <button className="btn-primary" onClick={() => setShowForm(true)}>
          Ajouter un membre
        </button>
      </div>

      {/* Statistiques */}
      <div className="stats-grid">
        <div className="stat-card total-staff">
          <h3>Total Personnel</h3>
          <p className="stat-number">{stats.totalStaff || 0}</p>
        </div>
        
        <div className="stat-card active-staff">
          <h3>Personnel Actif</h3>
          <p className="stat-number">{stats.activeStaff || 0}</p>
        </div>
        
        <div className="stat-card average-salary">
          <h3>Masse Salariale</h3>
          <p className="stat-number">{stats.totalSalary ? `${stats.totalSalary.toLocaleString()} FCFA` : '0 FCFA'}</p>
        </div>
      </div>

      {/* Filtres */}
      <div className="filters">
        <input
          type="text"
          placeholder="Rechercher..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="search-input"
        />
        <select value={filterDepartment} onChange={(e) => setFilterDepartment(e.target.value)}>
          <option value="">Tous les départements</option>
          {departments.map(dept => (
            <option key={dept} value={dept}>{dept}</option>
          ))}
        </select>
        <select value={filterStatus} onChange={(e) => setFilterStatus(e.target.value)}>
          <option value="">Tous les statuts</option>
          {statuses.map(status => (
            <option key={status} value={status}>{status}</option>
          ))}
        </select>
      </div>

      {/* Formulaire */}
      {showForm && (
        <div className="modal-overlay">
          <div className="modal">
            <div className="modal-header">
              <h3>{editingStaff ? 'Modifier' : 'Ajouter'} un membre du personnel</h3>
              <button onClick={() => { setShowForm(false); resetForm(); }}>&times;</button>
            </div>
            <form onSubmit={handleSubmit} className="staff-form">
              <div className="form-row">
                <div className="form-group">
                  <label>Prénom *</label>
                  <input
                    type="text"
                    value={formData.firstName}
                    onChange={(e) => setFormData({...formData, firstName: e.target.value})}
                    required
                  />
                </div>
                <div className="form-group">
                  <label>Nom *</label>
                  <input
                    type="text"
                    value={formData.lastName}
                    onChange={(e) => setFormData({...formData, lastName: e.target.value})}
                    required
                  />
                </div>
              </div>
              
              <div className="form-row">
                <div className="form-group">
                  <label>Email *</label>
                  <input
                    type="email"
                    value={formData.email}
                    onChange={(e) => setFormData({...formData, email: e.target.value})}
                    required
                  />
                </div>
                <div className="form-group">
                  <label>Téléphone *</label>
                  <input
                    type="tel"
                    value={formData.phone}
                    onChange={(e) => setFormData({...formData, phone: e.target.value})}
                    required
                  />
                </div>
              </div>

              <div className="form-row">
                <div className="form-group">
                  <label>Poste *</label>
                  <select
                    value={formData.position}
                    onChange={(e) => setFormData({...formData, position: e.target.value})}
                    required
                  >
                    <option value="">Sélectionner un poste</option>
                    {positions.map(pos => (
                      <option key={pos} value={pos}>{pos}</option>
                    ))}
                  </select>
                </div>
                <div className="form-group">
                  <label>Département *</label>
                  <select
                    value={formData.department}
                    onChange={(e) => setFormData({...formData, department: e.target.value})}
                    required
                  >
                    <option value="">Sélectionner un département</option>
                    {departments.map(dept => (
                      <option key={dept} value={dept}>{dept}</option>
                    ))}
                  </select>
                </div>
              </div>

              <div className="form-row">
                <div className="form-group">
                  <label>Salaire (FCFA) *</label>
                  <input
                    type="number"
                    value={formData.salary}
                    onChange={(e) => setFormData({...formData, salary: e.target.value})}
                    required
                  />
                </div>
                <div className="form-group">
                  <label>Date d'embauche *</label>
                  <input
                    type="date"
                    value={formData.hireDate}
                    onChange={(e) => setFormData({...formData, hireDate: e.target.value})}
                    required
                  />
                </div>
              </div>

              <div className="form-row">
                <div className="form-group">
                  <label>Statut</label>
                  <select
                    value={formData.status}
                    onChange={(e) => setFormData({...formData, status: e.target.value})}
                  >
                    {statuses.map(status => (
                      <option key={status} value={status}>{status}</option>
                    ))}
                  </select>
                </div>
                <div className="form-group">
                  <label>Adresse</label>
                  <input
                    type="text"
                    value={formData.address}
                    onChange={(e) => setFormData({...formData, address: e.target.value})}
                  />
                </div>
              </div>

              <div className="form-row">
                <div className="form-group">
                  <label>Contact d'urgence</label>
                  <input
                    type="text"
                    value={formData.emergencyContact}
                    onChange={(e) => setFormData({...formData, emergencyContact: e.target.value})}
                  />
                </div>
                <div className="form-group">
                  <label>Téléphone d'urgence</label>
                  <input
                    type="tel"
                    value={formData.emergencyPhone}
                    onChange={(e) => setFormData({...formData, emergencyPhone: e.target.value})}
                  />
                </div>
              </div>

              <div className="form-group">
                <label>Notes</label>
                <textarea
                  value={formData.notes}
                  onChange={(e) => setFormData({...formData, notes: e.target.value})}
                  rows="3"
                />
              </div>

              <div className="form-actions">
                <button type="submit" className="btn-primary">
                  {editingStaff ? 'Modifier' : 'Ajouter'}
                </button>
                <button type="button" onClick={() => { setShowForm(false); resetForm(); }} className="btn-secondary">
                  Annuler
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Liste du personnel */}
      <div className="staff-list">
        <table>
          <thead>
            <tr>
              <th>Nom</th>
              <th>Email</th>
              <th>Poste</th>
              <th>Département</th>
              <th>Salaire</th>
              <th>Statut</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {filteredStaff.map(member => (
              <tr key={member.id}>
                <td>{member.firstName} {member.lastName}</td>
                <td>{member.email}</td>
                <td>{member.position}</td>
                <td>{member.department}</td>
                <td>{member.salary?.toLocaleString()} FCFA</td>
                <td>
                  <span className={`status-badge status-${member.status.toLowerCase()}`}>
                    {member.status}
                  </span>
                </td>
                <td>
                  <button onClick={() => handleEdit(member)} className="btn-edit">Modifier</button>
                  <button onClick={() => handleDelete(member.id)} className="btn-delete">Supprimer</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default StaffManagement; 