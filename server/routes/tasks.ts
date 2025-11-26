import { Router } from 'express';
import { db } from '../db.js';
import { tasks } from '../schema.js';
import { eq } from 'drizzle-orm';

const router = Router();

router.get('/', async (req, res) => {
  try {
    const allTasks = await db.select().from(tasks).where(eq(tasks.isDeleted, false));
    res.json(allTasks);
  } catch (error) {
    console.error('Get tasks error:', error);
    res.status(500).json({ error: 'Error en el servidor' });
  }
});

router.post('/', async (req, res) => {
  try {
    const [newTask] = await db.insert(tasks).values(req.body).returning();
    res.status(201).json(newTask);
  } catch (error) {
    console.error('Create task error:', error);
    res.status(500).json({ error: 'Error en el servidor' });
  }
});

router.put('/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const [updatedTask] = await db.update(tasks)
      .set({ ...req.body, updatedAt: new Date() })
      .where(eq(tasks.id, Number(id)))
      .returning();
    res.json(updatedTask);
  } catch (error) {
    console.error('Update task error:', error);
    res.status(500).json({ error: 'Error en el servidor' });
  }
});

router.delete('/:id', async (req, res) => {
  try {
    const { id } = req.params;
    await db.update(tasks)
      .set({ isDeleted: true, deletedAt: new Date() })
      .where(eq(tasks.id, Number(id)));
    res.json({ success: true });
  } catch (error) {
    console.error('Delete task error:', error);
    res.status(500).json({ error: 'Error en el servidor' });
  }
});

export default router;
