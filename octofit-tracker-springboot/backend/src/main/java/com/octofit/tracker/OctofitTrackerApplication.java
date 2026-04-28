package com.octofit.tracker;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.data.jpa.repository.config.EnableJpaAuditing;

@SpringBootApplication
@EnableJpaAuditing
public class OctofitTrackerApplication {

    public static void main(String[] args) {
        SpringApplication.run(OctofitTrackerApplication.class, args);
    }
}
