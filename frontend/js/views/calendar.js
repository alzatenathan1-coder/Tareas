// ============================================================
// Calendar View
// Monthly calendar with task indicators and daily focus list
// ============================================================

import state, { setCalendarMonth, setSelectedDate } from '../state.js';
import { navigateTo } from '../router.js';

const MONTH_NAMES = [
  'Enero', 'Febrero', 'Marzo', 'Abril', 'Mayo', 'Junio',
  'Julio', 'Agosto', 'Septiembre', 'Octubre', 'Noviembre', 'Diciembre'
];

const DAY_HEADERS = ['Dom', 'Lun', 'Mar', 'Mié', 'Jue', 'Vie', 'Sáb'];

/**
 * Get the number of days in a month.
 */
function daysInMonth(year, month) {
  return new Date(year, month + 1, 0).getDate();
}

/**
 * Get the day of week (0=Sun) for the first of the month.
 */
function firstDayOfMonth(year, month) {
  return new Date(year, month, 1).getDay();
}

/**
 * Format date as YYYY-MM-DD.
 */
function toDateStr(year, month, day) {
  return `${year}-${String(month + 1).padStart(2, '0')}-${String(day).padStart(2, '0')}`;
}

/**
 * Get tasks for a specific date.
 */
function getTasksForDate(dateStr) {
  return state.tasks.filter(t => t.dueDate === dateStr);
}

/**
 * Get priority dot class.
 */
function dotClass(priority) {
  switch (priority) {
    case 'URGENT': return 'task-dot-urgent';
    case 'STANDARD': return 'task-dot-standard';
    case 'LOW': return 'task-dot-low';
    default: return 'task-dot-standard';
  }
}

/**
 * Priority bar class for task list items.
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
 * Priority icon color.
 */
function priorityColor(priority) {
  switch (priority) {
    case 'URGENT': return 'var(--tertiary)';
    case 'STANDARD': return 'var(--primary)';
    case 'LOW': return 'var(--secondary-light)';
    default: return 'var(--primary)';
  }
}

/**
 * Priority badge class.
 */
function priorityBadgeClass(priority) {
  switch (priority) {
    case 'URGENT': return 'badge-urgent';
    case 'STANDARD': return 'badge-standard';
    case 'LOW': return 'badge-low';
    default: return 'badge-standard';
  }
}

function priorityLabel(priority) {
  switch (priority) {
    case 'URGENT': return 'Urgente';
    case 'STANDARD': return 'Normal';
    case 'LOW': return 'Baja';
    default: return priority;
  }
}

/**
 * Render the calendar grid.
 */
function renderCalendarGrid(year, month) {
  const today = new Date();
  const todayStr = toDateStr(today.getFullYear(), today.getMonth(), today.getDate());
  const totalDays = daysInMonth(year, month);
  const startDay = firstDayOfMonth(year, month);
  const selected = state.selectedDate;

  // Previous month trailing days
  const prevMonthDays = daysInMonth(year, month - 1);

  let cells = '';

  // Day headers
  DAY_HEADERS.forEach(d => {
    cells += `<div class="calendar-day-header">${d}</div>`;
  });

  // Previous month filler days
  for (let i = startDay - 1; i >= 0; i--) {
    const day = prevMonthDays - i;
    cells += `<div class="calendar-day outside"><span class="day-number">${day}</span></div>`;
  }

  // Current month days
  for (let d = 1; d <= totalDays; d++) {
    const dateStr = toDateStr(year, month, d);
    const isToday = dateStr === todayStr;
    const isSelected = dateStr === selected && !isToday;
    const tasks = getTasksForDate(dateStr);

    let extraClass = '';
    if (isToday) extraClass = 'today';
    else if (isSelected) extraClass = 'selected';

    // Render up to 3 priority dots
    let dots = '';
    if (tasks.length > 0) {
      const uniquePriorities = [...new Set(tasks.map(t => t.priority))].slice(0, 3);
      dots = `<div class="dot-container">
        ${uniquePriorities.map(p => `<div class="task-dot ${isToday ? '' : dotClass(p)}"></div>`).join('')}
      </div>`;
    }

    cells += `
      <div class="calendar-day ${extraClass}" data-date="${dateStr}">
        <span class="day-number">${d}</span>
        ${dots}
      </div>`;
  }

  // Next month filler days (fill to complete last row)
  const totalCells = startDay + totalDays;
  const remainder = totalCells % 7;
  if (remainder > 0) {
    for (let i = 1; i <= 7 - remainder; i++) {
      cells += `<div class="calendar-day outside"><span class="day-number">${i}</span></div>`;
    }
  }

  return cells;
}

/**
 * Render a task list item for the focus section.
 */
function renderTaskItem(task) {
  const iconMap = {
    'URGENT': 'emergency',
    'STANDARD': 'bolt',
    'LOW': 'coffee',
  };
  const icon = iconMap[task.priority] || 'task_alt';

  return `
    <div class="surface-card cursor-pointer" style="padding: 16px 20px; display: flex; align-items: center; gap: 14px;" data-task-id="${task.id}">
      <div class="priority-bar ${priorityBarClass(task.priority)}"></div>
      <div style="width: 44px; height: 44px; border-radius: 12px; background: ${priorityColor(task.priority)}15; display: flex; align-items: center; justify-content: center; flex-shrink: 0;">
        <span class="material-symbols-outlined" style="color: ${priorityColor(task.priority)}; font-size: 22px;">${icon}</span>
      </div>
      <div style="flex: 1; min-width: 0;">
        <h4 style="font-size: 14px; font-weight: 700; color: var(--text-primary); margin: 0 0 4px 0; white-space: nowrap; overflow: hidden; text-overflow: ellipsis;">${task.title}</h4>
        <span class="badge ${priorityBadgeClass(task.priority)}">${priorityLabel(task.priority)}</span>
      </div>
      <span class="material-symbols-outlined" style="color: var(--text-tertiary); font-size: 20px;">chevron_right</span>
    </div>`;
}

/**
 * Render the full calendar view.
 */
export function render() {
  const year = state.calendarYear;
  const month = state.calendarMonth;
  const selected = state.selectedDate;

  // Determine which tasks to show in the focus list
  const today = new Date();
  const todayStr = toDateStr(today.getFullYear(), today.getMonth(), today.getDate());
  const focusDate = selected || todayStr;
  const focusTasks = getTasksForDate(focusDate);

  // Focus section title
  let focusTitle = 'Foco de Hoy';
  if (selected && selected !== todayStr) {
    const d = new Date(selected + 'T00:00:00');
    focusTitle = `Tareas del ${d.getDate()} de ${MONTH_NAMES[d.getMonth()]}`;
  }

  return `
    <div class="view-enter" style="padding: 0 16px;">
      <!-- Month Header -->
      <div style="display: flex; align-items: center; justify-content: space-between; margin-bottom: 24px; padding: 0 4px;">
        <div>
          <span style="font-size: 11px; font-weight: 600; text-transform: uppercase; letter-spacing: 0.05em; color: var(--text-tertiary);">
            ${MONTH_NAMES[month]} ${year}
          </span>
          <h2 style="font-size: 28px; font-weight: 800; letter-spacing: -0.02em; color: var(--text-primary); margin: 2px 0 0 0;">
            Calendario
          </h2>
        </div>
        <div style="display: flex; gap: 8px;">
          <button class="btn-ghost" id="cal-prev" aria-label="Mes anterior">
            <span class="material-symbols-outlined">chevron_left</span>
          </button>
          <button class="btn-ghost" id="cal-next" aria-label="Mes siguiente">
            <span class="material-symbols-outlined">chevron_right</span>
          </button>
        </div>
      </div>

      <!-- Calendar Grid -->
      <div class="surface-card-elevated" style="padding: 20px; margin-bottom: 28px; border-radius: 24px;">
        <div class="calendar-grid">
          ${renderCalendarGrid(year, month)}
        </div>
      </div>

      <!-- Focus Task List -->
      <div style="margin-bottom: 16px;">
        <div style="display: flex; align-items: center; justify-content: space-between; margin-bottom: 16px; padding: 0 4px;">
          <h3 style="font-size: 18px; font-weight: 700; color: var(--text-primary); margin: 0;">${focusTitle}</h3>
          ${selected && selected !== todayStr
            ? `<button class="btn-ghost" id="cal-reset-date" style="font-size: 12px; color: var(--primary);">
                <span class="material-symbols-outlined" style="font-size: 18px;">today</span>
              </button>`
            : ''
          }
        </div>
        <div style="display: flex; flex-direction: column; gap: 8px;">
          ${focusTasks.length > 0
            ? focusTasks.map(renderTaskItem).join('')
            : `<div style="text-align: center; padding: 32px 20px; color: var(--text-tertiary);">
                <span class="material-symbols-outlined" style="font-size: 36px; opacity: 0.3; display: block; margin-bottom: 8px;">event_available</span>
                <p style="font-size: 13px; font-weight: 500; margin: 0;">Sin tareas para este día</p>
              </div>`
          }
        </div>
      </div>
    </div>
  `;
}

/**
 * Attach event listeners after render.
 */
export function mount() {
  const year = state.calendarYear;
  const month = state.calendarMonth;

  // Previous month
  document.getElementById('cal-prev')?.addEventListener('click', () => {
    const newMonth = month === 0 ? 11 : month - 1;
    const newYear = month === 0 ? year - 1 : year;
    setCalendarMonth(newYear, newMonth);
  });

  // Next month
  document.getElementById('cal-next')?.addEventListener('click', () => {
    const newMonth = month === 11 ? 0 : month + 1;
    const newYear = month === 11 ? year + 1 : year;
    setCalendarMonth(newYear, newMonth);
  });

  // Reset to today
  document.getElementById('cal-reset-date')?.addEventListener('click', () => {
    const today = new Date();
    setCalendarMonth(today.getFullYear(), today.getMonth());
    setSelectedDate(null);
  });

  // Day clicks
  document.querySelectorAll('.calendar-day[data-date]').forEach(cell => {
    cell.addEventListener('click', () => {
      setSelectedDate(cell.dataset.date);
    });
  });

  // Task card clicks
  document.querySelectorAll('[data-task-id]').forEach(card => {
    card.addEventListener('click', () => {
      navigateTo(`/task/${card.dataset.taskId}`);
    });
  });
}
