package com.taskscape.service;

import com.taskscape.model.Status;
import com.taskscape.model.Task;
import com.taskscape.repository.TaskRepository;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;
import org.springframework.web.server.ResponseStatusException;

import java.time.LocalDate;
import java.util.List;

/**
 * Service layer for Task business logic.
 *
 * The @Service annotation marks this as a Spring-managed bean.
 * It sits between the Controller (HTTP layer) and the Repository (database layer).
 * This separation keeps controllers thin and business logic testable.
 */
@Service
public class TaskService {

    // Injected by Spring via constructor injection (preferred over @Autowired on fields)
    private final TaskRepository taskRepository;

    /**
     * Constructor injection: Spring automatically provides the TaskRepository bean.
     * This is the recommended way to inject dependencies in Spring.
     */
    public TaskService(TaskRepository taskRepository) {
        this.taskRepository = taskRepository;
    }

    // ──────────────────────────────────────────────
    // READ operations
    // ──────────────────────────────────────────────

    /**
     * Get all tasks, ordered by creation date (newest first).
     */
    public List<Task> getAllTasks() {
        return taskRepository.findAllByOrderByCreatedAtDesc();
    }

    /**
     * Get tasks filtered by status (PENDIENTE, HACIENDO, or HECHO).
     */
    public List<Task> getTasksByStatus(Status status) {
        return taskRepository.findByStatus(status);
    }

    /**
     * Get a single task by its ID.
     * Throws 404 if the task doesn't exist.
     */
    public Task getTask(Long id) {
        return taskRepository.findById(id)
                .orElseThrow(() -> new ResponseStatusException(
                        HttpStatus.NOT_FOUND,
                        "Tarea con id " + id + " no encontrada"
                ));
    }

    /**
     * Get all tasks due on a specific date.
     * Used by the calendar view in the frontend.
     */
    public List<Task> getTasksByDate(LocalDate date) {
        return taskRepository.findByDueDate(date);
    }

    // ──────────────────────────────────────────────
    // WRITE operations
    // ──────────────────────────────────────────────

    /**
     * Create a new task.
     * The @PrePersist callback on the entity will set createdAt/updatedAt.
     */
    public Task createTask(Task task) {
        // Ensure we don't accidentally set an ID (let the DB generate it)
        task.setId(null);
        return taskRepository.save(task);
    }

    /**
     * Update an existing task.
     * First checks the task exists, then copies over the new values.
     */
    public Task updateTask(Long id, Task updatedTask) {
        // Find the existing task or throw 404
        Task existingTask = getTask(id);

        // Update only the fields that can change
        existingTask.setTitle(updatedTask.getTitle());
        existingTask.setDescription(updatedTask.getDescription());
        existingTask.setPriority(updatedTask.getPriority());
        existingTask.setStatus(updatedTask.getStatus());
        existingTask.setDueDate(updatedTask.getDueDate());

        // Save and return; @PreUpdate will set updatedAt automatically
        return taskRepository.save(existingTask);
    }

    /**
     * Delete a task by its ID.
     * Throws 404 if the task doesn't exist.
     */
    public void deleteTask(Long id) {
        // Verify the task exists before deleting
        if (!taskRepository.existsById(id)) {
            throw new ResponseStatusException(
                    HttpStatus.NOT_FOUND,
                    "Tarea con id " + id + " no encontrada"
            );
        }
        taskRepository.deleteById(id);
    }
}
