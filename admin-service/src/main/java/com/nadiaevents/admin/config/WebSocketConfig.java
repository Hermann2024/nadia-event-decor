package com.nadiaevents.admin.config;

import org.springframework.context.annotation.Configuration;
import org.springframework.messaging.simp.config.MessageBrokerRegistry;
import org.springframework.web.socket.config.annotation.EnableWebSocketMessageBroker;
import org.springframework.web.socket.config.annotation.StompEndpointRegistry;
import org.springframework.web.socket.config.annotation.WebSocketMessageBrokerConfigurer;

@Configuration
@EnableWebSocketMessageBroker
public class WebSocketConfig implements WebSocketMessageBrokerConfigurer {
    
    @Override
    public void configureMessageBroker(MessageBrokerRegistry config) {
        // Activer le broker de messages simple
        config.enableSimpleBroker("/topic", "/queue");
        
        // Préfixe pour les messages envoyés par les clients
        config.setApplicationDestinationPrefixes("/app");
        
        // Préfixe pour les messages privés
        config.setUserDestinationPrefix("/user");
    }
    
    @Override
    public void registerStompEndpoints(StompEndpointRegistry registry) {
        // Endpoint pour la connexion WebSocket
        registry.addEndpoint("/ws")
                .setAllowedOriginPatterns("*")
                .withSockJS();
        
        // Endpoint alternatif sans SockJS
        registry.addEndpoint("/ws")
                .setAllowedOriginPatterns("*");
    }
} 