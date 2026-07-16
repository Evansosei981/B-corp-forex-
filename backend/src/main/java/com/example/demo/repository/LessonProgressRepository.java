package com.example.demo.repository;

import com.example.demo.model.LessonProgress;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.jpa.repository.Modifying;

import java.util.List;

public interface LessonProgressRepository extends JpaRepository<LessonProgress, Long> {
    
    boolean existsByUserIdAndLessonId(Long userId, Long lessonId);

    @Query("SELECT lp.lesson.id FROM LessonProgress lp WHERE lp.user.id = :userId AND lp.lesson.module.course.id = :courseId")
    List<Long> findCompletedLessonIdsByUserAndCourse(Long userId, Long courseId);

    @Modifying
    @Query("DELETE FROM LessonProgress lp WHERE lp.lesson.module.course.id = :courseId")
    void deleteByCourseId(Long courseId);
}
