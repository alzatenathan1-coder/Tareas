// ============================================================
// State Management - Simple reactive store
// ============================================================

const state = {
  // Task data
  tasks: [],

  // Current view filter for kanban
  currentFilter: 'all', // 'all' | 'pendiente' | 'haciendo' | 'hecho'

  // Calendar state
  calendarYear: new Date().getFullYear(),
  calendarMonth: new Date().getMonth(),
  selectedDate: null,

  // Connectivity
  isOffline: false,

  // Internal: subscriber callbacks
  _listeners: [],
};

/**
 * Subscribe to state changes. Returns an unsubscribe function.
 */
export function onChange(callback) {
  state._listeners.push(callback);
  return () => {
    state._listeners = state._listeners.filter(fn => fn !== callback);
  };
}

/**
 * Notify all listeners that state has changed.
 */
export function notify() {
  state._listeners.forEach(fn => {
    try { fn(state); } catch (e) { console.error('State listener error:', e); }
  });
}

/**
 * Set tasks array and notify.
 */
export function setTasks(tasks) {
  state.tasks = tasks;
  // Persist to localStorage as fallback cache
  try {
    localStorage.setItem('ft_tasks_cache', JSON.stringify(tasks));
  } catch (_) { /* ignore quota errors */ }
  notify();
}

/**
 * Update a single task in state by id.
 */
export function updateTaskInState(updatedTask) {
  const idx = state.tasks.findIndex(t => t.id === updatedTask.id);
  if (idx !== -1) {
    state.tasks[idx] = updatedTask;
  } else {
    state.tasks.push(updatedTask);
  }
  try {
    localStorage.setItem('ft_tasks_cache', JSON.stringify(state.tasks));
  } catch (_) {}
  notify();
}

/**
 * Remove a task from state by id.
 */
export function removeTaskFromState(id) {
  state.tasks = state.tasks.filter(t => t.id !== id);
  try {
    localStorage.setItem('ft_tasks_cache', JSON.stringify(state.tasks));
  } catch (_) {}
  notify();
}

/**
 * Set the kanban filter.
 */
export function setFilter(filter) {
  state.currentFilter = filter;
  notify();
}

/**
 * Set calendar month/year.
 */
export function setCalendarMonth(year, month) {
  state.calendarYear = year;
  state.calendarMonth = month;
  notify();
}

/**
 * Set selected calendar date.
 */
export function setSelectedDate(dateStr) {
  state.selectedDate = dateStr;
  notify();
}

/**
 * Load cached tasks from localStorage (fallback when API is down).
 */
export function loadCachedTasks() {
  try {
    const cached = localStorage.getItem('ft_tasks_cache');
    if (cached) {
      state.tasks = JSON.parse(cached);
      return true;
    }
  } catch (_) {}
  return false;
}

/**
 * Get sample tasks for demo/fallback mode.
 */
export function getSampleTasks() {
  const today = new Date();
  const fmt = (d) => d.toISOString().split('T')[0];
  const addDays = (d, n) => { const r = new Date(d); r.setDate(r.getDate() + n); return r; };

  return [
    {
      id: 'sample-1',
      title: 'Completar auditoría estructural del roadmap Q2',
      description: 'Revisar todos los entregables del trimestre y preparar el informe para stakeholders. Incluir métricas de rendimiento y recomendaciones.',
      priority: 'URGENT',
      status: 'PENDIENTE',
      dueDate: fmt(today),
      createdAt: fmt(addDays(today, -5)),
    },
    {
      id: 'sample-2',
      title: 'Finalizar UI kit para el Design System v2',
      description: 'Actualizar componentes de Figma con los nuevos tokens de diseño. Verificar accesibilidad de contraste en modo oscuro.',
      priority: 'STANDARD',
      status: 'HACIENDO',
      dueDate: fmt(addDays(today, 2)),
      createdAt: fmt(addDays(today, -3)),
    },
    {
      id: 'sample-3',
      title: 'Redactar artículo sobre optimización de rendimiento PWA',
      description: 'Cubrir temas de Service Workers, caching strategies y lazy loading. Incluir benchmarks reales.',
      priority: 'LOW',
      status: 'PENDIENTE',
      dueDate: fmt(addDays(today, 5)),
      createdAt: fmt(addDays(today, -2)),
    },
    {
      id: 'sample-4',
      title: 'Reunión con stakeholders sobre actualizaciones de accesibilidad',
      description: 'Presentar hallazgos de la auditoría WCAG 2.1 y plan de remediación. Preparar demo en vivo.',
      priority: 'STANDARD',
      status: 'PENDIENTE',
      dueDate: fmt(addDays(today, 1)),
      createdAt: fmt(addDays(today, -1)),
    },
    {
      id: 'sample-5',
      title: 'Revisión de lanzamiento de producto',
      description: 'Validar que todos los features del MVP estén listos. Coordinar con QA para las pruebas finales.',
      priority: 'URGENT',
      status: 'HACIENDO',
      dueDate: fmt(today),
      createdAt: fmt(addDays(today, -4)),
    },
    {
      id: 'sample-6',
      title: 'Configurar pipeline de CI/CD',
      description: 'Implementar GitHub Actions para build, test y deploy automáticos. Configurar ambientes staging y producción.',
      priority: 'STANDARD',
      status: 'HECHO',
      dueDate: fmt(addDays(today, -1)),
      createdAt: fmt(addDays(today, -7)),
    },
    {
      id: 'sample-7',
      title: 'Actualizar dependencias del proyecto',
      description: 'Revisar vulnerabilidades con npm audit y actualizar paquetes críticos.',
      priority: 'LOW',
      status: 'HECHO',
      dueDate: fmt(addDays(today, -2)),
      createdAt: fmt(addDays(today, -6)),
    },
    {
      id: 'sample-8',
      title: 'Diseñar flujo de onboarding para nuevos usuarios',
      description: 'Crear wireframes y prototipos interactivos del flujo de registro y configuración inicial.',
      priority: 'STANDARD',
      status: 'PENDIENTE',
      dueDate: fmt(addDays(today, 4)),
      createdAt: fmt(addDays(today, -1)),
    },
  ];
}

export default state;
