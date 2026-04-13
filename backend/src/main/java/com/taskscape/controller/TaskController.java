package com.taskscape.controller;

import com.taskscape.model.Status;
import com.taskscape.model.Task;
import com.taskscape.service.TaskService;
import jakarta.validation.Valid;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDate;
import java.util.List;

/**
 * REST Controller for Task endpoints.
 *
 * @RestController = @Controller + @ResponseBody
 *   → Every method returns JSON (not a view/template).
 *
 * @RequestMapping("/api/tasks") sets the base URL for all endpoints in this class.
 *
 * All endpoints:
 *   GET    /api/tasks              → list all (optional ?status= filter)
 *   GET    /api/tasks/{id}         → get one task
 *   POST   /api/tasks              → create a task
 *   PUT    /api/tasks/{id}         → update a task
 *   DELETE /api/tasks/{id}         → delete a task
 *   GET    /api/tasks/date/{date}  → get tasks by due date
 */
@RestController
@RequestMapping("/api/tasks")
public class TaskController {

    private final TaskService taskService;

    /**
     * Constructor injection of the TaskService.
     */
    public TaskController(TaskService taskService) {
        this.taskService = taskService;
    }

    // ──────────────────────────────────────────────
    // GET /api/tasks?status=PENDIENTE (optional filter)
    // ──────────────────────────────────────────────

    /**
     * List all tasks. Optionally filter by status using a query parameter.
     *
     * Examples:
     *   GET /api/tasks             → returns all tasks
     *   GET /api/tasks?status=HACIENDO → returns only "in progress" tasks
     *
     * @param status optional status filter (PENDIENTE, HACIENDO, HECHO)
     * @return list of tasks as JSON array
     */
    @GetMapping
    public ResponseEntity<List<Task>> getAllTasks(
            @RequestParam(required = false) Status status
    ) {
        List<Task> tasks;

        if (status != null) {
            // Filter by status if provided
            tasks = taskService.getTasksByStatus(status);
        } else {
            // Otherwise return all tasks
            tasks = taskService.getAllTasks();
        }

        return ResponseEntity.ok(tasks);  // 200 OK
    }

    // ──────────────────────────────────────────────
    // GET /api/tasks/{id}
    // ──────────────────────────────────────────────

    /**
     * Get a single task by its ID.
     *
     * @param id the task ID from the URL path
     * @return the task as JSON, or 404 if not found
     */
    @GetMapping("/{id}")
    public ResponseEntity<Task> getTask(@PathVariable Long id) {
        Task task = taskService.getTask(id);
        return ResponseEntity.ok(task);  // 200 OK
    }

    // ──────────────────────────────────────────────
    // POST /api/tasks
    // ──────────────────────────────────────────────

    /**
     * Create a new task.
     *
     * @Valid triggers validation annotations on the Task entity (@NotBlank, @NotNull).
     * If validation fails, Spring returns 400 Bad Request automatically.
     *
     * @param task the task data from the request body (JSON)
     * @return the created task with its generated ID, status 201 Created
     */
    @PostMapping
    public ResponseEntity<Task> createTask(@Valid @RequestBody Task task) {
        Task createdTask = taskService.createTask(task);
        return ResponseEntity.status(HttpStatus.CREATED).body(createdTask);  // 201 Created
    }

    // ──────────────────────────────────────────────
    // PUT /api/tasks/{id}
    // ──────────────────────────────────────────────

    /**
     * Update an existing task.
     *
     * @param id the task ID from the URL path
     * @param task the updated task data from the request body
     * @return the updated task as JSON, or 404 if not found
     */
    @PutMapping("/{id}")
    public ResponseEntity<Task> updateTask(
            @PathVariable Long id,
            @Valid @RequestBody Task task
    ) {
        Task updatedTask = taskService.updateTask(id, task);
        return ResponseEntity.ok(updatedTask);  // 200 OK
    }

    // ──────────────────────────────────────────────
    // DELETE /api/tasks/{id}
    // ──────────────────────────────────────────────

    /**
     * Delete a task by its ID.
     *
     * @param id the task ID from the URL path
     * @return 204 No Content on success, 404 if not found
     */
    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteTask(@PathVariable Long id) {
        taskService.deleteTask(id);
        return ResponseEntity.noContent().build();  // 204 No Content
    }

    // ──────────────────────────────────────────────
    // GET /api/tasks/date/{date}
    // ──────────────────────────────────────────────

    /**
     * Get all tasks due on a specific date.
     * Used by the calendar view in the frontend.
     *
     * The date format is ISO: YYYY-MM-DD (e.g., 2026-04-15)
     *
     * @param date the due date from the URL path
     * @return list of tasks due on that date
     */
    @GetMapping("/date/{date}")
    public ResponseEntity<List<Task>> getTasksByDate(@PathVariable LocalDate date) {
        List<Task> tasks = taskService.getTasksByDate(date);
        return ResponseEntity.ok(tasks);  // 200 OK
    }
}
