import React, { useState, useEffect } from 'react';
import styled from 'styled-components';
import { motion } from 'framer-motion';
import { FaSearch, FaFilter, FaHeart, FaEye } from 'react-icons/fa';

const ProductsContainer = styled.div`
  padding-top: 100px;
  min-height: 100vh;
  background: var(--light-green);
`;

const ProductsHeader = styled.div`
  background: var(--gradient-primary);
  color: white;
  padding: 60px 0;
  text-align: center;
`;

const FiltersSection = styled.div`
  background: white;
  padding: 30px 0;
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
`;

const FiltersContainer = styled.div`
  max-width: 1200px;
  margin: 0 auto;
  padding: 0 20px;
  display: flex;
  gap: 20px;
  align-items: center;
  flex-wrap: wrap;
`;

const SearchBox = styled.div`
  position: relative;
  flex: 1;
  min-width: 300px;
  
  input {
    width: 100%;
    padding: 12px 45px 12px 15px;
    border: 2px solid var(--primary-green);
    border-radius: 25px;
    font-size: 1rem;
    outline: none;
    transition: all 0.3s ease;
    
    &:focus {
      box-shadow: 0 0 0 3px rgba(50, 205, 50, 0.1);
    }
  }
  
  svg {
    position: absolute;
    right: 15px;
    top: 50%;
    transform: translateY(-50%);
    color: var(--primary-green);
  }
`;

const FilterSelect = styled.select`
  padding: 12px 20px;
  border: 2px solid var(--primary-green);
  border-radius: 25px;
  background: white;
  color: var(--dark-green);
  font-size: 1rem;
  outline: none;
  cursor: pointer;
  transition: all 0.3s ease;
  
  &:focus {
    box-shadow: 0 0 0 3px rgba(50, 205, 50, 0.1);
  }
`;

const ProductsGrid = styled.div`
  max-width: 1200px;
  margin: 0 auto;
  padding: 60px 20px;
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(350px, 1fr));
  gap: 30px;
`;

const ProductCard = styled(motion.div)`
  background: white;
  border-radius: 20px;
  overflow: hidden;
  box-shadow: 0 10px 30px rgba(0, 0, 0, 0.1);
  transition: all 0.3s ease;
  
  &:hover {
    transform: translateY(-10px);
    box-shadow: 0 20px 40px rgba(50, 205, 50, 0.2);
  }
`;

const ProductImage = styled.div`
  position: relative;
  height: 300px;
  overflow: hidden;
  
  img {
    width: 100%;
    height: 100%;
    object-fit: cover;
    transition: transform 0.3s ease;
  }
  
  ${ProductCard}:hover & img {
    transform: scale(1.1);
  }
`;

const ProductOverlay = styled.div`
  position: absolute;
  top: 15px;
  right: 15px;
  display: flex;
  gap: 10px;
  opacity: 0;
  transition: opacity 0.3s ease;
  
  ${ProductCard}:hover & {
    opacity: 1;
  }
`;

const ActionButton = styled.button`
  width: 40px;
  height: 40px;
  border-radius: 50%;
  border: none;
  background: rgba(255, 255, 255, 0.9);
  color: var(--primary-green);
  cursor: pointer;
  transition: all 0.3s ease;
  display: flex;
  align-items: center;
  justify-content: center;
  
  &:hover {
    background: var(--primary-green);
    color: white;
    transform: scale(1.1);
  }
`;

const ProductInfo = styled.div`
  padding: 20px;
  text-align: center;
`;

const ProductTitle = styled.h3`
  color: var(--dark-green);
  margin-bottom: 10px;
  font-size: 1.3rem;
  font-weight: 600;
`;

const ProductCategory = styled.span`
  color: var(--primary-green);
  font-size: 0.9rem;
  font-weight: 500;
  background: rgba(50, 205, 50, 0.1);
  padding: 5px 15px;
  border-radius: 20px;
`;

const ProductDescription = styled.p`
  color: #555;
  font-size: 1rem;
  margin-top: 10px;
  font-style: italic;
  min-height: 48px;
`;

const ModalOverlay = styled.div`
  position: fixed;
  top: 0; left: 0; right: 0; bottom: 0;
  background: rgba(0,0,0,0.7);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 1000;
`;

const ModalContent = styled.div`
  background: white;
  border-radius: 20px;
  padding: 30px;
  max-width: 90vw;
  max-height: 90vh;
  box-shadow: 0 10px 40px rgba(0,0,0,0.2);
  text-align: center;
  position: relative;
`;

const ModalImage = styled.img`
  max-width: 80vw;
  max-height: 60vh;
  border-radius: 15px;
  margin-bottom: 20px;
`;

const CloseButton = styled.button`
  position: absolute;
  top: 15px;
  right: 15px;
  background: var(--primary-green);
  color: white;
  border: none;
  border-radius: 50%;
  width: 35px;
  height: 35px;
  font-size: 1.2rem;
  cursor: pointer;
`;

const Products = () => {
  const [products, setProducts] = useState([]);
  const [filteredProducts, setFilteredProducts] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('');
  const [loading, setLoading] = useState(true);
  const [modalProduct, setModalProduct] = useState(null);

  // ⚠️ NOUVEAU : Catalogue enrichi avec toutes les photos disponibles
  const mockProducts = [
    // Produits existants (1-40)
    {
      id: 1,
      name: "Arche de mariage florale blanche",
      category: "Mariage",
      imageUrl: "/assets/images/decorations/ff26f7a9-acab-4c5b-9a25-728e8f8a81bd.JPG",
      available: true,
      description: "Arche élégante ornée de fleurs blanches, parfaite pour une cérémonie de mariage romantique."
    },
    {
      id: 2,
      name: "Arche de cérémonie avec rideaux",
      category: "Mariage",
      imageUrl: "/assets/images/decorations/02923311-a9be-4da5-a6e7-f9b803635ddc.JPG",
      available: true,
      description: "Arche de cérémonie décorée de rideaux, idéale pour un fond raffiné lors de votre mariage."
    },
    {
      id: 3,
      name: "Arche de mariage dorée luxueuse",
      category: "Mariage",
      imageUrl: "/assets/images/decorations/58ef184d-e587-4c8c-b75b-fddb9fd98079.JPG",
      available: true,
      description: "Arche dorée au style luxueux, apportant une touche d'élégance à votre événement."
    },
    {
      id: 4,
      name: "Arche ronde moderne blanche",
      category: "Mariage",
      imageUrl: "/assets/images/decorations/563c5c26-78f5-4008-9887-0e65c68e2729.JPG",
      available: true
    },
    {
      id: 5,
      name: "Arche de mariage avec guirlandes",
      category: "Mariage",
      imageUrl: "/assets/images/decorations/1a90f8ce-c126-4cd5-be89-a3bda046baee.JPG",
      available: true
    },
    {
      id: 6,
      name: "Arche de cérémonie avec fleurs roses",
      category: "Mariage",
      imageUrl: "/assets/images/decorations/71f6edb6-ceaa-4493-b90c-bf73e034b9b1.JPG",
      available: true
    },
    {
      id: 7,
      name: "Arche de mariage avec rideaux dorés",
      category: "Mariage",
      imageUrl: "/assets/images/decorations/84022810-af90-4397-9b66-f5e9887d22f1.JPG",
      available: true
    },
    {
      id: 8,
      name: "Arche de cérémonie blanche classique",
      category: "Mariage",
      imageUrl: "/assets/images/decorations/5e6dc65d-fb3b-4160-bd88-41c18f47204d.JPG",
      available: true
    },
    {
      id: 9,
      name: "Arche de mariage avec tissus",
      category: "Mariage",
      imageUrl: "/assets/images/decorations/5dc0bb6d-e390-4d46-b4ca-5371cd6cae7e.JPG",
      available: true
    },
    {
      id: 10,
      name: "Arche de cérémonie avec rideaux blancs",
      category: "Mariage",
      imageUrl: "/assets/images/decorations/df55366c-59c9-475a-9b88-4397e294f550.JPG",
      available: true
    },
    {
      id: 11,
      name: "Arche de mariage avec guirlandes dorées",
      category: "Mariage",
      imageUrl: "/assets/images/decorations/352b7cb9-4583-427a-a2f4-449f0dc16654.JPG",
      available: true
    },
    {
      id: 12,
      name: "Arche de cérémonie avec fleurs blanches",
      category: "Mariage",
      imageUrl: "/assets/images/decorations/fa2cfdc0-4f31-4854-92bf-8f0d5717fff5.JPG",
      available: true
    },
    {
      id: 13,
      name: "Arche de mariage avec rideaux et fleurs",
      category: "Mariage",
      imageUrl: "/assets/images/decorations/d3fe1b88-408c-461d-91d6-c35035fee0f7.JPG",
      available: true
    },
    {
      id: 14,
      name: "Arche de cérémonie avec guirlandes blanches",
      category: "Mariage",
      imageUrl: "/assets/images/decorations/7ab2a718-ff9f-4a98-9b4b-cc40873e75bd.JPG",
      available: true
    },
    {
      id: 15,
      name: "Arche de mariage avec tissus blancs",
      category: "Mariage",
      imageUrl: "/assets/images/decorations/b51b63b9-69d0-4079-ad01-b16990c5c5d4.JPG",
      available: true
    },
    {
      id: 16,
      name: "Arche de cérémonie avec rideaux dorés",
      category: "Mariage",
      imageUrl: "/assets/images/decorations/ac8c2b2e-dd7b-476b-94a0-a6882b415fe9.JPG",
      available: true
    },
    {
      id: 17,
      name: "Arche de mariage avec guirlandes florales",
      category: "Mariage",
      imageUrl: "/assets/images/decorations/0d30a120-ac1a-4ea3-b742-6f149d537a27.JPG",
      available: true
    },
    {
      id: 18,
      name: "Arche de cérémonie ronde moderne",
      category: "Mariage",
      imageUrl: "/assets/images/decorations/645a8f1d-d439-41b1-bec5-faa8e7b0ca18.JPG",
      available: true
    },
    {
      id: 19,
      name: "Arche de mariage avec fleurs suspendues",
      category: "Mariage",
      imageUrl: "/assets/images/decorations/5396bdb0-a5af-42a8-a26e-4f5096d68437.JPG",
      available: true
    },
    {
      id: 20,
      name: "Arche de cérémonie avec rideaux blancs",
      category: "Mariage",
      imageUrl: "/assets/images/decorations/96ec9be0-c772-40f7-9ffc-2721a5388783.JPG",
      available: true
    },
    {
      id: 21,
      name: "Arche de mariage avec tissus et fleurs",
      category: "Mariage",
      imageUrl: "/assets/images/decorations/ac01d8d9-4d6f-4850-ad0e-e68a645a2f2e.JPG",
      available: true
    },
    {
      id: 22,
      name: "Arche de cérémonie avec guirlandes",
      category: "Mariage",
      imageUrl: "/assets/images/decorations/e46c90a7-d041-466e-b6d0-a11c185df56a.JPG",
      available: true
    },
    {
      id: 23,
      name: "Arche de mariage avec rideaux dorés",
      category: "Mariage",
      imageUrl: "/assets/images/decorations/59a6c21a-3ffc-457a-834d-d60ae941cf1d.JPG",
      available: true
    },
    {
      id: 24,
      name: "Arche de cérémonie avec fleurs blanches",
      category: "Mariage",
      imageUrl: "/assets/images/decorations/50b868e2-da7a-4069-a054-bde82c51212d.JPG",
      available: true
    },
    {
      id: 25,
      name: "Arche de mariage avec tissus blancs",
      category: "Mariage",
      imageUrl: "/assets/images/decorations/98305edb-6a4f-4907-bedd-522b6874e868.JPG",
      available: true
    },
    {
      id: 26,
      name: "Arche de cérémonie moderne",
      category: "Mariage",
      imageUrl: "/assets/images/decorations/e0c0bbba-4166-452b-8d3d-15bed0d07dea.JPG",
      available: true
    },
    {
      id: 27,
      name: "Arche de mariage avec guirlandes dorées",
      category: "Mariage",
      imageUrl: "/assets/images/decorations/649408e9-5bdd-4a2f-aa59-cc4924538dfc.JPG",
      available: true
    },
    {
      id: 28,
      name: "Arche de cérémonie avec rideaux",
      category: "Mariage",
      imageUrl: "/assets/images/decorations/ac57cd94-d7ae-41f0-9132-fa40de76f4ca.JPG",
      available: true
    },
    {
      id: 29,
      name: "Arche de mariage avec tissus et rideaux",
      category: "Mariage",
      imageUrl: "/assets/images/decorations/c12e7392-6ad3-4ac7-ab9c-5254144e745f.JPG",
      available: true
    },
    {
      id: 30,
      name: "Arche de cérémonie avec fleurs roses",
      category: "Mariage",
      imageUrl: "/assets/images/decorations/1d396254-67c7-45bf-bf6e-499c5ec28f81.JPG",
      available: true
    },
    {
      id: 31,
      name: "Arche de mariage avec guirlandes blanches",
      category: "Mariage",
      imageUrl: "/assets/images/decorations/5d0a1c8e-5db9-481b-aeb9-a78c28e92a8f.JPG",
      available: true
    },
    {
      id: 32,
      name: "Arche de cérémonie blanche classique",
      category: "Mariage",
      imageUrl: "/assets/images/decorations/369845e3-ead8-4fb2-9782-599ecaa74232.JPG",
      available: true
    },
    {
      id: 33,
      name: "Arche de mariage avec tissus blancs",
      category: "Mariage",
      imageUrl: "/assets/images/decorations/7c0b0685-0309-4e52-91b4-a7bdeadbd0aa.JPG",
      available: true
    },
    {
      id: 34,
      name: "Arche de cérémonie avec guirlandes",
      category: "Mariage",
      imageUrl: "/assets/images/decorations/c0269945-7317-45e7-87bc-a78933729a08.JPG",
      available: true
    },
    {
      id: 35,
      name: "Arche de mariage avec rideaux blancs",
      category: "Mariage",
      imageUrl: "/assets/images/decorations/e4673bb3-5001-461c-9890-0c27c7861b02.JPG",
      available: true
    },
    {
      id: 36,
      name: "Décoration de table élégante",
      category: "Événements",
      imageUrl: "/assets/images/decorations/014910c4-9368-42db-8cc6-69d9ecb52e5a.JPG",
      available: true
    },
    {
      id: 37,
      name: "Centre de table floral",
      category: "Événements",
      imageUrl: "/assets/images/decorations/002e3752-13f3-46c0-912e-56eb7dbafa78.JPG",
      available: true
    },
    {
      id: 38,
      name: "Décoration de salle de réception",
      category: "Événements",
      imageUrl: "/assets/images/decorations/0eb48322-1092-46eb-b469-dd3c3ac9f86c.JPG",
      available: true
    },
    {
      id: 39,
      name: "Éclairage d'ambiance",
      category: "Éclairage",
      imageUrl: "/assets/images/decorations/13e22580-539c-42b2-b692-06f8bffd7e53.JPG",
      available: true
    },
    {
      id: 40,
      name: "Décoration d'anniversaire",
      category: "Anniversaire",
      imageUrl: "/assets/images/decorations/02923311-a9be-4da5-a6e7-f9b803635ddc.JPG",
      available: true
    },
    // ⚠️ NOUVEAU : Ajout de 50+ nouveaux produits avec toutes les photos disponibles
    {
      id: 41,
      name: "Décoration florale élégante",
      category: "Événements",
      imageUrl: "/assets/images/decorations/fb6ff84d-a84a-45a8-bbfa-b043b70418eb.JPG",
      available: true
    },
    {
      id: 42,
      name: "Arche de mariage avec rideaux blancs",
      category: "Mariage",
      imageUrl: "/assets/images/decorations/faeb14cd-f3fa-4718-8dbb-701dae0da37f.JPG",
      available: true
    },
    {
      id: 43,
      name: "Décoration de table de mariage",
      category: "Mariage",
      imageUrl: "/assets/images/decorations/fd590228-30fc-4d4a-b538-e8ca1d940f97.JPG",
      available: true
    },
    {
      id: 44,
      name: "Arche de cérémonie avec tissus",
      category: "Mariage",
      imageUrl: "/assets/images/decorations/b2df716c-5ab6-463c-ac3a-ebb1bb8f00fa.JPG",
      available: true
    },
    {
      id: 45,
      name: "Décoration florale moderne",
      category: "Événements",
      imageUrl: "/assets/images/decorations/ef9bdfb1-c0fc-4b06-b85f-8d4333af39be.JPG",
      available: true
    },
    {
      id: 46,
      name: "Arche de mariage avec guirlandes",
      category: "Mariage",
      imageUrl: "/assets/images/decorations/edccfdd7-916c-4142-be9a-4a4700a3bdd9.JPG",
      available: true
    },
    {
      id: 47,
      name: "Décoration de salle élégante",
      category: "Événements",
      imageUrl: "/assets/images/decorations/dde7d60f-c5c7-49c4-b42e-64192d98121d.JPG",
      available: true
    },
    {
      id: 48,
      name: "Arche de cérémonie avec fleurs",
      category: "Mariage",
      imageUrl: "/assets/images/decorations/32f8e0d0-7545-47e7-a8fa-8d044c7ffed0.JPG",
      available: true
    },
    {
      id: 49,
      name: "Décoration de table de réception",
      category: "Événements",
      imageUrl: "/assets/images/decorations/daecc5f6-8b5a-491a-a583-225bf8d96e9d.JPG",
      available: true
    },
    {
      id: 50,
      name: "Arche de mariage avec rideaux dorés",
      category: "Mariage",
      imageUrl: "/assets/images/decorations/ab8ac749-aa9e-487c-823b-25016234ddd0.JPG",
      available: true
    },
    {
      id: 51,
      name: "Décoration florale de mariage",
      category: "Mariage",
      imageUrl: "/assets/images/decorations/0f3319b9-9d05-4af3-b4ee-89376eb5f8f4.JPG",
      available: true
    },
    {
      id: 52,
      name: "Arche de cérémonie moderne",
      category: "Mariage",
      imageUrl: "/assets/images/decorations/cfa2a157-d723-488f-a52a-460ff51caa09.JPG",
      available: true
    },
    {
      id: 53,
      name: "Décoration de table élégante",
      category: "Événements",
      imageUrl: "/assets/images/decorations/a647009c-0538-459d-8e82-51584a9fb9ca.JPG",
      available: true
    },
    {
      id: 54,
      name: "Arche de mariage avec tissus blancs",
      category: "Mariage",
      imageUrl: "/assets/images/decorations/cecd8c8a-efe1-42ea-8deb-a0da6a9c21fd.JPG",
      available: true
    },
    {
      id: 55,
      name: "Décoration de salle de mariage",
      category: "Mariage",
      imageUrl: "/assets/images/decorations/5775911e-cbeb-4796-9894-8c2d37fe4c6d.JPG",
      available: true
    },
    {
      id: 56,
      name: "Arche de cérémonie avec fleurs blanches",
      category: "Mariage",
      imageUrl: "/assets/images/decorations/5ebca71e-50a0-45e9-aa89-b475b740b749.JPG",
      available: true
    },
    {
      id: 57,
      name: "Décoration de table de cérémonie",
      category: "Événements",
      imageUrl: "/assets/images/decorations/2af76391-d078-4d30-a177-f24007a656cd.JPG",
      available: true
    },
    {
      id: 58,
      name: "Arche de mariage avec guirlandes dorées",
      category: "Mariage",
      imageUrl: "/assets/images/decorations/96f4ac27-e7cc-471b-bb22-7b4890a60851.JPG",
      available: true
    },
    {
      id: 59,
      name: "Décoration florale élégante",
      category: "Événements",
      imageUrl: "/assets/images/decorations/3328b414-78e4-4292-b59e-10823d08f3eb.JPG",
      available: true
    },
    {
      id: 60,
      name: "Arche de cérémonie avec rideaux",
      category: "Mariage",
      imageUrl: "/assets/images/decorations/7d97c41e-8211-40cb-8524-b49df48a8bb3.JPG",
      available: true
    },
    {
      id: 61,
      name: "Décoration de table de réception",
      category: "Événements",
      imageUrl: "/assets/images/decorations/1bc9d55b-2ae2-4f02-98d1-ccf1df092d0b.JPG",
      available: true
    },
    {
      id: 62,
      name: "Arche de mariage avec tissus",
      category: "Mariage",
      imageUrl: "/assets/images/decorations/92d072ce-89da-4a55-ab69-e8c19b1bb05e.JPG",
      available: true
    },
    {
      id: 63,
      name: "Décoration de salle élégante",
      category: "Événements",
      imageUrl: "/assets/images/decorations/3ebc7ce3-967b-4d46-938e-7b067e2ef45e.JPG",
      available: true
    },
    {
      id: 64,
      name: "Arche de cérémonie avec fleurs",
      category: "Mariage",
      imageUrl: "/assets/images/decorations/b58672ef-eb43-4504-9704-0841ce6869e3.JPG",
      available: true
    },
    {
      id: 65,
      name: "Décoration de table de mariage",
      category: "Mariage",
      imageUrl: "/assets/images/decorations/2e04df6a-b30d-4dfc-93c4-615c4a504cf2.JPG",
      available: true
    },
    {
      id: 66,
      name: "Arche de mariage avec rideaux blancs",
      category: "Mariage",
      imageUrl: "/assets/images/decorations/2e4b24b9-13aa-45a0-bd54-409fbc0897ee.JPG",
      available: true
    },
    {
      id: 67,
      name: "Décoration florale moderne",
      category: "Événements",
      imageUrl: "/assets/images/decorations/c9849b1d-cd22-486c-881a-001cecc3e104.JPG",
      available: true
    },
    {
      id: 68,
      name: "Arche de cérémonie avec tissus",
      category: "Mariage",
      imageUrl: "/assets/images/decorations/aacb13d9-83fa-4a9b-9def-7f3a443c0ccd.JPG",
      available: true
    },
    {
      id: 69,
      name: "Décoration de salle de réception",
      category: "Événements",
      imageUrl: "/assets/images/decorations/cbe14bb4-dd0b-425b-9868-5df5c3e752c6.JPG",
      available: true
    },
    {
      id: 70,
      name: "Arche de mariage avec fleurs blanches",
      category: "Mariage",
      imageUrl: "/assets/images/decorations/cab11059-5c5d-4626-a0ae-9007e837426b.JPG",
      available: true
    },
    {
      id: 71,
      name: "Décoration de table élégante",
      category: "Événements",
      imageUrl: "/assets/images/decorations/f96ba1f5-efbb-4d88-89a1-40c03e914610.JPG",
      available: true
    },
    {
      id: 72,
      name: "Arche de cérémonie avec rideaux dorés",
      category: "Mariage",
      imageUrl: "/assets/images/decorations/ff54c16e-84a8-40f5-a0d9-3a93d61e9c70.JPG",
      available: true
    },
    {
      id: 73,
      name: "Décoration florale de mariage",
      category: "Mariage",
      imageUrl: "/assets/images/decorations/d686bcc7-8620-408a-b1db-e79357c52b40.JPG",
      available: true
    },
    {
      id: 74,
      name: "Arche de mariage avec tissus blancs",
      category: "Mariage",
      imageUrl: "/assets/images/decorations/28d965c3-2f8a-4556-af1c-be0203c51afe.JPG",
      available: true
    },
    {
      id: 75,
      name: "Décoration de table de cérémonie",
      category: "Événements",
      imageUrl: "/assets/images/decorations/734c10e8-0a91-4be0-aa63-4240f4c2b3b9.JPG",
      available: true
    },
    {
      id: 76,
      name: "Arche de cérémonie avec fleurs",
      category: "Mariage",
      imageUrl: "/assets/images/decorations/cecd8c8a-efe1-42ea-8deb-a0da6a9c21fd 2.JPG",
      available: true
    },
    {
      id: 77,
      name: "Décoration de salle élégante",
      category: "Événements",
      imageUrl: "/assets/images/decorations/22667b9b-c893-407f-ad66-7842bbfb9b3b 2.JPG",
      available: true
    },
    {
      id: 78,
      name: "Arche de mariage avec rideaux",
      category: "Mariage",
      imageUrl: "/assets/images/decorations/91f21a4c-7a3c-46bb-8d71-f8246902dc07.JPG",
      available: true
    },
    {
      id: 79,
      name: "Décoration de table de réception",
      category: "Événements",
      imageUrl: "/assets/images/decorations/66202dc7-3e78-4306-9bd2-76ab388e5f28.JPG",
      available: true
    },
    {
      id: 80,
      name: "Arche de cérémonie avec tissus",
      category: "Mariage",
      imageUrl: "/assets/images/decorations/b77f5276-66de-4120-a950-2769f96540cc.JPG",
      available: true
    },
    {
      id: 81,
      name: "Décoration florale moderne",
      category: "Événements",
      imageUrl: "/assets/images/decorations/cbe14bb4-dd0b-425b-9868-5df5c3e752c6 2.JPG",
      available: true
    },
    {
      id: 82,
      name: "Arche de mariage avec fleurs blanches",
      category: "Mariage",
      imageUrl: "/assets/images/decorations/ae7462a0-88b1-4ea4-9c5e-24c4fc2e4c3a.JPG",
      available: true
    },
    {
      id: 83,
      name: "Décoration de salle de réception",
      category: "Événements",
      imageUrl: "/assets/images/decorations/daecc5f6-8b5a-491a-a583-225bf8d96e9d 2.JPG",
      available: true
    },
    {
      id: 84,
      name: "Arche de cérémonie avec rideaux dorés",
      category: "Mariage",
      imageUrl: "/assets/images/decorations/35e9ea30-c553-426d-8811-1df9ca45bc31.JPG",
      available: true
    },
    {
      id: 85,
      name: "Décoration de table élégante",
      category: "Événements",
      imageUrl: "/assets/images/decorations/82e2abff-089c-4c75-9e5c-bd7e7de1e28f.JPG",
      available: true
    },
    {
      id: 86,
      name: "Arche de mariage avec tissus blancs",
      category: "Mariage",
      imageUrl: "/assets/images/decorations/ce6b534a-9960-438c-889f-b1fdd1275236.JPG",
      available: true
    },
    {
      id: 87,
      name: "Décoration florale de mariage",
      category: "Mariage",
      imageUrl: "/assets/images/decorations/624aa154-fb19-43a1-ab4f-c4deba2968f3.JPG",
      available: true
    },
    {
      id: 88,
      name: "Arche de cérémonie avec fleurs",
      category: "Mariage",
      imageUrl: "/assets/images/decorations/48909299-bfff-4acd-b697-949d21bd3799 2.JPG",
      available: true
    },
    {
      id: 89,
      name: "Décoration de table de cérémonie",
      category: "Événements",
      imageUrl: "/assets/images/decorations/df55366c-59c9-475a-9b88-4397e294f550 2.JPG",
      available: true
    },
    {
      id: 90,
      name: "Arche de mariage avec rideaux blancs",
      category: "Mariage",
      imageUrl: "/assets/images/decorations/39a5f235-68f6-4dee-b62e-e175e832ce36.JPG",
      available: true
    },
    {
      id: 91,
      name: "Décoration de salle élégante",
      category: "Événements",
      imageUrl: "/assets/images/decorations/62fec61f-c51d-4b59-aabc-a816fd6c0c08.JPG",
      available: true
    },
    {
      id: 92,
      name: "Arche de cérémonie avec tissus",
      category: "Mariage",
      imageUrl: "/assets/images/decorations/e0e74e08-0dc1-4e91-8b81-dba5c5ad5415.JPG",
      available: true
    },
    {
      id: 93,
      name: "Décoration de table de réception",
      category: "Événements",
      imageUrl: "/assets/images/decorations/1f185d05-ec82-414a-be15-31b8f7fa7e10.JPG",
      available: true
    },
    {
      id: 94,
      name: "Arche de mariage avec fleurs blanches",
      category: "Mariage",
      imageUrl: "/assets/images/decorations/d721bd2f-ffcd-4951-bd0e-b2f771135ce5.JPG",
      available: true
    },
    {
      id: 95,
      name: "Décoration florale moderne",
      category: "Événements",
      imageUrl: "/assets/images/decorations/958cfee3-625c-4acb-83e4-a694ac4104ea.JPG",
      available: true
    },
    {
      id: 96,
      name: "Arche de cérémonie avec rideaux",
      category: "Mariage",
      imageUrl: "/assets/images/decorations/bb08e33a-6a29-4ccc-9e01-6866a1357992.JPG",
      available: true
    },
    {
      id: 97,
      name: "Décoration de table élégante",
      category: "Événements",
      imageUrl: "/assets/images/decorations/b02d472f-f61f-4b0d-9c6c-7954b4d2dfb8.JPG",
      available: true
    },
    {
      id: 98,
      name: "Arche de mariage avec tissus blancs",
      category: "Mariage",
      imageUrl: "/assets/images/decorations/e160c61b-b98d-4ff5-a516-35e68e689be9.JPG",
      available: true
    },
    {
      id: 99,
      name: "Décoration de salle de réception",
      category: "Événements",
      imageUrl: "/assets/images/decorations/ec7304b8-b738-4ca3-9e80-0b12218d6a3e.JPG",
      available: true
    },
    {
      id: 100,
      name: "Arche de cérémonie avec fleurs",
      category: "Mariage",
      imageUrl: "/assets/images/decorations/63cfef8e-7b47-441f-bcea-6c2506e5fb97.JPG",
      available: true
    }
  ].map(product => ({
    ...product,
    description: product.description || (
      product.category === "Mariage"
        ? `Décoration "${product.name}" idéale pour sublimer votre mariage.`
        : product.category === "Événements"
        ? `Élément "${product.name}" pour embellir tous vos événements.`
        : product.category === "Éclairage"
        ? `Éclairage "${product.name}" pour une ambiance unique.`
        : product.category === "Anniversaire"
        ? `Décoration "${product.name}" parfaite pour un anniversaire mémorable.`
        : `Décoration "${product.name}".`
    )
  }));

  const categories = ["Tous", "Mariage", "Événements", "Éclairage", "Anniversaire"];

  useEffect(() => {
    // Simuler le chargement des données
    setTimeout(() => {
      setProducts(mockProducts);
      setFilteredProducts(mockProducts);
      setLoading(false);
    }, 1000);
  }, []);

  useEffect(() => {
    // Filtrer les produits
    let filtered = products;

    if (searchTerm) {
      filtered = filtered.filter(product =>
        product.name.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    if (selectedCategory && selectedCategory !== "Tous") {
      filtered = filtered.filter(product => product.category === selectedCategory);
    }

    setFilteredProducts(filtered);
  }, [searchTerm, selectedCategory, products]);

  const handleAddToFavorites = (product) => {
    // Logique pour ajouter aux favoris
    console.log('Produit ajouté aux favoris:', product);
    if (window.playSound) {
      window.playSound('success');
    }
  };

  const handleViewProduct = (product) => {
    setModalProduct(product);
    if (window.playSound) {
      window.playSound('success');
    }
  };

  if (loading) {
    return (
      <ProductsContainer>
        <div style={{ textAlign: 'center', padding: '100px 20px' }}>
          <h2>Chargement des produits...</h2>
        </div>
      </ProductsContainer>
    );
  }

  return (
    <ProductsContainer>
      {/* Modale d'affichage de l'image */}
      {modalProduct && (
        <ModalOverlay onClick={() => setModalProduct(null)}>
          <ModalContent onClick={e => e.stopPropagation()}>
            <CloseButton onClick={() => setModalProduct(null)}>×</CloseButton>
            <ModalImage src={modalProduct.imageUrl} alt={modalProduct.name} />
            <h2>{modalProduct.name}</h2>
            <ProductCategory>{modalProduct.category}</ProductCategory>
            <ProductDescription>{modalProduct.description}</ProductDescription>
          </ModalContent>
        </ModalOverlay>
      )}
      <ProductsHeader>
        <div className="container">
          <h1>Nos Produits de Décoration</h1>
          <p>Découvrez notre collection complète d'éléments décoratifs pour tous vos événements</p>
        </div>
      </ProductsHeader>

      <FiltersSection>
        <FiltersContainer>
          <SearchBox>
            <input
              type="text"
              placeholder="Rechercher un produit..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
            <FaSearch />
          </SearchBox>

          <FilterSelect
            value={selectedCategory}
            onChange={(e) => setSelectedCategory(e.target.value)}
          >
            {categories.map(category => (
              <option key={category} value={category}>
                {category}
              </option>
            ))}
          </FilterSelect>
        </FiltersContainer>
      </FiltersSection>

      <ProductsGrid>
        {filteredProducts.map((product, index) => (
          <ProductCard
            key={product.id}
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: index * 0.1 }}
          >
            <ProductImage>
              <img src={product.imageUrl} alt={product.name} />
              <ProductOverlay>
                <ActionButton onClick={() => handleViewProduct(product)}>
                  <FaEye />
                </ActionButton>
                <ActionButton onClick={() => handleAddToFavorites(product)}>
                  <FaHeart />
                </ActionButton>
              </ProductOverlay>
            </ProductImage>

            <ProductInfo>
              <ProductTitle>{product.name}</ProductTitle>
              <ProductCategory>{product.category}</ProductCategory>
              <ProductDescription>{product.description}</ProductDescription>
            </ProductInfo>
          </ProductCard>
        ))}
      </ProductsGrid>
    </ProductsContainer>
  );
};

export default Products; 