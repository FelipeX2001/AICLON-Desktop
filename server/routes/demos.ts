import { Router } from 'express';
import { db } from '../db.js';
import { demos } from '../schema.js';
import { eq } from 'drizzle-orm';

const router = Router();

router.get('/', async (req, res) => {
  try {
    const allDemos = await db.select()
      .from(demos)
      .where(eq(demos.isDeleted, false));
    res.json(allDemos);
  } catch (error) {
    console.error('Get demos error:', error);
    res.status(500).json({ error: 'Error en el servidor' });
  }
});

router.post('/', async (req, res) => {
  try {
    const [newDemo] = await db.insert(demos).values(req.body).returning();
    res.status(201).json(newDemo);
  } catch (error) {
    console.error('Create demo error:', error);
    res.status(500).json({ error: 'Error en el servidor' });
  }
});

router.put('/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const [updatedDemo] = await db.update(demos)
      .set({ ...req.body, updatedAt: new Date() })
      .where(eq(demos.id, Number(id)))
      .returning();
    res.json(updatedDemo);
  } catch (error) {
    console.error('Update demo error:', error);
    res.status(500).json({ error: 'Error en el servidor' });
  }
});

router.delete('/:id', async (req, res) => {
  try {
    const { id } = req.params;
    await db.update(demos)
      .set({ isDeleted: true, deletedAt: new Date() })
      .where(eq(demos.id, Number(id)));
    res.json({ success: true });
  } catch (error) {
    console.error('Delete demo error:', error);
    res.status(500).json({ error: 'Error en el servidor' });
  }
});

export default router;
