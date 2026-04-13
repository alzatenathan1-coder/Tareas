package com.taskscape.model;

import jakarta.persistence.*;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import java.time.LocalDate;
import java.time.LocalDateTime;

/**
 * JPA Entity representing a task in the database.
 *
 * Maps to the "tasks" table in MySQL. Each field becomes a column.
 * The @Entity annotation tells Hibernate this class should be persisted.
 */
@Entity
@Table(name = "tasks")
public class Task {

    // ──────────────────────────────────────────────
    // Fields
    // ──────────────────────────────────────────────

    /** Auto-generated primary key */
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    /** Task title - required, cannot be blank */
    @NotBlank(message = "El titulo no puede estar vacio")
    @Column(nullable = false)
    private String title;

    /** Optional longer description of the task */
    @Column(columnDefinition = "TEXT")
    private String description;

    /** Priority level: URGENT, STANDARD, or LOW */
    @NotNull(message = "La prioridad es obligatoria")
    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    private Priority priority;

    /** Current status: PENDIENTE, HACIENDO, or HECHO */
    @NotNull(message = "El estado es obligatorio")
    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    private Status status;

    /** Optional due date for the task */
    private LocalDate dueDate;

    /** Timestamp when the task was created (set automatically, never updated) */
    @Column(updatable = false)
    private LocalDateTime createdAt;

    /** Timestamp of the last update (set automatically on every save) */
    private LocalDateTime updatedAt;

    // ──────────────────────────────────────────────
    // JPA Lifecycle Callbacks
    // ──────────────────────────────────────────────

    /**
     * Called automatically by JPA before inserting a new task.
     * Sets both createdAt and updatedAt to the current time.
     */
    @PrePersist
    protected void onCreate() {
        createdAt = LocalDateTime.now();
        updatedAt = LocalDateTime.now();
    }

    /**
     * Called automatically by JPA before updating an existing task.
     * Only updates the updatedAt timestamp.
     */
    @PreUpdate
    protected void onUpdate() {
        updatedAt = LocalDateTime.now();
    }

    // ──────────────────────────────────────────────
    // Constructors
    // ──────────────────────────────────────────────

    /** Default no-args constructor (required by JPA) */
    public Task() {
    }

    /** Convenience constructor with all main fields */
    public Task(String title, String description, Priority priority, Status status, LocalDate dueDate) {
        this.title = title;
        this.description = description;
        this.priority = priority;
        this.status = status;
        this.dueDate = dueDate;
    }

    // ──────────────────────────────────────────────
    // Getters and Setters
    // ──────────────────────────────────────────────

    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public String getTitle() {
        return title;
    }

    public void setTitle(String title) {
        this.title = title;
    }

    public String getDescription() {
        return description;
    }

    public void setDescription(String description) {
        this.description = description;
    }

    public Priority getPriority() {
        return priority;
    }

    public void setPriority(Priority priority) {
        this.priority = priority;
    }

    public Status getStatus() {
        return status;
    }

    public void setStatus(Status status) {
        this.status = status;
    }

    public LocalDate getDueDate() {
        return dueDate;
    }

    public void setDueDate(LocalDate dueDate) {
        this.dueDate = dueDate;
    }

    public LocalDateTime getCreatedAt() {
        return createdAt;
    }

    public void setCreatedAt(LocalDateTime createdAt) {
        this.createdAt = createdAt;
    }

    public LocalDateTime getUpdatedAt() {
        return updatedAt;
    }

    public void setUpdatedAt(LocalDateTime updatedAt) {
        this.updatedAt = updatedAt;
    }

    // ──────────────────────────────────────────────
    // toString (useful for debugging)
    // ──────────────────────────────────────────────

    @Override
    public String toString() {
        return "Task{" +
                "id=" + id +
                ", title='" + title + '\'' +
                ", priority=" + priority +
                ", status=" + status +
                ", dueDate=" + dueDate +
                '}';
    }
}
