
import React, { useState } from 'react';
import { User, Task, MeetingEvent, Demo, TaskStatus, TaskPriority, Lead, ActiveClient } from '../types';
import { Clock, Users, Plus, Edit2, Bot, X, Building2, Calendar, AlertTriangle, User as UserIcon, ListChecks } from 'lucide-react';
import TaskViewModal from './TaskViewModal';
import TaskModal from './TaskModal';

interface DashboardHomeProps {
  user: User;
  users: User[];
  tasks: Task[];
  meetings: MeetingEvent[];
  demos: Demo[];
  leads?: Lead[];
  activeClients?: ActiveClient[];
  onSaveDemo: (demo: Demo) => void;
  onDeleteDemo: (demoId: string) => void;
  onSaveTask: (task: Task) => void;
  onDeleteTask: (taskId: string) => void;
}

const shortcuts = [
  { id: '1', label: 'API', iconType: 'api', url: 'https://api.aiclon.io', imageUrl: '/images/logos faltantes/ISOTIPO BLANCO.png' },
  { id: '2', label: 'Replit', iconType: 'code', url: 'https://replit.com', imageUrl: 'https://www.google.com/s2/favicons?domain=replit.com&sz=128' },
  { id: '3', label: 'Admin Chats', iconType: 'chat', url: 'https://api.aiclon.io', imageUrl: '/images/logos faltantes/ISOTIPO CELESTE.png' },
  { id: '4', label: 'Coolify', iconType: 'cloud', url: 'https://app.coolify.io', imageUrl: 'https://www.google.com/s2/favicons?domain=coolify.io&sz=128' },
  { id: '5', label: 'Evolution', iconType: 'bot', url: 'http://3.83.151.37:8080/manager', imageUrl: '/images/logos faltantes/evolution-logo.png' },
  { id: '6', label: 'Appwrite', iconType: 'db', url: 'https://appwrite.aiclon.io/console/organization-aiclon', imageUrl: 'https://www.google.com/s2/favicons?domain=appwrite.io&sz=128' },
  { id: '7', label: 'Open Router', iconType: 'network', url: 'https://openrouter.ai', imageUrl: 'https://www.google.com/s2/favicons?domain=openrouter.ai&sz=128' },
  { id: '8', label: 'ElevenLabs', iconType: 'audio', url: 'https://elevenlabs.io', imageUrl: '/images/logos faltantes/eleven-labs-ai-logo.png' },
  { id: '9', label: 'Chat GPT', iconType: 'ai', url: 'https://chatgpt.com', imageUrl: '/images/logos faltantes/gpt-logo.png' },
  { id: '10', label: 'Gemini', iconType: 'ai', url: 'https://gemini.google.com', imageUrl: 'https://www.google.com/s2/favicons?domain=gemini.google.com&sz=128' },
];

const DashboardHome: React.FC<DashboardHomeProps> = ({ user, users = [], tasks = [], meetings = [], demos = [], leads = [], activeClients = [], onSaveDemo, onDeleteDemo, onSaveTask, onDeleteTask }) => {
  const toLocalDateString = (d: Date) => {
    return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`;
  };
  const today = toLocalDateString(new Date());
  
  const myTasksToday = tasks.filter(t => 
    !t.isDeleted &&
    t.assigneeIds?.includes(user.id) &&
    t.deadline === today &&
    t.status !== TaskStatus.Completed
  );

  const myMeetingsToday = meetings.filter(m => 
    !m.isDeleted &&
    m.attendeeIds.includes(user.id) &&
    m.date === today
  ).sort((a, b) => a.startTime.localeCompare(b.startTime));

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isDeleteConfirmOpen, setIsDeleteConfirmOpen] = useState(false);
  const [currentDemo, setCurrentDemo] = useState<Partial<Demo>>({});
  const [isEditing, setIsEditing] = useState(false);

  const [selectedTask, setSelectedTask] = useState<Task | null>(null);
  const [isViewModalOpen, setIsViewModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);

  const clients = React.useMemo(() => {
    const clientNames = new Set<string>();
    leads.forEach(l => { if (l.nombre_empresa) clientNames.add(l.nombre_empresa); });
    activeClients.forEach(c => { if (c.nombre_empresa) clientNames.add(c.nombre_empresa); });
    tasks.forEach(t => { if (t.clientName) clientNames.add(t.clientName); });
    return Array.from(clientNames).sort();
  }, [leads, activeClients, tasks]);

  const openViewModal = (task: Task) => {
    setSelectedTask(task);
    setIsViewModalOpen(true);
  };

  const openEditFromView = () => {
    setIsViewModalOpen(false);
    setIsEditModalOpen(true);
  };

  const handleSubtaskToggle = (taskId: string, subtaskId: string, completed: boolean) => {
    const task = tasks.find(t => t.id === taskId);
    if (!task) return;
    
    const updatedSubtasks = (task.subtasks || []).map(s => 
      s.id === subtaskId ? { ...s, completed } : s
    );
    
    const updatedTask = { ...task, subtasks: updatedSubtasks };
    onSaveTask(updatedTask);
    setSelectedTask(updatedTask);
  };

  const handleSaveTask = (task: Task) => {
    onSaveTask(task);
    setIsEditModalOpen(false);
    setIsViewModalOpen(false);
    setSelectedTask(null);
  };

  const handleDeleteTask = (taskId: string) => {
    onDeleteTask(taskId);
    setIsEditModalOpen(false);
    setIsViewModalOpen(false);
    setSelectedTask(null);
  };

  const getPriorityColor = (p: TaskPriority) => {
    switch (p) {
      case TaskPriority.Urgent: return 'text-red-500 bg-red-500/10 border-red-500/30';
      case TaskPriority.High: return 'text-neon-orange bg-neon-orange/10 border-neon-orange/30';
      case TaskPriority.Medium: return 'text-yellow-400 bg-yellow-400/10 border-yellow-400/30';
      case TaskPriority.Low: return 'text-blue-400 bg-blue-400/10 border-blue-400/30';
      default: return 'text-mist-muted';
    }
  };

  const handleOpenNewDemo = () => { 
    setCurrentDemo({ name: '', number: '', client: '', url: '' }); 
    setIsEditing(false); 
    setIsModalOpen(true); 
  };
  
  const handleOpenEditDemo = (demo: Demo) => { 
    setCurrentDemo({ ...demo }); 
    setIsEditing(true); 
    setIsModalOpen(true); 
  };
  
  const handleSaveDemo = (e: React.FormEvent) => {
    e.preventDefault();
    if (isEditing && currentDemo.id) { 
      onSaveDemo(currentDemo as Demo); 
    } else { 
      onSaveDemo({ ...currentDemo, id: Date.now().toString() } as Demo); 
    }
    setIsModalOpen(false);
  };
  
  const handleConfirmDelete = () => { 
    if (currentDemo.id) { 
      onDeleteDemo(currentDemo.id); 
      setIsDeleteConfirmOpen(false); 
      setIsModalOpen(false); 
    } 
  };

  const validDemos = demos.filter(d => !d.isDeleted);
  const isAdmin = user?.role === 'admin';

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 pb-8">
      <div className="bg-surface-low border border-border-subtle rounded-2xl p-8 flex flex-col items-center text-center shadow-lg relative overflow-hidden group">
        <div className="absolute top-0 right-0 w-64 h-64 bg-neon/5 rounded-full blur-3xl -mr-16 -mt-16 pointer-events-none group-hover:bg-neon/10 transition-colors duration-500"></div>
        <div className="relative z-10 w-full mb-8">
          <h2 className="text-5xl md:text-7xl font-designer text-mist mb-4 tracking-wide">Bienvenido, {user.name.split(' ')[0]}</h2>
          <p className="text-mist-muted text-xl">
            Hoy tienes <span className="text-neon font-bold">{myTasksToday.length} tareas</span> y <span className="text-neon-orange font-bold">{myMeetingsToday.length} reuniones</span> pendientes.
          </p>
        </div>
        <img src={user.avatarUrl} alt={user.name} className="w-48 h-48 md:w-64 md:h-64 rounded-full border-4 border-neon/50 p-1 shadow-[0_0_40px_rgba(0,200,255,0.4)] object-cover transform group-hover:scale-105 transition-transform duration-500"/>
      </div>

      <div className="bg-surface-low border border-border-subtle rounded-2xl p-6 flex flex-col shadow-lg h-full">
        <div className="flex justify-between items-center mb-6">
          <h3 className="text-3xl font-designer text-mist flex items-center pt-1"><Clock size={28} className="text-neon mr-3" /> Diarias</h3>
        </div>
        <div className="flex-1 grid grid-cols-1 sm:grid-cols-2 gap-6">
          <div className="space-y-4">
            <h4 className="text-sm font-bold uppercase text-mist-muted tracking-wider mb-2 border-b border-border-subtle pb-2">Tareas para Hoy</h4>
            {myTasksToday.length === 0 ? <p className="text-xs text-mist-faint italic">Todo al día.</p> : myTasksToday.map(task => {
              const subtasks = task.subtasks || [];
              const completedSubtasks = subtasks.filter(s => s.completed).length;
              const totalSubtasks = subtasks.length;
              const progressPercent = totalSubtasks > 0 ? Math.round((completedSubtasks / totalSubtasks) * 100) : 0;
              
              return (
                <div 
                  key={task.id} 
                  onClick={() => openViewModal(task)}
                  className="p-4 rounded-lg bg-surface-low border border-border-subtle hover:border-neon/30 transition-colors cursor-pointer"
                >
                  <div className="flex justify-between items-start mb-2"><span className="text-base font-medium text-mist truncate pr-2">{task.title}</span></div>
                  
                  {totalSubtasks > 0 && (
                    <div className="mb-2 space-y-1">
                      <div className="flex items-center justify-between text-[10px] text-mist-muted">
                        <span className="flex items-center gap-1">
                          <ListChecks size={10} />
                          {completedSubtasks}/{totalSubtasks}
                        </span>
                        <span>{progressPercent}%</span>
                      </div>
                      <div className="w-full bg-night rounded-full h-1.5 overflow-hidden">
                        <div 
                          className="h-full bg-gradient-to-r from-neon to-neon-blue transition-all duration-300"
                          style={{ width: `${progressPercent}%` }}
                        />
                      </div>
                    </div>
                  )}
                  
                  <div className="flex justify-between items-center"><p className="text-xs text-mist-muted font-semibold">{task.clientName}</p><span className="text-[10px] px-2 py-1 rounded bg-neon-blue/20 text-mist-muted whitespace-nowrap border border-neon-blue/20">{task.deadline}</span></div>
                </div>
              );
            })}
          </div>
          <div className="space-y-4 relative sm:border-l sm:border-border-subtle sm:pl-6">
            <h4 className="text-sm font-bold uppercase text-mist-muted tracking-wider mb-2 border-b border-border-subtle pb-2">Agenda Hoy</h4>
            {myMeetingsToday.length === 0 ? <p className="text-xs text-mist-faint italic">Sin reuniones.</p> : myMeetingsToday.map(meeting => (
              <div key={meeting.id} className="flex items-start space-x-4 p-3 rounded-lg hover:bg-white/5 transition-colors">
                <div className="text-center min-w-[3.5rem] bg-surface-low rounded p-1 border border-border-subtle">
                  <span className="block text-base font-bold text-neon">{meeting.startTime}</span>
                </div>
                <div className="pt-1">
                  <p className="text-base font-medium text-mist">{meeting.title}</p>
                  <p className="text-xs text-mist-muted mt-0.5 flex items-center"><Users size={12} className="mr-1"/> {meeting.attendeeIds.length} inv.</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      <div className="lg:col-span-2">
        <h3 className="text-xl font-montserrat font-bold text-mist mb-4 ml-1 border-l-4 border-neon pl-3">Atajos Rápidos</h3>
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
          {shortcuts.map(link => (
            <a key={link.id} href={link.url} target="_blank" rel="noopener noreferrer" className="flex flex-col items-center justify-center p-4 rounded-xl bg-surface-low border border-border-subtle hover:bg-surface-med hover:border-neon hover:shadow-neon-glow transition-all duration-300 group h-32">
              <div className="p-3 rounded-full bg-night border border-border-subtle group-hover:bg-neon/10 group-hover:border-neon mb-3 transition-colors relative overflow-hidden w-12 h-12 flex items-center justify-center">
                {link.imageUrl ? <img src={link.imageUrl} alt={link.label} className="w-full h-full object-contain" /> : <span>ICON</span>}
              </div>
              <span className="text-sm font-medium text-mist group-hover:text-neon text-center">{link.label}</span>
            </a>
          ))}
        </div>
      </div>

      <div className="lg:col-span-2 bg-surface-low border border-border-subtle rounded-2xl overflow-hidden shadow-depth">
        <div className="p-6 border-b border-border-subtle flex justify-between items-center bg-night/30">
          <h3 className="text-3xl font-designer text-mist pt-1">Demos Activas</h3>
          {isAdmin && (
            <button onClick={handleOpenNewDemo} className="text-xs font-bold text-neon-orange border border-neon-orange/30 px-4 py-2 rounded hover:bg-neon-orange/10 transition-colors uppercase tracking-wide flex items-center"><Plus size={16} className="mr-1" /> Nueva Demo</button>
          )}
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead><tr className="border-b border-border-subtle bg-night/50"><th className="p-4 text-xs font-semibold text-mist-muted uppercase">Demo</th><th className="p-4 text-xs font-semibold text-mist-muted uppercase">Nombre</th><th className="p-4 text-xs font-semibold text-mist-muted uppercase">Cliente</th><th className="p-4 text-xs font-semibold text-mist-muted uppercase">URL</th>{isAdmin && <th className="p-4 text-center">Editar</th>}</tr></thead>
            <tbody className="divide-y divide-border-subtle">
              {validDemos.map((demo) => (
                <tr key={demo.id} className="hover:bg-surface-med transition-colors">
                  <td className="p-4 text-center"><Bot size={16} className="text-neon mx-auto" /></td>
                  <td className="p-4 text-sm font-bold text-mist">{demo.name}</td>
                  <td className="p-4 text-sm text-mist">{demo.client}</td>
                  <td className="p-4 text-sm text-neon font-mono">{demo.url}</td>
                  {isAdmin && <td className="p-4 text-center"><button onClick={() => handleOpenEditDemo(demo)} className="p-2 text-mist-muted hover:text-neon"><Edit2 size={16}/></button></td>}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
      
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm">
          <div className="bg-night border border-border-subtle rounded-xl w-full max-w-md p-6">
            <h3 className="text-xl text-mist mb-4">{isEditing ? 'Editar Demo' : 'Nueva Demo'}</h3>
            <input className="w-full bg-surface-low border border-border-subtle p-2 rounded mb-2 text-mist" placeholder="Nombre" value={currentDemo.name || ''} onChange={e=>setCurrentDemo({...currentDemo, name: e.target.value})} />
            <input className="w-full bg-surface-low border border-border-subtle p-2 rounded mb-2 text-mist" placeholder="Cliente" value={currentDemo.client || ''} onChange={e=>setCurrentDemo({...currentDemo, client: e.target.value})} />
            <input className="w-full bg-surface-low border border-border-subtle p-2 rounded mb-4 text-mist" placeholder="URL" value={currentDemo.url || ''} onChange={e=>setCurrentDemo({...currentDemo, url: e.target.value})} />
            <div className="flex justify-end space-x-2">
              <button onClick={() => setIsModalOpen(false)} className="px-4 py-2 text-mist-muted">Cancelar</button>
              {isEditing && <button onClick={() => setIsDeleteConfirmOpen(true)} className="px-4 py-2 text-neon-orange border border-neon-orange rounded">Eliminar</button>}
              <button onClick={handleSaveDemo} className="px-4 py-2 bg-neon text-night font-bold rounded">Guardar</button>
            </div>
          </div>
        </div>
      )}
      
      {isDeleteConfirmOpen && (
        <div className="fixed inset-0 z-[60] flex items-center justify-center bg-black/90">
          <div className="bg-night border border-neon-orange p-6 rounded-xl text-center">
            <p className="text-mist mb-4">¿Eliminar definitivamente?</p>
            <button onClick={handleConfirmDelete} className="bg-neon-orange text-white px-4 py-2 rounded font-bold">Sí, Eliminar</button>
            <button onClick={() => setIsDeleteConfirmOpen(false)} className="ml-2 text-mist">Cancelar</button>
          </div>
        </div>
      )}

      {selectedTask && (
        <TaskViewModal 
          isOpen={isViewModalOpen}
          onClose={() => {
            setIsViewModalOpen(false);
            setSelectedTask(null);
          }}
          task={selectedTask}
          users={users}
          onEdit={openEditFromView}
          onSubtaskToggle={handleSubtaskToggle}
        />
      )}

      <TaskModal 
        isOpen={isEditModalOpen}
        onClose={() => {
          setIsEditModalOpen(false);
          setSelectedTask(null);
        }}
        onSave={handleSaveTask}
        onDelete={handleDeleteTask}
        taskToEdit={selectedTask}
        users={users}
        clients={clients}
      />
    </div>
  );
};

export default DashboardHome;
