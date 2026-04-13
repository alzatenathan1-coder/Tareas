import state, { setTasks, getSampleTasks, loadCachedTasks, onChange, injectMotivationalPlan } from './state.js';
import { getTasks, healthCheck } from './api.js';
import router from './router.js';

// Views
import * as kanbanView from './views/kanban.js';
import * as calendarView from './views/calendar.js';
import * as taskDetailView from './views/taskDetail.js';
import * as taskFormView from './views/taskForm.js';

/**
 * Handle view rendering and lifecycle
 */
function renderView(viewComponent, params) {
  const appElement = document.getElementById('app');
  appElement.innerHTML = viewComponent.render(params);
  if (viewComponent.mount) {
    viewComponent.mount();
  }
}

/**
 * Update bottom nav active state based on hash path
 */
function updateBottomNav(path) {
  document.querySelectorAll('.bottom-nav a').forEach(a => {
    a.classList.remove('active');
    if (a.getAttribute('href') === '#' + path) {
      a.classList.add('active');
    }
  });

  // Hide nav/header/FAB on detail and form views
  const isFullScreenView = path.startsWith('/task/') || path === '/new';
  document.getElementById('main-bottom-nav').style.display = isFullScreenView ? 'none' : 'block';
  document.getElementById('main-header').style.display = isFullScreenView ? 'none' : 'flex';
  document.getElementById('fab-add').style.display = isFullScreenView ? 'none' : 'flex';
  
  const appElement = document.getElementById('app');
  if (isFullScreenView) {
    appElement.style.paddingTop = '20px';
    appElement.style.paddingBottom = '20px';
  } else {
    appElement.style.paddingTop = 'var(--header-height)';
    appElement.style.paddingBottom = 'calc(var(--nav-height) + 24px)';
  }
}

/**
 * Show a toast notification
 */
export function showToast(message, type = 'info') {
  const toast = document.getElementById('toast');
  if (!toast) return;

  toast.textContent = message;
  toast.className = `toast toast-${type} show`;

  // Clear previous timeouts and wait a bit to hide
  if (toast.timeoutId) clearTimeout(toast.timeoutId);
  toast.timeoutId = setTimeout(() => {
    toast.className = `toast toast-${type}`;
  }, 3000);
}

/**
 * Initialize application
 */
async function init() {
  // Setup Routes
  router.addRoute('/board', () => {
    updateBottomNav('/board');
    renderView(kanbanView);
  });

  router.addRoute('/calendar', () => {
    updateBottomNav('/calendar');
    renderView(calendarView);
  });

  router.addRoute('/task/:id', (params) => {
    updateBottomNav(`/task/${params.id}`);
    renderView(taskDetailView, params);
  });

  router.addRoute('/new', () => {
    updateBottomNav('/new');
    renderView(taskFormView);
  });

  // Re-render current view when state changes
  onChange(() => {
    const hash = window.location.hash || '#/board';
    if (hash === '#/board') renderView(kanbanView);
    if (hash === '#/calendar') renderView(calendarView);
  });

  // Inject 30 days motivational plan tasks!
  injectMotivationalPlan();

  // Start Router immediately to paint the UI
  router.startRouter();

  // Wire up FAB Add Button
  document.getElementById('fab-add')?.addEventListener('click', () => {
    router.navigateTo('/new');
  });

  // Try loading from API in the background
  try {
    const isApiUp = await healthCheck();
    if (isApiUp) {
      const tasks = await getTasks();
      if (tasks) {
        setTasks(tasks);
      } else {
        console.warn("Failed to fetch tasks from API.");
        if (!loadCachedTasks()) setTasks(getSampleTasks());
      }
    } else {
      console.warn("Backend API not reachable. Using fallback tasks.");
      showToast('Backend sin conexión, usando datos offline', 'error');
      if (!loadCachedTasks()) setTasks(getSampleTasks());
    }
  } catch (err) {
    if (!loadCachedTasks()) setTasks(getSampleTasks());
  }
}

// Start application
document.addEventListener('DOMContentLoaded', init);
