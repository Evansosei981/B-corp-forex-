package com.example.demo.service;

import com.example.demo.model.Course;
import com.example.demo.model.Enrollment;
import com.example.demo.model.Payment;
import com.example.demo.model.PaymentStatus;
import com.example.demo.model.User;
import com.example.demo.repository.CourseRepository;
import com.example.demo.repository.EnrollmentRepository;
import com.example.demo.repository.PaymentRepository;
import com.example.demo.repository.UserRepository;
import com.example.demo.service.EmailService;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@Service
@RequiredArgsConstructor
public class PaymentService {

    private final PaymentRepository paymentRepository;
    private final EnrollmentRepository enrollmentRepository;
    private final CourseRepository courseRepository;
    private final UserRepository userRepository;
    private final EmailService emailService;

    public List<Payment> getAllPayments() {
        return paymentRepository.findAll();
    }

    public List<Payment> getStudentPayments(String email) {
        User student = userRepository.findByEmail(email).orElseThrow();
        return paymentRepository.findByStudentId(student.getId());
    }

    @Transactional
    public Payment submitPayment(String email, Long courseId, String proofUrl) {
        User student = userRepository.findByEmail(email).orElseThrow();
        Course course = courseRepository.findById(courseId).orElseThrow();

        if (enrollmentRepository.existsByStudentIdAndCourseId(student.getId(), course.getId())) {
            throw new RuntimeException("Already enrolled in this course");
        }
        
        boolean hasPending = paymentRepository.findByStudentId(student.getId()).stream()
                .anyMatch(p -> p.getCourse().getId().equals(course.getId()) && p.getStatus() == PaymentStatus.PENDING);
        if (hasPending) {
            throw new RuntimeException("Payment is already pending for this course");
        }

        Payment payment = Payment.builder()
                .student(student)
                .course(course)
                .amount(course.getPrice())
                .proofUrl(proofUrl)
                .status(PaymentStatus.PENDING)
                .build();

        Payment savedPayment = paymentRepository.save(payment);
        emailService.sendPaymentPendingEmail(student.getEmail(), course.getTitle());
        return savedPayment;
    }

    @Transactional
    public Payment approvePayment(Long paymentId) {
        Payment payment = paymentRepository.findById(paymentId).orElseThrow();
        
        if (payment.getStatus() == PaymentStatus.APPROVED) {
            throw new RuntimeException("Payment already approved");
        }

        payment.setStatus(PaymentStatus.APPROVED);
        paymentRepository.save(payment);

        // Create Enrollment if it doesn't already exist
        if (!enrollmentRepository.existsByStudentIdAndCourseId(payment.getStudent().getId(), payment.getCourse().getId())) {
            Enrollment enrollment = Enrollment.builder()
                    .student(payment.getStudent())
                    .course(payment.getCourse())
                    .build();
            enrollmentRepository.save(enrollment);
        }

        // Upgrade role from USER to STUDENT
        User user = payment.getStudent();
        if (user.getRole() == com.example.demo.model.Role.USER) {
            user.setRole(com.example.demo.model.Role.STUDENT);
            userRepository.save(user);
        }

        emailService.sendCourseUnlockedEmail(payment.getStudent().getEmail(), payment.getCourse().getTitle());
        return payment;
    }

    public Payment rejectPayment(Long paymentId) {
        Payment payment = paymentRepository.findById(paymentId).orElseThrow();
        payment.setStatus(PaymentStatus.REJECTED);
        return paymentRepository.save(payment);
    }
}
