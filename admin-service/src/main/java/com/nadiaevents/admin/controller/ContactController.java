package com.nadiaevents.admin.controller;

import com.nadiaevents.admin.model.QuoteRequest;
import com.nadiaevents.admin.service.EmailService;
import com.nadiaevents.admin.service.QuoteRequestService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/contact")
public class ContactController {
    
    @Autowired
    private EmailService emailService;
    
    @Autowired
    private QuoteRequestService quoteRequestService;
    
    @PostMapping("/send")
    public ResponseEntity<Map<String, Object>> submitContactMessage(@RequestBody Map<String, Object> request) {
        try {
            String name = (String) request.get("name");
            String email = (String) request.get("email");
            String phone = (String) request.get("phone");
            String subject = (String) request.get("subject");
            String message = (String) request.get("message");
            
            // Envoyer l'email de confirmation au client
            String confirmationSubject = "Message reçu - Nadia Event's Decor";
            String confirmationMessage = String.format(
                "Bonjour %s,\n\n" +
                "Nous avons bien reçu votre message :\n\n" +
                "Sujet : %s\n" +
                "Message : %s\n\n" +
                "Nous vous répondrons dans les plus brefs délais.\n\n" +
                "Cordialement,\n" +
                "L'équipe Nadia Event's Decor",
                name, subject, message
            );
            
            emailService.sendEmail(email, confirmationSubject, confirmationMessage);
            
            // Envoyer une notification à l'équipe
            String teamSubject = "Nouveau message de contact - " + subject;
            String teamMessage = String.format(
                "Nouveau message de contact reçu :\n\n" +
                "Nom : %s\n" +
                "Email : %s\n" +
                "Téléphone : %s\n" +
                "Sujet : %s\n" +
                "Message : %s",
                name, email, phone != null ? phone : "Non fourni", subject, message
            );
            
            emailService.sendEmail("nadiaeventsdecor@gmail.com", teamSubject, teamMessage);
            
            return ResponseEntity.ok(Map.of(
                "success", true,
                "message", "Votre message a été envoyé avec succès"
            ));
            
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(Map.of(
                "success", false,
                "message", "Erreur lors de l'envoi du message : " + e.getMessage()
            ));
        }
    }
    
    @PostMapping("/quote")
    public ResponseEntity<Map<String, Object>> submitQuoteRequest(@RequestBody Map<String, Object> request) {
        try {
            // Créer une nouvelle demande de devis
            QuoteRequest quoteRequest = new QuoteRequest();
            quoteRequest.setClientName((String) request.get("name"));
            quoteRequest.setClientEmail((String) request.get("email"));
            quoteRequest.setClientPhone((String) request.get("phone"));
            quoteRequest.setEventType((String) request.get("eventType"));
            quoteRequest.setEventLocation((String) request.get("eventLocation"));
            
            // Gérer le budget qui peut être un Integer ou String
            Object budgetObj = request.get("budget");
            if (budgetObj != null) {
                quoteRequest.setBudgetRange(budgetObj.toString());
            }
            
            quoteRequest.setDescription((String) request.get("message"));
            
            // Parser la date si elle est fournie
            String eventDateStr = (String) request.get("eventDate");
            if (eventDateStr != null && !eventDateStr.isEmpty()) {
                try {
                    LocalDateTime eventDate;
                    if (eventDateStr.contains("T")) {
                        eventDate = LocalDateTime.parse(eventDateStr);
                    } else {
                        eventDate = LocalDateTime.parse(eventDateStr + "T00:00:00");
                    }
                    quoteRequest.setEventDate(eventDate);
                } catch (Exception e) {
                    // Si la date ne peut pas être parsée, on la laisse null
                }
            }
            
            // Parser le nombre d'invités si fourni
            Object guestCountObj = request.get("guestCount");
            if (guestCountObj != null) {
                try {
                    if (guestCountObj instanceof Integer) {
                        quoteRequest.setGuestCount((Integer) guestCountObj);
                    } else {
                        quoteRequest.setGuestCount(Integer.parseInt(guestCountObj.toString()));
                    }
                } catch (Exception e) {
                    // Si le nombre d'invités ne peut pas être parsé, on laisse null
                }
            }
            
            // Sauvegarder la demande en base de données
            QuoteRequest savedRequest = quoteRequestService.createQuoteRequest(quoteRequest);
            
            return ResponseEntity.ok(Map.of(
                "success", true,
                "message", "Votre demande de devis a été envoyée avec succès",
                "requestNumber", savedRequest.getRequestNumber(),
                "requestId", savedRequest.getId()
            ));
            
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(Map.of(
                "success", false,
                "message", "Erreur lors de l'envoi de la demande : " + e.getMessage()
            ));
        }
    }
    
    @GetMapping("/quotes")
    public ResponseEntity<Map<String, Object>> getQuoteRequests() {
        try {
            List<QuoteRequest> requests = quoteRequestService.getAllQuoteRequests();
            return ResponseEntity.ok(Map.of(
                "success", true,
                "message", "Demandes de devis récupérées avec succès",
                "requests", requests,
                "count", requests.size()
            ));
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(Map.of(
                "success", false,
                "message", "Erreur lors de la récupération : " + e.getMessage()
            ));
        }
    }
    
    @GetMapping("/quotes/latest")
    public ResponseEntity<Map<String, Object>> getLatestQuoteRequests() {
        try {
            List<QuoteRequest> requests = quoteRequestService.getAllQuoteRequests();
            // Retourner seulement les 5 dernières demandes
            List<QuoteRequest> latestRequests = requests.stream()
                    .limit(5)
                    .toList();
            
            return ResponseEntity.ok(Map.of(
                "success", true,
                "message", "Dernières demandes de devis",
                "requests", latestRequests,
                "count", latestRequests.size()
            ));
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(Map.of(
                "success", false,
                "message", "Erreur lors de la récupération : " + e.getMessage()
            ));
        }
    }

    @PostMapping("/chat")
    public ResponseEntity<Map<String, Object>> submitChatMessage(@RequestBody Map<String, Object> request) {
        try {
            String message = (String) request.get("message");
            String visitorName = request.get("visitorName") != null ? (String) request.get("visitorName") : "Visiteur Chat";
            
            // Envoyer une notification à l'équipe
            String teamSubject = "Nouveau message via chat - " + visitorName;
            String teamMessage = String.format(
                "Nouveau message reçu via le chat en ligne :\n\n" +
                "Visiteur : %s\n" +
                "Message : %s\n\n" +
                "Répondez rapidement pour maintenir un bon service client.",
                visitorName, message
            );
            
            emailService.sendEmail("nadiaeventsdecor@gmail.com", teamSubject, teamMessage);
            
            return ResponseEntity.ok(Map.of(
                "success", true,
                "message", "Message reçu avec succès"
            ));
            
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(Map.of(
                "success", false,
                "message", "Erreur lors de l'envoi du message : " + e.getMessage()
            ));
        }
    }
} 