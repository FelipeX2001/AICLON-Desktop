import { Router } from 'express';
import { db } from '../db.js';
import { botVersions } from '../schema.js';
import { eq } from 'drizzle-orm';
const router = Router();
router.get('/', async (req, res) => {
    try {
        const allBotVersions = await db.select().from(botVersions).where(eq(botVersions.isDeleted, false));
        res.json(allBotVersions);
    }
    catch (error) {
        console.error('Get bot versions error:', error);
        res.status(500).json({ error: 'Error en el servidor' });
    }
});
router.post('/', async (req, res) => {
    try {
        const [newBotVersion] = await db.insert(botVersions).values(req.body).returning();
        res.status(201).json(newBotVersion);
    }
    catch (error) {
        console.error('Create bot version error:', error);
        res.status(500).json({ error: 'Error en el servidor' });
    }
});
router.put('/:id', async (req, res) => {
    try {
        const { id } = req.params;
        const [updatedBotVersion] = await db.update(botVersions)
            .set({ ...req.body, updatedAt: new Date() })
            .where(eq(botVersions.id, Number(id)))
            .returning();
        res.json(updatedBotVersion);
    }
    catch (error) {
        console.error('Update bot version error:', error);
        res.status(500).json({ error: 'Error en el servidor' });
    }
});
router.delete('/:id', async (req, res) => {
    try {
        const { id } = req.params;
        await db.update(botVersions)
            .set({ isDeleted: true, deletedAt: new Date() })
            .where(eq(botVersions.id, Number(id)));
        res.json({ success: true });
    }
    catch (error) {
        console.error('Delete bot version error:', error);
        res.status(500).json({ error: 'Error en el servidor' });
    }
});
export default router;
