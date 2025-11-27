
import type { ReactNode } from 'react';

// --- BASE ENTITY FOR SOFT DELETE & COVER POSITION ---
export interface CoverPosition {
  x: number; // percent 0-100
  y: number; // percent 0-100
  zoom: number; // scale 1-3
}

export interface BaseEntity {
  isDeleted?: boolean;
  deletedAt?: string;
  coverUrl?: string;
  coverPosition?: CoverPosition;
}

export interface Notification {
  id: string;
  userId: string;
  type: 'task_assigned' | 'meeting_assigned' | 'system';
  referenceId?: string; // TaskID or MeetingID
  message: string;
  read: boolean;
  createdAt: string;
}

export interface User extends BaseEntity {
  id: string;
  name: string;
  email: string;
  avatarUrl: string;
  role: 'admin' | 'developer';
  
  // Auth Fields
  passwordHash?: string;
  isActive?: boolean;
  mustChangePassword?: boolean;
  passwordResetToken?: string;
  passwordResetExpires?: number;
}

export enum TaskStatus {
  Pending = 'Pendiente',
  InProcess = 'En proceso',
  InReview = 'En revisión',
  Completed = 'Completada'
}

export enum TaskPriority {
  Urgent = 'Urgente',
  High = 'Alta',
  Medium = 'Media',
  Low = 'Baja'
}

export interface Subtask {
  id: string;
  title: string;
  completed: boolean;
}

export interface Task extends BaseEntity {
  id: string;
  title: string;
  description?: string; 
  status: TaskStatus;
  assigneeId: string;
  clientName: string;
  priority: TaskPriority;
  deadline: string; // YYYY-MM-DD
  comments?: string;
  subtasks?: Subtask[]; // Optional checklist items with progress
  completedAt?: string; // New Field for archiving logic
}

export interface Meeting {
  id: string;
  time: string;
  title: string;
  attendees: string;
}

export interface MeetingEvent extends BaseEntity {
  id: string;
  title: string;
  description?: string;
  date: string; // YYYY-MM-DD
  startTime: string; // HH:mm
  endTime: string; // HH:mm
  attendeeIds: string[]; 
  clientId?: string; 
  link?: string; 
  isRemote: boolean;
}

export interface QuickLink {
  id: string;
  label: string;
  url: string;
  iconType: 'api' | 'code' | 'chat' | 'cloud' | 'bot' | 'db' | 'network' | 'audio' | 'ai';
  imageUrl?: string;
}

export interface Demo extends BaseEntity {
  id: string;
  number: string;
  name: string;
  client: string;
  url: string;
}

export interface SidebarItem {
  id: string;
  label: string;
  icon: ReactNode;
  active?: boolean;
  subItems?: string[];
}

// --- LEAD MANAGEMENT TYPES ---

export const LEAD_STAGES = [
  'En Espera',
  'Primer Contacto',
  'Reunión Inicial',
  'Pendiente de Propuesta',
  'Reunión Revisión Propuesta',
  'Levantamiento de Información',
  'Etapa de Entrenamiento',
  'Etapa DEMO',
  'Reunión de Capacitación',
  'Conexión de la Línea',
  'Pendiente de Pago',
  'Lead Cerrado'
] as const;

export type LeadStage = typeof LEAD_STAGES[number];

export interface LeadMilestones {
  envio_propuesta: boolean;
  envio_contrato: boolean;
  pago_primer_50: boolean;
  envio_capacitaciones: boolean;
  envio_accesos: boolean;
  pago_50_final: boolean;
  ia_activada: boolean;
}

export interface Lead extends BaseEntity {
  id: string;
  etapa: LeadStage;
  assignedUserId?: string; 
  isConverted?: boolean; // New Flag: Logic deletion from Lead Board
  
  // Contact Info
  nombre_empresa: string;
  nombre_contacto: string;
  sector: string;
  ciudad: string;
  telefono: string;
  email: string;
  email_secundario?: string;
  web: string;
  fuente_origen: string;
  // Service Info
  servicio_interes: string;
  necesidad: string;
  fecha_envio_propuesta: string;
  valor_implementacion: string;
  valor_mensualidad: string;
  // Status Info
  fecha_primer_contacto: string;
  comentarios: string;
  resultado_final: string;
  fecha_cierre_real: string;
  // Progress
  hitos: LeadMilestones;
}

// --- CURRENT CLIENT TYPES ---
export interface CurrentClient extends BaseEntity {
  id: string;
  name: string;
  sector: string;
  city: string;
  monthlyValue: string;
  status: 'Activo' | 'En Pausa' | 'Cancelado';
  joinDate: string;
}

// --- ACTIVE CLIENTS BOARD TYPES ---
export const ACTIVE_CLIENT_STAGES = ['En servicio', 'Pendiente de pago', 'Desarrollos extra'] as const;
export type ActiveClientStage = typeof ACTIVE_CLIENT_STAGES[number];

export interface ActiveClient extends Lead {
    activeId: string; 
    leadId: string;   
    fecha_inicio_servicio: string;
    fecha_corte: string;
    pago_mes_actual: boolean;
    estado_servicio: ActiveClientStage;
    valor_mensual_servicio: string; 
}

// --- DROPPED CLIENTS ---
export interface DroppedClient extends BaseEntity {
  id: string;
  originalId: string; 
  name: string;
  type: 'lead' | 'active'; 
  reason: string;
  droppedDate: string;
  originalData: Lead | ActiveClient; 
}

// --- BOT VERSIONS ---
export type BotType = 'evolution' | 'meta' | 'chatbot';

export interface BotVersion extends BaseEntity {
  id: string;
  type: BotType;
  name: string;
  date: string;
  notes: string;
}

// --- TUTORIALS ---
export interface TutorialMedia {
  id: string;
  type: 'image' | 'video' | 'video_link';
  url: string;
  name?: string;
}

export interface TutorialStep {
  id: string;
  title: string;
  content: string;
  order: number;
}

export interface Tutorial extends BaseEntity {
  id: string;
  title: string;
  date: string;
  description: string;
  link: string;
  media: TutorialMedia[];
  steps?: TutorialStep[];
}
