import { Router } from 'express';
import { db } from '../db.js';
import { tasks } from '../schema.js';
import { eq } from 'drizzle-orm';

const router = Router();

const transformTaskForClient = (dbTask: any) => {
  const assigneeIds = dbTask.assigneeIds || dbTask.assignee_ids || [];
  return {
    id: String(dbTask.id),
    title: dbTask.title,
    description: dbTask.description || '',
    status: dbTask.status,
    assigneeIds: Array.isArray(assigneeIds) ? assigneeIds.map((id: any) => String(id)) : [],
    clientName: dbTask.clientName || dbTask.client_name || '',
    priority: dbTask.priority,
    deadline: dbTask.deadline || '',
    comments: dbTask.comments || '',
    subtasks: dbTask.subtasks || [],
    completedAt: dbTask.completedAt || dbTask.completed_at || null,
    isDeleted: dbTask.isDeleted ?? dbTask.is_deleted ?? false,
    deletedAt: dbTask.deletedAt || dbTask.deleted_at || null,
    coverUrl: dbTask.coverUrl || dbTask.cover_url || null,
    coverPosition: dbTask.coverPosition || dbTask.cover_position || null,
    createdAt: dbTask.createdAt || dbTask.created_at,
    updatedAt: dbTask.updatedAt || dbTask.updated_at,
  };
};

const transformTaskFromClient = (clientTask: any) => {
  const transformed: any = {};
  
  if (clientTask.title !== undefined) transformed.title = clientTask.title;
  if (clientTask.description !== undefined) transformed.description = clientTask.description;
  if (clientTask.status !== undefined) transformed.status = clientTask.status;
  if (clientTask.assigneeIds !== undefined) {
    transformed.assigneeIds = Array.isArray(clientTask.assigneeIds) 
      ? clientTask.assigneeIds.map((id: any) => Number(id))
      : [];
  }
  if (clientTask.clientName !== undefined) transformed.clientName = clientTask.clientName;
  if (clientTask.priority !== undefined) transformed.priority = clientTask.priority;
  if (clientTask.deadline !== undefined) transformed.deadline = clientTask.deadline;
  if (clientTask.comments !== undefined) transformed.comments = clientTask.comments;
  if (clientTask.subtasks !== undefined) transformed.subtasks = clientTask.subtasks;
  if (clientTask.completedAt !== undefined) transformed.completedAt = clientTask.completedAt ? new Date(clientTask.completedAt) : null;
  if (clientTask.coverUrl !== undefined) transformed.coverUrl = clientTask.coverUrl;
  if (clientTask.coverPosition !== undefined) transformed.coverPosition = clientTask.coverPosition;
  
  return transformed;
};

router.get('/', async (req, res) => {
  try {
    const allTasks = await db.select().from(tasks).where(eq(tasks.isDeleted, false));
    const transformedTasks = allTasks.map(transformTaskForClient);
    res.json(transformedTasks);
  } catch (error) {
    console.error('Get tasks error:', error);
    res.status(500).json({ error: 'Error en el servidor' });
  }
});

router.post('/', async (req, res) => {
  try {
    const taskData = transformTaskFromClient(req.body);
    const [newTask] = await db.insert(tasks).values(taskData).returning();
    res.status(201).json(transformTaskForClient(newTask));
  } catch (error) {
    console.error('Create task error:', error);
    res.status(500).json({ error: 'Error en el servidor' });
  }
});

router.put('/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const taskData = transformTaskFromClient(req.body);
    const [updatedTask] = await db.update(tasks)
      .set({ ...taskData, updatedAt: new Date() })
      .where(eq(tasks.id, Number(id)))
      .returning();
    res.json(transformTaskForClient(updatedTask));
  } catch (error) {
    console.error('Update task error:', error);
    res.status(500).json({ error: 'Error en el servidor' });
  }
});

router.delete('/:id', async (req, res) => {
  try {
    const { id } = req.params;
    await db.update(tasks)
      .set({ isDeleted: true, deletedAt: new Date() })
      .where(eq(tasks.id, Number(id)));
    res.json({ success: true });
  } catch (error) {
    console.error('Delete task error:', error);
    res.status(500).json({ error: 'Error en el servidor' });
  }
});

export default router;
