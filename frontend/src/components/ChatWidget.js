import React, { useState, useEffect, useRef } from 'react';
import styled from 'styled-components';
import { FaComments, FaTimes, FaPaperPlane, FaUser, FaRobot } from 'react-icons/fa';
import NotificationService from '../services/NotificationService';

const ChatContainer = styled.div`
  position: fixed;
  bottom: 20px;
  right: 20px;
  z-index: 1000;
  font-family: 'Poppins', sans-serif;
`;

const ChatButton = styled.button`
  width: 60px;
  height: 60px;
  border-radius: 50%;
  background: var(--gradient-primary);
  border: none;
  color: white;
  font-size: 24px;
  cursor: pointer;
  box-shadow: 0 4px 20px rgba(50, 205, 50, 0.3);
  transition: all 0.3s ease;
  display: flex;
  align-items: center;
  justify-content: center;
  
  &:hover {
    transform: scale(1.1);
    box-shadow: 0 6px 25px rgba(50, 205, 50, 0.4);
  }
  
  ${props => props.isOpen && `
    background: var(--dark-green);
  `}
`;

const ChatWindow = styled.div`
  position: absolute;
  bottom: 80px;
  right: 0;
  width: 350px;
  height: 500px;
  background: white;
  border-radius: 20px;
  box-shadow: 0 10px 40px rgba(0, 0, 0, 0.2);
  display: flex;
  flex-direction: column;
  overflow: hidden;
  animation: slideIn 0.3s ease;
  
  @keyframes slideIn {
    from {
      opacity: 0;
      transform: translateY(20px) scale(0.9);
    }
    to {
      opacity: 1;
      transform: translateY(0) scale(1);
    }
  }
`;

const ChatHeader = styled.div`
  background: var(--gradient-primary);
  color: white;
  padding: 20px;
  display: flex;
  align-items: center;
  justify-content: space-between;
  
  h3 {
    margin: 0;
    font-size: 1.1rem;
    font-weight: 600;
  }
  
  button {
    background: none;
    border: none;
    color: white;
    font-size: 18px;
    cursor: pointer;
    padding: 5px;
    border-radius: 50%;
    transition: background 0.3s ease;
    
    &:hover {
      background: rgba(255, 255, 255, 0.2);
    }
  }
`;

const ChatMessages = styled.div`
  flex: 1;
  padding: 20px;
  overflow-y: auto;
  display: flex;
  flex-direction: column;
  gap: 15px;
  
  &::-webkit-scrollbar {
    width: 6px;
  }
  
  &::-webkit-scrollbar-track {
    background: #f1f1f1;
    border-radius: 3px;
  }
  
  &::-webkit-scrollbar-thumb {
    background: var(--primary-green);
    border-radius: 3px;
  }
`;

const Message = styled.div`
  display: flex;
  align-items: flex-start;
  gap: 10px;
  max-width: 80%;
  
  ${props => props.isUser ? `
    align-self: flex-end;
    flex-direction: row-reverse;
  ` : `
    align-self: flex-start;
  `}
`;

const MessageAvatar = styled.div`
  width: 35px;
  height: 35px;
  border-radius: 50%;
  background: ${props => props.isUser ? 'var(--primary-green)' : 'var(--light-green)'};
  display: flex;
  align-items: center;
  justify-content: center;
  color: white;
  font-size: 14px;
  flex-shrink: 0;
`;

const MessageContent = styled.div`
  background: ${props => props.isUser ? 'var(--gradient-primary)' : '#f8f9fa'};
  color: ${props => props.isUser ? 'white' : 'var(--dark-green)'};
  padding: 12px 16px;
  border-radius: 18px;
  font-size: 0.9rem;
  line-height: 1.4;
  max-width: 100%;
  word-wrap: break-word;
  
  ${props => props.isUser ? `
    border-bottom-right-radius: 5px;
  ` : `
    border-bottom-left-radius: 5px;
  `}
`;

const ChatInput = styled.div`
  padding: 20px;
  border-top: 1px solid #eee;
  display: flex;
  gap: 10px;
  align-items: center;
`;

const Input = styled.input`
  flex: 1;
  padding: 12px 16px;
  border: 2px solid #eee;
  border-radius: 25px;
  font-size: 0.9rem;
  outline: none;
  transition: border-color 0.3s ease;
  
  &:focus {
    border-color: var(--primary-green);
  }
`;

const SendButton = styled.button`
  width: 40px;
  height: 40px;
  border-radius: 50%;
  background: var(--gradient-primary);
  border: none;
  color: white;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: all 0.3s ease;
  
  &:hover {
    transform: scale(1.1);
  }
  
  &:disabled {
    background: #ccc;
    cursor: not-allowed;
    transform: none;
  }
`;

const TypingIndicator = styled.div`
  display: flex;
  align-items: center;
  gap: 5px;
  padding: 10px 20px;
  color: var(--gray);
  font-size: 0.8rem;
  font-style: italic;
`;

const ChatWidget = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState([
    {
      id: 1,
      text: "Bonjour ! 👋 Je suis l'assistant de Nadia Event's Decor. Comment puis-je vous aider aujourd'hui ?",
      isUser: false,
      timestamp: new Date()
    }
  ]);
  const [inputValue, setInputValue] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const messagesEndRef = useRef(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  useEffect(() => {
    // Demander la permission pour les notifications
    NotificationService.requestPermission();
  }, []);

  const handleSendMessage = async () => {
    if (!inputValue.trim()) return;

    const userMessage = {
      id: Date.now(),
      text: inputValue,
      isUser: true,
      timestamp: new Date()
    };

    setMessages(prev => [...prev, userMessage]);
    setInputValue('');
    setIsTyping(true);

    try {
      // ⚠️ NOUVEAU : Envoyer le message au serveur
      const response = await fetch('http://localhost:8082/api/contact/send', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          name: 'Visiteur Chat',
          email: 'chat@nadiaeventsdecor.com',
          phone: 'Chat en ligne',
          subject: 'Message via chat',
          message: inputValue
        })
      });

      if (response.ok) {
        const botMessage = {
          id: Date.now() + 1,
          text: "Merci pour votre message ! Notre équipe va vous répondre dans les plus brefs délais. Vous pouvez aussi nous contacter directement au +237 680 207 496.",
          isUser: false,
          timestamp: new Date()
        };
        setMessages(prev => [...prev, botMessage]);
      } else {
        // Fallback si le serveur ne répond pas
        const responses = [
          "Merci pour votre message ! Notre équipe va vous répondre dans les plus brefs délais.",
          "Excellente question ! Laissez-moi vous donner plus de détails sur nos services.",
          "Je comprends votre demande. Pouvez-vous me donner plus de précisions ?",
          "Parfait ! Je vais transmettre votre demande à notre équipe spécialisée.",
          "Nous avons exactement ce qu'il vous faut ! Voulez-vous que je vous envoie un devis ?"
        ];
        
        const randomResponse = responses[Math.floor(Math.random() * responses.length)];
        
        const botMessage = {
          id: Date.now() + 1,
          text: randomResponse,
          isUser: false,
          timestamp: new Date()
        };

        setMessages(prev => [...prev, botMessage]);
      }
    } catch (error) {
      console.error('Erreur lors de l\'envoi du message:', error);
      const botMessage = {
        id: Date.now() + 1,
        text: "Désolé, il y a eu un problème technique. Vous pouvez nous contacter directement au +237 680 207 496 ou par email à nadiaeventsdecor@gmail.com",
        isUser: false,
        timestamp: new Date()
      };
      setMessages(prev => [...prev, botMessage]);
    }

    setIsTyping(false);
  };

  const handleKeyPress = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  const toggleChat = () => {
    setIsOpen(!isOpen);
    if (window.playSound) {
      window.playSound('click');
    }
  };

  const handleWebSocketMessage = (message) => {
    if (message.type === 'CHAT_MESSAGE') {
      const newMessage = {
        id: message.id,
        text: message.message,
        isUser: !message.isFromVisitor,
        timestamp: new Date(message.createdAt),
        senderName: message.senderName
      };
      setMessages(prev => [...prev, newMessage]);
      
      // Afficher une notification push si le chat n'est pas ouvert
      if (!isOpen && message.isFromVisitor) {
        NotificationService.showChatNotification(
          message.senderName,
          message.message
        );
      }
    }
  };

  return (
    <ChatContainer>
      <ChatButton 
        onClick={() => setIsOpen(!isOpen)}
        data-chat-button
      >
        {isOpen ? <FaTimes /> : <FaComments />}
      </ChatButton>
      
      {isOpen && (
        <ChatWindow>
          <ChatHeader>
            <h3>💬 Support en ligne</h3>
            <button onClick={toggleChat}>
              <FaTimes />
            </button>
          </ChatHeader>
          
          <ChatMessages>
            {messages.map((message) => (
              <Message key={message.id} isUser={message.isUser}>
                <MessageAvatar isUser={message.isUser}>
                  {message.isUser ? <FaUser /> : <FaRobot />}
                </MessageAvatar>
                <MessageContent isUser={message.isUser}>
                  {message.text}
                </MessageContent>
              </Message>
            ))}
            
            {isTyping && (
              <TypingIndicator>
                <FaRobot /> L'assistant tape...
              </TypingIndicator>
            )}
            
            <div ref={messagesEndRef} />
          </ChatMessages>
          
          <ChatInput>
            <Input
              type="text"
              placeholder="Tapez votre message..."
              value={inputValue}
              onChange={(e) => setInputValue(e.target.value)}
              onKeyPress={handleKeyPress}
            />
            <SendButton 
              onClick={handleSendMessage}
              disabled={!inputValue.trim()}
            >
              <FaPaperPlane />
            </SendButton>
          </ChatInput>
        </ChatWindow>
      )}
    </ChatContainer>
  );
};

export default ChatWidget; 