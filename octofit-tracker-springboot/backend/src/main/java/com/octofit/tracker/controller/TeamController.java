package com.octofit.tracker.controller;

import com.octofit.tracker.dto.MessageResponse;
import com.octofit.tracker.model.Team;
import com.octofit.tracker.model.User;
import com.octofit.tracker.repository.TeamRepository;
import com.octofit.tracker.repository.UserRepository;
import jakarta.validation.Valid;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.web.bind.annotation.*;

import java.util.HashMap;
import java.util.List;
import java.util.Map;

@CrossOrigin(origins = "*", maxAge = 3600)
@RestController
@RequestMapping("/api/teams")
public class TeamController {

    @Autowired
    private TeamRepository teamRepository;

    @Autowired
    private UserRepository userRepository;

    @GetMapping
    public ResponseEntity<List<Map<String, Object>>> getAllTeams() {
        List<Team> teams = teamRepository.findAll();
        List<Map<String, Object>> teamResponses = teams.stream().map(team -> {
            Map<String, Object> response = new HashMap<>();
            response.put("id", team.getId());
            response.put("name", team.getName());
            response.put("description", team.getDescription());
            response.put("captainName", team.getCaptainName());
            response.put("memberCount", team.getMemberCount());
            response.put("createdAt", team.getCreatedAt());
            
            // Check if current user is captain or member
            Authentication auth = SecurityContextHolder.getContext().getAuthentication();
            if (auth != null && auth.isAuthenticated() && !"anonymousUser".equals(auth.getPrincipal())) {
                User currentUser = userRepository.findByUsername(auth.getName()).orElse(null);
                if (currentUser != null) {
                    response.put("isCaptain", team.getCaptain().getId().equals(currentUser.getId()));
                    response.put("isMember", team.getMembers().contains(currentUser));
                } else {
                    response.put("isCaptain", false);
                    response.put("isMember", false);
                }
            } else {
                response.put("isCaptain", false);
                response.put("isMember", false);
            }
            
            return response;
        }).toList();
        
        return ResponseEntity.ok(teamResponses);
    }

    @GetMapping("/{id}")
    public ResponseEntity<?> getTeamById(@PathVariable Long id) {
        Team team = teamRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Team not found"));
        return ResponseEntity.ok(team);
    }

    @PostMapping
    public ResponseEntity<?> createTeam(@Valid @RequestBody Team teamRequest) {
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
        if (authentication == null || !authentication.isAuthenticated()) {
            return ResponseEntity.status(401).body(new MessageResponse("Not authenticated"));
        }

        User captain = userRepository.findByUsername(authentication.getName())
                .orElseThrow(() -> new RuntimeException("User not found"));

        Team team = new Team(teamRequest.getName(), teamRequest.getDescription(), captain);
        Team savedTeam = teamRepository.save(team);

        Map<String, Object> response = new HashMap<>();
        response.put("id", savedTeam.getId());
        response.put("name", savedTeam.getName());
        response.put("description", savedTeam.getDescription());
        response.put("captainName", savedTeam.getCaptainName());
        response.put("memberCount", savedTeam.getMemberCount());
        response.put("isCaptain", true);
        response.put("isMember", false);
        response.put("createdAt", savedTeam.getCreatedAt());

        return ResponseEntity.ok(response);
    }

    @PostMapping("/{id}/join")
    public ResponseEntity<?> joinTeam(@PathVariable Long id) {
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
        if (authentication == null || !authentication.isAuthenticated()) {
            return ResponseEntity.status(401).body(new MessageResponse("Not authenticated"));
        }

        User user = userRepository.findByUsername(authentication.getName())
                .orElseThrow(() -> new RuntimeException("User not found"));

        Team team = teamRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Team not found"));

        if (team.getCaptain().getId().equals(user.getId())) {
            return ResponseEntity.badRequest().body(new MessageResponse("Captain cannot join their own team"));
        }

        if (team.getMembers().contains(user)) {
            return ResponseEntity.badRequest().body(new MessageResponse("Already a member of this team"));
        }

        team.getMembers().add(user);
        teamRepository.save(team);

        return ResponseEntity.ok(new MessageResponse("Successfully joined the team"));
    }

    @PostMapping("/{id}/leave")
    public ResponseEntity<?> leaveTeam(@PathVariable Long id) {
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
        if (authentication == null || !authentication.isAuthenticated()) {
            return ResponseEntity.status(401).body(new MessageResponse("Not authenticated"));
        }

        User user = userRepository.findByUsername(authentication.getName())
                .orElseThrow(() -> new RuntimeException("User not found"));

        Team team = teamRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Team not found"));

        if (!team.getMembers().contains(user)) {
            return ResponseEntity.badRequest().body(new MessageResponse("Not a member of this team"));
        }

        team.getMembers().remove(user);
        teamRepository.save(team);

        return ResponseEntity.ok(new MessageResponse("Successfully left the team"));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<?> deleteTeam(@PathVariable Long id) {
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
        if (authentication == null || !authentication.isAuthenticated()) {
            return ResponseEntity.status(401).body(new MessageResponse("Not authenticated"));
        }

        User user = userRepository.findByUsername(authentication.getName())
                .orElseThrow(() -> new RuntimeException("User not found"));

        Team team = teamRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Team not found"));

        if (!team.getCaptain().getId().equals(user.getId())) {
            return ResponseEntity.status(403).body(new MessageResponse("Only the captain can delete the team"));
        }

        teamRepository.delete(team);
        return ResponseEntity.ok(new MessageResponse("Team deleted successfully"));
    }
}
