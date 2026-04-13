// ============================================================
// Kanban Board View
// Displays tasks in filtered card list with priority indicators
// ============================================================

import state, { setFilter } from '../state.js';
import { navigateTo } from '../router.js';

/**
 * Format a date string for display.
 */
function formatDate(dateStr) {
  if (!dateStr) return '';
  const date = new Date(dateStr + 'T00:00:00');
  const months = ['Ene', 'Feb', 'Mar', 'Abr', 'May', 'Jun', 'Jul', 'Ago', 'Sep', 'Oct', 'Nov', 'Dic'];
  return `${months[date.getMonth()]} ${date.getDate()}, ${date.getFullYear()}`;
}

/**
 * Get the CSS class for a priority badge.
 */
function priorityBadgeClass(priority) {
  switch (priority) {
    case 'URGENT': return 'badge-urgent';
    case 'STANDARD': return 'badge-standard';
    case 'LOW': return 'badge-low';
    default: return 'badge-standard';
  }
}

/**
 * Get the CSS class for a priority bar.
 */
function priorityBarClass(priority) {
  switch (priority) {
    case 'URGENT': return 'priority-bar-urgent';
    case 'STANDARD': return 'priority-bar-standard';
    case 'LOW': return 'priority-bar-low';
    default: return 'priority-bar-standard';
  }
}

/**
 * Get priority label in Spanish.
 */
function priorityLabel(priority) {
  switch (priority) {
    case 'URGENT': return 'Urgente';
    case 'STANDARD': return 'Normal';
    case 'LOW': return 'Baja';
    default: return priority;
  }
}

/**
 * Get status badge class.
 */
function statusBadgeClass(status) {
  switch (status) {
    case 'PENDIENTE': return 'badge-pendiente';
    case 'HACIENDO': return 'badge-haciendo';
    case 'HECHO': return 'badge-hecho';
    default: return '';
  }
}

/**
 * Get status label.
 */
function statusLabel(status) {
  switch (status) {
    case 'PENDIENTE': return 'Pendiente';
    case 'HACIENDO': return 'Haciendo';
    case 'HECHO': return 'Hecho';
    default: return status;
  }
}

/**
 * Check if a due date is overdue.
 */
function isOverdue(dateStr) {
  if (!dateStr) return false;
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  const due = new Date(dateStr + 'T00:00:00');
  return due < today;
}

/**
 * Render a single task card.
 */
function renderCard(task) {
  const overdue = isOverdue(task.dueDate) && task.status !== 'HECHO';
  const overdueClass = overdue ? 'style="color: var(--tertiary)"' : '';

  return `
    <article class="surface-card p-5 cursor-pointer" data-task-id="${task.id}">
      <div class="priority-bar ${priorityBarClass(task.priority)}"></div>
      <div style="padding-left: 8px;">
        <div style="display: flex; justify-content: space-between; align-items: flex-start; margin-bottom: 10px;">
          <span class="badge ${priorityBadgeClass(task.priority)}">${priorityLabel(task.priority)}</span>
          <span class="badge ${statusBadgeClass(task.status)}">${statusLabel(task.status)}</span>
        </div>
        <h3 style="font-size: 16px; font-weight: 700; line-height: 1.3; margin-bottom: 12px; color: var(--text-primary);">
          ${task.title}
        </h3>
        <div style="display: flex; align-items: center; gap: 6px;" ${overdueClass}>
          <span class="material-symbols-outlined" style="font-size: 14px; opacity: 0.6;">calendar_today</span>
          <time style="font-size: 11px; font-weight: 600; text-transform: uppercase; letter-spacing: 0.05em; color: ${overdue ? 'var(--tertiary)' : 'var(--text-secondary)'};">
            ${formatDate(task.dueDate)}${overdue ? ' (vencida)' : ''}
          </time>
        </div>
      </div>
    </article>
  `;
}

/**
 * Render the Kanban board view.
 * Returns HTML string.
 */
export function render() {
  const filter = state.currentFilter;

  // Filter tasks
  let filteredTasks = state.tasks;
  if (filter !== 'all') {
    filteredTasks = state.tasks.filter(t => t.status === filter.toUpperCase());
  }

  // Sort: URGENT first, then by due date
  const priorityOrder = { 'URGENT': 0, 'STANDARD': 1, 'LOW': 2 };
  filteredTasks.sort((a, b) => {
    const pDiff = (priorityOrder[a.priority] || 1) - (priorityOrder[b.priority] || 1);
    if (pDiff !== 0) return pDiff;
    return (a.dueDate || '').localeCompare(b.dueDate || '');
  });

  // Count per status for tab badges
  const counts = {
    pendiente: state.tasks.filter(t => t.status === 'PENDIENTE').length,
    haciendo: state.tasks.filter(t => t.status === 'HACIENDO').length,
    hecho: state.tasks.filter(t => t.status === 'HECHO').length,
  };

  const tabActive = (f) => filter === f ? 'active' : '';

  const today = new Date();
  const dayNames = ['Domingo', 'Lunes', 'Martes', 'Miércoles', 'Jueves', 'Viernes', 'Sábado'];
  const monthNames = ['enero', 'febrero', 'marzo', 'abril', 'mayo', 'junio', 'julio', 'agosto', 'septiembre', 'octubre', 'noviembre', 'diciembre'];
  const dateStr = `${dayNames[today.getDay()]}, ${today.getDate()} de ${monthNames[today.getMonth()]}`;

  return `
    <div class="view-enter" style="padding: 0 20px;">
      <!-- Greeting -->
      <div style="margin-bottom: 24px;">
        <h2 style="font-size: 28px; font-weight: 800; letter-spacing: -0.02em; color: var(--text-primary); margin: 0 0 4px 0;">
          Tablero
        </h2>
        <p style="font-size: 13px; font-weight: 500; color: var(--text-tertiary); margin: 0;">
          ${dateStr}
        </p>
      </div>

      <!-- Tab Filter Bar -->
      <div class="tab-bar hide-scrollbar" style="margin-bottom: 24px; position: sticky; top: 68px; z-index: 40;">
        <button class="${tabActive('all')}" data-filter="all">
          Todos <span style="opacity: 0.5; margin-left: 4px;">${state.tasks.length}</span>
        </button>
        <button class="${tabActive('pendiente')}" data-filter="pendiente">
          Pendiente <span style="opacity: 0.5; margin-left: 4px;">${counts.pendiente}</span>
        </button>
        <button class="${tabActive('haciendo')}" data-filter="haciendo">
          Haciendo <span style="opacity: 0.5; margin-left: 4px;">${counts.haciendo}</span>
        </button>
        <button class="${tabActive('hecho')}" data-filter="hecho">
          Hecho <span style="opacity: 0.5; margin-left: 4px;">${counts.hecho}</span>
        </button>
      </div>

      <!-- Task Cards -->
      <div style="display: flex; flex-direction: column; gap: 12px;">
        ${filteredTasks.length > 0
          ? filteredTasks.map(renderCard).join('')
          : `<div style="text-align: center; padding: 48px 20px; color: var(--text-tertiary);">
              <span class="material-symbols-outlined" style="font-size: 48px; opacity: 0.3; display: block; margin-bottom: 12px;">inbox</span>
              <p style="font-size: 14px; font-weight: 500;">No hay tareas${filter !== 'all' ? ` en "${statusLabel(filter.toUpperCase())}"` : ''}</p>
            </div>`
        }
      </div>
    </div>
  `;
}

/**
 * Attach event listeners after render.
 */
export function mount() {
  // Tab filter buttons
  document.querySelectorAll('.tab-bar button[data-filter]').forEach(btn => {
    btn.addEventListener('click', () => {
      setFilter(btn.dataset.filter);
    });
  });

  // Task card clicks → navigate to detail
  document.querySelectorAll('[data-task-id]').forEach(card => {
    card.addEventListener('click', () => {
      navigateTo(`/task/${card.dataset.taskId}`);
    });
  });
}
