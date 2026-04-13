package com.taskscape;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;

/**
 * Main entry point for the Taskscape application.
 *
 * @SpringBootApplication combines three annotations:
 *   - @Configuration: marks this class as a source of bean definitions
 *   - @EnableAutoConfiguration: tells Spring Boot to auto-configure based on dependencies
 *   - @ComponentScan: scans this package and sub-packages for Spring components
 */
@SpringBootApplication
public class TaskscapeApplication {

    public static void main(String[] args) {
        SpringApplication.run(TaskscapeApplication.class, args);
    }
}
