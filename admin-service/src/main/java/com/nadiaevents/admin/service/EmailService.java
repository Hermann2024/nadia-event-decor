package com.nadiaevents.admin.service;

import com.nadiaevents.admin.model.QuoteRequest;
import com.nadiaevents.admin.model.Quote;
import com.nadiaevents.admin.model.Invoice;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.mail.SimpleMailMessage;
import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.mail.javamail.MimeMessageHelper;
import org.springframework.stereotype.Service;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.thymeleaf.TemplateEngine;
import org.thymeleaf.context.Context;

import javax.mail.MessagingException;
import javax.mail.internet.MimeMessage;
import java.time.format.DateTimeFormatter;

@Service
public class EmailService {
    
    private static final Logger logger = LoggerFactory.getLogger(EmailService.class);
    
    @Autowired(required = false)
    private JavaMailSender mailSender;
    
    @Autowired(required = false)
    private TemplateEngine templateEngine;
    
    @Value("${spring.mail.username:nadia@events-decor.com}")
    private String fromEmail;
    
    @Value("${app.email.enabled:false}")
    private boolean emailEnabled;
    
    public void sendEmail(String to, String subject, String message) {
        if (!emailEnabled || mailSender == null) {
            // Mode simulation
            logger.info("=== EMAIL SIMULATION ===");
            logger.info("To: {}", to);
            logger.info("Subject: {}", subject);
            logger.info("Message: {}", message);
            logger.info("========================");
            return;
        }
        
        try {
            SimpleMailMessage email = new SimpleMailMessage();
            email.setFrom(fromEmail);
            email.setTo(to);
            email.setSubject(subject);
            email.setText(message);
            mailSender.send(email);
            
            logger.info("Email envoyé avec succès à: {}", to);
        } catch (Exception e) {
            logger.error("Erreur lors de l'envoi de l'email à {}: {}", to, e.getMessage());
        }
    }
    
    public void sendHtmlEmail(String to, String subject, String htmlContent) {
        if (!emailEnabled || mailSender == null) {
            // Mode simulation
            logger.info("=== HTML EMAIL SIMULATION ===");
            logger.info("To: {}", to);
            logger.info("Subject: {}", subject);
            logger.info("HTML Content: {}", htmlContent);
            logger.info("=============================");
            return;
        }
        
        try {
            MimeMessage message = mailSender.createMimeMessage();
            MimeMessageHelper helper = new MimeMessageHelper(message, true, "UTF-8");
            
            helper.setFrom(fromEmail);
            helper.setTo(to);
            helper.setSubject(subject);
            helper.setText(htmlContent, true);
            
            mailSender.send(message);
            
            logger.info("Email HTML envoyé avec succès à: {}", to);
        } catch (MessagingException e) {
            logger.error("Erreur lors de l'envoi de l'email HTML à {}: {}", to, e.getMessage());
        }
    }
    
    public void sendQuoteRequestConfirmation(QuoteRequest quoteRequest) {
        String subject = "Confirmation de votre demande de devis - " + quoteRequest.getRequestNumber();
        
        String message = String.format(
            "Bonjour %s,\n\n" +
            "Nous avons bien reçu votre demande de devis (référence: %s) pour votre événement.\n\n" +
            "Détails de votre demande:\n" +
            "- Type d'événement: %s\n" +
            "- Date: %s\n" +
            "- Lieu: %s\n" +
            "- Nombre d'invités: %s\n" +
            "- Budget: %s\n\n" +
            "Notre équipe va étudier votre demande et vous contactera dans les plus brefs délais.\n\n" +
            "Merci de votre confiance,\n" +
            "L'équipe Nadia Event's Decor",
            quoteRequest.getClientName(),
            quoteRequest.getRequestNumber(),
            quoteRequest.getEventType(),
            quoteRequest.getEventDate() != null ? quoteRequest.getEventDate().format(DateTimeFormatter.ofPattern("dd/MM/yyyy")) : "À définir",
            quoteRequest.getEventLocation(),
            quoteRequest.getGuestCount(),
            quoteRequest.getBudgetRange()
        );
        
        sendEmail(quoteRequest.getClientEmail(), subject, message);
    }
    
    public void sendQuoteToClient(Quote quote) {
        String subject = "Votre devis - " + quote.getQuoteNumber();
        
        // Utiliser un template HTML si disponible
        if (templateEngine != null) {
            Context context = new Context();
            context.setVariable("quote", quote);
            context.setVariable("clientName", quote.getClientName());
            context.setVariable("quoteNumber", quote.getQuoteNumber());
            context.setVariable("totalAmount", quote.getTotalAmount());
            context.setVariable("validUntil", quote.getValidUntil());
            
            String htmlContent = templateEngine.process("quote-email", context);
            sendHtmlEmail(quote.getClientEmail(), subject, htmlContent);
        } else {
            String message = String.format(
                "Bonjour %s,\n\n" +
                "Veuillez trouver ci-joint votre devis (référence: %s).\n\n" +
                "Montant total: %.2f €\n" +
                "Valide jusqu'au: %s\n\n" +
                "Pour accepter ce devis, veuillez nous contacter.\n\n" +
                "Cordialement,\n" +
                "L'équipe Nadia Event's Decor",
                quote.getClientName(),
                quote.getQuoteNumber(),
                quote.getTotalAmount(),
                quote.getValidUntil() != null ? quote.getValidUntil().format(DateTimeFormatter.ofPattern("dd/MM/yyyy")) : "À définir"
            );
            
            sendEmail(quote.getClientEmail(), subject, message);
        }
    }
    
    public void sendInvoiceToClient(Invoice invoice) {
        String subject = "Votre facture - " + invoice.getInvoiceNumber();
        
        // Utiliser un template HTML si disponible
        if (templateEngine != null) {
            Context context = new Context();
            context.setVariable("invoice", invoice);
            context.setVariable("clientName", invoice.getClientName());
            context.setVariable("invoiceNumber", invoice.getInvoiceNumber());
            context.setVariable("totalAmount", invoice.getTotalAmount());
            context.setVariable("dueDate", invoice.getDueDate());
            
            String htmlContent = templateEngine.process("invoice-email", context);
            sendHtmlEmail(invoice.getClientEmail(), subject, htmlContent);
        } else {
            String message = String.format(
                "Bonjour %s,\n\n" +
                "Veuillez trouver ci-joint votre facture (référence: %s).\n\n" +
                "Montant total: %.2f €\n" +
                "Date d'échéance: %s\n\n" +
                "Merci de votre confiance,\n" +
                "L'équipe Nadia Event's Decor",
                invoice.getClientName(),
                invoice.getInvoiceNumber(),
                invoice.getTotalAmount(),
                invoice.getDueDate() != null ? invoice.getDueDate().format(DateTimeFormatter.ofPattern("dd/MM/yyyy")) : "À définir"
            );
            
            sendEmail(invoice.getClientEmail(), subject, message);
        }
    }
    
    public void sendPaymentReminder(Invoice invoice) {
        String subject = "Rappel de paiement - Facture " + invoice.getInvoiceNumber();
        
        String message = String.format(
            "Bonjour %s,\n\n" +
            "Nous vous rappelons que votre facture (référence: %s) d'un montant de %.2f € " +
            "était due le %s.\n\n" +
            "Merci de procéder au règlement dans les plus brefs délais.\n\n" +
            "Cordialement,\n" +
            "L'équipe Nadia Event's Decor",
            invoice.getClientName(),
            invoice.getInvoiceNumber(),
            invoice.getTotalAmount(),
            invoice.getDueDate() != null ? invoice.getDueDate().format(DateTimeFormatter.ofPattern("dd/MM/yyyy")) : "À définir"
        );
        
        sendEmail(invoice.getClientEmail(), subject, message);
    }
    
    public void sendAdminNotification(String subject, String message) {
        // ⚠️ CORRECTION : Utiliser nadiaevents@gmail.com au lieu de admin@nadia-events-decor.com
        String adminEmail = "nadiaevents@gmail.com";
        sendEmail(adminEmail, subject, message);
    }
} 