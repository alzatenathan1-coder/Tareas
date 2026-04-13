// ============================================================
// Task Form View - Quick task creation
// Matches the "entrada rápida" design
// ============================================================

import { createTask } from '../api.js';
import { updateTaskInState } from '../state.js';
import { navigateTo } from '../router.js';
import { showToast } from '../app.js';

/**
 * Render the task creation form.
 */
export function render() {
  const today = new Date().toISOString().split('T')[0];

  return `
    <div class="view-enter" style="padding: 0 20px; display: flex; flex-direction: column; min-height: calc(100dvh - var(--header-height) - var(--nav-height) - 24px);">
      <!-- Close Row -->
      <div style="display: flex; align-items: center; gap: 12px; margin-bottom: 32px;">
        <button class="btn-ghost" id="form-close">
          <span class="material-symbols-outlined">close</span>
        </button>
        <span style="font-size: 13px; font-weight: 600; color: var(--text-tertiary); text-transform: uppercase; letter-spacing: 0.05em;">
          Nueva Tarea
        </span>
      </div>

      <div style="flex: 1; display: flex; flex-direction: column; gap: 32px;">

        <!-- Task Title Input -->
        <div>
          <label class="form-label" for="form-title">Definición de la tarea</label>
          <textarea
            id="form-title"
            class="form-input"
            style="font-size: 22px; font-weight: 700; line-height: 1.3; min-height: 100px;"
            rows="3"
            placeholder="¿Qué necesitas hacer?"
            autofocus
          ></textarea>
        </div>

        <!-- Description -->
        <div>
          <label class="form-label" for="form-description">Descripción (opcional)</label>
          <textarea
            id="form-description"
            class="form-input"
            style="font-size: 15px; line-height: 1.6; min-height: 60px;"
            rows="2"
            placeholder="Agrega más detalles..."
          ></textarea>
        </div>

        <!-- Status Selection -->
        <div>
          <label class="form-label">Estado</label>
          <div style="display: flex; flex-wrap: wrap; gap: 8px;" id="form-status-group">
            <button class="chip active-primary" data-status="PENDIENTE">Pendiente</button>
            <button class="chip" data-status="HACIENDO">Haciendo</button>
            <button class="chip" data-status="HECHO">Hecho</button>
          </div>
        </div>

        <!-- Priority Slider -->
        <div>
          <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 8px;">
            <label class="form-label" style="margin-bottom: 0;">Nivel de prioridad</label>
            <span id="form-priority-label" style="font-size: 11px; font-weight: 700; text-transform: uppercase; letter-spacing: 0.05em; color: var(--primary);">
              Normal
            </span>
          </div>
          <div class="surface-card-elevated" style="padding: 24px; border-radius: 20px;">
            <input
              type="range"
              id="form-priority-slider"
              class="priority-slider"
              min="0"
              max="2"
              value="1"
              step="1"
            />
            <div style="display: flex; justify-content: space-between; margin-top: 16px;">
              <span style="font-size: 10px; font-weight: 700; text-transform: uppercase; letter-spacing: 0.08em; color: var(--text-tertiary);">Urgente</span>
              <span style="font-size: 10px; font-weight: 700; text-transform: uppercase; letter-spacing: 0.08em; color: var(--text-tertiary);">Normal</span>
              <span style="font-size: 10px; font-weight: 700; text-transform: uppercase; letter-spacing: 0.08em; color: var(--text-tertiary);">Baja</span>
            </div>
          </div>
        </div>

        <!-- Date & Quick Tags -->
        <div style="display: flex; flex-wrap: wrap; gap: 8px;">
          <div style="position: relative;">
            <button class="chip" id="form-date-btn" style="gap: 6px;">
              <span class="material-symbols-outlined" style="font-size: 16px;">calendar_today</span>
              <span id="form-date-label">Hoy</span>
            </button>
            <input
              type="date"
              id="form-date-input"
              value="${today}"
              style="position: absolute; top: 0; left: 0; width: 100%; height: 100%; opacity: 0; cursor: pointer;"
            />
          </div>
        </div>
      </div>

      <!-- Submit Button -->
      <div style="padding: 24px 0;">
        <button class="btn-primary shadow-glow-primary" id="form-submit">
          <span class="material-symbols-outlined">rocket_launch</span>
          Crear Tarea
        </button>
      </div>
    </div>

    <!-- Ambient decoration blobs -->
    <div class="ambient-blob" style="width: 250px; height: 250px; background: var(--primary); top: 100px; left: -80px;"></div>
    <div class="ambient-blob" style="width: 300px; height: 300px; background: var(--tertiary); bottom: 60px; right: -100px;"></div>
  `;
}

/**
 * Attach event listeners after render.
 */
export function mount() {
  // Form state
  const formState = {
    title: '',
    description: '',
    status: 'PENDIENTE',
    priority: 'STANDARD',
    dueDate: new Date().toISOString().split('T')[0],
  };

  const priorityMap = { 0: 'URGENT', 1: 'STANDARD', 2: 'LOW' };
  const priorityLabelMap = {
    'URGENT': { text: 'Urgente', color: 'var(--tertiary)' },
    'STANDARD': { text: 'Normal', color: 'var(--primary)' },
    'LOW': { text: 'Baja', color: 'var(--secondary-light)' },
  };

  // Close
  document.getElementById('form-close')?.addEventListener('click', () => {
    history.back();
  });

  // Title
  document.getElementById('form-title')?.addEventListener('input', (e) => {
    formState.title = e.target.value;
  });

  // Description
  document.getElementById('form-description')?.addEventListener('input', (e) => {
    formState.description = e.target.value;
  });

  // Status chips
  document.querySelectorAll('#form-status-group [data-status]').forEach(btn => {
    btn.addEventListener('click', () => {
      formState.status = btn.dataset.status;
      document.querySelectorAll('#form-status-group [data-status]').forEach(b => {
        b.classList.remove('active-primary');
      });
      btn.classList.add('active-primary');
    });
  });

  // Priority slider
  const slider = document.getElementById('form-priority-slider');
  const label = document.getElementById('form-priority-label');
  if (slider && label) {
    const updatePriorityLabel = () => {
      const p = priorityMap[slider.value];
      formState.priority = p;
      const info = priorityLabelMap[p];
      label.textContent = info.text;
      label.style.color = info.color;
    };
    slider.addEventListener('input', updatePriorityLabel);
    updatePriorityLabel();
  }

  // Date input
  const dateInput = document.getElementById('form-date-input');
  const dateLabel = document.getElementById('form-date-label');
  if (dateInput && dateLabel) {
    dateInput.addEventListener('change', () => {
      formState.dueDate = dateInput.value;
      if (dateInput.value === new Date().toISOString().split('T')[0]) {
        dateLabel.textContent = 'Hoy';
      } else {
        const d = new Date(dateInput.value + 'T00:00:00');
        const months = ['Ene', 'Feb', 'Mar', 'Abr', 'May', 'Jun', 'Jul', 'Ago', 'Sep', 'Oct', 'Nov', 'Dic'];
        dateLabel.textContent = `${d.getDate()} ${months[d.getMonth()]}`;
      }
    });
  }

  // Submit
  document.getElementById('form-submit')?.addEventListener('click', async () => {
    if (!formState.title.trim()) {
      showToast('Escribe un título para la tarea', 'error');
      document.getElementById('form-title')?.focus();
      return;
    }

    const taskData = {
      title: formState.title.trim(),
      description: formState.description.trim(),
      priority: formState.priority,
      status: formState.status,
      dueDate: formState.dueDate,
      createdAt: new Date().toISOString().split('T')[0],
    };

    // Try to create on backend
    const result = await createTask(taskData);

    if (result) {
      updateTaskInState(result);
      showToast('Tarea creada', 'success');
    } else {
      // Fallback: create locally with temporary ID
      taskData.id = 'local-' + Date.now();
      updateTaskInState(taskData);
      showToast('Tarea guardada localmente (sin conexión al servidor)', 'info');
    }

    navigateTo('/board');
  });
}
