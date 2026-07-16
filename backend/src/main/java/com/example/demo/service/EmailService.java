package com.example.demo.service;

import jakarta.mail.MessagingException;
import jakarta.mail.internet.MimeMessage;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.mail.javamail.MimeMessageHelper;
import org.springframework.scheduling.annotation.Async;
import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
@Slf4j
public class EmailService {

    private final JavaMailSender mailSender;

    @Value("${spring.mail.username:noreply@bcorp.com}")
    private String fromEmail;

    @Value("${frontend.url:https://b-corp-forex.vercel.app}")
    private String frontendUrl;

    // Removed @Async from here because internal calls bypass the Spring Proxy
    public void sendHtmlEmail(String to, String subject, String htmlBody) {
        try {
            MimeMessage message = mailSender.createMimeMessage();
            MimeMessageHelper helper = new MimeMessageHelper(message, true, "UTF-8");
            
            helper.setFrom(fromEmail);
            helper.setTo(to);
            helper.setSubject(subject);
            helper.setText(htmlBody, true); // true indicates HTML
            
            mailSender.send(message);
            log.info("Email sent successfully to {}", to);
        } catch (MessagingException e) {
            log.error("Failed to send email to {}", to, e);
        } catch (Exception e) {
            // Catching general exception to prevent async task failure from crashing thread if JavaMailSender isn't configured
            log.error("Error occurred while sending email to {}: {}", to, e.getMessage());
        }
    }

    @Async
    public void sendWelcomeEmail(String to, String firstName) {
        String subject = "Welcome to B Corp Forex Academy!";
        String body = String.format(
            "<h1>Welcome %s!</h1>" +
            "<p>We are thrilled to have you join B Corp Forex Academy.</p>" +
            "<p>Get ready to master the markets with our professional-grade curriculum.</p>" +
            "<br><p>Best regards,<br>The B Corp Team</p>",
            firstName
        );
        sendHtmlEmail(to, subject, body);
    }

    @Async
    public void sendVerificationEmail(String to, String firstName, String token) {
        String subject = "Verify your email - B Corp Forex Academy";
        String verificationLink = frontendUrl + "/verify?token=" + token;
        
        String body = String.format(
            "<h1>Welcome %s!</h1>" +
            "<p>Please click the button below to verify your email address and activate your account:</p>" +
            "<br>" +
            "<a href=\"%s\" style=\"background-color: #eab308; color: #1a1a1a; padding: 12px 24px; text-decoration: none; border-radius: 6px; font-weight: bold; display: inline-block;\">Verify Email</a>" +
            "<br><br>" +
            "<p>Or copy this link: %s</p>" +
            "<br><p>Best regards,<br>The B Corp Team</p>",
            firstName, verificationLink, verificationLink
        );
        sendHtmlEmail(to, subject, body);
    }

    @Async
    public void sendPaymentPendingEmail(String to, String courseTitle) {
        String subject = "Payment Received - Pending Verification";
        String body = String.format(
            "<h1>Payment Received</h1>" +
            "<p>Thank you! We have received your manual payment submission for: <strong>%s</strong>.</p>" +
            "<p>Our admins will verify the bank transfer shortly. You will receive another email once your course is unlocked.</p>" +
            "<br><p>Best regards,<br>The B Corp Team</p>",
            courseTitle
        );
        sendHtmlEmail(to, subject, body);
    }

    @Async
    public void sendCourseUnlockedEmail(String to, String courseTitle) {
        String subject = "Course Unlocked! Start Learning Now";
        String body = String.format(
            "<h1>Payment Approved!</h1>" +
            "<p>Great news! Your payment for <strong>%s</strong> has been verified.</p>" +
            "<p>The course is now unlocked on your dashboard. You can start learning immediately!</p>" +
            "<br><p>Happy Trading,<br>The B Corp Team</p>",
            courseTitle
        );
        sendHtmlEmail(to, subject, body);
    }
}
