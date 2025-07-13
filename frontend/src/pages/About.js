import React from 'react';
import styled from 'styled-components';
import { motion } from 'framer-motion';
import { FaHeart, FaStar, FaUsers, FaAward, FaCrown, FaLightbulb, FaHandshake } from 'react-icons/fa';

const AboutContainer = styled.div`
  padding-top: 80px;
  min-height: 100vh;
`;

const HeroSection = styled.section`
  background: var(--gradient-primary);
  color: white;
  padding: 100px 0;
  text-align: center;
`;

const StorySection = styled.section`
  padding: 100px 0;
  background: var(--white);
`;

const StoryContent = styled.div`
  max-width: 1200px;
  margin: 0 auto;
  padding: 0 20px;
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 60px;
  align-items: center;
  
  @media (max-width: 768px) {
    grid-template-columns: 1fr;
    gap: 40px;
  }
`;

const StoryImage = styled.div`
  position: relative;
  border-radius: 20px;
  overflow: hidden;
  box-shadow: 0 20px 40px rgba(50, 205, 50, 0.2);
  
  img {
    width: 100%;
    height: 400px;
    object-fit: cover;
  }
`;

const StoryText = styled.div`
  h2 {
    color: var(--dark-green);
    margin-bottom: 30px;
    font-size: 2.5rem;
  }
  
  p {
    color: var(--gray);
    line-height: 1.8;
    margin-bottom: 20px;
    font-size: 1.1rem;
  }
`;

const ValuesSection = styled.section`
  padding: 100px 0;
  background: var(--white);
`;

const ValuesGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
  gap: 40px;
  margin-top: 60px;
`;

const ValueCard = styled(motion.div)`
  background: white;
  padding: 40px;
  border-radius: 20px;
  box-shadow: 0 10px 30px rgba(0, 0, 0, 0.1);
  text-align: center;
  transition: transform 0.3s ease;
  
  &:hover {
    transform: translateY(-10px);
  }
  
  h3 {
    color: var(--dark-green);
    margin: 20px 0 15px;
    font-size: 1.5rem;
  }
  
  p {
    color: var(--gray);
    line-height: 1.6;
  }
`;

const ValueIcon = styled.div`
  width: 80px;
  height: 80px;
  background: linear-gradient(135deg, var(--light-green), var(--dark-green));
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  margin: 0 auto;
  font-size: 2rem;
  color: white;
`;

const TeamSection = styled.section`
  padding: 120px 0;
  background: linear-gradient(135deg, var(--white) 0%, var(--light-green) 100%);
`;

const TeamContent = styled.div`
  max-width: 1200px;
  margin: 0 auto;
  padding: 0 20px;
`;

const TeamHeader = styled.div`
  text-align: center;
  margin-bottom: 80px;
  
  h2 {
    font-size: 3rem;
    color: var(--dark-green);
    margin-bottom: 20px;
    font-weight: 700;
  }
  
  p {
    font-size: 1.3rem;
    color: var(--gray);
    max-width: 600px;
    margin: 0 auto;
  }
`;

const TeamMemberCard = styled.div`
  background: white;
  border-radius: 20px;
  padding: 60px;
  box-shadow: 0 20px 60px rgba(0, 0, 0, 0.1);
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 60px;
  align-items: center;
  margin-bottom: 60px;
  
  @media (max-width: 768px) {
    grid-template-columns: 1fr;
    gap: 40px;
    padding: 40px;
  }
`;

const TeamMemberImage = styled.div`
  position: relative;
  text-align: center;
  
  .profile-placeholder {
    width: 200px;
    height: 200px;
    border-radius: 50%;
    background: linear-gradient(135deg, var(--light-green), var(--dark-green));
    display: flex;
    align-items: center;
    justify-content: center;
    font-size: 4rem;
    font-weight: bold;
    color: white;
    margin: 0 auto;
    box-shadow: 0 15px 35px rgba(0, 0, 0, 0.2);
  }
  
  .profile-photo {
    width: 200px;
    height: 200px;
    border-radius: 50%;
    object-fit: cover;
    box-shadow: 0 15px 35px rgba(0, 0, 0, 0.2);
  }
  
  .team-badge {
    position: absolute;
    top: -10px;
    right: 50%;
    transform: translateX(50%);
    background: var(--dark-green);
    color: white;
    padding: 8px 16px;
    border-radius: 20px;
    font-size: 0.9rem;
    font-weight: 600;
    display: flex;
    align-items: center;
    gap: 5px;
    box-shadow: 0 5px 15px rgba(0, 0, 0, 0.2);
  }
`;

const TeamMemberInfo = styled.div`
  h3 {
    font-size: 2.5rem;
    color: var(--dark-green);
    margin-bottom: 15px;
    font-weight: 700;
  }
  
  .team-title {
    display: flex;
    align-items: center;
    gap: 10px;
    font-size: 1.2rem;
    color: var(--light-green);
    font-weight: 600;
    margin-bottom: 25px;
    
    svg {
      font-size: 1.4rem;
    }
  }
  
  p {
    font-size: 1.1rem;
    line-height: 1.8;
    color: var(--gray);
    margin-bottom: 20px;
  }
  
  .team-quote {
    background: linear-gradient(135deg, var(--light-green), var(--dark-green));
    color: white;
    padding: 25px;
    border-radius: 15px;
    font-style: italic;
    font-size: 1.1rem;
    margin: 25px 0;
    position: relative;
    
    &::before {
      content: '"';
      font-size: 3rem;
      position: absolute;
      top: -10px;
      left: 15px;
      color: rgba(255, 255, 255, 0.3);
    }
  }
  
  .team-stats {
    display: grid;
    grid-template-columns: repeat(3, 1fr);
    gap: 20px;
    margin-top: 30px;
    
    @media (max-width: 768px) {
      grid-template-columns: repeat(2, 1fr);
    }
  }
  
  .stat-item {
    text-align: center;
    padding: 20px;
    background: var(--light-green);
    border-radius: 15px;
    
    .stat-number {
      font-size: 2rem;
      font-weight: bold;
      color: var(--dark-green);
      margin-bottom: 5px;
    }
    
    .stat-label {
      font-size: 0.9rem;
      color: var(--gray);
      font-weight: 500;
    }
  }
`;

const StatsSection = styled.section`
  padding: 100px 0;
  background: linear-gradient(135deg, var(--light-green) 0%, var(--white) 100%);
`;

const StatsGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
  gap: 40px;
  margin-top: 60px;
`;

const StatItem = styled(motion.div)`
  text-align: center;
  padding: 40px 20px;
  background: white;
  border-radius: 20px;
  box-shadow: 0 10px 30px rgba(0, 0, 0, 0.1);
  
  h3 {
    font-size: 3rem;
    color: var(--dark-green);
    margin-bottom: 10px;
    font-weight: bold;
  }
  
  p {
    color: var(--gray);
    font-size: 1.1rem;
    font-weight: 500;
  }
`;

const FounderSection = styled.section`
  padding: 120px 0;
  background: linear-gradient(135deg, var(--light-green) 0%, var(--white) 100%);
`;

const FounderContent = styled.div`
  max-width: 1200px;
  margin: 0 auto;
  padding: 0 20px;
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 80px;
  align-items: center;
  
  @media (max-width: 768px) {
    grid-template-columns: 1fr;
    gap: 50px;
  }
`;

const FounderImage = styled.div`
  position: relative;
  text-align: center;
  
  .profile-placeholder {
    width: 300px;
    height: 300px;
    border-radius: 50%;
    background: var(--gradient-primary);
    display: flex;
    align-items: center;
    justify-content: center;
    margin: 0 auto;
    font-size: 4rem;
    color: white;
    font-weight: bold;
    box-shadow: 0 20px 40px rgba(50, 205, 50, 0.3);
    border: 8px solid white;
  }
  
  .profile-photo {
    width: 300px;
    height: 300px;
    border-radius: 50%;
    object-fit: cover;
    margin: 0 auto;
    box-shadow: 0 20px 40px rgba(50, 205, 50, 0.3);
    border: 8px solid white;
  }
  
  .founder-badge {
    position: absolute;
    bottom: 20px;
    right: 50%;
    transform: translateX(50%);
    background: var(--gold);
    color: white;
    padding: 8px 16px;
    border-radius: 20px;
    font-size: 0.9rem;
    font-weight: bold;
    box-shadow: 0 5px 15px rgba(255, 215, 0, 0.3);
  }
`;

const FounderInfo = styled.div`
  h2 {
    color: var(--dark-green);
    margin-bottom: 20px;
    font-size: 2.8rem;
    position: relative;
    
    &::after {
      content: '';
      position: absolute;
      bottom: -10px;
      left: 0;
      width: 60px;
      height: 4px;
      background: var(--primary-green);
      border-radius: 2px;
    }
  }
  
  .founder-title {
    color: var(--primary-green);
    font-size: 1.3rem;
    font-weight: 600;
    margin-bottom: 30px;
    display: flex;
    align-items: center;
    gap: 10px;
  }
  
  p {
    color: var(--gray);
    line-height: 1.8;
    margin-bottom: 20px;
    font-size: 1.1rem;
  }
  
  .founder-quote {
    font-style: italic;
    color: var(--dark-green);
    font-size: 1.2rem;
    margin: 30px 0;
    padding: 20px;
    background: rgba(50, 205, 50, 0.1);
    border-left: 4px solid var(--primary-green);
    border-radius: 0 10px 10px 0;
  }
  
  .founder-stats {
    display: grid;
    grid-template-columns: repeat(2, 1fr);
    gap: 20px;
    margin-top: 30px;
  }
  
  .stat-item {
    text-align: center;
    padding: 15px;
    background: white;
    border-radius: 10px;
    box-shadow: 0 5px 15px rgba(50, 205, 50, 0.1);
    
    .stat-number {
      font-size: 1.8rem;
      font-weight: bold;
      color: var(--primary-green);
    }
    
    .stat-label {
      font-size: 0.9rem;
      color: var(--gray);
      margin-top: 5px;
    }
  }
`;

const About = () => {
  const values = [
    {
      icon: <FaHeart />,
      title: "Passion",
      description: "Nous mettons notre passion au service de vos rêves pour créer des décors uniques et mémorables."
    },
    {
      icon: <FaStar />,
      title: "Excellence",
      description: "Chaque détail est soigneusement pensé pour garantir une qualité exceptionnelle dans toutes nos créations."
    },
    {
      icon: <FaUsers />,
      title: "Service Client",
      description: "Votre satisfaction est notre priorité. Nous vous accompagnons à chaque étape de votre projet."
    },
    {
      icon: <FaAward />,
      title: "Innovation",
      description: "Nous créons des décors innovants et tendance pour des événements qui sortent de l'ordinaire."
    }
  ];

  const stats = [
    { number: "500+", label: "Événements Réalisés" },
    { number: "50+", label: "Produits de Décoration" },
    { number: "98%", label: "Clients Satisfaits" },
    { number: "5", label: "Années d'Expérience" }
  ];

  return (
    <AboutContainer>
      <HeroSection>
        <div className="container">
          <motion.h1
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
          >
            À Propos de Nadia Event's Decor
          </motion.h1>
          <motion.p
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            style={{ fontSize: '1.3rem', marginTop: '20px' }}
          >
            Fondé par Nadine Kechiamen Nganou, nous créons des moments magiques depuis 2019
          </motion.p>
        </div>
      </HeroSection>

      <FounderSection>
        <FounderContent>
          <motion.div
            initial={{ opacity: 0, x: -50 }}
            whileInView={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
          >
            <FounderImage>
              {/* Placeholder pour la photo de profil - à remplacer par la vraie photo */}
              <div className="profile-placeholder">
                NK
              </div>
              {/* Décommentez la ligne suivante quand vous aurez la photo */}
              {/* <img src="/assets/images/founder/nadine-profile.jpg" alt="Nadine Kechiamen Nganou" className="profile-photo" /> */}
              <div className="founder-badge">
                <FaCrown /> Fondatrice
              </div>
            </FounderImage>
          </motion.div>
          
          <motion.div
            initial={{ opacity: 0, x: 50 }}
            whileInView={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
          >
            <FounderInfo>
              <h2>Nadine Kechiamen Nganou</h2>
              <div className="founder-title">
                <FaLightbulb />
                Fondatrice & Directrice Créative
              </div>
              
              <p>
                Passionnée de décoration depuis son plus jeune âge, Nadine Kechiamen Nganou a transformé 
                sa vision créative en une entreprise florissante qui redéfinit l'art de la décoration événementielle.
              </p>
              
              <p>
                Avec plus de 15 ans d'expérience dans le domaine, elle a développé une expertise unique 
                dans la création d'ambiances magiques et mémorables. Son approche personnalisée et son 
                attention aux détails font d'elle une référence dans le secteur.
              </p>
              
              <div className="founder-quote">
                "Chaque événement raconte une histoire unique. Mon rôle est de donner vie à cette histoire 
                à travers des décors qui émerveillent et inspirent."
              </div>
              
              <p>
                Sous sa direction, Nadia Event's Decor est devenue synonyme d'excellence, d'innovation 
                et de service client exceptionnel. Son leadership visionnaire continue d'inspirer 
                notre équipe à repousser les limites de la créativité.
              </p>
              
              <div className="founder-stats">
                {stats.map((stat, index) => (
                  <div key={index} className="stat-item">
                    <div className="stat-number">{stat.number}</div>
                    <div className="stat-label">{stat.label}</div>
                  </div>
                ))}
              </div>
            </FounderInfo>
          </motion.div>
        </FounderContent>
      </FounderSection>

      <StorySection>
        <StoryContent>
          <motion.div
            initial={{ opacity: 0, x: -50 }}
            whileInView={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
          >
            <StoryImage>
              <img src="/assets/images/decorations/IMG_0921.jpeg" alt="Nadine Kechiamen Nganou" />
            </StoryImage>
          </motion.div>
          
          <motion.div
            initial={{ opacity: 0, x: 50 }}
            whileInView={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
          >
            <StoryText>
              <h2>Notre Histoire</h2>
              <p>
                Nadia Event's Decor est né de la passion de Nadine Kechiamen Nganou pour la beauté 
                et l'art de la décoration. Après avoir assisté à de nombreux événements où la 
                décoration laissait à désirer, elle a décidé de créer sa propre entreprise pour 
                offrir des services de décoration événementielle de qualité.
              </p>
              <p>
                Depuis 2019, nous avons eu le privilège de participer à plus de 500 événements, 
                transformant des espaces ordinaires en lieux extraordinaires. Chaque projet est 
                une nouvelle aventure créative qui nous permet de donner vie aux rêves de nos clients.
              </p>
              <p>
                Notre équipe passionnée travaille avec dévouement pour créer des décors uniques 
                qui reflètent la personnalité et les souhaits de chaque client. Nous croyons que 
                chaque événement mérite d'être exceptionnel.
              </p>
            </StoryText>
          </motion.div>
        </StoryContent>
      </StorySection>

      <ValuesSection>
        <div className="container">
          <div className="section-title">
            <h2>Nos Valeurs</h2>
            <p>Les principes qui guident notre travail et notre relation avec nos clients</p>
          </div>
          <ValuesGrid>
            {values.map((value, index) => (
              <ValueCard
                key={index}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: index * 0.1 }}
                viewport={{ once: true }}
              >
                <ValueIcon>{value.icon}</ValueIcon>
                <h3>{value.title}</h3>
                <p>{value.description}</p>
              </ValueCard>
            ))}
          </ValuesGrid>
        </div>
      </ValuesSection>

      <StatsSection>
        <div className="container">
          <StatsGrid>
            {stats.map((stat, index) => (
              <StatItem
                key={index}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: index * 0.1 }}
                viewport={{ once: true }}
              >
                <h3>{stat.number}</h3>
                <p>{stat.label}</p>
              </StatItem>
            ))}
          </StatsGrid>
        </div>
      </StatsSection>
    </AboutContainer>
  );
};

export default About; 