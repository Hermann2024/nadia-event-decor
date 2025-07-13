import React from 'react';
import styled from 'styled-components';
import { Link } from 'react-router-dom';
import { FaFacebook, FaInstagram, FaYoutube, FaTiktok, FaPhone, FaEnvelope, FaMapMarkerAlt } from 'react-icons/fa';

const FooterContainer = styled.footer`
  background: var(--dark-green);
  color: white;
  padding: 60px 0 20px;
`;

const FooterContent = styled.div`
  max-width: 1200px;
  margin: 0 auto;
  padding: 0 20px;
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
  gap: 40px;
`;

const FooterSection = styled.div`
  h3 {
    color: var(--primary-green);
    margin-bottom: 20px;
    font-size: 1.3rem;
  }
  
  p {
    color: #ccc;
    line-height: 1.6;
    margin-bottom: 10px;
  }
`;

const FooterLinks = styled.div`
  display: flex;
  flex-direction: column;
  gap: 10px;
  
  a {
    color: #ccc;
    text-decoration: none;
    transition: color 0.3s ease;
    
    &:hover {
      color: var(--primary-green);
    }
  }
`;

const SocialLinks = styled.div`
  display: flex;
  gap: 15px;
  margin-top: 20px;
`;

const SocialLink = styled.a`
  width: 40px;
  height: 40px;
  background: var(--primary-green);
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  color: white;
  text-decoration: none;
  transition: all 0.3s ease;
  
  &:hover {
    background: var(--secondary-green);
    transform: translateY(-2px);
  }
`;

const ContactInfo = styled.div`
  display: flex;
  align-items: center;
  gap: 10px;
  margin-bottom: 15px;
  color: #ccc;
  
  svg {
    color: var(--primary-green);
  }
`;

const Copyright = styled.div`
  text-align: center;
  padding-top: 40px;
  margin-top: 40px;
  border-top: 1px solid rgba(255, 255, 255, 0.1);
  color: #ccc;
`;

const Footer = () => {
  return (
    <FooterContainer>
      <FooterContent>
        <FooterSection>
          <h3>Nadia Event's Decor</h3>
          <p>
            Fondé par Nadine Kechiamen Nganou, nous créons des décors magiques 
            pour tous vos événements spéciaux. De la décoration de mariages aux 
            événements d'entreprise, nous donnons vie à vos rêves.
          </p>
          <SocialLinks>
            <SocialLink href="https://facebook.com/nadiaeventsdecor" target="_blank">
              <FaFacebook style={{ color: '#1877F3' }} />
            </SocialLink>
            <SocialLink href="https://instagram.com/nadiaeventsdecor" target="_blank">
              <FaInstagram style={{ color: '#E4405F' }} />
            </SocialLink>
            <SocialLink href="https://youtube.com/nadiaeventsdecor" target="_blank">
              <FaYoutube style={{ color: '#FF0000' }} />
            </SocialLink>
            <SocialLink href="https://tiktok.com/@nadiaeventsdecor" target="_blank">
              <FaTiktok style={{ color: '#000000' }} />
            </SocialLink>
          </SocialLinks>
        </FooterSection>

        <FooterSection>
          <h3>Nos Services</h3>
          <FooterLinks>
            <Link to="/products">Décoration de Mariages</Link>
            <Link to="/products">Événements d'Entreprise</Link>
            <Link to="/products">Anniversaires & Célébrations</Link>
            <Link to="/products">Cérémonies Religieuses</Link>
            <Link to="/products">Location de Décors</Link>
            <Link to="/products">Conseils en Décoration</Link>
          </FooterLinks>
        </FooterSection>

        <FooterSection>
          <h3>Liens Utiles</h3>
          <FooterLinks>
            <Link to="/">Accueil</Link>
            <Link to="/about">À Propos</Link>
            <Link to="/products">Nos Produits</Link>
            <Link to="/contact">Contact</Link>
            <Link to="/admin">Administration</Link>
          </FooterLinks>
        </FooterSection>

        <FooterSection>
          <h3>Contact</h3>
          <ContactInfo>
            <FaPhone />
            <span>+237 XXX XXX XXX</span>
          </ContactInfo>
          <ContactInfo>
            <FaEnvelope />
            <span>nadiaeventsdecor@gmail.com</span>
          </ContactInfo>
          <ContactInfo>
            <FaMapMarkerAlt />
            <span>Cameroun</span>
          </ContactInfo>
          <p style={{ marginTop: '20px' }}>
            <strong>Horaires d'ouverture:</strong><br />
            Lundi - Vendredi: 8h - 18h<br />
            Samedi: 9h - 16h<br />
            Dimanche: Sur rendez-vous
          </p>
        </FooterSection>
      </FooterContent>

      <Copyright>
        <p>&copy; 2024 Nadia Event's Decor. Tous droits réservés.</p>
        <p>Fondé par Nadine Kechiamen Nganou</p>
      </Copyright>
    </FooterContainer>
  );
};

export default Footer; 