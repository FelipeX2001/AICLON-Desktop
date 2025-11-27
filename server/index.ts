import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';
import { existsSync } from 'fs';
import authRoutes from './routes/auth.js';
import usersRoutes from './routes/users.js';
import tasksRoutes from './routes/tasks.js';
import meetingsRoutes from './routes/meetings.js';
import leadsRoutes from './routes/leads.js';
import activeClientsRoutes from './routes/activeClients.js';
import droppedClientsRoutes from './routes/droppedClients.js';
import botVersionsRoutes from './routes/botVersions.js';
import tutorialsRoutes from './routes/tutorials.js';
import notificationsRoutes from './routes/notifications.js';
import demosRoutes from './routes/demos.js';

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = parseInt(process.env.PORT || '5000', 10);

app.use(cors());
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ limit: '10mb', extended: true }));

app.use('/api/auth', authRoutes);
app.use('/api/users', usersRoutes);
app.use('/api/tasks', tasksRoutes);
app.use('/api/meetings', meetingsRoutes);
app.use('/api/leads', leadsRoutes);
app.use('/api/active-clients', activeClientsRoutes);
app.use('/api/dropped-clients', droppedClientsRoutes);
app.use('/api/bot-versions', botVersionsRoutes);
app.use('/api/tutorials', tutorialsRoutes);
app.use('/api/notifications', notificationsRoutes);
app.use('/api/demos', demosRoutes);

app.get('/api/health', (req, res) => {
  res.json({ status: 'ok' });
});

const distPath = path.join(__dirname, '..', 'dist');
if (existsSync(distPath)) {
  console.log(`Serving static files from ${distPath}`);
  app.use(express.static(distPath));
  
  app.get(/.*/, (req, res) => {
    res.sendFile(path.join(distPath, 'index.html'));
  });
} else {
  console.log('No dist directory found - running in development mode');
}

app.listen(PORT, '0.0.0.0', () => {
  console.log(`Server running on http://0.0.0.0:${PORT}`);
});
