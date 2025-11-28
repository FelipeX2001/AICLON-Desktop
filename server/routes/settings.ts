import { Router } from 'express';
import { db } from '../db.js';
import { appSettings } from '../schema.js';
import { eq } from 'drizzle-orm';

const router = Router();

router.get('/', async (req, res) => {
  try {
    const allSettings = await db.select().from(appSettings);
    const settingsMap: Record<string, string> = {};
    allSettings.forEach(s => {
      if (s.value) settingsMap[s.key] = s.value;
    });
    res.json(settingsMap);
  } catch (error) {
    console.error('Get settings error:', error);
    res.status(500).json({ error: 'Error en el servidor' });
  }
});

router.put('/:key', async (req, res) => {
  try {
    const { key } = req.params;
    const { value } = req.body;
    
    const existing = await db.select().from(appSettings).where(eq(appSettings.key, key));
    
    if (existing.length > 0) {
      await db.update(appSettings)
        .set({ value, updatedAt: new Date() })
        .where(eq(appSettings.key, key));
    } else {
      await db.insert(appSettings).values({ key, value });
    }
    
    res.json({ success: true, key, value });
  } catch (error) {
    console.error('Update setting error:', error);
    res.status(500).json({ error: 'Error en el servidor' });
  }
});

export default router;
