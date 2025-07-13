import React from 'react';
import styled from 'styled-components';

const SnowflakeContainer = styled.div`
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  pointer-events: none;
  z-index: 1000;
  overflow: hidden;
`;

const Snowflake = styled.div`
  position: absolute;
  color: var(--white);
  font-size: ${props => props.size || '1em'};
  text-shadow: 0 0 5px rgba(255, 255, 255, 0.8);
  animation: 
    fall ${props => props.duration || '10s'} linear infinite,
    sway ${props => props.swayDuration || '3s'} ease-in-out infinite;
  left: ${props => props.left || '10%'};
  animation-delay: ${props => props.delay || '0s'}, ${props => props.swayDelay || '0s'};
  
  @keyframes fall {
    0% {
      transform: translateY(-10px) rotate(0deg);
    }
    100% {
      transform: translateY(100vh) rotate(360deg);
    }
  }
  
  @keyframes sway {
    0%, 100% {
      transform: translateX(0px);
    }
    50% {
      transform: translateX(80px);
    }
  }
`;

const Snowflakes = () => {
  const snowflakes = [
    { id: 1, left: '10%', size: '1.2em', duration: '12s', delay: '1s', swayDelay: '1s' },
    { id: 2, left: '20%', size: '0.8em', duration: '8s', delay: '6s', swayDelay: '0.5s' },
    { id: 3, left: '30%', size: '1.5em', duration: '15s', delay: '4s', swayDelay: '2s' },
    { id: 4, left: '40%', size: '1em', duration: '10s', delay: '2s', swayDelay: '2s' },
    { id: 5, left: '50%', size: '1.3em', duration: '14s', delay: '8s', swayDelay: '3s' },
    { id: 6, left: '60%', size: '0.9em', duration: '9s', delay: '6s', swayDelay: '2s' },
    { id: 7, left: '70%', size: '1.1em', duration: '11s', delay: '2.5s', swayDelay: '1s' },
    { id: 8, left: '80%', size: '0.7em', duration: '7s', delay: '1s', swayDelay: '0s' },
    { id: 9, left: '90%', size: '1.4em', duration: '13s', delay: '3s', swayDelay: '1.5s' },
    { id: 10, left: '25%', size: '1em', duration: '10s', delay: '2s', swayDelay: '0s' },
    { id: 11, left: '65%', size: '1.2em', duration: '12s', delay: '4s', swayDelay: '2.5s' },
    { id: 12, left: '15%', size: '0.8em', duration: '8s', delay: '5s', swayDelay: '1.5s' },
    { id: 13, left: '75%', size: '1.1em', duration: '11s', delay: '3.5s', swayDelay: '0.5s' },
    { id: 14, left: '35%', size: '0.9em', duration: '9s', delay: '7s', swayDelay: '2.5s' },
    { id: 15, left: '85%', size: '1.3em', duration: '13s', delay: '1.5s', swayDelay: '1s' }
  ];

  return (
    <SnowflakeContainer>
      {snowflakes.map(snowflake => (
        <Snowflake
          key={snowflake.id}
          left={snowflake.left}
          size={snowflake.size}
          duration={snowflake.duration}
          delay={snowflake.delay}
          swayDelay={snowflake.swayDelay}
        >
          ❄
        </Snowflake>
      ))}
    </SnowflakeContainer>
  );
};

export default Snowflakes; 