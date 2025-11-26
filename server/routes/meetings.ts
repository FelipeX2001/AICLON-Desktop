import { Router } from 'express';
import { db } from '../db.js';
import { meetings } from '../schema.js';
import { eq } from 'drizzle-orm';

const router = Router();

router.get('/', async (req, res) => {
  try {
    const allMeetings = await db.select().from(meetings).where(eq(meetings.isDeleted, false));
    res.json(allMeetings);
  } catch (error) {
    console.error('Get meetings error:', error);
    res.status(500).json({ error: 'Error en el servidor' });
  }
});

router.post('/', async (req, res) => {
  try {
    const [newMeeting] = await db.insert(meetings).values(req.body).returning();
    res.status(201).json(newMeeting);
  } catch (error) {
    console.error('Create meeting error:', error);
    res.status(500).json({ error: 'Error en el servidor' });
  }
});

router.put('/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const [updatedMeeting] = await db.update(meetings)
      .set({ ...req.body, updatedAt: new Date() })
      .where(eq(meetings.id, Number(id)))
      .returning();
    res.json(updatedMeeting);
  } catch (error) {
    console.error('Update meeting error:', error);
    res.status(500).json({ error: 'Error en el servidor' });
  }
});

router.delete('/:id', async (req, res) => {
  try {
    const { id } = req.params;
    await db.update(meetings)
      .set({ isDeleted: true, deletedAt: new Date() })
      .where(eq(meetings.id, Number(id)));
    res.json({ success: true });
  } catch (error) {
    console.error('Delete meeting error:', error);
    res.status(500).json({ error: 'Error en el servidor' });
  }
});

export default router;
