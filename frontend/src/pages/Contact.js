import React, { useState } from 'react';
import styled from 'styled-components';
import { motion } from 'framer-motion';
import { FaPhone, FaEnvelope, FaMapMarkerAlt, FaClock, FaFacebook, FaInstagram, FaYoutube, FaTiktok } from 'react-icons/fa';
import '../styles/global.css';

const ContactContainer = styled.div`
  padding-top: 80px;
  min-height: 100vh;
  background: var(--light-green);
`;

const ContactHeader = styled.div`
  background: var(--gradient-primary);
  color: white;
  padding: 80px 0;
  text-align: center;
`;

const ContactContent = styled.div`
  max-width: 1200px;
  margin: 0 auto;
  padding: 80px 20px;
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 60px;
  
  @media (max-width: 768px) {
    grid-template-columns: 1fr;
    gap: 40px;
  }
`;

const ContactForm = styled.div`
  background: white;
  padding: 40px;
  border-radius: 20px;
  box-shadow: 0 10px 30px rgba(50, 205, 50, 0.1);
`;

const FormGroup = styled.div`
  margin-bottom: 20px;
  
  label {
    display: block;
    margin-bottom: 8px;
    color: var(--dark-green);
    font-weight: 500;
  }
  
  input, textarea, select {
    width: 100%;
    padding: 12px 15px;
    border: 2px solid #e0e0e0;
    border-radius: 10px;
    font-size: 1rem;
    transition: all 0.3s ease;
    
    &:focus {
      outline: none;
      border-color: var(--primary-green);
      box-shadow: 0 0 0 3px rgba(50, 205, 50, 0.1);
    }
  }
  
  textarea {
    resize: vertical;
    min-height: 120px;
  }
`;

const SubmitButton = styled.button`
  width: 100%;
  padding: 15px;
  background: var(--gradient-primary);
  color: white;
  border: none;
  border-radius: 10px;
  font-size: 1.1rem;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.3s ease;
  
  &:hover {
    transform: translateY(-2px);
    box-shadow: 0 5px 15px rgba(50, 205, 50, 0.3);
  }
  
  &:disabled {
    opacity: 0.6;
    cursor: not-allowed;
    transform: none;
  }
`;

const ContactInfo = styled.div`
  h3 {
    color: var(--dark-green);
    margin-bottom: 30px;
    font-size: 2rem;
  }
`;

const InfoItem = styled(motion.div)`
  display: flex;
  align-items: center;
  gap: 15px;
  margin-bottom: 30px;
  padding: 20px;
  background: white;
  border-radius: 15px;
  box-shadow: 0 5px 15px rgba(0, 0, 0, 0.1);
  
  svg {
    font-size: 1.5rem;
    color: var(--primary-green);
    min-width: 30px;
  }
  
  div {
    h4 {
      color: var(--dark-green);
      margin-bottom: 5px;
    }
    
    p {
      color: var(--gray);
      margin: 0;
    }
  }
`;

const SocialLinks = styled.div`
  margin-top: 40px;
  
  h4 {
    color: var(--dark-green);
    margin-bottom: 20px;
  }
  
  .social-grid {
    display: grid;
    grid-template-columns: repeat(2, 1fr);
    gap: 15px;
  }
`;

const SocialLink = styled.a`
  display: flex;
  align-items: center;
  gap: 10px;
  padding: 15px;
  background: white;
  border-radius: 10px;
  text-decoration: none;
  color: var(--dark-green);
  transition: all 0.3s ease;
  box-shadow: 0 5px 15px rgba(0, 0, 0, 0.1);
  
  &:hover {
    transform: translateY(-2px);
    box-shadow: 0 8px 20px rgba(50, 205, 50, 0.2);
    color: var(--primary-green);
  }
  
  svg {
    font-size: 1.2rem;
  }
`;

const MapSection = styled.div`
  margin-top: 60px;
  background: white;
  border-radius: 20px;
  overflow: hidden;
  box-shadow: 0 10px 30px rgba(50, 205, 50, 0.1);
  
  iframe {
    width: 100%;
    height: 300px;
    border: none;
  }
`;

const TabContainer = styled.div`
  display: flex;
  margin-bottom: 30px;
  border-radius: 10px;
  overflow: hidden;
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
`;

const TabButton = styled.button`
  flex: 1;
  padding: 15px 20px;
  border: none;
  background: ${props => props.active ? 'linear-gradient(135deg, #32CD32, #228B22)' : '#f8f9fa'};
  color: ${props => props.active ? 'white' : '#666'};
  font-weight: ${props => props.active ? '600' : '400'};
  cursor: pointer;
  transition: all 0.3s ease;
  
  &:hover {
    background: ${props => props.active ? 'linear-gradient(135deg, #32CD32, #228B22)' : '#e9ecef'};
  }
  
  &:first-child {
    border-radius: 10px 0 0 10px;
  }
  
  &:last-child {
    border-radius: 0 10px 10px 0;
  }
`;

const Contact = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    subject: '',
    message: ''
  });

  const [quoteData, setQuoteData] = useState({
    name: '',
    email: '',
    phone: '',
    eventType: '',
    eventDate: '',
    eventLocation: '',
    guestCount: '',
    budget: '',
    message: '',
    additionalRequirements: ''
  });

  const [activeTab, setActiveTab] = useState('contact'); // 'contact' ou 'quote'

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleQuoteChange = (e) => {
    setQuoteData({
      ...quoteData,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    try {
      const response = await fetch('http://localhost:8082/api/contact/send', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData)
      });

      const data = await response.json();

      if (data.success) {
        alert(data.message);
        setFormData({
          name: '',
          email: '',
          phone: '',
          subject: '',
          message: ''
        });
      } else {
        alert('Erreur: ' + data.message);
      }
    } catch (error) {
      console.error('Erreur lors de l\'envoi:', error);
      alert('Erreur lors de l\'envoi du message. Veuillez réessayer.');
    }
  };

  const handleQuoteSubmit = async (e) => {
    e.preventDefault();
    
    try {
      const response = await fetch('http://localhost:8082/api/contact/quote', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(quoteData)
      });

      const data = await response.json();

      if (data.success) {
        alert(data.message);
        setQuoteData({
          name: '',
          email: '',
          phone: '',
          eventType: '',
          eventDate: '',
          eventLocation: '',
          guestCount: '',
          budget: '',
          message: '',
          additionalRequirements: ''
        });
      } else {
        alert('Erreur: ' + data.message);
      }
    } catch (error) {
      console.error('Erreur lors de l\'envoi:', error);
      alert('Erreur lors de l\'envoi de la demande de devis. Veuillez réessayer.');
    }
  };

  const eventTypes = [
    'Mariage',
    'Anniversaire',
    'Événement d\'entreprise',
    'Baptême',
    'Communion',
    'Autre'
  ];

  const socialLinks = [
    { name: 'Facebook', url: 'https://facebook.com/nadiaevents', icon: <FaFacebook style={{ color: '#1877F3' }} /> },
    { name: 'TikTok', url: 'https://tiktok.com/@nadiaevents', icon: <FaTiktok style={{ color: '#000000' }} /> },
    { name: 'YouTube', url: 'https://youtube.com/@nadiaevents', icon: <FaYoutube style={{ color: '#FF0000' }} /> },
    { name: 'Instagram', url: 'https://instagram.com/nadiaevents', icon: <FaInstagram style={{ color: '#E4405F' }} /> }
  ];

  return (
    <ContactContainer>
      <ContactHeader>
        <div className="container">
          <motion.h1
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
          >
            Contactez-nous
          </motion.h1>
          <motion.p
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            style={{ fontSize: '1.2rem', marginTop: '20px' }}
          >
            Prêt à créer votre événement de rêve ? Parlons-en !
          </motion.p>
        </div>
      </ContactHeader>

      <ContactContent>
        <ContactForm>
          <h3>Contactez-nous</h3>
          
          <TabContainer>
            <TabButton 
              active={activeTab === 'contact'} 
              onClick={() => setActiveTab('contact')}
            >
              Message de Contact
            </TabButton>
            <TabButton 
              active={activeTab === 'quote'} 
              onClick={() => setActiveTab('quote')}
            >
              Demande de Devis
            </TabButton>
          </TabContainer>

          {activeTab === 'contact' ? (
            <form onSubmit={handleSubmit}>
              <FormGroup>
                <label>Nom complet *</label>
                <input
                  type="text"
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  required
                />
              </FormGroup>

              <FormGroup>
                <label>Email *</label>
                <input
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  required
                />
              </FormGroup>

              <FormGroup>
                <label>Téléphone</label>
                <input
                  type="tel"
                  name="phone"
                  value={formData.phone}
                  onChange={handleChange}
                />
              </FormGroup>

              <FormGroup>
                <label>Sujet *</label>
                <input
                  type="text"
                  name="subject"
                  value={formData.subject}
                  onChange={handleChange}
                  required
                />
              </FormGroup>

              <FormGroup>
                <label>Message *</label>
                <textarea
                  name="message"
                  value={formData.message}
                  onChange={handleChange}
                  placeholder="Décrivez votre projet et vos souhaits..."
                  required
                />
              </FormGroup>

              <SubmitButton type="submit">
                Envoyer le Message
              </SubmitButton>
            </form>
          ) : (
            <form onSubmit={handleQuoteSubmit}>
              <FormGroup>
                <label>Nom complet *</label>
                <input
                  type="text"
                  name="name"
                  value={quoteData.name}
                  onChange={handleQuoteChange}
                  required
                />
              </FormGroup>

              <FormGroup>
                <label>Email *</label>
                <input
                  type="email"
                  name="email"
                  value={quoteData.email}
                  onChange={handleQuoteChange}
                  required
                />
              </FormGroup>

              <FormGroup>
                <label>Téléphone *</label>
                <input
                  type="tel"
                  name="phone"
                  value={quoteData.phone}
                  onChange={handleQuoteChange}
                  required
                />
              </FormGroup>

              <FormGroup>
                <label>Type d'événement *</label>
                <select
                  name="eventType"
                  value={quoteData.eventType}
                  onChange={handleQuoteChange}
                  required
                >
                  <option value="">Sélectionnez un type d'événement</option>
                  {eventTypes.map((type, index) => (
                    <option key={index} value={type}>{type}</option>
                  ))}
                </select>
              </FormGroup>

              <FormGroup>
                <label>Date de l'événement</label>
                <input
                  type="date"
                  name="eventDate"
                  value={quoteData.eventDate}
                  onChange={handleQuoteChange}
                />
              </FormGroup>

              <FormGroup>
                <label>Lieu de l'événement</label>
                <input
                  type="text"
                  name="eventLocation"
                  value={quoteData.eventLocation}
                  onChange={handleQuoteChange}
                  placeholder="Adresse ou lieu de l'événement"
                />
              </FormGroup>

              <FormGroup>
                <label>Nombre d'invités</label>
                <input
                  type="number"
                  name="guestCount"
                  value={quoteData.guestCount}
                  onChange={handleQuoteChange}
                  placeholder="Nombre approximatif d'invités"
                />
              </FormGroup>

              <FormGroup>
                <label>Budget estimé</label>
                <select
                  name="budget"
                  value={quoteData.budget}
                  onChange={handleQuoteChange}
                >
                  <option value="">Sélectionnez une fourchette de budget</option>
                  <option value="Moins de 100 000 FCFA">Moins de 100 000 FCFA</option>
                  <option value="100 000 - 300 000 FCFA">100 000 - 300 000 FCFA</option>
                  <option value="300 000 - 500 000 FCFA">300 000 - 500 000 FCFA</option>
                  <option value="500 000 - 1 000 000 FCFA">500 000 - 1 000 000 FCFA</option>
                  <option value="Plus de 1 000 000 FCFA">Plus de 1 000 000 FCFA</option>
                </select>
              </FormGroup>

              <FormGroup>
                <label>Description de votre projet *</label>
                <textarea
                  name="message"
                  value={quoteData.message}
                  onChange={handleQuoteChange}
                  placeholder="Décrivez votre événement, vos souhaits de décoration, le thème..."
                  required
                />
              </FormGroup>

              <FormGroup>
                <label>Exigences supplémentaires</label>
                <textarea
                  name="additionalRequirements"
                  value={quoteData.additionalRequirements}
                  onChange={handleQuoteChange}
                  placeholder="Couleurs préférées, style particulier, contraintes..."
                />
              </FormGroup>

              <SubmitButton type="submit">
                Demander un Devis
              </SubmitButton>
            </form>
          )}
        </ContactForm>

        <ContactInfo>
          <h3>Informations de Contact</h3>
          
          <InfoItem
            initial={{ opacity: 0, x: 30 }}
            whileInView={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true }}
          >
            <FaPhone />
            <div>
              <h4>Téléphone</h4>
              <p>+237 680 207 496</p>
              <p>+237 657 759 510</p>
              <p>+237 699 275 786</p>
            </div>
          </InfoItem>

          <InfoItem
            initial={{ opacity: 0, x: 30 }}
            whileInView={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6, delay: 0.1 }}
            viewport={{ once: true }}
          >
            <FaEnvelope />
            <div>
              <h4>Email</h4>
              <p>nadiaeventsdecor@gmail.com</p>
            </div>
          </InfoItem>

          <InfoItem
            initial={{ opacity: 0, x: 30 }}
            whileInView={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            viewport={{ once: true }}
          >
            <FaMapMarkerAlt />
            <div>
              <h4>Adresse</h4>
              <p>Yaoundé, Cameroun</p>
              <p>Zone 4, Avenue de l'Indépendance</p>
            </div>
          </InfoItem>

          <InfoItem
            initial={{ opacity: 0, x: 30 }}
            whileInView={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6, delay: 0.3 }}
            viewport={{ once: true }}
          >
            <FaClock />
            <div>
              <h4>Horaires d'ouverture</h4>
              <p>Lundi - Vendredi: 8h - 18h<br />
              Samedi: 9h - 16h<br />
              Dimanche: Sur rendez-vous</p>
            </div>
          </InfoItem>

          <SocialLinks>
            <h4>Suivez-nous</h4>
            <div className="social-grid">
              {socialLinks.map((social, index) => (
                <SocialLink
                  key={index}
                  href={social.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.6, delay: index * 0.1 }}
                  viewport={{ once: true }}
                >
                  {social.icon}
                  <span>{social.name}</span>
                </SocialLink>
              ))}
            </div>
          </SocialLinks>
        </ContactInfo>
      </ContactContent>

      <MapSection>
        <iframe
          src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3988.819123456789!2d11.5183!3d3.8480!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x0%3A0x0!2zM8KwNTAnNTIuOCJOIDExwrAzMScwNi4wIkU!5e0!3m2!1sfr!2scm!4v1234567890"
          title="Localisation Nadia Event's Decor"
          allowFullScreen=""
          loading="lazy"
          referrerPolicy="no-referrer-when-downgrade"
        />
      </MapSection>
    </ContactContainer>
  );
};

export default Contact; 