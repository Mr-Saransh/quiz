// ===== Main Entry Point =====
import './styles/global.css';
import './styles/components.css';
import './styles/landing.css';
import './styles/auth.css';
import './styles/dashboard.css';
import './styles/quiz.css';
import './styles/report.css';
import './styles/leaderboard.css';
import './styles/profile.css';
import './styles/courses.css';

import { registerRoute, initRouter } from './router.js';
import { initStorage } from './utils/storage.js';
import { renderNavbar } from './components/navbar.js';

import { renderLanding } from './pages/landing.js';
import { renderAuth } from './pages/auth.js';
import { renderDashboard } from './pages/dashboard.js';
import { renderQuiz } from './pages/quiz.js';
import { renderReport } from './pages/report.js';
import { renderLeaderboard } from './pages/leaderboard.js';
import { renderProfile } from './pages/profile.js';
import { renderAlerts } from './pages/alerts.js';
import { renderAdmin } from './pages/admin.js';
import { renderAdminLogin } from './pages/admin-login.js';
import { renderEvents } from './pages/events.js';
import { renderCourses } from './pages/courses.js';
import { renderCoursePlayer } from './pages/course-player.js';

// Initialize storage (default leaderboard)
initStorage();

// Register routes
registerRoute('/', renderLanding);
registerRoute('/auth', renderAuth);
registerRoute('/dashboard', renderDashboard);
registerRoute('/quiz', renderQuiz);
registerRoute('/results/:id', renderReport);
registerRoute('/leaderboard', renderLeaderboard);
registerRoute('/profile', renderProfile);
registerRoute('/profile/:id', renderProfile);
registerRoute('/alerts', renderAlerts);
registerRoute('/admin', renderAdmin);
registerRoute('/admin-login', renderAdminLogin);
registerRoute('/events', renderEvents);
registerRoute('/courses', renderCourses);
registerRoute('/course/:courseId', renderCoursePlayer);

// Start router
initRouter();

// Initialize and sync global Navbar
renderNavbar();
window.addEventListener('hashchange', () => {
    // Small delay to ensure route hash is updated in router
    setTimeout(renderNavbar, 50);
});
