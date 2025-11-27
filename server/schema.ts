import { pgTable, serial, integer, text, varchar, boolean, timestamp, jsonb, pgEnum } from 'drizzle-orm/pg-core';

export const taskStatusEnum = pgEnum('task_status', ['Pendiente', 'En proceso', 'En revisión', 'Completada']);
export const taskPriorityEnum = pgEnum('task_priority', ['Urgente', 'Alta', 'Media', 'Baja']);
export const userRoleEnum = pgEnum('user_role', ['admin', 'developer']);
export const activeClientStageEnum = pgEnum('active_client_stage', ['En servicio', 'Pendiente de pago', 'Desarrollos extra']);
export const botTypeEnum = pgEnum('bot_type', ['evolution', 'meta', 'chatbot']);
export const currentClientStatusEnum = pgEnum('current_client_status', ['Activo', 'En Pausa', 'Cancelado']);

export const users = pgTable('users', {
  id: serial('id').primaryKey(),
  name: varchar('name', { length: 255 }).notNull(),
  email: varchar('email', { length: 255 }).notNull().unique(),
  avatarUrl: text('avatar_url'),
  role: userRoleEnum('role').notNull().default('developer'),
  passwordHash: text('password_hash').notNull(),
  isActive: boolean('is_active').default(true),
  mustChangePassword: boolean('must_change_password').default(false),
  passwordResetToken: text('password_reset_token'),
  passwordResetExpires: timestamp('password_reset_expires'),
  isDeleted: boolean('is_deleted').default(false),
  deletedAt: timestamp('deleted_at'),
  coverUrl: text('cover_url'),
  coverPosition: jsonb('cover_position'),
  createdAt: timestamp('created_at').defaultNow().notNull(),
  updatedAt: timestamp('updated_at').defaultNow().notNull(),
});

export const tasks = pgTable('tasks', {
  id: serial('id').primaryKey(),
  title: varchar('title', { length: 255 }).notNull(),
  description: text('description'),
  status: taskStatusEnum('status').notNull().default('Pendiente'),
  assigneeId: serial('assignee_id').references(() => users.id),
  clientName: varchar('client_name', { length: 255 }),
  priority: taskPriorityEnum('priority').notNull().default('Media'),
  deadline: varchar('deadline', { length: 50 }),
  comments: text('comments'),
  subtasks: jsonb('subtasks').$type<Array<{
    id: string;
    title: string;
    completed: boolean;
  }>>(),
  completedAt: timestamp('completed_at'),
  isDeleted: boolean('is_deleted').default(false),
  deletedAt: timestamp('deleted_at'),
  coverUrl: text('cover_url'),
  coverPosition: jsonb('cover_position'),
  createdAt: timestamp('created_at').defaultNow().notNull(),
  updatedAt: timestamp('updated_at').defaultNow().notNull(),
});

export const meetings = pgTable('meetings', {
  id: serial('id').primaryKey(),
  title: varchar('title', { length: 255 }).notNull(),
  description: text('description'),
  date: varchar('date', { length: 50 }).notNull(),
  startTime: varchar('start_time', { length: 50 }).notNull(),
  endTime: varchar('end_time', { length: 50 }).notNull(),
  attendeeIds: jsonb('attendee_ids').notNull().$type<number[]>(),
  clientId: serial('client_id'),
  link: text('link'),
  isRemote: boolean('is_remote').default(false),
  isDeleted: boolean('is_deleted').default(false),
  deletedAt: timestamp('deleted_at'),
  coverUrl: text('cover_url'),
  coverPosition: jsonb('cover_position'),
  createdAt: timestamp('created_at').defaultNow().notNull(),
  updatedAt: timestamp('updated_at').defaultNow().notNull(),
});

export const leads = pgTable('leads', {
  id: serial('id').primaryKey(),
  etapa: varchar('etapa', { length: 100 }).notNull(),
  assignedUserId: integer('assigned_user_id').references(() => users.id),
  isConverted: boolean('is_converted').default(false),
  
  nombreEmpresa: varchar('nombre_empresa', { length: 255 }).notNull(),
  nombreContacto: varchar('nombre_contacto', { length: 255 }),
  sector: varchar('sector', { length: 255 }),
  ciudad: varchar('ciudad', { length: 255 }),
  telefono: varchar('telefono', { length: 50 }),
  email: varchar('email', { length: 255 }),
  emailSecundario: varchar('email_secundario', { length: 255 }),
  web: text('web'),
  fuenteOrigen: varchar('fuente_origen', { length: 255 }),
  
  servicioInteres: varchar('servicio_interes', { length: 255 }),
  necesidad: text('necesidad'),
  fechaEnvioPropuesta: varchar('fecha_envio_propuesta', { length: 50 }),
  valorImplementacion: varchar('valor_implementacion', { length: 100 }),
  valorMensualidad: varchar('valor_mensualidad', { length: 100 }),
  
  fechaPrimerContacto: varchar('fecha_primer_contacto', { length: 50 }),
  comentarios: text('comentarios'),
  resultadoFinal: text('resultado_final'),
  fechaCierreReal: varchar('fecha_cierre_real', { length: 50 }),
  
  hitos: jsonb('hitos').$type<{
    envio_propuesta: boolean;
    envio_contrato: boolean;
    pago_primer_50: boolean;
    envio_capacitaciones: boolean;
    envio_accesos: boolean;
    pago_50_final: boolean;
    ia_activada: boolean;
  }>(),
  
  isDeleted: boolean('is_deleted').default(false),
  deletedAt: timestamp('deleted_at'),
  coverUrl: text('cover_url'),
  coverPosition: jsonb('cover_position'),
  createdAt: timestamp('created_at').defaultNow().notNull(),
  updatedAt: timestamp('updated_at').defaultNow().notNull(),
});

export const activeClients = pgTable('active_clients', {
  id: serial('id').primaryKey(),
  leadId: serial('lead_id').references(() => leads.id),
  estadoServicio: activeClientStageEnum('estado_servicio').notNull(),
  fechaInicioServicio: varchar('fecha_inicio_servicio', { length: 50 }),
  fechaCorte: varchar('fecha_corte', { length: 50 }),
  pagoMesActual: boolean('pago_mes_actual').default(false),
  valorMensualServicio: varchar('valor_mensual_servicio', { length: 100 }),
  
  isDeleted: boolean('is_deleted').default(false),
  deletedAt: timestamp('deleted_at'),
  coverUrl: text('cover_url'),
  coverPosition: jsonb('cover_position'),
  createdAt: timestamp('created_at').defaultNow().notNull(),
  updatedAt: timestamp('updated_at').defaultNow().notNull(),
});

export const botVersions = pgTable('bot_versions', {
  id: serial('id').primaryKey(),
  type: botTypeEnum('type').notNull(),
  name: varchar('name', { length: 255 }).notNull(),
  date: varchar('date', { length: 50 }).notNull(),
  notes: text('notes'),
  
  isDeleted: boolean('is_deleted').default(false),
  deletedAt: timestamp('deleted_at'),
  coverUrl: text('cover_url'),
  coverPosition: jsonb('cover_position'),
  createdAt: timestamp('created_at').defaultNow().notNull(),
  updatedAt: timestamp('updated_at').defaultNow().notNull(),
});

export const tutorials = pgTable('tutorials', {
  id: serial('id').primaryKey(),
  title: varchar('title', { length: 255 }).notNull(),
  date: varchar('date', { length: 50 }).notNull(),
  description: text('description'),
  link: text('link'),
  media: jsonb('media').$type<Array<{
    id: string;
    type: 'image' | 'video' | 'video_link';
    url: string;
    name?: string;
  }>>(),
  
  isDeleted: boolean('is_deleted').default(false),
  deletedAt: timestamp('deleted_at'),
  coverUrl: text('cover_url'),
  coverPosition: jsonb('cover_position'),
  createdAt: timestamp('created_at').defaultNow().notNull(),
  updatedAt: timestamp('updated_at').defaultNow().notNull(),
});

export const notifications = pgTable('notifications', {
  id: serial('id').primaryKey(),
  userId: serial('user_id').references(() => users.id).notNull(),
  type: varchar('type', { length: 50 }).notNull(),
  referenceId: varchar('reference_id', { length: 50 }),
  message: text('message').notNull(),
  read: boolean('read').default(false),
  createdAt: timestamp('created_at').defaultNow().notNull(),
});

export const droppedClients = pgTable('dropped_clients', {
  id: serial('id').primaryKey(),
  name: varchar('name', { length: 255 }).notNull(),
  email: varchar('email', { length: 255 }),
  telefono: varchar('telefono', { length: 50 }),
  sector: varchar('sector', { length: 255 }),
  ciudad: varchar('ciudad', { length: 255 }),
  servicioContratado: varchar('servicio_contratado', { length: 255 }),
  fechaInicio: varchar('fecha_inicio', { length: 50 }),
  fechaFin: varchar('fecha_fin', { length: 50 }),
  razonAbandono: text('razon_abandono'),
  valorMensualidad: varchar('valor_mensualidad', { length: 100 }),
  isDeleted: boolean('is_deleted').default(false),
  deletedAt: timestamp('deleted_at'),
  createdAt: timestamp('created_at').defaultNow().notNull(),
  updatedAt: timestamp('updated_at').defaultNow().notNull(),
});

export const demos = pgTable('demos', {
  id: serial('id').primaryKey(),
  number: varchar('number', { length: 50 }),
  name: varchar('name', { length: 255 }).notNull(),
  client: varchar('client', { length: 255 }),
  url: varchar('url', { length: 500 }),
  isDeleted: boolean('is_deleted').default(false),
  deletedAt: timestamp('deleted_at'),
  createdAt: timestamp('created_at').defaultNow().notNull(),
  updatedAt: timestamp('updated_at').defaultNow().notNull(),
});

export type User = typeof users.$inferSelect;
export type InsertUser = typeof users.$inferInsert;
export type Task = typeof tasks.$inferSelect;
export type InsertTask = typeof tasks.$inferInsert;
export type Meeting = typeof meetings.$inferSelect;
export type InsertMeeting = typeof meetings.$inferInsert;
export type Lead = typeof leads.$inferSelect;
export type InsertLead = typeof leads.$inferInsert;
export type ActiveClient = typeof activeClients.$inferSelect;
export type InsertActiveClient = typeof activeClients.$inferInsert;
export type BotVersion = typeof botVersions.$inferSelect;
export type InsertBotVersion = typeof botVersions.$inferInsert;
export type Tutorial = typeof tutorials.$inferSelect;
export type InsertTutorial = typeof tutorials.$inferInsert;
export type Notification = typeof notifications.$inferSelect;
export type InsertNotification = typeof notifications.$inferInsert;
export type DroppedClient = typeof droppedClients.$inferSelect;
export type InsertDroppedClient = typeof droppedClients.$inferInsert;
export type Demo = typeof demos.$inferSelect;
export type InsertDemo = typeof demos.$inferInsert;
