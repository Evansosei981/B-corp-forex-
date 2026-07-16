package com.example.demo.controller;

import com.example.demo.model.Course;
import com.example.demo.service.CourseService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/v1/courses")
@RequiredArgsConstructor
public class CourseController {

    private final CourseService courseService;

    @GetMapping
    public ResponseEntity<List<Course>> getAllCourses() {
        return ResponseEntity.ok(courseService.getAllCourses());
    }

    @GetMapping("/{id}")
    public ResponseEntity<Course> getCourseById(@PathVariable Long id) {
        return ResponseEntity.ok(courseService.getCourseById(id));
    }

    @GetMapping("/my-enrollments")
    public ResponseEntity<List<Course>> getMyEnrollments(org.springframework.security.core.Authentication auth) {
        return ResponseEntity.ok(courseService.getStudentEnrolledCourses(auth.getName()));
    }

    @PostMapping
    public ResponseEntity<Course> createCourse(@RequestBody Course course) {
        // Received Course payload
        try {
            Course saved = courseService.createCourse(course);
            // Successfully saved course
            return ResponseEntity.ok(saved);
        } catch (Exception e) {
            e.printStackTrace();
            throw e;
        }
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<?> deleteCourse(@PathVariable Long id) {
        courseService.deleteCourse(id);
        return ResponseEntity.ok().build();
    }
}
