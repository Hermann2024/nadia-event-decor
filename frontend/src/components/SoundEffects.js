import React, { useEffect, useRef } from 'react';

const SoundEffects = ({ isEnabled }) => {
  const audioRefs = useRef({});

  useEffect(() => {
    // Précharger les sons
    const sounds = {
      click: '/sounds/click.mp3',
      hover: '/sounds/hover.mp3',
      success: '/sounds/success.mp3',
      notification: '/sounds/notification.mp3'
    };

    Object.entries(sounds).forEach(([key, src]) => {
      audioRefs.current[key] = new Audio(src);
      audioRefs.current[key].volume = 0.3;
    });

    // Ajouter les event listeners pour les effets sonores
    if (isEnabled) {
      const addSoundEffect = (event, soundKey) => {
        const audio = audioRefs.current[soundKey];
        if (audio) {
          audio.currentTime = 0;
          audio.play().catch(e => console.log('Audio play failed:', e));
        }
      };

      // Effet sonore sur les clics de boutons
      const buttons = document.querySelectorAll('button, .btn, a[href]');
      buttons.forEach(button => {
        button.addEventListener('click', (event) => addSoundEffect(event, 'click'));
        button.addEventListener('mouseenter', (event) => addSoundEffect(event, 'hover'));
      });

      // Effet sonore sur les liens de navigation
      const navLinks = document.querySelectorAll('nav a');
      navLinks.forEach(link => {
        link.addEventListener('click', (event) => addSoundEffect(event, 'click'));
        link.addEventListener('mouseenter', (event) => addSoundEffect(event, 'hover'));
      });

      // Nettoyage des event listeners
      return () => {
        buttons.forEach(button => {
          button.removeEventListener('click', (event) => addSoundEffect(event, 'click'));
          button.removeEventListener('mouseenter', (event) => addSoundEffect(event, 'hover'));
        });
        navLinks.forEach(link => {
          link.removeEventListener('click', (event) => addSoundEffect(event, 'click'));
          link.removeEventListener('mouseenter', (event) => addSoundEffect(event, 'hover'));
        });
      };
    }
  }, [isEnabled]);

  // Fonction pour jouer un son spécifique
  const playSound = (soundKey) => {
    if (isEnabled && audioRefs.current[soundKey]) {
      audioRefs.current[soundKey].currentTime = 0;
      audioRefs.current[soundKey].play().catch(e => console.log('Audio play failed:', e));
    }
  };

  // Exposer la fonction playSound globalement pour l'utiliser dans d'autres composants
  React.useEffect(() => {
    window.playSound = playSound;
    return () => {
      delete window.playSound;
    };
  }, [isEnabled]);

  return null; // Ce composant ne rend rien visuellement
};

export default SoundEffects; 