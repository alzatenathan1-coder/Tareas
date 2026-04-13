package com.taskscape.repository;

import com.taskscape.model.Status;
import com.taskscape.model.Task;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.time.LocalDate;
import java.util.List;

/**
 * JPA Repository for Task entities.
 *
 * By extending JpaRepository, Spring automatically provides:
 *   - findAll(), findById(), save(), deleteById(), count(), etc.
 *
 * We only need to declare custom query methods below.
 * Spring Data JPA generates the SQL from the method name automatically!
 */
@Repository
public interface TaskRepository extends JpaRepository<Task, Long> {

    /**
     * Find all tasks with a specific status.
     * Example: findByStatus(Status.PENDIENTE) → SELECT * FROM tasks WHERE status = 'PENDIENTE'
     */
    List<Task> findByStatus(Status status);

    /**
     * Find all tasks due on a specific date.
     * Used by the calendar view in the frontend.
     */
    List<Task> findByDueDate(LocalDate date);

    /**
     * Find all tasks ordered by creation date (newest first).
     * This is the default listing order.
     */
    List<Task> findAllByOrderByCreatedAtDesc();
}
