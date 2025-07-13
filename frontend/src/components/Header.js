import React, { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import styled from 'styled-components';
import { motion } from 'framer-motion';
import { FaVolumeUp, FaVolumeMute, FaBars, FaTimes, FaComments, FaUserShield } from 'react-icons/fa';

const HeaderContainer = styled.header`
  background: rgba(255, 255, 255, 0.95);
  backdrop-filter: blur(10px);
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  z-index: 1000;
  box-shadow: 0 2px 20px rgba(50, 205, 50, 0.1);
  transition: all 0.3s ease;
`;

const Nav = styled.nav`
  width: 100%;
  margin: 0;
  padding-left: 16px;
  display: flex;
  justify-content: space-between;
  align-items: center;
  height: 80px;
`;

const Logo = styled(Link)`
  font-family: 'Playfair Display', serif;
  font-size: 1.8rem;
  font-weight: 700;
  color: var(--primary-green);
  text-decoration: none;
  transition: all 0.3s ease;
  
  &:hover {
    color: var(--secondary-green);
    transform: scale(1.05);
  }
`;

const LogoText = styled.span`
  font-family: 'Playfair Display', serif;
  font-size: 1.8rem;
  font-weight: 700;
  color: var(--primary-green);
  text-decoration: none;
  transition: all 0.3s ease;
  
  &:hover {
    color: var(--secondary-green);
    transform: scale(1.05);
  }
`;

const NavLinks = styled.div`
  display: flex;
  align-items: center;
  gap: 30px;
  
  @media (max-width: 768px) {
    display: none;
  }
`;

const NavLink = styled(Link)`
  color: var(--dark-green);
  text-decoration: none;
  font-weight: 500;
  position: relative;
  transition: all 0.3s ease;
  
  &:hover {
    color: var(--primary-green);
  }
  
  &::after {
    content: '';
    position: absolute;
    bottom: -5px;
    left: 0;
    width: 0;
    height: 2px;
    background: var(--gradient-primary);
    transition: width 0.3s ease;
  }
  
  &:hover::after {
    width: 100%;
  }
  
  &.active {
    color: var(--primary-green);
    
    &::after {
      width: 100%;
    }
  }
`;

const HeaderButtons = styled.div`
  display: flex;
  align-items: center;
  gap: 32px;
`;

const HeaderButton = styled.button`
  background: var(--gradient-primary);
  border: none;
  border-radius: 50%;
  width: 40px;
  height: 40px;
  display: flex;
  align-items: center;
  justify-content: center;
  color: white;
  cursor: pointer;
  transition: all 0.3s ease;
  box-shadow: 0 4px 15px rgba(50, 205, 50, 0.3);
  
  &.admin {
    margin-right: 24px;
  }
  
  &:hover {
    transform: scale(1.1);
    box-shadow: 0 6px 20px rgba(50, 205, 50, 0.4);
  }
`;

const MobileMenuButton = styled.button`
  display: none;
  background: none;
  border: none;
  font-size: 1.5rem;
  color: var(--primary-green);
  cursor: pointer;
  
  @media (max-width: 768px) {
    display: block;
  }
`;

const MobileMenu = styled(motion.div)`
  position: fixed;
  top: 80px;
  left: 0;
  right: 0;
  background: rgba(255, 255, 255, 0.98);
  backdrop-filter: blur(10px);
  padding: 20px;
  box-shadow: 0 4px 20px rgba(50, 205, 50, 0.1);
  
  @media (min-width: 769px) {
    display: none;
  }
`;

const MobileNavLink = styled(Link)`
  display: block;
  padding: 15px 0;
  color: var(--dark-green);
  text-decoration: none;
  font-weight: 500;
  border-bottom: 1px solid rgba(50, 205, 50, 0.1);
  transition: all 0.3s ease;
  
  &:hover {
    color: var(--primary-green);
    padding-left: 10px;
  }
  
  &.active {
    color: var(--primary-green);
    background: rgba(50, 205, 50, 0.05);
  }
`;

const Header = ({ onSoundToggle }) => {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isSoundEnabled, setIsSoundEnabled] = useState(true);
  const location = useLocation();

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 50);
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const handleSoundToggle = () => {
    setIsSoundEnabled(!isSoundEnabled);
    onSoundToggle();
  };

  const handleMessageClick = () => {
    // Déclencher l'ouverture du chat widget
    const chatButton = document.querySelector('[data-chat-button]');
    if (chatButton) {
      chatButton.click();
    }
  };

  const navItems = [
    { path: '/', label: 'Accueil' },
    { path: '/products', label: 'Produits' },
    { path: '/about', label: 'À Propos' },
    { path: '/contact', label: 'Contact' },
    { path: '/video', label: 'Vidéos' }
  ];

  useEffect(() => {
    document.body.classList.add('admin-mode');
    return () => document.body.classList.remove('admin-mode');
  }, []);

  return (
    <HeaderContainer style={{ 
      background: isScrolled ? 'rgba(255, 255, 255, 0.98)' : 'rgba(255, 255, 255, 0.95)',
      boxShadow: isScrolled ? '0 4px 30px rgba(50, 205, 50, 0.15)' : '0 2px 20px rgba(50, 205, 50, 0.1)'
    }}>
      <Nav>
        <Logo to="/">
          <LogoText>Nadia Event's Decor</LogoText>
        </Logo>

        <NavLinks>
          {navItems.map(item => (
            <NavLink
              key={item.path}
              to={item.path}
              className={location.pathname === item.path ? 'active' : ''}
            >
              {item.label}
            </NavLink>
          ))}
        </NavLinks>

        <HeaderButtons>
          <HeaderButton onClick={handleMessageClick} title="Message">
            <FaComments />
          </HeaderButton>
          <HeaderButton onClick={handleSoundToggle} title={isSoundEnabled ? 'Désactiver le son' : 'Activer le son'}>
            {isSoundEnabled ? <FaVolumeUp /> : <FaVolumeMute />}
          </HeaderButton>
          <HeaderButton as={Link} to="/admin" title="Administration" className="admin">
            <FaUserShield />
          </HeaderButton>
          <MobileMenuButton onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}>
            {isMobileMenuOpen ? <FaTimes /> : <FaBars />}
          </MobileMenuButton>
        </HeaderButtons>
      </Nav>

      <MobileMenu
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: isMobileMenuOpen ? 1 : 0, y: isMobileMenuOpen ? 0 : -20 }}
        transition={{ duration: 0.3 }}
        style={{ display: isMobileMenuOpen ? 'block' : 'none' }}
      >
        {navItems.map(item => (
          <MobileNavLink
            key={item.path}
            to={item.path}
            className={location.pathname === item.path ? 'active' : ''}
            onClick={() => setIsMobileMenuOpen(false)}
          >
            {item.label}
          </MobileNavLink>
        ))}
      </MobileMenu>
    </HeaderContainer>
  );
};

export default Header; 