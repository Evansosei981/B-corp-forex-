package com.example.demo.service;

import com.example.demo.model.Lesson;
import com.example.demo.model.LessonProgress;
import com.example.demo.model.User;
import com.example.demo.repository.LessonProgressRepository;
import com.example.demo.repository.LessonRepository;
import com.example.demo.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.util.List;

@Service
@RequiredArgsConstructor
public class ProgressService {

    private final LessonProgressRepository progressRepository;
    private final UserRepository userRepository;
    private final LessonRepository lessonRepository;
    private final com.example.demo.repository.EnrollmentRepository enrollmentRepository;

    @Transactional
    public void markLessonAsComplete(String email, Long lessonId) {
        User user = userRepository.findByEmail(email)
                .orElseThrow(() -> new RuntimeException("User not found"));
        
        Lesson lesson = lessonRepository.findById(lessonId)
                .orElseThrow(() -> new RuntimeException("Lesson not found"));

        if (!progressRepository.existsByUserIdAndLessonId(user.getId(), lesson.getId())) {
            LessonProgress progress = LessonProgress.builder()
                    .user(user)
                    .lesson(lesson)
                    .completedAt(LocalDateTime.now())
                    .build();
            progressRepository.save(progress);
        }
    }

    public List<Long> getCompletedLessonsForCourse(String email, Long courseId) {
        User user = userRepository.findByEmail(email)
                .orElseThrow(() -> new RuntimeException("User not found"));
        return progressRepository.findCompletedLessonIdsByUserAndCourse(user.getId(), courseId);
    }

    public List<com.example.demo.dto.ProgressSummaryResponse> getProgressSummary(String email) {
        User user = userRepository.findByEmail(email)
                .orElseThrow(() -> new RuntimeException("User not found"));
        
        List<com.example.demo.model.Enrollment> enrollments = enrollmentRepository.findByStudentId(user.getId());
        
        return enrollments.stream().map(enrollment -> {
            com.example.demo.model.Course course = enrollment.getCourse();
            List<Long> completedIds = progressRepository.findCompletedLessonIdsByUserAndCourse(user.getId(), course.getId());
            
            int totalLessons = 0;
            if (course.getModules() != null) {
                for (com.example.demo.model.Module module : course.getModules()) {
                    if (module.getLessons() != null) {
                        totalLessons += module.getLessons().size();
                    }
                }
            }
            
            int percentage = totalLessons == 0 ? 0 : (int) Math.round((completedIds.size() * 100.0) / totalLessons);
            
            return com.example.demo.dto.ProgressSummaryResponse.builder()
                    .courseId(course.getId())
                    .completedLessons(completedIds.size())
                    .totalLessons(totalLessons)
                    .percentage(percentage)
                    .isCertified(percentage == 100)
                    .build();
        }).toList();
    }
}
