import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import styled from 'styled-components';
import { motion } from 'framer-motion';
import { FaPlay, FaInstagram, FaFacebook, FaYoutube, FaTiktok } from 'react-icons/fa';

const HomeContainer = styled.div`
  padding-top: 80px;
`;

const HeroSection = styled.section`
  min-height: 100vh;
  display: flex;
  align-items: center;
  position: relative;
  overflow: hidden;
`;

const HeroBackground = styled.div`
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: url('/assets/images/decorations/13e22580-539c-42b2-b692-06f8bffd7e53.JPG') center/cover;
  opacity: 0.7; /* Plus visible */
  z-index: -1;
  
  &::after {
    content: '';
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    background: linear-gradient(
      135deg,
      rgba(50, 205, 50, 0.4) 0%,
      rgba(34, 139, 34, 0.5) 50%,
      rgba(0, 0, 0, 0.3) 100%
    );
    z-index: 1;
  }
`;

const HeroContent = styled.div`
  max-width: 1200px;
  margin: 0 auto;
  padding: 0 20px;
  text-align: center;
  color: white; /* ⚠️ CORRECTION : Texte blanc pour meilleur contraste */
  position: relative;
  z-index: 2;
`;

const HeroTitle = styled(motion.h1)`
  font-size: 4rem;
  font-weight: 700;
  margin-bottom: 20px;
  text-shadow: 2px 2px 4px rgba(0, 0, 0, 0.7),
    0 0 20px rgba(0, 0, 0, 0.3);
  color: white;
  
  @media (max-width: 768px) {
    font-size: 2.5rem;
  }
`;

const HeroSubtitle = styled(motion.p)`
  font-size: 1.3rem;
  margin-bottom: 40px;
  color: rgba(255, 255, 255, 0.9); /* ⚠️ CORRECTION : Texte blanc semi-transparent */
  max-width: 600px;
  margin-left: auto;
  margin-right: auto;
  text-shadow: 1px 1px 2px rgba(0, 0, 0, 0.5); /* ⚠️ NOUVEAU : Ombre de texte */
`;

const HeroButtons = styled(motion.div)`
  display: flex;
  gap: 20px;
  justify-content: center;
  flex-wrap: wrap;
`;

// ⚠️ NOUVEAU : Style pour les boutons avec meilleur contraste
const StyledButton = styled.button`
  padding: 15px 30px;
  border: none;
  border-radius: 50px;
  font-size: 1.1rem;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.3s ease;
  text-decoration: none;
  display: inline-flex;
  align-items: center;
  gap: 10px;
  
  &.primary {
    background: linear-gradient(135deg, #28a745 0%, #20c997 100%);
    color: white;
    box-shadow: 0 4px 15px rgba(40, 167, 69, 0.3);
    
    &:hover {
      transform: translateY(-2px);
      box-shadow: 0 6px 20px rgba(40, 167, 69, 0.4);
    }
  }
  
  &.secondary {
    background: rgba(255, 255, 255, 0.9);
    color: #333;
    backdrop-filter: blur(10px);
    
    &:hover {
      background: rgba(255, 255, 255, 1);
      transform: translateY(-2px);
    }
  }
`;

const ServicesSection = styled.section`
  padding: 100px 0;
  background: var(--white);
`;

const ServiceCard = styled(motion.div)`
  background: var(--white);
  border-radius: 20px;
  padding: 40px 30px;
  text-align: center;
  box-shadow: 0 10px 30px rgba(50, 205, 50, 0.1);
  border: 1px solid rgba(50, 205, 50, 0.1);
  transition: all 0.3s ease;
  
  &:hover {
    transform: translateY(-10px);
    box-shadow: 0 20px 40px rgba(50, 205, 50, 0.2);
  }
`;

const ServiceIcon = styled.div`
  width: 80px;
  height: 80px;
  background: var(--gradient-primary);
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  margin: 0 auto 20px;
  font-size: 2rem;
  color: white;
`;

const GallerySection = styled.section`
  padding: 100px 0;
  background: var(--light-green);
`;

const GalleryGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
  gap: 30px;
  margin-top: 60px;
`;

const GalleryItem = styled(motion.div)`
  position: relative;
  border-radius: 20px;
  overflow: hidden;
  box-shadow: 0 10px 30px rgba(0, 0, 0, 0.1);
  cursor: pointer;
  
  &:hover img {
    transform: scale(1.1);
  }
`;

const GalleryImage = styled.img`
  width: 100%;
  height: 300px;
  object-fit: cover;
  transition: transform 0.3s ease;
`;

const GalleryOverlay = styled.div`
  position: absolute;
  bottom: 0;
  left: 0;
  right: 0;
  background: linear-gradient(transparent, rgba(0, 0, 0, 0.7));
  color: white;
  padding: 20px;
  transform: translateY(100%);
  transition: transform 0.3s ease;
  
  ${GalleryItem}:hover & {
    transform: translateY(0);
  }
`;

const SocialSection = styled.section`
  padding: 80px 0;
  background: var(--gradient-primary);
  color: white;
  text-align: center;
`;

const SocialGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
  gap: 30px;
  margin-top: 60px;
`;

const SocialCard = styled(motion.a)`
  background: rgba(255, 255, 255, 0.1);
  backdrop-filter: blur(10px);
  border-radius: 20px;
  padding: 30px;
  text-decoration: none;
  color: white;
  transition: all 0.3s ease;
  
  &:hover {
    background: rgba(255, 255, 255, 0.2);
    transform: translateY(-5px);
  }
`;

const SocialIcon = styled.div`
  font-size: 3rem;
  margin-bottom: 20px;
`;

// Ajout d'un composant de modale simple
const ModalOverlay = styled.div`
  position: fixed;
  top: 0;
  left: 0;
  width: 100vw;
  height: 100vh;
  background: rgba(0,0,0,0.7);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 2000;
`;

const ModalImage = styled.img`
  max-width: 90vw;
  max-height: 80vh;
  border-radius: 16px;
  box-shadow: 0 8px 32px rgba(0,0,0,0.25);
`;

const CloseButton = styled.button`
  position: absolute;
  top: 32px;
  right: 48px;
  background: rgba(0,0,0,0.5);
  color: white;
  border: none;
  font-size: 2rem;
  border-radius: 50%;
  width: 48px;
  height: 48px;
  cursor: pointer;
  z-index: 2100;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: background 0.2s;
  &:hover {
    background: rgba(0,0,0,0.8);
  }
`;

const Home = () => {
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [modalImage, setModalImage] = useState(null);
  
  // ⚠️ CORRECTION : Images de fond sans IMG_0908.jpeg
  const backgroundImages = [
    '/assets/images/decorations/13e22580-539c-42b2-b692-06f8bffd7e53.JPG',
    '/assets/images/decorations/02923311-a9be-4da5-a6e7-f9b803635ddc.JPG',
    '/assets/images/decorations/0eb48322-1092-46eb-b469-dd3c3ac9f86c.JPG'
  ];

  // ⚠️ CORRECTION : Images de la galerie sans IMG_0908.jpeg
  const galleryImages = [
    '/assets/images/decorations/13e22580-539c-42b2-b692-06f8bffd7e53.JPG',
    '/assets/images/decorations/02923311-a9be-4da5-a6e7-f9b803635ddc.JPG',
    '/assets/images/decorations/0eb48322-1092-46eb-b469-dd3c3ac9f86c.JPG',
    '/assets/images/decorations/014910c4-9368-42db-8cc6-69d9ecb52e5a.JPG',
    '/assets/images/decorations/13e22580-539c-42b2-b692-06f8bffd7e53.JPG'
  ];

  // ⚠️ NOUVEAU : Rotation automatique des images de fond
  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentImageIndex((prev) => (prev + 1) % backgroundImages.length);
    }, 5000); // Change toutes les 5 secondes

    return () => clearInterval(interval);
  }, [backgroundImages.length]);

  const services = [
    {
      icon: '🎨',
      title: 'Décoration de Mariages',
      description: 'Créez votre jour J de rêve avec nos décors élégants et personnalisés'
    },
    {
      icon: '🎉',
      title: 'Événements d\'Entreprise',
      description: 'Donnez du style à vos événements professionnels'
    },
    {
      icon: '🎂',
      title: 'Anniversaires & Célébrations',
      description: 'Rendez vos moments spéciaux inoubliables'
    },
    {
      icon: '💒',
      title: 'Cérémonies Religieuses',
      description: 'Décoration respectueuse et élégante pour vos cérémonies'
    }
  ];

  const socialLinks = [
    {
      icon: <FaFacebook style={{ color: '#1877F3' }} />,
      title: 'Facebook',
      description: 'Suivez nos dernières créations',
      url: 'https://facebook.com/nadiaeventsdecor'
    },
    {
      icon: <FaInstagram style={{ color: '#E4405F' }} />,
      title: 'Instagram',
      description: 'Découvrez notre portfolio',
      url: 'https://instagram.com/nadiaeventsdecor'
    },
    {
      icon: <FaYoutube style={{ color: '#FF0000' }} />,
      title: 'YouTube',
      description: 'Vidéos de nos réalisations',
      url: 'https://youtube.com/nadiaeventsdecor'
    },
    {
      icon: <FaTiktok style={{ color: '#000000' }} />,
      title: 'TikTok',
      description: 'Contenu créatif et tendance',
      url: 'https://tiktok.com/@nadiaeventsdecor'
    }
  ];

  return (
    <HomeContainer>
      <HeroSection>
        <HeroBackground 
          style={{ 
            backgroundImage: `url(${backgroundImages[currentImageIndex]})`,
            transition: 'background-image 1s ease-in-out'
          }}
        />
        <HeroContent>
          <HeroTitle
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
          >
            Nadia Event's Decor
          </HeroTitle>
          <HeroSubtitle
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
          >
            Créez des moments inoubliables avec nos services de décoration d'événements personnalisés
          </HeroSubtitle>
          <HeroButtons
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.4 }}
          >
            <StyledButton as={Link} to="/contact" className="primary">
              📞 Nous Contacter
            </StyledButton>
            <StyledButton as={Link} to="/about" className="secondary">
              🎨 Découvrir Nos Créations
            </StyledButton>
          </HeroButtons>
        </HeroContent>
      </HeroSection>

      <ServicesSection>
        <div className="container">
          <div className="section-title">
            <h2>Nos Services</h2>
            <p>Une gamme complète de services de décoration pour tous vos événements</p>
          </div>
          <div className="grid grid-3">
            {services.map((service, index) => (
              <ServiceCard
                key={index}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: index * 0.1 }}
                viewport={{ once: true }}
              >
                <ServiceIcon>{service.icon}</ServiceIcon>
                <h3>{service.title}</h3>
                <p>{service.description}</p>
              </ServiceCard>
            ))}
          </div>
        </div>
      </ServicesSection>

      <GallerySection>
        <div className="container">
          <div className="section-title">
            <h2>Notre Galerie</h2>
            <p>Découvrez quelques-unes de nos plus belles réalisations</p>
          </div>
          <GalleryGrid>
            {galleryImages.map((image, index) => (
              <GalleryItem
                key={index}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: index * 0.1 }}
                viewport={{ once: true }}
                onClick={() => setModalImage(image)}
                style={{ cursor: 'pointer' }}
              >
                <GalleryImage src={image} alt={`Décoration ${index + 1}`} />
                <GalleryOverlay>
                  <h4>Décoration Élégante</h4>
                  <p>Création personnalisée pour votre événement</p>
                </GalleryOverlay>
              </GalleryItem>
            ))}
          </GalleryGrid>
        </div>
        {/* Modale d'image */}
        {modalImage && (
          <ModalOverlay onClick={() => setModalImage(null)}>
            <CloseButton onClick={e => { e.stopPropagation(); setModalImage(null); }}>&times;</CloseButton>
            <ModalImage src={modalImage} alt="Agrandissement" />
          </ModalOverlay>
        )}
      </GallerySection>

      <SocialSection>
        <div className="container">
          <h2>Suivez-nous sur les Réseaux Sociaux</h2>
          <p>Découvrez nos dernières créations et inspirations</p>
          <SocialGrid>
            {socialLinks.map((social, index) => (
              <SocialCard
                key={index}
                href={social.url}
                target="_blank"
                rel="noopener noreferrer"
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: index * 0.1 }}
                viewport={{ once: true }}
              >
                <SocialIcon>{social.icon}</SocialIcon>
                <h3>{social.title}</h3>
                <p>{social.description}</p>
              </SocialCard>
            ))}
          </SocialGrid>
        </div>
      </SocialSection>
    </HomeContainer>
  );
};

export default Home; 