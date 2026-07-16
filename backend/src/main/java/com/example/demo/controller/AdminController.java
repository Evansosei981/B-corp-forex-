package com.example.demo.controller;

import com.example.demo.model.Payment;
import com.example.demo.model.PaymentStatus;
import com.example.demo.model.Role;
import com.example.demo.model.User;
import com.example.demo.repository.CourseRepository;
import com.example.demo.repository.PaymentRepository;
import com.example.demo.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.math.BigDecimal;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;

@RestController
@RequestMapping("/api/v1/admin")
@RequiredArgsConstructor
public class AdminController {

    private final UserRepository userRepository;
    private final CourseRepository courseRepository;
    private final PaymentRepository paymentRepository;

    @GetMapping("/students")
    public ResponseEntity<List<User>> getStudents() {
        List<User> students = userRepository.findAll().stream()
                .filter(user -> user.getRole() == Role.STUDENT)
                .collect(Collectors.toList());
        return ResponseEntity.ok(students);
    }

    @GetMapping("/stats")
    public ResponseEntity<Map<String, Object>> getStats() {
        List<Payment> approvedPayments = paymentRepository.findAll().stream()
                .filter(p -> p.getStatus() == PaymentStatus.APPROVED)
                .collect(Collectors.toList());

        BigDecimal totalRevenue = approvedPayments.stream()
                .map(Payment::getAmount)
                .reduce(BigDecimal.ZERO, BigDecimal::add);

        long totalStudents = userRepository.findAll().stream()
                .filter(user -> user.getRole() == Role.STUDENT)
                .count();

        long activeCourses = courseRepository.count();
        long recentSales = approvedPayments.size(); // Simplified for now

        Map<String, Object> stats = new HashMap<>();
        stats.put("totalRevenue", totalRevenue);
        stats.put("totalStudents", totalStudents);
        stats.put("activeCourses", activeCourses);
        stats.put("recentSales", recentSales);

        return ResponseEntity.ok(stats);
    }
}
