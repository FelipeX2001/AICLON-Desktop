import { Router } from 'express';
import { db } from '../db.js';
import { activeClients, leads } from '../schema.js';
import { eq } from 'drizzle-orm';

const router = Router();

router.get('/', async (req, res) => {
  try {
    const allActiveClients = await db.select({
      activeClient: activeClients,
      lead: leads,
    })
    .from(activeClients)
    .leftJoin(leads, eq(activeClients.leadId, leads.id))
    .where(eq(activeClients.isDeleted, false));
    
    const formatted = allActiveClients.map(({ activeClient, lead }) => ({
      ...activeClient,
      ...lead,
      activeId: activeClient.id,
      leadId: lead?.id,
    }));
    
    res.json(formatted);
  } catch (error) {
    console.error('Get active clients error:', error);
    res.status(500).json({ error: 'Error en el servidor' });
  }
});

router.post('/', async (req, res) => {
  try {
    const [newActiveClient] = await db.insert(activeClients).values(req.body).returning();
    res.status(201).json(newActiveClient);
  } catch (error) {
    console.error('Create active client error:', error);
    res.status(500).json({ error: 'Error en el servidor' });
  }
});

router.put('/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const [updatedActiveClient] = await db.update(activeClients)
      .set({ ...req.body, updatedAt: new Date() })
      .where(eq(activeClients.id, Number(id)))
      .returning();
    res.json(updatedActiveClient);
  } catch (error) {
    console.error('Update active client error:', error);
    res.status(500).json({ error: 'Error en el servidor' });
  }
});

router.delete('/:id', async (req, res) => {
  try {
    const { id } = req.params;
    await db.update(activeClients)
      .set({ isDeleted: true, deletedAt: new Date() })
      .where(eq(activeClients.id, Number(id)));
    res.json({ success: true });
  } catch (error) {
    console.error('Delete active client error:', error);
    res.status(500).json({ error: 'Error en el servidor' });
  }
});

export default router;
