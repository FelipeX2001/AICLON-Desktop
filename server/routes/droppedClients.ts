import { Router } from 'express';
import { db } from '../db.js';
import { droppedClients } from '../schema.js';
import { eq } from 'drizzle-orm';

const router = Router();

router.get('/', async (req, res) => {
  try {
    const allDroppedClients = await db.select()
      .from(droppedClients)
      .where(eq(droppedClients.isDeleted, false));
    res.json(allDroppedClients);
  } catch (error) {
    console.error('Get dropped clients error:', error);
    res.status(500).json({ error: 'Error en el servidor' });
  }
});

router.post('/', async (req, res) => {
  try {
    const [newDroppedClient] = await db.insert(droppedClients).values(req.body).returning();
    res.status(201).json(newDroppedClient);
  } catch (error) {
    console.error('Create dropped client error:', error);
    res.status(500).json({ error: 'Error en el servidor' });
  }
});

router.put('/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const [updatedDroppedClient] = await db.update(droppedClients)
      .set({ ...req.body, updatedAt: new Date() })
      .where(eq(droppedClients.id, Number(id)))
      .returning();
    res.json(updatedDroppedClient);
  } catch (error) {
    console.error('Update dropped client error:', error);
    res.status(500).json({ error: 'Error en el servidor' });
  }
});

router.delete('/:id', async (req, res) => {
  try {
    const { id } = req.params;
    await db.update(droppedClients)
      .set({ isDeleted: true, deletedAt: new Date() })
      .where(eq(droppedClients.id, Number(id)));
    res.json({ success: true });
  } catch (error) {
    console.error('Delete dropped client error:', error);
    res.status(500).json({ error: 'Error en el servidor' });
  }
});

export default router;
