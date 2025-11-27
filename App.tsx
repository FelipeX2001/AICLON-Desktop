
import React, { useState, useEffect, useCallback } from 'react';
import LoginScreen from './components/LoginScreen';
import ForgotPasswordScreen from './components/ForgotPasswordScreen';
import ResetPasswordScreen from './components/ResetPasswordScreen';
import ChangePasswordModal from './components/ChangePasswordModal';
import DashboardLayout from './components/DashboardLayout';
import DashboardHome from './components/DashboardHome';
import TeamView from './components/TeamView';
import LeadBoard from './components/LeadBoard';
import ClientsDashboard from './components/ClientsDashboard';
import ActiveClientsBoard from './components/ActiveClientsBoard';
import TaskBoard from './components/TaskBoard';
import MeetingsView from './components/MeetingsView';
import BotVersionsView from './components/BotVersionsView';
import TutorialsView from './components/TutorialsView';
import TutorialPage from './components/TutorialPage';
import TutorialEditPage from './components/TutorialEditPage';
import UserEditModal from './components/UserEditModal';
import UserProfilePage from './components/UserProfilePage';
import { User, Task, MeetingEvent, ActiveClient, Lead, Notification, BotVersion, Tutorial, Demo, DroppedClient } from './types';
import { 
  authAPI, 
  usersAPI, 
  tasksAPI, 
  meetingsAPI, 
  leadsAPI, 
  activeClientsAPI, 
  botVersionsAPI, 
  tutorialsAPI, 
  notificationsAPI,
  droppedClientsAPI,
  demosAPI
} from './client';

const App: React.FC = () => {
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(false);
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [showForceChangePassword, setShowForceChangePassword] = useState(false);
  const [authError, setAuthError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  
  const [theme, setTheme] = useState<'dark' | 'light'>(() => {
    return localStorage.getItem('aiclon_theme') as 'dark' | 'light' || 'dark';
  });
  const [currentView, setCurrentView] = useState<string>('dashboard');

  const [users, setUsers] = useState<User[]>([]);
  const [tasks, setTasks] = useState<Task[]>([]);
  const [meetings, setMeetings] = useState<MeetingEvent[]>([]);
  const [activeClients, setActiveClients] = useState<ActiveClient[]>([]);
  const [leads, setLeads] = useState<Lead[]>([]);
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [botVersions, setBotVersions] = useState<BotVersion[]>([]);
  const [tutorials, setTutorials] = useState<Tutorial[]>([]);
  const [demos, setDemos] = useState<Demo[]>([]);
  const [droppedClients, setDroppedClients] = useState<DroppedClient[]>([]);
  const [botListCovers, setBotListCovers] = useState<Record<string, string>>({});

  const [isEditProfileOpen, setIsEditProfileOpen] = useState(false);
  const [userToEdit, setUserToEdit] = useState<User | null>(null);

  const [profileViewUser, setProfileViewUser] = useState<User | null>(null);
  const [profileViewTab, setProfileViewTab] = useState<'tasks' | 'meetings' | 'clients'>('tasks');

  const [selectedTutorial, setSelectedTutorial] = useState<Tutorial | null>(null);
  const [isEditingTutorial, setIsEditingTutorial] = useState(false);

  const loadAllData = useCallback(async () => {
    try {
      const [
        usersData,
        tasksData,
        meetingsData,
        leadsData,
        activeClientsData,
        botVersionsData,
        tutorialsData,
        demosData,
        droppedClientsData
      ] = await Promise.all([
        usersAPI.getAll(),
        tasksAPI.getAll(),
        meetingsAPI.getAll(),
        leadsAPI.getAll(),
        activeClientsAPI.getAll(),
        botVersionsAPI.getAll(),
        tutorialsAPI.getAll(),
        demosAPI.getAll(),
        droppedClientsAPI.getAll()
      ]);

      setUsers(usersData.map((u: any) => ({
        ...u,
        id: String(u.id),
        avatarUrl: u.avatarUrl || `https://ui-avatars.com/api/?name=${encodeURIComponent(u.name)}&background=0D8ABC&color=fff`
      })));
      
      setTasks(tasksData.map((t: any) => ({
        ...t,
        id: String(t.id),
        assigneeId: String(t.assigneeId)
      })));
      
      setMeetings(meetingsData.map((m: any) => ({
        ...m,
        id: String(m.id),
        attendeeIds: (m.attendeeIds || []).map(String)
      })));
      
      setLeads(leadsData.map((l: any) => ({
        ...l,
        id: String(l.id),
        assignedUserId: l.assignedUserId ? String(l.assignedUserId) : undefined,
        nombre_empresa: l.nombreEmpresa,
        nombre_contacto: l.nombreContacto,
        email_secundario: l.emailSecundario,
        fuente_origen: l.fuenteOrigen,
        servicio_interes: l.servicioInteres,
        fecha_envio_propuesta: l.fechaEnvioPropuesta,
        valor_implementacion: l.valorImplementacion,
        valor_mensualidad: l.valorMensualidad,
        fecha_primer_contacto: l.fechaPrimerContacto,
        resultado_final: l.resultadoFinal,
        fecha_cierre_real: l.fechaCierreReal
      })));
      
      setActiveClients(activeClientsData.map((ac: any) => ({
        ...ac,
        id: String(ac.activeId || ac.id),
        activeId: String(ac.activeId || ac.id),
        leadId: ac.leadId ? String(ac.leadId) : undefined,
        nombre_empresa: ac.nombreEmpresa,
        nombre_contacto: ac.nombreContacto,
        email_secundario: ac.emailSecundario,
        fuente_origen: ac.fuenteOrigen,
        servicio_interes: ac.servicioInteres,
        fecha_envio_propuesta: ac.fechaEnvioPropuesta,
        valor_implementacion: ac.valorImplementacion,
        valor_mensualidad: ac.valorMensualidad,
        fecha_primer_contacto: ac.fechaPrimerContacto,
        resultado_final: ac.resultadoFinal,
        fecha_cierre_real: ac.fechaCierreReal,
        fecha_inicio_servicio: ac.fechaInicioServicio,
        fecha_corte: ac.fechaCorte,
        pago_mes_actual: ac.pagoMesActual,
        estado_servicio: ac.estadoServicio,
        valor_mensual_servicio: ac.valorMensualServicio
      })));
      
      setBotVersions(botVersionsData.map((bv: any) => ({
        ...bv,
        id: String(bv.id)
      })));
      
      setTutorials(tutorialsData.map((t: any) => ({
        ...t,
        id: String(t.id)
      })));
      
      setDemos(demosData.map((d: any) => ({
        ...d,
        id: String(d.id)
      })));
      
      setDroppedClients(droppedClientsData.map((dc: any) => ({
        ...dc,
        id: String(dc.id)
      })));

    } catch (error) {
      console.error('Error loading data:', error);
    } finally {
      setIsLoading(false);
    }
  }, []);

  const loadNotifications = useCallback(async (userId: number) => {
    try {
      const notifData = await notificationsAPI.getAll();
      setNotifications(notifData.filter((n: any) => n.userId === userId).map((n: any) => ({
        ...n,
        id: String(n.id),
        userId: String(n.userId)
      })));
    } catch (error) {
      console.error('Error loading notifications:', error);
    }
  }, []);

  useEffect(() => {
    loadAllData();
  }, [loadAllData]);

  useEffect(() => {
    localStorage.setItem('aiclon_theme', theme);
  }, [theme]);

  const handleLogin = async (email: string, pass: string) => {
    setAuthError(null);
    try {
      const response = await authAPI.login(email, pass);
      const user = {
        ...response.user,
        id: String(response.user.id),
        avatarUrl: response.user.avatarUrl || `https://ui-avatars.com/api/?name=${encodeURIComponent(response.user.name)}&background=0D8ABC&color=fff`
      } as User;
      setCurrentUser(user);
      setIsAuthenticated(true);
      await loadNotifications(Number(user.id));
      if (user.mustChangePassword) {
        setShowForceChangePassword(true);
      } else {
        setCurrentView('dashboard');
      }
    } catch (error: any) {
      setAuthError(error.message || "Hubo un error en el usuario o la contraseña.");
    }
  };

  const handleForcePasswordChange = async (newPassword: string) => {
    if (!currentUser) return;
    try {
      await authAPI.changePassword(Number(currentUser.id), newPassword);
      const updatedUser = { ...currentUser, mustChangePassword: false };
      setCurrentUser(updatedUser);
      setShowForceChangePassword(false);
      alert("Contraseña actualizada correctamente.");
    } catch (error: any) {
      alert("Error al cambiar la contraseña: " + error.message);
    }
  };

  const handleLogout = () => {
    setIsAuthenticated(false);
    setCurrentUser(null);
    setCurrentView('dashboard');
    setAuthError(null);
    setNotifications([]);
  };

  const handleCreateUser = async (newUser: User & { tempPassword?: string }) => {
    if (currentUser?.role !== 'admin') return;
    try {
      const created = await usersAPI.create({
        name: newUser.name,
        email: newUser.email,
        role: newUser.role,
        avatarUrl: newUser.avatarUrl,
        tempPassword: newUser.tempPassword || 'temp1234'
      });
      setUsers(prev => [...prev, {
        ...created,
        id: String(created.id),
        avatarUrl: created.avatarUrl || `https://ui-avatars.com/api/?name=${encodeURIComponent(created.name)}&background=0D8ABC&color=fff`
      }]);
    } catch (error: any) {
      alert("Error al crear usuario: " + error.message);
    }
  };

  const handleSaveUser = async (updatedUser: User) => {
    if (updatedUser.email === 'admin@aiclon.io') {
      if (updatedUser.role !== 'admin' || updatedUser.isActive === false) {
        alert("No se puede modificar el rol o estado del Administrador Principal.");
        return;
      }
    }
    try {
      const updated = await usersAPI.update(Number(updatedUser.id), {
        name: updatedUser.name,
        email: updatedUser.email,
        role: updatedUser.role,
        avatarUrl: updatedUser.avatarUrl,
        isActive: updatedUser.isActive,
        coverUrl: updatedUser.coverUrl,
        coverPosition: updatedUser.coverPosition
      });
      setUsers(prev => prev.map(u => u.id === updatedUser.id ? {
        ...updated,
        id: String(updated.id),
        avatarUrl: updated.avatarUrl || `https://ui-avatars.com/api/?name=${encodeURIComponent(updated.name)}&background=0D8ABC&color=fff`
      } : u));
      if (currentUser?.id === updatedUser.id) {
        setCurrentUser({
          ...updated,
          id: String(updated.id),
          avatarUrl: updated.avatarUrl || `https://ui-avatars.com/api/?name=${encodeURIComponent(updated.name)}&background=0D8ABC&color=fff`
        });
      }
    } catch (error: any) {
      alert("Error al actualizar usuario: " + error.message);
    }
  };

  const handleDeleteUser = async (userId: string) => {
    const userToDelete = users.find(u => u.id === userId);
    if (userToDelete?.email === 'admin@aiclon.io') {
      alert("No se puede eliminar al Administrador Principal.");
      return;
    }
    try {
      await usersAPI.delete(Number(userId));
      setUsers(prev => prev.filter(u => u.id !== userId));
      setIsEditProfileOpen(false);
    } catch (error: any) {
      alert("Error al eliminar usuario: " + error.message);
    }
  };

  const addNotification = async (userId: string, message: string, type: Notification['type'], refId?: string) => {
    try {
      const created = await notificationsAPI.create({
        userId: Number(userId),
        message,
        type,
        referenceId: refId
      });
      setNotifications(prev => [{
        ...created,
        id: String(created.id),
        userId: String(created.userId)
      }, ...prev]);
    } catch (error) {
      console.error('Error creating notification:', error);
    }
  };

  const handleMarkNotificationRead = async (id: string) => {
    try {
      await notificationsAPI.markAsRead(Number(id));
      setNotifications(prev => prev.map(n => n.id === id ? { ...n, read: true } : n));
    } catch (error) {
      console.error('Error marking notification as read:', error);
    }
  };

  const handleSaveTask = async (task: Task) => {
    const existingTask = tasks.find(t => t.id === task.id);
    
    try {
      if (existingTask) {
        const updated = await tasksAPI.update(Number(task.id), {
          title: task.title,
          description: task.description,
          status: task.status,
          assigneeId: Number(task.assigneeId),
          clientName: task.clientName,
          priority: task.priority,
          deadline: task.deadline,
          comments: task.comments,
          subtasks: task.subtasks || [],
          completedAt: task.completedAt,
          coverUrl: task.coverUrl,
          coverPosition: task.coverPosition
        });
        setTasks(prev => prev.map(t => t.id === task.id ? {
          ...updated,
          id: String(updated.id),
          assigneeId: String(updated.assigneeId)
        } : t));
        
        if (existingTask.assigneeId !== task.assigneeId) {
          addNotification(task.assigneeId, `Se te ha asignado la tarea: ${task.title}`, 'task_assigned', task.id);
        }
      } else {
        const created = await tasksAPI.create({
          title: task.title,
          description: task.description,
          status: task.status,
          assigneeId: Number(task.assigneeId),
          clientName: task.clientName,
          priority: task.priority,
          deadline: task.deadline,
          comments: task.comments,
          subtasks: task.subtasks || [],
          coverUrl: task.coverUrl,
          coverPosition: task.coverPosition
        });
        setTasks(prev => [...prev, {
          ...created,
          id: String(created.id),
          assigneeId: String(created.assigneeId)
        }]);
        addNotification(task.assigneeId, `Se te ha asignado la tarea: ${task.title}`, 'task_assigned', String(created.id));
      }
    } catch (error: any) {
      alert("Error al guardar tarea: " + error.message);
    }
  };

  const handleDeleteTask = async (taskId: string) => {
    try {
      await tasksAPI.delete(Number(taskId));
      setTasks(prev => prev.filter(t => t.id !== taskId));
    } catch (error: any) {
      alert("Error al eliminar tarea: " + error.message);
    }
  };

  const handleSaveMeeting = async (meeting: MeetingEvent) => {
    const existingMeeting = meetings.find(m => m.id === meeting.id);
    
    try {
      if (existingMeeting) {
        const updated = await meetingsAPI.update(Number(meeting.id), {
          title: meeting.title,
          description: meeting.description,
          date: meeting.date,
          startTime: meeting.startTime,
          endTime: meeting.endTime,
          attendeeIds: meeting.attendeeIds.map(Number),
          clientId: meeting.clientId ? Number(meeting.clientId) : null,
          link: meeting.link,
          isRemote: meeting.isRemote,
          coverUrl: meeting.coverUrl,
          coverPosition: meeting.coverPosition
        });
        setMeetings(prev => prev.map(m => m.id === meeting.id ? {
          ...updated,
          id: String(updated.id),
          attendeeIds: (updated.attendeeIds || []).map(String)
        } : m));
        
        meeting.attendeeIds.forEach(userId => {
          if (!existingMeeting.attendeeIds.includes(userId)) {
            addNotification(userId, `Nueva reunión: ${meeting.title}`, 'meeting_assigned', meeting.id);
          }
        });
      } else {
        const created = await meetingsAPI.create({
          title: meeting.title,
          description: meeting.description,
          date: meeting.date,
          startTime: meeting.startTime,
          endTime: meeting.endTime,
          attendeeIds: meeting.attendeeIds.map(Number),
          clientId: meeting.clientId ? Number(meeting.clientId) : null,
          link: meeting.link,
          isRemote: meeting.isRemote,
          coverUrl: meeting.coverUrl,
          coverPosition: meeting.coverPosition
        });
        setMeetings(prev => [...prev, {
          ...created,
          id: String(created.id),
          attendeeIds: (created.attendeeIds || []).map(String)
        }]);
        meeting.attendeeIds.forEach(userId => {
          addNotification(userId, `Nueva reunión: ${meeting.title}`, 'meeting_assigned', String(created.id));
        });
      }
    } catch (error: any) {
      alert("Error al guardar reunión: " + error.message);
    }
  };

  const handleDeleteMeeting = async (meetingId: string) => {
    try {
      await meetingsAPI.delete(Number(meetingId));
      setMeetings(prev => prev.filter(m => m.id !== meetingId));
    } catch (error: any) {
      alert("Error al eliminar reunión: " + error.message);
    }
  };

  const handleSaveLead = async (lead: Lead) => {
    const existingLead = leads.find(l => l.id === lead.id);
    
    try {
      const leadData = {
        etapa: lead.etapa,
        assignedUserId: lead.assignedUserId ? Number(lead.assignedUserId) : null,
        isConverted: lead.isConverted,
        nombreEmpresa: lead.nombre_empresa,
        nombreContacto: lead.nombre_contacto,
        sector: lead.sector,
        ciudad: lead.ciudad,
        telefono: lead.telefono,
        email: lead.email,
        emailSecundario: lead.email_secundario,
        web: lead.web,
        fuenteOrigen: lead.fuente_origen,
        servicioInteres: lead.servicio_interes,
        necesidad: lead.necesidad,
        fechaEnvioPropuesta: lead.fecha_envio_propuesta,
        valorImplementacion: lead.valor_implementacion,
        valorMensualidad: lead.valor_mensualidad,
        fechaPrimerContacto: lead.fecha_primer_contacto,
        comentarios: lead.comentarios,
        resultadoFinal: lead.resultado_final,
        fechaCierreReal: lead.fecha_cierre_real,
        hitos: lead.hitos,
        coverUrl: lead.coverUrl,
        coverPosition: lead.coverPosition
      };

      if (existingLead) {
        const updated = await leadsAPI.update(Number(lead.id), leadData);
        setLeads(prev => prev.map(l => l.id === lead.id ? {
          ...updated,
          id: String(updated.id),
          assignedUserId: updated.assignedUserId ? String(updated.assignedUserId) : undefined,
          nombre_empresa: updated.nombreEmpresa,
          nombre_contacto: updated.nombreContacto,
          email_secundario: updated.emailSecundario,
          fuente_origen: updated.fuenteOrigen,
          servicio_interes: updated.servicioInteres,
          fecha_envio_propuesta: updated.fechaEnvioPropuesta,
          valor_implementacion: updated.valorImplementacion,
          valor_mensualidad: updated.valorMensualidad,
          fecha_primer_contacto: updated.fechaPrimerContacto,
          resultado_final: updated.resultadoFinal,
          fecha_cierre_real: updated.fechaCierreReal
        } : l));
      } else {
        const created = await leadsAPI.create(leadData);
        setLeads(prev => [...prev, {
          ...created,
          id: String(created.id),
          assignedUserId: created.assignedUserId ? String(created.assignedUserId) : undefined,
          nombre_empresa: created.nombreEmpresa,
          nombre_contacto: created.nombreContacto,
          email_secundario: created.emailSecundario,
          fuente_origen: created.fuenteOrigen,
          servicio_interes: created.servicioInteres,
          fecha_envio_propuesta: created.fechaEnvioPropuesta,
          valor_implementacion: created.valorImplementacion,
          valor_mensualidad: created.valorMensualidad,
          fecha_primer_contacto: created.fechaPrimerContacto,
          resultado_final: created.resultadoFinal,
          fecha_cierre_real: created.fechaCierreReal
        }]);
      }
    } catch (error: any) {
      alert("Error al guardar lead: " + error.message);
    }
  };

  const handleDeleteLead = async (leadId: string) => {
    try {
      await leadsAPI.delete(Number(leadId));
      setLeads(prev => prev.filter(l => l.id !== leadId));
    } catch (error: any) {
      alert("Error al eliminar lead: " + error.message);
    }
  };

  const handleSaveActiveClient = async (client: ActiveClient) => {
    const existingClient = activeClients.find(c => c.activeId === client.activeId);
    
    try {
      const clientData = {
        leadId: client.leadId ? Number(client.leadId) : null,
        estadoServicio: client.estado_servicio,
        fechaInicioServicio: client.fecha_inicio_servicio,
        fechaCorte: client.fecha_corte,
        pagoMesActual: client.pago_mes_actual,
        valorMensualServicio: client.valor_mensual_servicio,
        coverUrl: client.coverUrl,
        coverPosition: client.coverPosition
      };

      if (existingClient) {
        const updated = await activeClientsAPI.update(Number(client.activeId), clientData);
        setActiveClients(prev => prev.map(c => c.activeId === client.activeId ? {
          ...client,
          ...updated,
          id: String(updated.id),
          activeId: String(updated.id)
        } : c));
      } else {
        const created = await activeClientsAPI.create(clientData);
        setActiveClients(prev => [...prev, {
          ...client,
          id: String(created.id),
          activeId: String(created.id)
        }]);
      }
    } catch (error: any) {
      alert("Error al guardar cliente activo: " + error.message);
    }
  };

  const handleDeleteActiveClient = async (clientId: string) => {
    try {
      await activeClientsAPI.delete(Number(clientId));
      setActiveClients(prev => prev.filter(c => c.activeId !== clientId));
    } catch (error: any) {
      alert("Error al eliminar cliente activo: " + error.message);
    }
  };

  const handleSaveBotVersion = async (version: BotVersion) => {
    const existingVersion = botVersions.find(v => v.id === version.id);
    
    try {
      if (existingVersion) {
        const updated = await botVersionsAPI.update(Number(version.id), {
          type: version.type,
          name: version.name,
          date: version.date,
          notes: version.notes,
          coverUrl: version.coverUrl,
          coverPosition: version.coverPosition
        });
        setBotVersions(prev => prev.map(v => v.id === version.id ? {
          ...updated,
          id: String(updated.id)
        } : v));
      } else {
        const created = await botVersionsAPI.create({
          type: version.type,
          name: version.name,
          date: version.date,
          notes: version.notes,
          coverUrl: version.coverUrl,
          coverPosition: version.coverPosition
        });
        setBotVersions(prev => [...prev, {
          ...created,
          id: String(created.id)
        }]);
      }
    } catch (error: any) {
      alert("Error al guardar versión de bot: " + error.message);
    }
  };

  const handleDeleteBotVersion = async (versionId: string) => {
    try {
      await botVersionsAPI.delete(Number(versionId));
      setBotVersions(prev => prev.filter(v => v.id !== versionId));
    } catch (error: any) {
      alert("Error al eliminar versión de bot: " + error.message);
    }
  };

  const handleSaveTutorial = async (tutorial: Tutorial) => {
    const existingTutorial = tutorials.find(t => t.id === tutorial.id);
    
    try {
      if (existingTutorial) {
        const updated = await tutorialsAPI.update(Number(tutorial.id), {
          title: tutorial.title,
          date: tutorial.date,
          description: tutorial.description,
          link: tutorial.link,
          media: tutorial.media,
          steps: tutorial.steps,
          coverUrl: tutorial.coverUrl,
          coverPosition: tutorial.coverPosition
        });
        const updatedTutorial = {
          ...updated,
          id: String(updated.id)
        };
        setTutorials(prev => prev.map(t => t.id === tutorial.id ? updatedTutorial : t));
        if (selectedTutorial?.id === tutorial.id) {
          setSelectedTutorial(updatedTutorial);
        }
      } else {
        const created = await tutorialsAPI.create({
          title: tutorial.title,
          date: tutorial.date,
          description: tutorial.description,
          link: tutorial.link,
          media: tutorial.media,
          steps: tutorial.steps,
          coverUrl: tutorial.coverUrl,
          coverPosition: tutorial.coverPosition
        });
        setTutorials(prev => [...prev, {
          ...created,
          id: String(created.id)
        }]);
      }
    } catch (error: any) {
      alert("Error al guardar tutorial: " + error.message);
    }
  };

  const handleDeleteTutorial = async (tutorialId: string) => {
    try {
      await tutorialsAPI.delete(Number(tutorialId));
      setTutorials(prev => prev.filter(t => t.id !== tutorialId));
    } catch (error: any) {
      alert("Error al eliminar tutorial: " + error.message);
    }
  };

  const handleSaveDemo = async (demo: Demo) => {
    const existingDemo = demos.find(d => d.id === demo.id);
    
    try {
      if (existingDemo) {
        const updated = await demosAPI.update(Number(demo.id), {
          number: demo.number,
          name: demo.name,
          client: demo.client,
          url: demo.url
        });
        setDemos(prev => prev.map(d => d.id === demo.id ? {
          ...updated,
          id: String(updated.id)
        } : d));
      } else {
        const created = await demosAPI.create({
          number: demo.number,
          name: demo.name,
          client: demo.client,
          url: demo.url
        });
        setDemos(prev => [...prev, {
          ...created,
          id: String(created.id)
        }]);
      }
    } catch (error: any) {
      alert("Error al guardar demo: " + error.message);
    }
  };

  const handleDeleteDemo = async (demoId: string) => {
    try {
      await demosAPI.delete(Number(demoId));
      setDemos(prev => prev.filter(d => d.id !== demoId));
    } catch (error: any) {
      alert("Error al eliminar demo: " + error.message);
    }
  };

  const handleSaveDroppedClient = async (client: DroppedClient) => {
    try {
      const created = await droppedClientsAPI.create({
        name: client.name,
        email: (client.originalData as any)?.email,
        telefono: (client.originalData as any)?.telefono,
        sector: (client.originalData as any)?.sector,
        ciudad: (client.originalData as any)?.ciudad,
        razonAbandono: client.reason,
        fechaFin: client.droppedDate
      });
      setDroppedClients(prev => [...prev, {
        ...client,
        id: String(created.id)
      }]);
    } catch (error: any) {
      alert("Error al guardar cliente abandonado: " + error.message);
    }
  };

  const handleDeleteDroppedClient = async (clientId: string) => {
    try {
      await droppedClientsAPI.delete(Number(clientId));
      setDroppedClients(prev => prev.filter(c => c.id !== clientId));
    } catch (error: any) {
      alert("Error al eliminar registro: " + error.message);
    }
  };

  const handleRecoverClient = async (client: DroppedClient) => {
    try {
      if (client.type === 'active' && client.originalData) {
        const originalClient = client.originalData as ActiveClient;
        const created = await activeClientsAPI.create({
          leadId: originalClient.leadId ? Number(originalClient.leadId) : undefined,
          estadoServicio: originalClient.estado_servicio,
          fechaInicioServicio: originalClient.fecha_inicio_servicio,
          fechaCorte: originalClient.fecha_corte,
          pagoMesActual: originalClient.pago_mes_actual,
          valorMensualServicio: originalClient.valor_mensual_servicio
        });
        setActiveClients(prev => [...prev, {
          ...originalClient,
          activeId: String(created.id)
        }]);
      } else if (client.type === 'lead' && client.originalData) {
        const originalLead = client.originalData as Lead;
        const created = await leadsAPI.create({
          etapa: originalLead.etapa,
          assignedUserId: originalLead.assignedUserId ? Number(originalLead.assignedUserId) : undefined,
          nombreEmpresa: originalLead.nombre_empresa,
          nombreContacto: originalLead.nombre_contacto,
          sector: originalLead.sector,
          ciudad: originalLead.ciudad,
          telefono: originalLead.telefono,
          email: originalLead.email,
          emailSecundario: originalLead.email_secundario,
          web: originalLead.web,
          fuenteOrigen: originalLead.fuente_origen,
          servicioInteres: originalLead.servicio_interes,
          necesidad: originalLead.necesidad,
          fechaEnvioPropuesta: originalLead.fecha_envio_propuesta,
          valorImplementacion: originalLead.valor_implementacion,
          valorMensualidad: originalLead.valor_mensualidad,
          fechaPrimerContacto: originalLead.fecha_primer_contacto,
          comentarios: originalLead.comentarios,
          resultadoFinal: originalLead.resultado_final,
          fechaCierreReal: originalLead.fecha_cierre_real,
          hitos: originalLead.hitos
        });
        setLeads(prev => [...prev, {
          ...originalLead,
          id: String(created.id)
        }]);
      }
      
      await droppedClientsAPI.delete(Number(client.id));
      setDroppedClients(prev => prev.filter(c => c.id !== client.id));
    } catch (error: any) {
      alert("Error al recuperar cliente: " + error.message);
    }
  };

  const handleSaveBotListCover = (type: string, coverUrl: string) => {
    setBotListCovers(prev => ({ ...prev, [type]: coverUrl }));
  };

  const handleOpenEditProfile = (user: User) => {
    setUserToEdit(user);
    setIsEditProfileOpen(true);
  };

  const handleViewUserProfile = (user: User, tab: 'tasks' | 'meetings' | 'clients' = 'tasks') => {
    setProfileViewUser(user);
    setProfileViewTab(tab);
    setCurrentView('user-profile');
  };

  const handleCloseUserProfile = () => {
    setProfileViewUser(null);
    setCurrentView('team');
  };

  const renderContent = () => {
    const validUsers = users.filter(u => !u.isDeleted);
    const validTasks = tasks.filter(t => !t.isDeleted);
    const validMeetings = meetings.filter(m => !m.isDeleted);
    const validActiveClients = activeClients.filter(c => !c.isDeleted);
    const validLeads = leads.filter(l => !l.isDeleted && !l.isConverted);
    const validBotVersions = botVersions.filter(v => !v.isDeleted);
    const validTutorials = tutorials.filter(t => !t.isDeleted);
    const validDemos = demos.filter(d => !d.isDeleted);

    if (showForceChangePassword) {
      return (
        <div className="flex items-center justify-center h-full">
          <ChangePasswordModal isOpen={true} onClose={() => {}} onSave={handleForcePasswordChange} />
        </div>
      );
    }

    switch (currentView) {
      case 'dashboard':
        return (
          <DashboardHome 
            user={currentUser!}
            users={validUsers}
            tasks={validTasks} 
            meetings={validMeetings}
            demos={validDemos}
            leads={validLeads}
            activeClients={validActiveClients}
            onSaveDemo={handleSaveDemo}
            onDeleteDemo={handleDeleteDemo}
            onSaveTask={handleSaveTask}
            onDeleteTask={handleDeleteTask}
          />
        );
      case 'team':
        return (
          <TeamView 
            users={validUsers} 
            currentUser={currentUser!} 
            onEditUser={handleOpenEditProfile}
            onViewUserProfile={(user) => handleViewUserProfile(user, 'tasks')}
          />
        );
      case 'user-profile':
        if (!profileViewUser) return null;
        return (
          <UserProfilePage
            user={profileViewUser}
            currentUser={currentUser!}
            allUsers={validUsers}
            tasks={validTasks}
            meetings={validMeetings}
            activeClients={validActiveClients}
            leads={validLeads}
            initialTab={profileViewTab}
            onBack={handleCloseUserProfile}
            onEditProfile={handleOpenEditProfile}
            onSaveTask={handleSaveTask}
            onDeleteTask={handleDeleteTask}
            onSaveMeeting={handleSaveMeeting}
            onDeleteMeeting={handleDeleteMeeting}
          />
        );
      case 'clients-process':
        return (
          <LeadBoard 
            user={currentUser!} 
            users={validUsers}
            leads={validLeads}
            onSaveLead={handleSaveLead}
            onDeleteLead={handleDeleteLead}
            onConvertToActiveClient={handleSaveActiveClient}
          />
        );
      case 'clients-general':
        return (
          <ClientsDashboard 
            users={validUsers}
            currentUser={currentUser || undefined}
            activeClients={validActiveClients}
            leads={validLeads}
            droppedClients={droppedClients}
            onSaveActiveClient={handleSaveActiveClient}
            onDeleteActiveClient={handleDeleteActiveClient}
            onSaveLead={handleSaveLead}
            onDeleteLead={handleDeleteLead}
            onSaveDroppedClient={handleSaveDroppedClient}
            onDeleteDroppedClient={handleDeleteDroppedClient}
            onRecoverClient={handleRecoverClient}
          />
        );
      case 'clients-active':
        return (
          <ActiveClientsBoard 
            user={currentUser!} 
            users={validUsers}
            activeClients={validActiveClients}
            leads={validLeads}
            droppedClients={droppedClients}
            onSaveActiveClient={handleSaveActiveClient}
            onDeleteActiveClient={handleDeleteActiveClient}
            onSaveDroppedClient={handleSaveDroppedClient}
          />
        );
      case 'tasks':
        return (
          <TaskBoard 
            user={currentUser!} 
            users={validUsers}
            tasks={validTasks}
            leads={validLeads}
            activeClients={validActiveClients}
            onSaveTask={handleSaveTask}
            onDeleteTask={handleDeleteTask}
          />
        );
      case 'meetings':
        return (
          <MeetingsView 
            user={currentUser!} 
            users={validUsers}
            meetings={validMeetings}
            leads={validLeads}
            activeClients={validActiveClients}
            onSaveMeeting={handleSaveMeeting}
            onDeleteMeeting={handleDeleteMeeting}
          />
        );
      case 'bot-versions':
        return (
          <BotVersionsView 
            user={currentUser!}
            botVersions={validBotVersions}
            botListCovers={botListCovers}
            onSaveBotVersion={handleSaveBotVersion}
            onDeleteBotVersion={handleDeleteBotVersion}
            onSaveBotListCover={handleSaveBotListCover}
          />
        );
      case 'tutorials':
        if (selectedTutorial && isEditingTutorial) {
          return (
            <TutorialEditPage
              tutorial={selectedTutorial}
              currentUser={currentUser || undefined}
              onBack={() => {
                setIsEditingTutorial(false);
              }}
              onSave={(tutorial) => {
                handleSaveTutorial(tutorial);
                setIsEditingTutorial(false);
              }}
              onDelete={(id) => {
                handleDeleteTutorial(id);
                setSelectedTutorial(null);
                setIsEditingTutorial(false);
              }}
            />
          );
        }
        if (selectedTutorial) {
          return (
            <TutorialPage
              tutorial={selectedTutorial}
              currentUser={currentUser || undefined}
              onBack={() => setSelectedTutorial(null)}
              onEdit={() => setIsEditingTutorial(true)}
            />
          );
        }
        return (
          <TutorialsView 
            tutorials={validTutorials}
            currentUser={currentUser || undefined}
            onSaveTutorial={handleSaveTutorial}
            onDeleteTutorial={handleDeleteTutorial}
            onViewTutorial={(tutorial) => setSelectedTutorial(tutorial)}
          />
        );
      case 'forgot-password':
        return <ForgotPasswordScreen onBack={() => setCurrentView('login')} />;
      case 'reset-password':
        return <ResetPasswordScreen onBack={() => setCurrentView('login')} />;
      default:
        return (
          <DashboardHome 
            user={currentUser!}
            users={validUsers}
            tasks={validTasks} 
            meetings={validMeetings}
            demos={validDemos}
            leads={validLeads}
            activeClients={validActiveClients}
            onSaveDemo={handleSaveDemo}
            onDeleteDemo={handleDeleteDemo}
            onSaveTask={handleSaveTask}
            onDeleteTask={handleDeleteTask}
          />
        );
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen w-full bg-night flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-electric mx-auto mb-4"></div>
          <p className="text-mist">Cargando...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen w-full bg-night text-mist font-montserrat transition-colors duration-300">
      {!isAuthenticated && currentView !== 'forgot-password' && currentView !== 'reset-password' ? (
        <LoginScreen 
          onLogin={handleLogin} 
          onForgotPassword={() => setCurrentView('forgot-password')} 
          authError={authError}
        />
      ) : !isAuthenticated ? (
        renderContent()
      ) : (
        <DashboardLayout 
          user={currentUser!} 
          onLogout={handleLogout}
          currentTheme={theme}
          onToggleTheme={() => setTheme(prev => prev === 'dark' ? 'light' : 'dark')}
          onNavigate={setCurrentView}
          currentView={currentView}
          onEditProfile={() => handleOpenEditProfile(currentUser!)}
          onViewMyTasks={() => handleViewUserProfile(currentUser!, 'tasks')}
          onViewMyMeetings={() => handleViewUserProfile(currentUser!, 'meetings')}
          notifications={notifications}
          onMarkNotificationRead={handleMarkNotificationRead}
        >
          {renderContent()}
        </DashboardLayout>
      )}

      <UserEditModal 
        isOpen={isEditProfileOpen}
        onClose={() => setIsEditProfileOpen(false)}
        currentUser={currentUser!}
        userToEdit={userToEdit}
        onSave={(u) => {
          if ('tempPassword' in u) handleCreateUser(u as any);
          else handleSaveUser(u);
        }}
        onDelete={handleDeleteUser}
      />
    </div>
  );
};

export default App;
