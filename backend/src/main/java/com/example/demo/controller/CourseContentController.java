package com.example.demo.controller;

import com.example.demo.model.Course;
import com.example.demo.model.Lesson;
import com.example.demo.model.Module;
import com.example.demo.repository.CourseRepository;
import com.example.demo.repository.LessonRepository;
import com.example.demo.repository.ModuleRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/v1/courses")
@RequiredArgsConstructor
public class CourseContentController {

    private final CourseRepository courseRepository;
    private final ModuleRepository moduleRepository;
    private final LessonRepository lessonRepository;

    @GetMapping("/{courseId}/modules")
    public ResponseEntity<List<Module>> getModules(@PathVariable Long courseId) {
        return ResponseEntity.ok(moduleRepository.findByCourseIdOrderByOrderIndexAsc(courseId));
    }

    @PostMapping("/{courseId}/modules")
    public ResponseEntity<Module> addModule(@PathVariable Long courseId, @RequestBody Module module) {
        Course course = courseRepository.findById(courseId).orElseThrow();
        module.setCourse(course);
        return ResponseEntity.ok(moduleRepository.save(module));
    }

    private final com.example.demo.repository.UserRepository userRepository;
    private final com.example.demo.repository.EnrollmentRepository enrollmentRepository;

    @GetMapping("/modules/{moduleId}/lessons")
    public ResponseEntity<List<Lesson>> getLessons(@PathVariable Long moduleId, org.springframework.security.core.Authentication auth) {
        Module module = moduleRepository.findById(moduleId).orElseThrow();
        boolean isEnrolledOrAdmin = false;
        
        if (auth != null) {
            com.example.demo.model.User user = userRepository.findByEmail(auth.getName()).orElse(null);
            if (user != null) {
                if (user.getRole() == com.example.demo.model.Role.ADMIN) {
                    isEnrolledOrAdmin = true;
                } else {
                    isEnrolledOrAdmin = enrollmentRepository.existsByStudentIdAndCourseId(user.getId(), module.getCourse().getId());
                }
            }
        }
        
        if (module.getCourse().getPrice() != null && module.getCourse().getPrice().compareTo(java.math.BigDecimal.ZERO) == 0) {
            isEnrolledOrAdmin = true;
        }
        
        List<Lesson> lessons = lessonRepository.findByModuleIdOrderByOrderIndexAsc(moduleId);
        
        if (!isEnrolledOrAdmin) {
            lessons.forEach(l -> {
                if (!l.isFreePreview()) {
                    l.setMeetingUrl(null);
                }
            });
        }
        
        return ResponseEntity.ok(lessons);
    }

    @PostMapping("/modules/{moduleId}/lessons")
    public ResponseEntity<Lesson> addLesson(@PathVariable Long moduleId, @RequestBody Lesson lesson) {
        Module module = moduleRepository.findById(moduleId).orElseThrow();
        lesson.setModule(module);
        return ResponseEntity.ok(lessonRepository.save(lesson));
    }
}
