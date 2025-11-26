import { Router } from 'express';
import { db } from '../db.js';
import { leads } from '../schema.js';
import { eq } from 'drizzle-orm';

const router = Router();

router.get('/', async (req, res) => {
  try {
    const allLeads = await db.select().from(leads).where(eq(leads.isDeleted, false));
    res.json(allLeads);
  } catch (error) {
    console.error('Get leads error:', error);
    res.status(500).json({ error: 'Error en el servidor' });
  }
});

router.post('/', async (req, res) => {
  try {
    const [newLead] = await db.insert(leads).values(req.body).returning();
    res.status(201).json(newLead);
  } catch (error) {
    console.error('Create lead error:', error);
    res.status(500).json({ error: 'Error en el servidor' });
  }
});

router.put('/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const [updatedLead] = await db.update(leads)
      .set({ ...req.body, updatedAt: new Date() })
      .where(eq(leads.id, Number(id)))
      .returning();
    res.json(updatedLead);
  } catch (error) {
    console.error('Update lead error:', error);
    res.status(500).json({ error: 'Error en el servidor' });
  }
});

router.delete('/:id', async (req, res) => {
  try {
    const { id } = req.params;
    await db.update(leads)
      .set({ isDeleted: true, deletedAt: new Date() })
      .where(eq(leads.id, Number(id)));
    res.json({ success: true });
  } catch (error) {
    console.error('Delete lead error:', error);
    res.status(500).json({ error: 'Error en el servidor' });
  }
});

export default router;
