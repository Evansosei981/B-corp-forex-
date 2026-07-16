package com.example.demo.service;

import com.example.demo.model.Course;
import com.example.demo.model.Enrollment;
import com.example.demo.model.User;
import com.example.demo.repository.CourseRepository;
import com.example.demo.repository.EnrollmentRepository;
import com.example.demo.repository.UserRepository;
import com.example.demo.repository.LessonProgressRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class CourseService {

    private final CourseRepository courseRepository;
    private final EnrollmentRepository enrollmentRepository;
    private final com.example.demo.repository.PaymentRepository paymentRepository;
    private final UserRepository userRepository;
    private final com.example.demo.repository.WishlistRepository wishlistRepository;
    private final LessonProgressRepository lessonProgressRepository;

    public List<Course> getAllCourses() {
        return courseRepository.findAll();
    }

    public Course getCourseById(Long id) {
        return courseRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Course not found"));
    }

    public Course createCourse(Course course) {
        // hardcoding admin instructor for now to avoid null constraints
        User admin = userRepository.findByEmail("admin@bcorp.com").orElseThrow();
        course.setInstructor(admin);
        if (course.getIsPublished() == null) {
            course.setIsPublished(false);
        }
        return courseRepository.save(course);
    }

    public List<Course> getStudentEnrolledCourses(String email) {
        User student = userRepository.findByEmail(email).orElseThrow();
        List<Enrollment> enrollments = enrollmentRepository.findByStudentId(student.getId());
        return enrollments.stream().map(Enrollment::getCourse).distinct().collect(Collectors.toList());
    }

    @org.springframework.transaction.annotation.Transactional
    public void deleteCourse(Long id) {
        lessonProgressRepository.deleteByCourseId(id);
        wishlistRepository.deleteByCourseId(id);
        enrollmentRepository.deleteByCourseId(id);
        paymentRepository.deleteByCourseId(id);
        courseRepository.deleteById(id);
    }
}
