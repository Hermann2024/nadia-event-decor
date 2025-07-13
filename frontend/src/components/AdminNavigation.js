import React from 'react';
import { FaChartBar, FaUsers, FaFileInvoice, FaFileAlt, FaComments, FaCalculator } from 'react-icons/fa';
import './AdminNavigation.css';

const AdminNavigation = ({ activeSection, onSectionChange }) => {
  const navItems = [
    { id: 'dashboard', label: 'Tableau de bord', icon: FaChartBar },
    // { id: 'chat', label: 'Chat en ligne', icon: FaComments },
    { id: 'quotes', label: 'Devis', icon: FaFileAlt },
    { id: 'invoices', label: 'Factures', icon: FaFileInvoice },
    { id: 'staff', label: 'Personnel', icon: FaUsers },
    { id: 'accounting', label: 'Comptabilité', icon: FaCalculator }
  ];

  return (
    <nav className="admin-navigation">
      <ul className="nav-list">
        {navItems.map((item) => {
          const Icon = item.icon;
          return (
            <li key={item.id} className="nav-item">
              <button
                className={`nav-button ${activeSection === item.id ? 'active' : ''}`}
                onClick={() => onSectionChange(item.id)}
              >
                <Icon className="nav-icon" />
                <span className="nav-label">{item.label}</span>
              </button>
            </li>
          );
        })}
      </ul>
    </nav>
  );
};

export default AdminNavigation; 