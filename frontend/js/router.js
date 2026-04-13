// ============================================================
// Router - Simple hash-based SPA router
// ============================================================

// Route definitions: pattern → handler
const routes = [];

// Current matched params
let currentParams = {};

/**
 * Register a route.
 * Pattern uses :param syntax, e.g. '/task/:id'
 */
export function addRoute(pattern, handler) {
  // Convert pattern to regex: '/task/:id' → /^\/task\/([^/]+)$/
  const paramNames = [];
  const regexStr = pattern.replace(/:([^/]+)/g, (_, name) => {
    paramNames.push(name);
    return '([^/]+)';
  });
  const regex = new RegExp(`^${regexStr}$`);
  routes.push({ pattern, regex, paramNames, handler });
}

/**
 * Get the current hash path (without '#').
 */
function getPath() {
  const hash = window.location.hash || '#/board';
  return hash.slice(1); // remove '#'
}

/**
 * Match the current path to a route and execute its handler.
 */
function resolve() {
  const path = getPath();

  for (const route of routes) {
    const match = path.match(route.regex);
    if (match) {
      // Extract params
      currentParams = {};
      route.paramNames.forEach((name, i) => {
        currentParams[name] = decodeURIComponent(match[i + 1]);
      });

      route.handler(currentParams);
      return;
    }
  }

  // No match: redirect to default
  console.warn(`No route matched for: ${path}`);
  navigateTo('/board');
}

/**
 * Navigate to a hash path.
 */
export function navigateTo(path) {
  window.location.hash = `#${path}`;
}

/**
 * Get current route params.
 */
export function getParams() {
  return { ...currentParams };
}

/**
 * Initialize the router: listen to hash changes and resolve initial route.
 */
export function startRouter() {
  window.addEventListener('hashchange', resolve);
  resolve();
}

export default { addRoute, navigateTo, getParams, startRouter };
