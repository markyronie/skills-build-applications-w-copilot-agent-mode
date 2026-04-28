package com.octofit.tracker.repository;

import com.octofit.tracker.model.Activity;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.time.LocalDate;
import java.util.List;

@Repository
public interface ActivityRepository extends JpaRepository<Activity, Long> {
    
    List<Activity> findByUserIdOrderByActivityDateDesc(Long userId);
    
    List<Activity> findByUserIdAndActivityDateBetweenOrderByActivityDateDesc(
        Long userId, LocalDate startDate, LocalDate endDate);
    
    @Query("SELECT a FROM Activity a WHERE a.activityDate >= :startDate ORDER BY a.activityDate DESC")
    List<Activity> findRecentActivities(@Param("startDate") LocalDate startDate);
    
    @Query("SELECT a.user.id as userId, a.user.username as username, " +
           "SUM(a.duration) as totalDuration, SUM(a.calories) as totalCalories " +
           "FROM Activity a WHERE a.activityDate >= :startDate " +
           "GROUP BY a.user.id, a.user.username " +
           "ORDER BY totalDuration DESC")
    List<Object[]> findLeaderboardData(@Param("startDate") LocalDate startDate);
}
