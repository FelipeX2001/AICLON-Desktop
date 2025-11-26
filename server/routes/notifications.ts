import { Router } from 'express';
import { db } from '../db.js';
import { notifications } from '../schema.js';
import { eq } from 'drizzle-orm';

const router = Router();

router.get('/', async (req, res) => {
  try {
    const allNotifications = await db.select().from(notifications);
    res.json(allNotifications);
  } catch (error) {
    console.error('Get notifications error:', error);
    res.status(500).json({ error: 'Error en el servidor' });
  }
});

router.post('/', async (req, res) => {
  try {
    const [newNotification] = await db.insert(notifications).values(req.body).returning();
    res.status(201).json(newNotification);
  } catch (error) {
    console.error('Create notification error:', error);
    res.status(500).json({ error: 'Error en el servidor' });
  }
});

router.put('/:id/read', async (req, res) => {
  try {
    const { id } = req.params;
    const [updatedNotification] = await db.update(notifications)
      .set({ read: true })
      .where(eq(notifications.id, Number(id)))
      .returning();
    res.json(updatedNotification);
  } catch (error) {
    console.error('Update notification error:', error);
    res.status(500).json({ error: 'Error en el servidor' });
  }
});

router.delete('/:id', async (req, res) => {
  try {
    const { id } = req.params;
    await db.delete(notifications).where(eq(notifications.id, Number(id)));
    res.json({ success: true });
  } catch (error) {
    console.error('Delete notification error:', error);
    res.status(500).json({ error: 'Error en el servidor' });
  }
});

export default router;
