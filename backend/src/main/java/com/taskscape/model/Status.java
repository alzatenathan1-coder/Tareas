package com.taskscape.model;

/**
 * Enum representing the current status of a task.
 * Uses Spanish names to match the frontend UI.
 * Stored as a STRING in the database.
 */
public enum Status {
    PENDIENTE,  // Pending - not started yet
    HACIENDO,   // In progress - currently being worked on
    HECHO       // Done - completed
}
