import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';
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

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = process.env.PORT || 3001;
const isProduction = process.env.NODE_ENV === 'production';

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

if (isProduction) {
  const distPath = path.join(__dirname, '..', 'dist');
  app.use(express.static(distPath));
  
  app.get('*', (req, res) => {
    res.sendFile(path.join(distPath, 'index.html'));
  });
}

app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
  if (isProduction) {
    console.log(`Serving static files from dist directory`);
  }
});
