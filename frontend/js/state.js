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

/**
 * Inject 30-day motivational plan into tasks if not already done.
 */
export function injectMotivationalPlan() {
  if (localStorage.getItem('ft_motivational_injected')) return;

  const plan = [
    { p: '¡Hoy es el día de empezar con energía! ¡A por todas!', s: 'Viva La Vida – Coldplay' },
    { p: '¡No te rindas! ¡Tú puedes con todo!', s: 'Stronger – Kelly Clarkson' },
    { p: '¡Sonríe! ¡La vida es bella!', s: 'Happy – Pharrell Williams' },
    { p: '¡Haz algo divertido hoy! ¡Te lo mereces!', s: 'Don\'t Stop Me Now – Queen' },
    { p: '¡Agradece lo que tienes!', s: 'Vivir Mi Vida – Marc Anthony' },
    { p: '¡Ayuda a alguien hoy!', s: 'Walking on Sunshine – Katrina & The Waves' },
    { p: '¡Aprende algo nuevo hoy!', s: 'Wake Me Up – Avicii' },
    { p: '¡No dejes para mañana lo que puedes hacer hoy!', s: 'Can\'t Stop the Feeling! – Justin Timberlake' },
    { p: '¡Haz algo que te guste hoy!', s: 'Uptown Funk – Mark Ronson' },
    { p: '¡Sonríe a un desconocido hoy!', s: 'Bonito – Jarabe de Palo' },
    { p: '¡No te compares con los demás!', s: 'Confident – Demi Lovato' },
    { p: '¡Cree en ti mismo!', s: 'Believer – Imagine Dragons' },
    { p: '¡No tengas miedo de fallar!', s: 'Lose Yourself – Eminem' },
    { p: '¡Aprende de tus errores!', s: 'Shake It Off – Taylor Swift' },
    { p: '¡No te rindas nunca!', s: 'Eye of the Tiger – Survivor' },
    { p: '¡Sé feliz con lo que tienes!', s: 'Flowers – Miley Cyrus' },
    { p: '¡Comparte lo que tienes!', s: 'La Gozadera – Gente de Zona' },
    { p: '¡Sé amable con los demás!', s: 'Madre Tierra (Oye) – Chayanne' },
    { p: '¡Sonríe! ¡La sonrisa es contagiosa!', s: 'Color Esperanza – Diego Torres' },
    { p: '¡No te preocupes por el pasado!', s: 'It\'s My Life – Bon Jovi' },
    { p: '¡No te preocupes por el futuro!', s: 'Celebra la Vida – Axel' },
    { p: '¡Sé tú mismo!', s: 'Levitating – Dua Lipa' },
    { p: '¡Cree en tus sueños!', s: 'On Top of the World – Imagine Dragons' },
    { p: '¡No te rindas nunca!', s: 'Titanium – David Guetta' },
    { p: '¡Sé feliz con lo que tienes!', s: 'La Bicicleta – Carlos Vives & Shakira' },
    { p: '¡Comparte lo que tienes con los demás!', s: 'Robarte un Beso – Carlos Vives' },
    { p: '¡Sé amable con los demás!', s: 'A Dios le Pido – Juanes' },
    { p: '¡Sonríe!', s: 'The Best – Tina Turner' },
    { p: '¡No te preocupes por el pasado!', s: 'Cero – Dani Martín' },
    { p: '¡No dejes que nadie te diga lo que puedes hacer!', s: 'Roar – Katy Perry' }
  ];

  const today = new Date();
  const fmt = (d) => d.toISOString().split('T')[0];
  const newTasks = [];

  plan.forEach((item, index) => {
    const targetDate = new Date(today);
    targetDate.setDate(today.getDate() + index); // Schedule one for each day starting today
    
    newTasks.push({
      id: 'motiv-' + Date.now() + '-' + index,
      title: 'Plan Día ' + (index + 1) + ': ' + item.p.substring(0, 30) + '...',
      description: 'Frase del día: ' + item.p + '\n\nCanción recomendada: ' + item.s,
      priority: 'STANDARD',
      status: 'PENDIENTE',
      dueDate: fmt(targetDate),
      createdAt: fmt(today),
    });
  });

  // Merge into existing state
  state.tasks = [...state.tasks, ...newTasks];
  try {
    localStorage.setItem('ft_tasks_cache', JSON.stringify(state.tasks));
    localStorage.setItem('ft_motivational_injected', 'true');
  } catch (_) {}
  notify();
}

export default state;
