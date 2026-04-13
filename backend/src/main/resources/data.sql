-- ============================================
-- Taskscape - Sample Seed Data
-- ============================================
-- This file runs on every application startup.
-- spring.sql.init.continue-on-error=true ensures that
-- duplicate inserts (on restart) won't crash the app.

-- Note: CURRENT_DATE is a MySQL function that returns today's date.
-- We use DATE_ADD / DATE_SUB to create relative dates.

INSERT INTO tasks (title, description, priority, status, due_date, created_at, updated_at) VALUES
('Completar auditoría estructural del roadmap Q4',
 'Revisar todos los milestones del Q4, identificar dependencias bloqueantes y actualizar el timeline con el equipo de producto.',
 'URGENT', 'PENDIENTE',
 DATE_ADD(CURRENT_DATE, INTERVAL 2 DAY),
 NOW(), NOW());

INSERT INTO tasks (title, description, priority, status, due_date, created_at, updated_at) VALUES
('Finalizar kit de UI para el sistema de diseño',
 'Completar los componentes de botones, inputs y modales en Figma. Exportar tokens de diseño para el equipo de frontend.',
 'STANDARD', 'HACIENDO',
 DATE_ADD(CURRENT_DATE, INTERVAL 3 DAY),
 NOW(), NOW());

INSERT INTO tasks (title, description, priority, status, due_date, created_at, updated_at) VALUES
('Redactar post sobre optimización de PWA',
 'Escribir un artículo técnico sobre estrategias de caching, service workers y rendimiento offline para Progressive Web Apps.',
 'LOW', 'PENDIENTE',
 DATE_ADD(CURRENT_DATE, INTERVAL 5 DAY),
 NOW(), NOW());

INSERT INTO tasks (title, description, priority, status, due_date, created_at, updated_at) VALUES
('Reunión con stakeholders sobre accesibilidad',
 'Preparar presentación sobre el estado actual de WCAG 2.1 compliance y proponer plan de mejora para los próximos sprints.',
 'STANDARD', 'PENDIENTE',
 DATE_ADD(CURRENT_DATE, INTERVAL 1 DAY),
 NOW(), NOW());

INSERT INTO tasks (title, description, priority, status, due_date, created_at, updated_at) VALUES
('Revisar pull requests del sprint actual',
 'Code review de los PRs pendientes: refactor del módulo de autenticación, nueva API de notificaciones y fix de memoria.',
 'URGENT', 'HACIENDO',
 CURRENT_DATE,
 NOW(), NOW());

INSERT INTO tasks (title, description, priority, status, due_date, created_at, updated_at) VALUES
('Configurar pipeline de CI/CD',
 'Implementar GitHub Actions para build, test y deploy automático. Incluir stages de lint, unit tests y deploy a staging.',
 'LOW', 'HECHO',
 DATE_SUB(CURRENT_DATE, INTERVAL 1 DAY),
 NOW(), NOW());
