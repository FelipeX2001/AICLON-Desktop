import { Router } from 'express';
import { db } from '../db.js';
import { tutorials } from '../schema.js';
import { eq } from 'drizzle-orm';

const router = Router();

router.get('/', async (req, res) => {
  try {
    const allTutorials = await db.select().from(tutorials).where(eq(tutorials.isDeleted, false));
    res.json(allTutorials);
  } catch (error) {
    console.error('Get tutorials error:', error);
    res.status(500).json({ error: 'Error en el servidor' });
  }
});

router.post('/', async (req, res) => {
  try {
    const [newTutorial] = await db.insert(tutorials).values(req.body).returning();
    res.status(201).json(newTutorial);
  } catch (error) {
    console.error('Create tutorial error:', error);
    res.status(500).json({ error: 'Error en el servidor' });
  }
});

router.put('/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const [updatedTutorial] = await db.update(tutorials)
      .set({ ...req.body, updatedAt: new Date() })
      .where(eq(tutorials.id, Number(id)))
      .returning();
    res.json(updatedTutorial);
  } catch (error) {
    console.error('Update tutorial error:', error);
    res.status(500).json({ error: 'Error en el servidor' });
  }
});

router.delete('/:id', async (req, res) => {
  try {
    const { id } = req.params;
    await db.update(tutorials)
      .set({ isDeleted: true, deletedAt: new Date() })
      .where(eq(tutorials.id, Number(id)));
    res.json({ success: true });
  } catch (error) {
    console.error('Delete tutorial error:', error);
    res.status(500).json({ error: 'Error en el servidor' });
  }
});

export default router;
