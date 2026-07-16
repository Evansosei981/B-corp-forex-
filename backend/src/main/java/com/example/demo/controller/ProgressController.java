package com.example.demo.controller;

import com.example.demo.service.ProgressService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/v1/progress")
@RequiredArgsConstructor
public class ProgressController {

    private final ProgressService progressService;

    @PostMapping("/{lessonId}")
    public ResponseEntity<Void> markLessonComplete(@PathVariable Long lessonId, Authentication auth) {
        progressService.markLessonAsComplete(auth.getName(), lessonId);
        return ResponseEntity.ok().build();
    }

    @GetMapping("/course/{courseId}")
    public ResponseEntity<List<Long>> getCompletedLessons(@PathVariable Long courseId, Authentication auth) {
        return ResponseEntity.ok(progressService.getCompletedLessonsForCourse(auth.getName(), courseId));
    }

    @GetMapping("/summary")
    public ResponseEntity<List<com.example.demo.dto.ProgressSummaryResponse>> getProgressSummary(Authentication auth) {
        return ResponseEntity.ok(progressService.getProgressSummary(auth.getName()));
    }
}
