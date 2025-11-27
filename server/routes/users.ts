import { Router } from 'express';
import bcrypt from 'bcryptjs';
import { db } from '../db.js';
import { users } from '../schema.js';
import { eq, and } from 'drizzle-orm';

const router = Router();

const transformUserForClient = (dbUser: any) => {
  return {
    id: String(dbUser.id),
    name: dbUser.name,
    email: dbUser.email,
    avatarUrl: dbUser.avatarUrl || dbUser.avatar_url || 'https://api.dicebear.com/7.x/avataaars/svg?seed=' + dbUser.email,
    role: dbUser.role,
    isActive: dbUser.isActive ?? dbUser.is_active ?? true,
    mustChangePassword: dbUser.mustChangePassword ?? dbUser.must_change_password ?? false,
    isDeleted: dbUser.isDeleted ?? dbUser.is_deleted ?? false,
    deletedAt: dbUser.deletedAt || dbUser.deleted_at || null,
    createdAt: dbUser.createdAt || dbUser.created_at,
    updatedAt: dbUser.updatedAt || dbUser.updated_at,
    coverUrl: dbUser.coverUrl || dbUser.cover_url || null,
    coverPosition: dbUser.coverPosition || dbUser.cover_position || null,
  };
};

router.get('/', async (req, res) => {
  try {
    const allUsers = await db.select().from(users).where(eq(users.isDeleted, false));
    const transformedUsers = allUsers.map(transformUserForClient);
    res.json(transformedUsers);
  } catch (error) {
    console.error('Get users error:', error);
    res.status(500).json({ error: 'Error en el servidor' });
  }
});

router.post('/', async (req, res) => {
  try {
    const { name, email, role, avatarUrl, tempPassword } = req.body;
    const passwordToHash = tempPassword || 'temp1234';
    const hashedPassword = await bcrypt.hash(passwordToHash, 10);
    
    const [newUser] = await db.insert(users).values({
      name,
      email,
      role,
      avatarUrl: avatarUrl || 'https://api.dicebear.com/7.x/avataaars/svg?seed=' + email,
      passwordHash: hashedPassword,
      mustChangePassword: true,
      isActive: true,
    }).returning();
    
    res.status(201).json(transformUserForClient(newUser));
  } catch (error) {
    console.error('Create user error:', error);
    res.status(500).json({ error: 'Error en el servidor' });
  }
});

router.put('/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const { name, email, role, avatarUrl, isActive, coverUrl, coverPosition } = req.body;
    
    const [updatedUser] = await db.update(users)
      .set({ 
        name, 
        email, 
        role, 
        avatarUrl, 
        isActive, 
        coverUrl,
        coverPosition,
        updatedAt: new Date() 
      })
      .where(eq(users.id, Number(id)))
      .returning();
    
    res.json(transformUserForClient(updatedUser));
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
