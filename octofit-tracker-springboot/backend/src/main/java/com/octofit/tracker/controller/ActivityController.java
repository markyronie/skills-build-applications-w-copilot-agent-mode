package com.octofit.tracker.controller;

import com.octofit.tracker.dto.MessageResponse;
import com.octofit.tracker.model.Activity;
import com.octofit.tracker.model.User;
import com.octofit.tracker.repository.ActivityRepository;
import com.octofit.tracker.repository.UserRepository;
import jakarta.validation.Valid;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDate;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

@CrossOrigin(origins = "*", maxAge = 3600)
@RestController
@RequestMapping("/api/activities")
public class ActivityController {

    @Autowired
    private ActivityRepository activityRepository;

    @Autowired
    private UserRepository userRepository;

    @GetMapping
    public ResponseEntity<?> getMyActivities() {
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
        if (authentication == null || !authentication.isAuthenticated()) {
            return ResponseEntity.status(401).body(new MessageResponse("Not authenticated"));
        }

        User user = userRepository.findByUsername(authentication.getName())
                .orElseThrow(() -> new RuntimeException("User not found"));

        List<Activity> activities = activityRepository.findByUserIdOrderByActivityDateDesc(user.getId());
        return ResponseEntity.ok(activities);
    }

    @GetMapping("/{id}")
    public ResponseEntity<?> getActivityById(@PathVariable Long id) {
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
        if (authentication == null || !authentication.isAuthenticated()) {
            return ResponseEntity.status(401).body(new MessageResponse("Not authenticated"));
        }

        User user = userRepository.findByUsername(authentication.getName())
                .orElseThrow(() -> new RuntimeException("User not found"));

        Activity activity = activityRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Activity not found"));

        if (!activity.getUser().getId().equals(user.getId())) {
            return ResponseEntity.status(403).body(new MessageResponse("Not authorized to view this activity"));
        }

        return ResponseEntity.ok(activity);
    }

    @PostMapping
    public ResponseEntity<?> createActivity(@Valid @RequestBody Activity activityRequest) {
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
        if (authentication == null || !authentication.isAuthenticated()) {
            return ResponseEntity.status(401).body(new MessageResponse("Not authenticated"));
        }

        User user = userRepository.findByUsername(authentication.getName())
                .orElseThrow(() -> new RuntimeException("User not found"));

        Activity activity = new Activity(
                user,
                activityRequest.getActivityType(),
                activityRequest.getDuration(),
                activityRequest.getDistance(),
                activityRequest.getCalories(),
                activityRequest.getNotes(),
                activityRequest.getActivityDate()
        );

        Activity savedActivity = activityRepository.save(activity);
        return ResponseEntity.ok(savedActivity);
    }

    @PutMapping("/{id}")
    public ResponseEntity<?> updateActivity(@PathVariable Long id, @Valid @RequestBody Activity activityRequest) {
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
        if (authentication == null || !authentication.isAuthenticated()) {
            return ResponseEntity.status(401).body(new MessageResponse("Not authenticated"));
        }

        User user = userRepository.findByUsername(authentication.getName())
                .orElseThrow(() -> new RuntimeException("User not found"));

        Activity activity = activityRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Activity not found"));

        if (!activity.getUser().getId().equals(user.getId())) {
            return ResponseEntity.status(403).body(new MessageResponse("Not authorized to update this activity"));
        }

        activity.setActivityType(activityRequest.getActivityType());
        activity.setDuration(activityRequest.getDuration());
        activity.setDistance(activityRequest.getDistance());
        activity.setCalories(activityRequest.getCalories());
        activity.setNotes(activityRequest.getNotes());
        activity.setActivityDate(activityRequest.getActivityDate());

        Activity updatedActivity = activityRepository.save(activity);
        return ResponseEntity.ok(updatedActivity);
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<?> deleteActivity(@PathVariable Long id) {
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
        if (authentication == null || !authentication.isAuthenticated()) {
            return ResponseEntity.status(401).body(new MessageResponse("Not authenticated"));
        }

        User user = userRepository.findByUsername(authentication.getName())
                .orElseThrow(() -> new RuntimeException("User not found"));

        Activity activity = activityRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Activity not found"));

        if (!activity.getUser().getId().equals(user.getId())) {
            return ResponseEntity.status(403).body(new MessageResponse("Not authorized to delete this activity"));
        }

        activityRepository.delete(activity);
        return ResponseEntity.ok(new MessageResponse("Activity deleted successfully"));
    }
}
