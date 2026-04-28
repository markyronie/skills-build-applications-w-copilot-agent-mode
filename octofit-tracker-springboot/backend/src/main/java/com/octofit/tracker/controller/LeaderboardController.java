package com.octofit.tracker.controller;

import com.octofit.tracker.repository.ActivityRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDate;
import java.time.temporal.ChronoUnit;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;

@CrossOrigin(origins = "*", maxAge = 3600)
@RestController
@RequestMapping("/api/leaderboard")
public class LeaderboardController {

    @Autowired
    private ActivityRepository activityRepository;

    @GetMapping
    public ResponseEntity<List<Map<String, Object>>> getLeaderboard(
            @RequestParam(defaultValue = "week") String period) {
        
        LocalDate startDate;
        LocalDate today = LocalDate.now();
        
        switch (period.toLowerCase()) {
            case "week":
                startDate = today.minus(7, ChronoUnit.DAYS);
                break;
            case "month":
                startDate = today.minus(30, ChronoUnit.DAYS);
                break;
            case "all":
                startDate = LocalDate.of(2000, 1, 1); // Far in the past
                break;
            default:
                startDate = today.minus(7, ChronoUnit.DAYS);
        }

        List<Object[]> leaderboardData = activityRepository.findLeaderboardData(startDate);
        
        List<Map<String, Object>> leaderboard = leaderboardData.stream()
                .map(data -> {
                    Map<String, Object> entry = new HashMap<>();
                    entry.put("userId", data[0]);
                    entry.put("username", data[1]);
                    entry.put("totalDuration", data[2]);
                    entry.put("totalCalories", data[3] != null ? data[3] : 0);
                    return entry;
                })
                .collect(Collectors.toList());
        
        return ResponseEntity.ok(leaderboard);
    }
}
