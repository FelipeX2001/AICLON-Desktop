import bcrypt from 'bcryptjs';
import { db } from './db.js';
import { users } from './schema.js';
import { eq } from 'drizzle-orm';
async function seed() {
    try {
        console.log('🌱 Seeding database...');
        const adminEmail = 'admin@aiclon.io';
        const [existingAdmin] = await db.select().from(users).where(eq(users.email, adminEmail)).limit(1);
        if (!existingAdmin) {
            const hashedPassword = await bcrypt.hash('admin1234', 10);
            await db.insert(users).values({
                name: 'Admin AICLON',
                email: adminEmail,
                avatarUrl: 'https://ui-avatars.com/api/?name=Admin+A&background=0D8ABC&color=fff',
                role: 'admin',
                passwordHash: hashedPassword,
                isActive: true,
                mustChangePassword: true,
                isDeleted: false,
            });
            console.log('✅ Admin user created successfully');
        }
        else {
            console.log('ℹ️  Admin user already exists');
        }
        console.log('🎉 Seeding complete!');
        process.exit(0);
    }
    catch (error) {
        console.error('❌ Seeding failed:', error);
        process.exit(1);
    }
}
seed();
