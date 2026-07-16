package com.example.demo.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@Builder
@AllArgsConstructor
@NoArgsConstructor
public class ProgressSummaryResponse {
    private Long courseId;
    private int completedLessons;
    private int totalLessons;
    private int percentage;
    private boolean isCertified;
}
