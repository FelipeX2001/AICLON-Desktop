import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import authRoutes from './routes/auth.js';
import usersRoutes from './routes/users.js';
import tasksRoutes from './routes/tasks.js';
import meetingsRoutes from './routes/meetings.js';
import leadsRoutes from './routes/leads.js';
import activeClientsRoutes from './routes/activeClients.js';
import botVersionsRoutes from './routes/botVersions.js';
import tutorialsRoutes from './routes/tutorials.js';
import notificationsRoutes from './routes/notifications.js';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 3001;

app.use(cors());
app.use(express.json());

app.use('/api/auth', authRoutes);
app.use('/api/users', usersRoutes);
app.use('/api/tasks', tasksRoutes);
app.use('/api/meetings', meetingsRoutes);
app.use('/api/leads', leadsRoutes);
app.use('/api/active-clients', activeClientsRoutes);
app.use('/api/bot-versions', botVersionsRoutes);
app.use('/api/tutorials', tutorialsRoutes);
app.use('/api/notifications', notificationsRoutes);

app.get('/api/health', (req, res) => {
  res.json({ status: 'ok' });
});

app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
