import { Router } from 'express';
import bcrypt from 'bcryptjs';
import { db } from '../db.js';
import { users } from '../schema.js';
import { eq, and } from 'drizzle-orm';

const router = Router();

router.get('/', async (req, res) => {
  try {
    const allUsers = await db.select().from(users).where(eq(users.isDeleted, false));
    const usersWithoutPasswords = allUsers.map(({ passwordHash, ...user }) => user);
    res.json(usersWithoutPasswords);
  } catch (error) {
    console.error('Get users error:', error);
    res.status(500).json({ error: 'Error en el servidor' });
  }
});

router.post('/', async (req, res) => {
  try {
    const { name, email, role, avatarUrl } = req.body;
    const hashedPassword = await bcrypt.hash('defaultPassword123', 10);
    
    const [newUser] = await db.insert(users).values({
      name,
      email,
      role,
      avatarUrl,
      passwordHash: hashedPassword,
      mustChangePassword: true,
      isActive: true,
    }).returning();
    
    const { passwordHash, ...userWithoutPassword } = newUser;
    res.status(201).json(userWithoutPassword);
  } catch (error) {
    console.error('Create user error:', error);
    res.status(500).json({ error: 'Error en el servidor' });
  }
});

router.put('/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const { name, email, role, avatarUrl, isActive } = req.body;
    
    const [updatedUser] = await db.update(users)
      .set({ name, email, role, avatarUrl, isActive, updatedAt: new Date() })
      .where(eq(users.id, Number(id)))
      .returning();
    
    const { passwordHash, ...userWithoutPassword } = updatedUser;
    res.json(userWithoutPassword);
  } catch (error) {
    console.error('Update user error:', error);
    res.status(500).json({ error: 'Error en el servidor' });
  }
});

router.delete('/:id', async (req, res) => {
  try {
    const { id } = req.params;
    
    await db.update(users)
      .set({ isDeleted: true, deletedAt: new Date() })
      .where(eq(users.id, Number(id)));
    
    res.json({ success: true });
  } catch (error) {
    console.error('Delete user error:', error);
    res.status(500).json({ error: 'Error en el servidor' });
  }
});

export default router;
