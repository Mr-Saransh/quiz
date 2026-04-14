import './load-env.js';
import express from 'express';
import cors from 'cors';
import authRoutes from './routes/auth.js';
import quizRoutes from './routes/quiz.js';
import leaderboardRoutes from './routes/leaderboard.js';
import statsRoutes from './routes/stats.js';
import competitionRoutes from './routes/competitions.js';
import courseRoutes from './routes/courses.js';
import adminRoutes from './routes/admin.js';
import paymentRoutes from './routes/payment.js';
import assessmentRoutes from './routes/assessment.js';
import mentorRoutes from './routes/mentors.js';

const app = express();
const PORT = 3002;

app.use(cors({ origin: 'http://localhost:5173', credentials: true }));
app.use(express.json());

// Health check
app.get('/api/health', (req, res) => {
  res.json({ status: 'ok', timestamp: new Date().toISOString() });
});

// Admin Login Logic MUST BE FIRST for failsafe mounting
app.post('/api/admin/login', (req, res) => {
  const { id, password } = req.body;
  if (id === 'admin' && password === 'admin@apni123') {
    return res.json({ success: true, token: 'admin-secret-token' });
  }
  res.status(401).json({ error: 'Invalid admin credentials' });
});

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/quiz', quizRoutes);
app.use('/api/leaderboard', leaderboardRoutes);
app.use('/api/stats', statsRoutes);
app.use('/api/competitions', competitionRoutes);
app.use('/api/courses', courseRoutes);
app.use('/api/payment', paymentRoutes);
app.use('/api/assessment', assessmentRoutes);
app.use('/api/mentors', mentorRoutes);

app.use('/api/admin', adminRoutes);

// Handle running directly (local dev)
if (process.env.NODE_ENV !== 'production') {
  app.listen(PORT, () => {
    console.log(`🚀 Quiz API server running at http://localhost:${PORT}`);
  });
}

// Export for Vercel
export default app;
