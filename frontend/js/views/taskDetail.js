// ============================================================
// Task Detail View
// Shows full task info with inline editing capability
// ============================================================

import state, { updateTaskInState, removeTaskFromState } from '../state.js';
import { updateTask, deleteTask } from '../api.js';
import { navigateTo, getParams } from '../router.js';
import { showToast } from '../app.js';

/**
 * Format date for display.
 */
function formatDate(dateStr) {
  if (!dateStr) return 'Sin fecha';
  const date = new Date(dateStr + 'T00:00:00');
  const months = ['enero', 'febrero', 'marzo', 'abril', 'mayo', 'junio', 'julio', 'agosto', 'septiembre', 'octubre', 'noviembre', 'diciembre'];
  return `${date.getDate()} de ${months[date.getMonth()]}, ${date.getFullYear()}`;
}

/**
 * Render the task detail view.
 */
export function render() {
  const { id } = getParams();
  const task = state.tasks.find(t => t.id === id || t.id === Number(id));

  if (!task) {
    return `
      <div class="view-enter" style="padding: 40px 20px; text-align: center;">
        <span class="material-symbols-outlined" style="font-size: 64px; color: var(--text-tertiary); opacity: 0.3;">search_off</span>
        <h2 style="font-size: 20px; font-weight: 700; color: var(--text-primary); margin: 16px 0 8px;">Tarea no encontrada</h2>
        <p style="color: var(--text-secondary); font-size: 14px; margin-bottom: 24px;">La tarea que buscas no existe o fue eliminada.</p>
        <button class="btn-primary" style="max-width: 200px; margin: 0 auto;" onclick="location.hash='#/board'">Volver al Tablero</button>
      </div>
    `;
  }

  // Priority button active states
  const pActive = (p) => task.priority === p ? 'active' : '';
  // Status chip active states
  const sActive = (s) => task.status === s ? 'active-primary' : '';

  return `
    <div class="view-enter" style="padding: 0 20px;" id="task-detail-view" data-task-id="${task.id}">
      <!-- Back Button Row -->
      <div style="display: flex; align-items: center; gap: 12px; margin-bottom: 24px;">
        <button class="btn-ghost" id="detail-back">
          <span class="material-symbols-outlined">arrow_back</span>
        </button>
        <span style="font-size: 13px; font-weight: 600; color: var(--text-tertiary); text-transform: uppercase; letter-spacing: 0.05em;">
          Detalle de Tarea
        </span>
      </div>

      <!-- Status & Date Header -->
      <div style="display: flex; align-items: center; gap: 8px; margin-bottom: 16px; flex-wrap: wrap;">
        <span class="badge badge-${task.status.toLowerCase()}" style="padding: 4px 12px; border-radius: 9999px; font-size: 11px;">
          ${task.status === 'PENDIENTE' ? 'Pendiente' : task.status === 'HACIENDO' ? 'Haciendo' : 'Hecho'}
        </span>
        <span style="font-size: 11px; font-weight: 500; color: var(--text-tertiary); letter-spacing: 0.05em; text-transform: uppercase;">
          Creada ${formatDate(task.createdAt)}
        </span>
      </div>

      <!-- Editable Title -->
      <div style="margin-bottom: 32px;">
        <textarea
          id="detail-title"
          class="form-input"
          style="font-size: 24px; font-weight: 800; letter-spacing: -0.02em; line-height: 1.2; padding: 16px; min-height: 80px; background: transparent;"
          rows="2"
        >${task.title}</textarea>
      </div>

      <!-- Sections Grid -->
      <div style="display: flex; flex-direction: column; gap: 16px; margin-bottom: 32px;">

        <!-- Description -->
        <div class="surface-card-elevated" style="padding: 20px; border-radius: 20px;">
          <label class="form-label">Descripción</label>
          <textarea
            id="detail-description"
            class="form-input"
            style="font-size: 15px; line-height: 1.6; min-height: 100px; background: var(--bg-surface-3);"
            rows="4"
            placeholder="Agregar descripción..."
          >${task.description || ''}</textarea>
        </div>

        <!-- Priority Selector -->
        <div class="surface-card-elevated" style="padding: 20px; border-radius: 20px;">
          <label class="form-label">Prioridad</label>
          <div style="display: flex; gap: 10px;">
            <button class="priority-btn urgent ${pActive('URGENT')}" data-priority="URGENT">
              <span class="material-symbols-outlined" style="font-size: 20px;">priority_high</span>
              <span class="label">Urgente</span>
            </button>
            <button class="priority-btn standard ${pActive('STANDARD')}" data-priority="STANDARD">
              <span class="material-symbols-outlined" style="font-size: 20px;">bolt</span>
              <span class="label">Normal</span>
            </button>
            <button class="priority-btn low ${pActive('LOW')}" data-priority="LOW">
              <span class="material-symbols-outlined" style="font-size: 20px;">coffee</span>
              <span class="label">Baja</span>
            </button>
          </div>
        </div>

        <!-- Status Selector -->
        <div class="surface-card-elevated" style="padding: 20px; border-radius: 20px;">
          <label class="form-label">Estado</label>
          <div style="display: flex; flex-wrap: wrap; gap: 8px;">
            <button class="chip ${sActive('PENDIENTE')}" data-status="PENDIENTE">Pendiente</button>
            <button class="chip ${sActive('HACIENDO')}" data-status="HACIENDO">Haciendo</button>
            <button class="chip ${sActive('HECHO')}" data-status="HECHO">Hecho</button>
          </div>
        </div>

        <!-- Due Date -->
        <div class="surface-card-elevated" style="padding: 20px; border-radius: 20px;">
          <label class="form-label">Fecha de vencimiento</label>
          <input
            type="date"
            id="detail-due-date"
            class="form-input"
            style="background: var(--bg-surface-3); color-scheme: dark;"
            value="${task.dueDate || ''}"
          />
        </div>
      </div>

      <!-- Action Buttons -->
      <div style="display: flex; flex-direction: column; gap: 12px; padding-bottom: 24px;">
        <button class="btn-primary" id="detail-save">
          <span class="material-symbols-outlined">check</span>
          Guardar Cambios
        </button>
        <button class="btn-danger" id="detail-delete">
          <span class="material-symbols-outlined">delete</span>
          Eliminar Tarea
        </button>
      </div>
    </div>
  `;
}

/**
 * Attach event listeners after render.
 */
export function mount() {
  const view = document.getElementById('task-detail-view');
  if (!view) return;

  const taskId = view.dataset.taskId;
  // Find the task — support both string and number ids
  let task = state.tasks.find(t => String(t.id) === String(taskId));
  if (!task) return;

  // Working copy of edits
  const edits = {
    title: task.title,
    description: task.description || '',
    priority: task.priority,
    status: task.status,
    dueDate: task.dueDate || '',
  };

  // Back button
  document.getElementById('detail-back')?.addEventListener('click', () => {
    history.back();
  });

  // Title input
  document.getElementById('detail-title')?.addEventListener('input', (e) => {
    edits.title = e.target.value;
  });

  // Description input
  document.getElementById('detail-description')?.addEventListener('input', (e) => {
    edits.description = e.target.value;
  });

  // Due date
  document.getElementById('detail-due-date')?.addEventListener('change', (e) => {
    edits.dueDate = e.target.value;
  });

  // Priority buttons
  document.querySelectorAll('[data-priority]').forEach(btn => {
    btn.addEventListener('click', () => {
      edits.priority = btn.dataset.priority;
      // Update visual state
      document.querySelectorAll('[data-priority]').forEach(b => b.classList.remove('active'));
      btn.classList.add('active');
    });
  });

  // Status buttons
  document.querySelectorAll('[data-status]').forEach(btn => {
    btn.addEventListener('click', () => {
      edits.status = btn.dataset.status;
      // Update visual state
      document.querySelectorAll('[data-status]').forEach(b => {
        b.classList.remove('active-primary');
      });
      btn.classList.add('active-primary');
    });
  });

  // Save button
  document.getElementById('detail-save')?.addEventListener('click', async () => {
    if (!edits.title.trim()) {
      showToast('El título no puede estar vacío', 'error');
      return;
    }

    const updated = { ...task, ...edits };
    updateTaskInState(updated);

    // Try to persist to backend
    const result = await updateTask(taskId, edits);
    if (result) {
      showToast('Tarea actualizada', 'success');
    } else {
      showToast('Guardado localmente (sin conexión al servidor)', 'info');
    }

    history.back();
  });

  // Delete button
  document.getElementById('detail-delete')?.addEventListener('click', async () => {
    const confirmed = confirm('¿Estás seguro de que quieres eliminar esta tarea?');
    if (!confirmed) return;

    removeTaskFromState(taskId);

    const result = await deleteTask(taskId);
    if (result) {
      showToast('Tarea eliminada', 'success');
    } else {
      showToast('Eliminada localmente (sin conexión al servidor)', 'info');
    }

    navigateTo('/board');
  });
}
