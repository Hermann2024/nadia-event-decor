import React, { useState, useEffect } from 'react';
import { Routes, Route, useLocation, Navigate } from 'react-router-dom';
import styled from 'styled-components';
import Header from './components/Header';
import Footer from './components/Footer';
import Home from './pages/Home';
import Products from './pages/Products';
import About from './pages/About';
import Contact from './pages/Contact';
import Admin from './pages/Admin';
import SoundEffects from './components/SoundEffects';
import ChatWidget from './components/ChatWidget';
import Login from './components/Login';
import ProtectedRoute from './components/ProtectedRoute';
import Videos from './pages/Video';
import './styles/global.css';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import './components/ToastifyCustom.css';

const AppContainer = styled.div`
  min-height: 100vh;
  position: relative;
`;

const MainContent = styled.main`
  min-height: calc(100vh - 200px);
`;

function AppContent() {
  const [isSoundEnabled, setIsSoundEnabled] = useState(true);
  const location = useLocation();
  const isAdminPage = location.pathname === '/admin';

  useEffect(() => {
    // Effet sonore de démarrage
    if (isSoundEnabled && !isAdminPage) {
      const audio = new Audio('/sounds/welcome.mp3');
      audio.volume = 0.3;
      audio.play().catch(e => console.log('Audio autoplay blocked'));
    }
  }, [isSoundEnabled, isAdminPage]);

  return (
    <AppContainer>
      {/* <GoldenStars /> */}
      <SoundEffects isEnabled={isSoundEnabled} />
      
      {!isAdminPage && (
        <Header onSoundToggle={() => setIsSoundEnabled(!isSoundEnabled)} />
      )}
      
      <MainContent>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/products" element={<Products />} />
          <Route path="/about" element={<About />} />
          <Route path="/contact" element={<Contact />} />
          <Route path="/video" element={<Videos />} />
          <Route path="/login" element={<Login />} />
          <Route 
            path="/admin" 
            element={
              <ProtectedRoute>
                <Admin />
              </ProtectedRoute>
            } 
          />
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </MainContent>
      
      {!isAdminPage && <Footer />}
      {!isAdminPage && <ChatWidget />}
      
      {/* Configuration Toastify */}
      <ToastContainer
        position="top-right"
        autoClose={4000}
        hideProgressBar={false}
        newestOnTop={false}
        closeOnClick
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover
        theme="light"
        toastClassName="custom-toast"
        bodyClassName="custom-toast-body"
        progressClassName="custom-toast-progress"
      />
    </AppContainer>
  );
}

function App() {
  return <AppContent />;
}

export default App; 