package com.taskscape.model;

/**
 * Enum representing the priority level of a task.
 * Stored as a STRING in the database (not ordinal) for readability.
 */
public enum Priority {
    URGENT,     // High priority - needs immediate attention
    STANDARD,   // Normal priority - regular workflow
    LOW         // Low priority - can wait
}
