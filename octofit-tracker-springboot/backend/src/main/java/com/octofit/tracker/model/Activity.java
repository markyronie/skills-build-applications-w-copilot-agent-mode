package com.octofit.tracker.model;

import jakarta.persistence.*;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Positive;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;
import org.springframework.data.annotation.CreatedDate;
import org.springframework.data.jpa.domain.support.AuditingEntityListener;

import java.time.LocalDate;
import java.time.LocalDateTime;

@Entity
@Table(name = "activities")
@EntityListeners(AuditingEntityListener.class)
@Data
@NoArgsConstructor
@AllArgsConstructor
public class Activity {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne(fetch = FetchType.EAGER)
    @JoinColumn(name = "user_id", nullable = false)
    private User user;

    @NotBlank
    @Column(nullable = false)
    private String activityType; // running, cycling, swimming, walking, gym, etc.

    @Positive
    @NotNull
    @Column(nullable = false)
    private Integer duration; // in minutes

    @Positive
    private Double distance; // in kilometers, optional for some activities

    @Positive
    private Integer calories; // optional, can be calculated

    @Column(length = 500)
    private String notes;

    @NotNull
    @Column(nullable = false)
    private LocalDate activityDate;

    @CreatedDate
    @Column(nullable = false, updatable = false)
    private LocalDateTime createdAt;

    public Activity(User user, String activityType, Integer duration, Double distance, 
                   Integer calories, String notes, LocalDate activityDate) {
        this.user = user;
        this.activityType = activityType;
        this.duration = duration;
        this.distance = distance;
        this.calories = calories;
        this.notes = notes;
        this.activityDate = activityDate;
    }
}
