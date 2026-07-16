package com.example.demo.controller;

import com.example.demo.model.Payment;
import com.example.demo.service.PaymentService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/v1/payments")
@RequiredArgsConstructor
public class PaymentController {

    private final PaymentService paymentService;

    // Admin endpoint
    @GetMapping
    public ResponseEntity<List<Payment>> getAllPayments() {
        return ResponseEntity.ok(paymentService.getAllPayments());
    }

    // Student endpoint
    @GetMapping("/me")
    public ResponseEntity<List<Payment>> getMyPayments(Authentication authentication) {
        return ResponseEntity.ok(paymentService.getStudentPayments(authentication.getName()));
    }

    // Student submits a receipt
    @PostMapping("/submit")
    public ResponseEntity<Payment> submitPayment(
            Authentication authentication,
            @RequestBody Map<String, Object> payload) {
        
        Long courseId = Long.valueOf(payload.get("courseId").toString());
        String proofUrl = payload.get("proofUrl") != null ? payload.get("proofUrl").toString() : null;
        
        return ResponseEntity.ok(paymentService.submitPayment(authentication.getName(), courseId, proofUrl));
    }

    // Admin approves payment
    @PostMapping("/{id}/approve")
    public ResponseEntity<Payment> approvePayment(@PathVariable Long id) {
        return ResponseEntity.ok(paymentService.approvePayment(id));
    }

    // Admin rejects payment
    @PostMapping("/{id}/reject")
    public ResponseEntity<Payment> rejectPayment(@PathVariable Long id) {
        return ResponseEntity.ok(paymentService.rejectPayment(id));
    }
}
