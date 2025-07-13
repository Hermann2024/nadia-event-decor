import React, { useState } from 'react';
import AdminDashboard from './AdminDashboard';
import InvoiceManagement from './InvoiceManagement';
import QuoteManagement from './QuoteManagement';
import StaffManagement from './StaffManagement';
import AccountingManagement from './AccountingManagement';
// import ChatManagement from './ChatManagement';
import './AdminPanel.css';

const navItems = [
  { id: 'dashboard', label: 'Tableau de bord' },
  { id: 'quotes', label: 'Devis' },
  { id: 'invoices', label: 'Factures' },
  { id: 'staff', label: 'Personnel' },
  { id: 'accounting', label: 'Comptabilité' }
];

const AdminPanel = () => {
  const [activeSection, setActiveSection] = useState('dashboard');

  const renderContent = () => {
    switch (activeSection) {
      case 'dashboard':
        return <AdminDashboard />;
      case 'accounting':
        return <AccountingManagement />;
      case 'staff':
        return <StaffManagement />;
      case 'invoices':
        return <InvoiceManagement />;
      case 'quotes':
        return <QuoteManagement />;
      case 'chat':
        return null;
      default:
        return <AdminDashboard />;
    }
  };

  return (
    <div className="admin-panel admin-bg">
      <header className="admin-header-navbar">
        <nav className="admin-navbar">
          {navItems.map(item => (
            <button
              key={item.id}
              className={`admin-navbar-btn${activeSection === item.id ? ' active' : ''}`}
              onClick={() => setActiveSection(item.id)}
            >
              {item.label}
            </button>
          ))}
        </nav>
      </header>
      <main className="admin-content">
        {renderContent()}
      </main>
    </div>
  );
};

export default AdminPanel; 