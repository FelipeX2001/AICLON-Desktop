import { Router } from 'express';
import bcrypt from 'bcryptjs';
import { db } from '../db.js';
import { users } from '../schema.js';
import { eq } from 'drizzle-orm';

const router = Router();

router.post('/login', async (req, res) => {
  try {
    const { email, password } = req.body;
    
    const [user] = await db.select().from(users).where(eq(users.email, email)).limit(1);
    
    if (!user || user.isDeleted) {
      return res.status(401).json({ error: 'Hubo un error en el usuario o la contraseña.' });
    }
    
    if (!user.isActive) {
      return res.status(401).json({ error: 'Hubo un error en el usuario o la contraseña.' });
    }
    
    const isPasswordValid = await bcrypt.compare(password, user.passwordHash);
    
    if (!isPasswordValid) {
      return res.status(401).json({ error: 'Hubo un error en el usuario o la contraseña.' });
    }
    
    const { passwordHash, ...userWithoutPassword } = user;
    res.json({ user: userWithoutPassword });
  } catch (error) {
    console.error('Login error:', error);
    res.status(500).json({ error: 'Error en el servidor' });
  }
});

router.post('/change-password', async (req, res) => {
  try {
    const { userId, newPassword } = req.body;
    
    const hashedPassword = await bcrypt.hash(newPassword, 10);
    
    await db.update(users)
      .set({ 
        passwordHash: hashedPassword, 
        mustChangePassword: false 
      })
      .where(eq(users.id, userId));
    
    res.json({ success: true });
  } catch (error) {
    console.error('Change password error:', error);
    res.status(500).json({ error: 'Error en el servidor' });
  }
});

router.post('/forgot-password', async (req, res) => {
  try {
    const { email } = req.body;
    
    const [user] = await db.select().from(users).where(eq(users.email, email)).limit(1);
    
    if (!user) {
      return res.status(404).json({ error: 'Usuario no encontrado' });
    }
    
    const resetToken = Math.random().toString(36).slice(2);
    const resetExpires = new Date(Date.now() + 3600000);
    
    await db.update(users)
      .set({ 
        passwordResetToken: resetToken,
        passwordResetExpires: resetExpires
      })
      .where(eq(users.id, user.id));
    
    res.json({ 
      success: true, 
      message: 'Token de restablecimiento enviado',
      token: resetToken
    });
  } catch (error) {
    console.error('Forgot password error:', error);
    res.status(500).json({ error: 'Error en el servidor' });
  }
});

router.post('/reset-password', async (req, res) => {
  try {
    const { token, newPassword } = req.body;
    
    const [user] = await db.select().from(users)
      .where(eq(users.passwordResetToken, token))
      .limit(1);
    
    if (!user || !user.passwordResetExpires || user.passwordResetExpires < new Date()) {
      return res.status(400).json({ error: 'Token inválido o expirado' });
    }
    
    const hashedPassword = await bcrypt.hash(newPassword, 10);
    
    await db.update(users)
      .set({ 
        passwordHash: hashedPassword,
        passwordResetToken: null,
        passwordResetExpires: null
      })
      .where(eq(users.id, user.id));
    
    res.json({ success: true });
  } catch (error) {
    console.error('Reset password error:', error);
    res.status(500).json({ error: 'Error en el servidor' });
  }
});

export default router;
