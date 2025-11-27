
import React, { useState, useRef, useMemo } from 'react';
import { User, Task, MeetingEvent, ActiveClient, Lead, TaskStatus, TaskPriority } from '../types';
import TaskModal from './TaskModal';
import TaskViewModal from './TaskViewModal';
import MeetingModal from './MeetingModal';
import { 
  ArrowLeft, CheckSquare, Calendar, Building2, Plus, GripVertical, Clock, 
  User as UserIcon, ListChecks, ChevronLeft, ChevronRight, ExternalLink, 
  Users, Mail, Shield, Phone, Globe, MapPin
} from 'lucide-react';

type ProfileTab = 'tasks' | 'meetings' | 'clients';

interface UserProfilePageProps {
  user: User;
  currentUser: User;
  allUsers: User[];
  tasks: Task[];
  meetings: MeetingEvent[];
  activeClients: ActiveClient[];
  leads?: Lead[];
  initialTab?: ProfileTab;
  onBack: () => void;
  onEditProfile: (user: User) => void;
  onSaveTask: (task: Task) => void;
  onDeleteTask: (taskId: string) => void;
  onSaveMeeting: (meeting: MeetingEvent) => void;
  onDeleteMeeting: (meetingId: string) => void;
}

const UserProfilePage: React.FC<UserProfilePageProps> = ({
  user,
  currentUser,
  allUsers,
  tasks,
  meetings,
  activeClients,
  leads = [],
  initialTab = 'tasks',
  onBack,
  onEditProfile,
  onSaveTask,
  onDeleteTask,
  onSaveMeeting,
  onDeleteMeeting
}) => {
  const [activeTab, setActiveTab] = useState<ProfileTab>(initialTab);

  const userTasks = tasks.filter(t => t.assigneeIds?.includes(user.id) && !t.isDeleted);
  const userMeetings = meetings.filter(m => m.attendeeIds.includes(user.id) && !m.isDeleted);
  const userClients = activeClients.filter(c => c.assignedUserId === user.id && !c.isDeleted);

  const isMe = user.id === currentUser.id;

  const tabs: { id: ProfileTab; label: string; icon: React.ReactNode; count: number }[] = [
    { id: 'tasks', label: 'Tareas', icon: <CheckSquare size={18} />, count: userTasks.length },
    { id: 'meetings', label: 'Reuniones', icon: <Calendar size={18} />, count: userMeetings.length },
    { id: 'clients', label: 'Clientes', icon: <Building2 size={18} />, count: userClients.length }
  ];

  return (
    <div className="h-full flex flex-col">
      <div className="relative mb-6">
        {user.coverUrl ? (
          <div 
            className="h-48 w-full rounded-xl overflow-hidden"
            style={{
              backgroundImage: `url(${user.coverUrl})`,
              backgroundSize: 'cover',
              backgroundPosition: user.coverPosition 
                ? `${user.coverPosition.x}% ${user.coverPosition.y}%` 
                : 'center'
            }}
          >
            <div className="absolute inset-0 bg-gradient-to-t from-night/90 via-night/50 to-transparent" />
          </div>
        ) : (
          <div className="h-48 w-full rounded-xl bg-gradient-to-br from-neon/20 via-neon-blue/20 to-night">
            <div className="absolute inset-0 bg-gradient-to-t from-night/90 via-transparent to-transparent" />
          </div>
        )}

        <button
          onClick={onBack}
          className="absolute top-4 left-4 p-2 bg-night/80 backdrop-blur-sm border border-border-subtle rounded-lg text-mist hover:text-neon hover:border-neon/50 transition-all z-10"
        >
          <ArrowLeft size={20} />
        </button>

        <div className="absolute -bottom-12 left-8 flex items-end gap-6">
          <img
            src={user.avatarUrl}
            alt={user.name}
            className="w-28 h-28 rounded-full border-4 border-night object-cover shadow-depth"
          />
          <div className="pb-2">
            <div className="flex items-center gap-3">
              <h1 className="text-2xl font-bold text-mist">{user.name}</h1>
              {isMe && (
                <span className="px-2 py-0.5 bg-neon/10 border border-neon/30 rounded text-neon text-xs font-bold">
                  Tú
                </span>
              )}
              <span className={`px-2 py-0.5 rounded text-[10px] uppercase font-bold tracking-wider border ${
                user.role === 'admin' 
                  ? 'bg-neon-orange/10 border-neon-orange/30 text-neon-orange' 
                  : 'bg-neon/10 border-neon/30 text-neon'
              }`}>
                {user.role === 'admin' && <Shield size={10} className="inline mr-1" />}
                {user.role}
              </span>
            </div>
            <div className="flex items-center text-mist-muted text-sm mt-1">
              <Mail size={14} className="mr-2" />
              {user.email}
            </div>
          </div>
        </div>

        {(currentUser.role === 'admin' || isMe) && (
          <button
            onClick={() => onEditProfile(user)}
            className="absolute bottom-4 right-4 px-4 py-2 bg-surface-med border border-border-subtle rounded-lg text-mist text-sm hover:border-neon/50 hover:text-neon transition-all"
          >
            Editar Perfil
          </button>
        )}
      </div>

      <div className="mt-16 mb-6">
        <div className="flex gap-2 border-b border-border-subtle">
          {tabs.map(tab => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`flex items-center gap-2 px-6 py-3 text-sm font-medium transition-all border-b-2 -mb-[2px] ${
                activeTab === tab.id
                  ? 'text-neon border-neon'
                  : 'text-mist-muted border-transparent hover:text-mist hover:border-border-subtle'
              }`}
            >
              {tab.icon}
              {tab.label}
              <span className={`ml-1 px-2 py-0.5 rounded-full text-xs ${
                activeTab === tab.id 
                  ? 'bg-neon/20 text-neon' 
                  : 'bg-surface-med text-mist-muted'
              }`}>
                {tab.count}
              </span>
            </button>
          ))}
        </div>
      </div>

      <div className="flex-1 overflow-hidden">
        {activeTab === 'tasks' && (
          <UserTasksTab
            user={user}
            users={allUsers}
            tasks={userTasks}
            leads={leads}
            activeClients={activeClients}
            onSaveTask={onSaveTask}
            onDeleteTask={onDeleteTask}
          />
        )}
        {activeTab === 'meetings' && (
          <UserMeetingsTab
            user={user}
            users={allUsers}
            meetings={userMeetings}
            leads={leads}
            activeClients={activeClients}
            onSaveMeeting={onSaveMeeting}
            onDeleteMeeting={onDeleteMeeting}
          />
        )}
        {activeTab === 'clients' && (
          <UserClientsTab
            clients={userClients}
          />
        )}
      </div>
    </div>
  );
};

interface UserTasksTabProps {
  user: User;
  users: User[];
  tasks: Task[];
  leads?: Lead[];
  activeClients?: ActiveClient[];
  onSaveTask: (task: Task) => void;
  onDeleteTask: (taskId: string) => void;
}

const UserTasksTab: React.FC<UserTasksTabProps> = ({ user, users, tasks, leads = [], activeClients = [], onSaveTask, onDeleteTask }) => {
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isViewModalOpen, setIsViewModalOpen] = useState(false);
  const [selectedTask, setSelectedTask] = useState<Task | null>(null);

  const scrollContainerRef = useRef<HTMLDivElement>(null);
  const isDraggingScroll = useRef(false);
  const startX = useRef(0);
  const scrollLeft = useRef(0);

  const clients = useMemo(() => {
    const clientNames = new Set<string>();
    leads.forEach(l => { if (l.nombre_empresa) clientNames.add(l.nombre_empresa); });
    activeClients.forEach(c => { if (c.nombre_empresa) clientNames.add(c.nombre_empresa); });
    tasks.forEach(t => { if (t.clientName) clientNames.add(t.clientName); });
    return Array.from(clientNames).sort();
  }, [leads, activeClients, tasks]);

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

  const openCreateModal = () => {
    setSelectedTask(null);
    setIsEditModalOpen(true);
  };

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

  const handleDragStart = (e: React.DragEvent, taskId: string) => {
    e.dataTransfer.setData('taskId', taskId);
    e.dataTransfer.effectAllowed = 'move';
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    e.dataTransfer.dropEffect = 'move';
  };

  const handleDrop = (e: React.DragEvent, status: TaskStatus) => {
    e.preventDefault();
    const taskId = e.dataTransfer.getData('taskId');
    const task = tasks.find(t => t.id === taskId);
    
    if (task && task.status !== status) {
      const updates: Partial<Task> = { status };
      if (status === TaskStatus.Completed && task.status !== TaskStatus.Completed) {
        updates.completedAt = new Date().toISOString();
      }
      if (status !== TaskStatus.Completed && task.status === TaskStatus.Completed) {
        updates.completedAt = undefined;
      }
      onSaveTask({ ...task, ...updates });
    }
  };

  const handleMouseDown = (e: React.MouseEvent) => {
    if ((e.target as HTMLElement).closest('.task-card')) return;
    isDraggingScroll.current = true;
    if (scrollContainerRef.current) {
      scrollContainerRef.current.style.cursor = 'grabbing';
      startX.current = e.pageX - scrollContainerRef.current.offsetLeft;
      scrollLeft.current = scrollContainerRef.current.scrollLeft;
    }
  };

  const handleMouseLeave = () => { isDraggingScroll.current = false; if (scrollContainerRef.current) scrollContainerRef.current.style.cursor = 'grab'; };
  const handleMouseUp = () => { isDraggingScroll.current = false; if (scrollContainerRef.current) scrollContainerRef.current.style.cursor = 'grab'; };
  const handleMouseMove = (e: React.MouseEvent) => {
    if (!isDraggingScroll.current || !scrollContainerRef.current) return;
    e.preventDefault();
    const x = e.pageX - scrollContainerRef.current.offsetLeft;
    const walk = (x - startX.current) * 1.5;
    scrollContainerRef.current.scrollLeft = scrollLeft.current - walk;
  };

  const getPriorityColor = (p: TaskPriority) => {
    switch (p) {
      case TaskPriority.Urgent: return 'text-red-500 bg-red-500/10 border-red-500/20';
      case TaskPriority.High: return 'text-neon-orange bg-neon-orange/10 border-neon-orange/20';
      case TaskPriority.Medium: return 'text-yellow-400 bg-yellow-400/10 border-yellow-400/20';
      case TaskPriority.Low: return 'text-blue-400 bg-blue-400/10 border-blue-400/20';
      default: return 'text-mist-muted';
    }
  };

  const getSortedTasks = (statusTasks: Task[]) => {
    const priorityWeight = {
      [TaskPriority.Urgent]: 4,
      [TaskPriority.High]: 3,
      [TaskPriority.Medium]: 2,
      [TaskPriority.Low]: 1
    };
    return [...statusTasks].sort((a, b) => {
      const weightDiff = priorityWeight[b.priority] - priorityWeight[a.priority];
      if (weightDiff !== 0) return weightDiff;
      return new Date(a.deadline).getTime() - new Date(b.deadline).getTime();
    });
  };

  return (
    <div className="h-full flex flex-col">
      <div className="flex justify-end items-center mb-4">
        <button 
          onClick={openCreateModal}
          className="px-6 py-2.5 rounded-lg bg-gradient-primary text-mist font-bold shadow-neon-glow hover:brightness-110 flex items-center"
        >
          <Plus size={18} className="mr-2" /> Crear Tarea
        </button>
      </div>

      <div 
        ref={scrollContainerRef}
        className="flex-1 overflow-x-auto pb-4 cursor-grab active:cursor-grabbing select-none"
        onMouseDown={handleMouseDown}
        onMouseLeave={handleMouseLeave}
        onMouseUp={handleMouseUp}
        onMouseMove={handleMouseMove}
      >
        <div className="flex h-full space-x-4 min-w-max px-1">
          {Object.values(TaskStatus).map((status) => {
            const statusTasks = tasks.filter(t => t.status === status && !t.isDeleted);
            const sortedStatusTasks = getSortedTasks(statusTasks);

            return (
              <div 
                key={status}
                className="w-80 flex flex-col bg-surface-low/50 border border-border-subtle rounded-xl overflow-hidden"
                onDragOver={handleDragOver}
                onDrop={(e) => handleDrop(e, status)}
              >
                <div className="p-3 bg-surface-med border-b border-border-subtle flex justify-between items-center sticky top-0 z-10">
                  <span className="font-bold text-sm text-mist uppercase tracking-wide truncate" title={status}>
                    {status}
                  </span>
                  <span className="bg-night border border-border-subtle text-neon text-xs font-bold px-2 py-0.5 rounded-full">
                    {statusTasks.length}
                  </span>
                </div>

                <div className="flex-1 overflow-y-auto p-3 space-y-3 custom-scrollbar">
                  {sortedStatusTasks.map((task) => {
                    const assignees = users.filter(u => task.assigneeIds?.includes(u.id));
                    const subtasks = task.subtasks || [];
                    const completedSubtasks = subtasks.filter(s => s.completed).length;
                    const totalSubtasks = subtasks.length;
                    const progressPercent = totalSubtasks > 0 ? Math.round((completedSubtasks / totalSubtasks) * 100) : 0;
                    
                    return (
                      <div
                        key={task.id}
                        draggable
                        onDragStart={(e) => handleDragStart(e, task.id)}
                        onClick={() => openViewModal(task)}
                        className={`task-card bg-night border rounded-lg hover:border-neon/50 hover:shadow-card-glow transition-all cursor-pointer group relative flex flex-col shadow-sm overflow-hidden ${
                          task.status === TaskStatus.Completed 
                            ? 'border-[#00C8FF]/30' 
                            : 'border-border-subtle'
                        }`}
                      >
                        {task.coverUrl && (
                          <div className="h-36 w-full relative border-b border-border-subtle -mt-px -mx-px w-[calc(100%+2px)] rounded-t-lg mb-3">
                            <img src={task.coverUrl} alt="Cover" className="w-full h-full object-cover" />
                          </div>
                        )}

                        <div className={task.coverUrl ? 'px-4 pb-4' : 'p-4'}>
                          <div className="absolute top-2 right-2 text-mist-muted/20 group-hover:text-mist-muted cursor-grab z-10 drop-shadow-md">
                            <GripVertical size={14} />
                          </div>
                          
                          <div className="mb-2">
                            <span className={`text-[10px] uppercase font-bold px-2 py-0.5 rounded border ${getPriorityColor(task.priority)}`}>
                              {task.priority}
                            </span>
                          </div>

                          <h4 className="font-montserrat font-bold text-mist text-sm mb-3 pr-4 leading-tight">
                            {task.title}
                          </h4>

                          {totalSubtasks > 0 && (
                            <div className="mb-3 space-y-1">
                              <div className="flex items-center justify-between text-[10px] text-mist-muted">
                                <span className="flex items-center gap-1">
                                  <ListChecks size={10} />
                                  {completedSubtasks}/{totalSubtasks}
                                </span>
                                <span>{progressPercent}%</span>
                              </div>
                              <div className="w-full bg-surface-low rounded-full h-1.5 overflow-hidden">
                                <div 
                                  className="h-full bg-gradient-to-r from-neon to-neon-blue transition-all duration-300"
                                  style={{ width: `${progressPercent}%` }}
                                />
                              </div>
                            </div>
                          )}

                          <div className="mt-auto space-y-2">
                            <div className="flex items-center text-xs text-mist-muted">
                              <Building2 size={12} className="mr-2 text-neon" />
                              <span className="truncate">{task.clientName}</span>
                            </div>
                            
                            <div className="flex justify-between items-center pt-2 border-t border-border-subtle/50">
                              <div className="flex items-center -space-x-1" title={`Encargados: ${assignees.map(a => a.name).join(', ') || 'Sin asignar'}`}>
                                {assignees.length > 0 ? assignees.slice(0, 3).map((assignee, idx) => (
                                  assignee.avatarUrl ? (
                                    <img key={assignee.id} src={assignee.avatarUrl} alt={assignee.name} className="w-5 h-5 rounded-full border border-night object-cover" style={{ zIndex: 3 - idx }} />
                                  ) : (
                                    <div key={assignee.id} className="w-5 h-5 rounded-full bg-surface-med border border-night flex items-center justify-center" style={{ zIndex: 3 - idx }}>
                                      <UserIcon size={10} className="text-mist-muted" />
                                    </div>
                                  )
                                )) : (
                                  <div className="w-5 h-5 rounded-full bg-surface-med border border-border-subtle flex items-center justify-center">
                                    <UserIcon size={10} className="text-mist-muted" />
                                  </div>
                                )}
                                {assignees.length > 3 && (
                                  <div className="w-5 h-5 rounded-full bg-neon/20 border border-night flex items-center justify-center text-[8px] text-neon font-bold">
                                    +{assignees.length - 3}
                                  </div>
                                )}
                              </div>
                              <div className="flex items-center text-[10px] text-mist-muted font-mono bg-surface-med px-1.5 py-0.5 rounded">
                                <Clock size={10} className="mr-1" />
                                {task.deadline}
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>
                    );
                  })}
                  {statusTasks.length === 0 && (
                    <div className="h-20 border-2 border-dashed border-border-subtle rounded-lg flex items-center justify-center text-xs text-mist-faint bg-night/30">
                      Arrastra tareas aquí
                    </div>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </div>

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
        defaultAssigneeId={user.id}
      />
    </div>
  );
};

interface UserMeetingsTabProps {
  user: User;
  users: User[];
  meetings: MeetingEvent[];
  leads?: Lead[];
  activeClients?: ActiveClient[];
  onSaveMeeting: (meeting: MeetingEvent) => void;
  onDeleteMeeting: (meetingId: string) => void;
}

const UserMeetingsTab: React.FC<UserMeetingsTabProps> = ({ user, users, meetings, leads = [], activeClients = [], onSaveMeeting, onDeleteMeeting }) => {
  const [currentDate, setCurrentDate] = useState(new Date());
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingEvent, setEditingEvent] = useState<MeetingEvent | null>(null);

  const clients = useMemo(() => {
    const clientNames = new Set<string>();
    leads.forEach(l => { if (l.nombre_empresa) clientNames.add(l.nombre_empresa); });
    activeClients.forEach(c => { if (c.nombre_empresa) clientNames.add(c.nombre_empresa); });
    meetings.forEach(m => {
      if (m.clientId) clientNames.add(m.clientId);
    });
    return Array.from(clientNames).sort();
  }, [leads, activeClients, meetings]);

  const getStartOfWeek = (d: Date) => {
    const date = new Date(d);
    const day = date.getDay();
    const diff = date.getDate() - day + (day === 0 ? -6 : 1);
    return new Date(date.setDate(diff));
  };

  const startOfWeek = getStartOfWeek(currentDate);
  const weekDays = Array.from({ length: 6 }, (_, i) => {
    const d = new Date(startOfWeek);
    d.setDate(startOfWeek.getDate() + i);
    return d;
  });

  const nextWeek = () => {
    const d = new Date(currentDate);
    d.setDate(d.getDate() + 7);
    setCurrentDate(d);
  };

  const prevWeek = () => {
    const d = new Date(currentDate);
    d.setDate(d.getDate() - 7);
    setCurrentDate(d);
  };

  const goToToday = () => setCurrentDate(new Date());

  const handleSaveEvent = (event: MeetingEvent) => {
    onSaveMeeting(event);
    setIsModalOpen(false);
    setEditingEvent(null);
  };

  const handleDeleteEvent = (id: string) => {
    onDeleteMeeting(id);
    setIsModalOpen(false);
    setEditingEvent(null);
  };

  const openCreateModal = () => {
    setEditingEvent(null);
    setIsModalOpen(true);
  };

  const openEditModal = (event: MeetingEvent) => {
    setEditingEvent(event);
    setIsModalOpen(true);
  };

  const hours = Array.from({ length: 12 }, (_, i) => i + 8);

  const getEventStyle = (event: MeetingEvent) => {
    const startH = parseInt(event.startTime.split(':')[0]);
    const startM = parseInt(event.startTime.split(':')[1]);
    const endH = parseInt(event.endTime.split(':')[0]);
    const endM = parseInt(event.endTime.split(':')[1]);

    const startMinutes = (startH - 8) * 60 + startM;
    const endMinutes = (endH - 8) * 60 + endM;
    const duration = endMinutes - startMinutes;

    return {
      top: `${(startMinutes / 60) * 80}px`,
      height: `${(duration / 60) * 80}px`,
    };
  };

  const validMeetings = meetings.filter(m => !m.isDeleted);

  return (
    <div className="h-full flex flex-col">
      <div className="flex justify-between items-center mb-4">
        <div className="flex items-center space-x-4">
          <div className="flex items-center space-x-2 bg-surface-low rounded-lg p-1 border border-border-subtle">
            <button onClick={prevWeek} className="p-1 hover:bg-surface-med rounded text-mist-muted hover:text-mist transition-colors"><ChevronLeft size={18}/></button>
            <button onClick={goToToday} className="px-3 py-1 text-xs font-bold uppercase text-mist hover:text-neon transition-colors">Esta Semana</button>
            <button onClick={nextWeek} className="p-1 hover:bg-surface-med rounded text-mist-muted hover:text-mist transition-colors"><ChevronRight size={18}/></button>
          </div>
          <span className="text-mist text-sm font-medium ml-2">
            {startOfWeek.toLocaleDateString('es-ES', { month: 'long', year: 'numeric' })}
          </span>
        </div>
        <button 
          onClick={openCreateModal}
          className="px-6 py-2.5 rounded-lg bg-gradient-primary text-mist font-bold shadow-neon-glow hover:brightness-110 flex items-center transition-all"
        >
          <Plus size={18} className="mr-2" /> Crear Reunión
        </button>
      </div>

      <div className="flex-1 bg-surface-low/30 border border-border-subtle rounded-xl overflow-hidden flex flex-col shadow-inner">
        <div className="flex border-b border-border-subtle bg-surface-med/80">
          <div className="w-16 border-r border-border-subtle flex-shrink-0"></div>
          <div className="flex-1 grid grid-cols-6">
            {weekDays.map(day => {
              const isToday = day.toDateString() === new Date().toDateString();
              return (
                <div key={day.toString()} className={`py-3 text-center border-r border-border-subtle last:border-r-0 ${isToday ? 'bg-neon/5' : ''}`}>
                  <span className={`text-xs uppercase font-bold block ${isToday ? 'text-neon' : 'text-mist-muted'}`}>
                    {day.toLocaleDateString('es-ES', { weekday: 'short' })}
                  </span>
                  <span className={`text-lg font-bold block ${isToday ? 'text-neon' : 'text-mist'}`}>
                    {day.getDate()}
                  </span>
                </div>
              );
            })}
          </div>
        </div>

        <div className="flex-1 overflow-y-auto custom-scrollbar relative">
          <div className="flex min-h-[960px]">
            <div className="w-16 flex-shrink-0 border-r border-border-subtle bg-surface-low">
              {hours.map(h => (
                <div key={h} className="h-20 border-b border-border-subtle/50 text-[10px] text-mist-muted font-mono p-2 text-right relative">
                  {h}:00
                  <div className="absolute top-0 right-0 w-2 h-[1px] bg-border-subtle"></div>
                </div>
              ))}
            </div>

            <div className="flex-1 grid grid-cols-6 relative">
              {weekDays.map((day, dayIndex) => (
                <div key={dayIndex} className="border-r border-border-subtle/30 last:border-r-0 relative h-full">
                  {hours.map(h => (
                    <div key={h} className="h-20 border-b border-border-subtle/30 w-full"></div>
                  ))}

                  {validMeetings
                    .filter(e => e.date === day.toISOString().split('T')[0])
                    .map(event => (
                      <div
                        key={event.id}
                        onClick={() => openEditModal(event)}
                        className="absolute left-1 right-1 rounded border-l-4 border-l-neon bg-surface-med border-y border-r border-border-subtle/50 p-0 cursor-pointer hover:bg-surface-low hover:border-l-neon-blue hover:shadow-neon-glow/20 transition-all z-10 overflow-hidden group flex flex-col"
                        style={getEventStyle(event)}
                      >
                        {event.coverUrl ? (
                          <div 
                            className="h-6 w-full bg-cover bg-center opacity-80 group-hover:opacity-100 transition-opacity"
                            style={{ backgroundImage: `url(${event.coverUrl})` }}
                          />
                        ) : null}
                        
                        <div className="p-2 flex-1 flex flex-col">
                          <div className="flex justify-between items-start">
                            <span className="text-xs font-bold text-mist truncate">{event.title}</span>
                            {event.link && (
                              <a 
                                href={event.link} 
                                target="_blank" 
                                rel="noopener noreferrer"
                                onClick={e => e.stopPropagation()} 
                                className="text-neon hover:text-white"
                              >
                                <ExternalLink size={12} />
                              </a>
                            )}
                          </div>
                          <div className="text-[10px] text-mist-muted mt-0.5 flex items-center">
                            <span className="font-mono">{event.startTime} - {event.endTime}</span>
                          </div>
                          {event.attendeeIds.length > 0 && (
                            <div className="mt-auto flex items-center text-[10px] text-mist-faint">
                              <Users size={10} className="mr-1" />
                              {event.attendeeIds.length} inv.
                            </div>
                          )}
                        </div>
                      </div>
                    ))
                  }
                </div>
              ))}
              
              {weekDays.some(d => d.toDateString() === new Date().toDateString()) && (
                (() => {
                  const now = new Date();
                  const currentHour = now.getHours();
                  const currentMin = now.getMinutes();
                  if (currentHour >= 8 && currentHour < 20) {
                    const top = ((currentHour - 8) * 60 + currentMin) / 60 * 80;
                    const dayIndex = (now.getDay() + 6) % 7;
                    if (dayIndex < 6) {
                      return (
                        <div 
                          className="absolute left-0 right-0 h-[2px] bg-neon-orange z-20 pointer-events-none flex items-center"
                          style={{ top: `${top}px` }}
                        >
                          <div className="w-2 h-2 rounded-full bg-neon-orange -ml-1"></div>
                        </div>
                      );
                    }
                  }
                  return null;
                })()
              )}
            </div>
          </div>
        </div>
      </div>

      <MeetingModal 
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onSave={handleSaveEvent}
        onDelete={handleDeleteEvent}
        meetingToEdit={editingEvent}
        users={users}
        clients={clients}
        defaultAttendeeId={user.id}
      />
    </div>
  );
};

interface UserClientsTabProps {
  clients: ActiveClient[];
}

const UserClientsTab: React.FC<UserClientsTabProps> = ({ clients }) => {
  if (clients.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center h-64 text-mist-muted">
        <Building2 size={48} className="mb-4 opacity-50" />
        <p className="text-lg">No hay clientes asociados</p>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 overflow-y-auto pb-4">
      {clients.map(client => (
        <div 
          key={client.activeId}
          className="bg-surface-low border border-border-subtle rounded-xl overflow-hidden hover:border-neon/30 transition-all group"
        >
          {client.coverUrl ? (
            <div 
              className="h-32 w-full bg-cover bg-center"
              style={{
                backgroundImage: `url(${client.coverUrl})`,
                backgroundPosition: client.coverPosition 
                  ? `${client.coverPosition.x}% ${client.coverPosition.y}%` 
                  : 'center'
              }}
            />
          ) : (
            <div className="h-32 w-full bg-gradient-to-br from-neon/10 via-neon-blue/10 to-surface-low flex items-center justify-center">
              <Building2 size={40} className="text-mist-muted/30" />
            </div>
          )}

          <div className="p-5">
            <div className="flex items-start justify-between mb-3">
              <h3 className="text-lg font-bold text-mist group-hover:text-neon transition-colors">
                {client.nombre_empresa}
              </h3>
              <span className={`px-2 py-0.5 rounded text-[10px] uppercase font-bold ${
                client.estado_servicio === 'En servicio' 
                  ? 'bg-neon/10 text-neon border border-neon/30'
                  : client.estado_servicio === 'Pendiente de factura'
                  ? 'bg-neon-orange/10 text-neon-orange border border-neon-orange/30'
                  : 'bg-neon-blue/10 text-neon-blue border border-neon-blue/30'
              }`}>
                {client.estado_servicio}
              </span>
            </div>

            <div className="space-y-2 text-sm">
              <div className="flex items-center text-mist-muted">
                <UserIcon size={14} className="mr-2 text-neon" />
                {client.nombre_contacto}
              </div>
              
              {client.email && (
                <div className="flex items-center text-mist-muted">
                  <Mail size={14} className="mr-2 text-neon" />
                  <span className="truncate">{client.email}</span>
                </div>
              )}
              
              {client.telefono && (
                <div className="flex items-center text-mist-muted">
                  <Phone size={14} className="mr-2 text-neon" />
                  {client.telefono}
                </div>
              )}
              
              {client.ciudad && (
                <div className="flex items-center text-mist-muted">
                  <MapPin size={14} className="mr-2 text-neon" />
                  {client.ciudad}
                </div>
              )}

              {client.web && (
                <div className="flex items-center text-mist-muted">
                  <Globe size={14} className="mr-2 text-neon" />
                  <a 
                    href={client.web.startsWith('http') ? client.web : `https://${client.web}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-neon hover:underline truncate"
                  >
                    {client.web}
                  </a>
                </div>
              )}
            </div>

            <div className="mt-4 pt-4 border-t border-border-subtle flex justify-between items-center">
              <div className="text-xs text-mist-muted">
                <span className="font-bold text-mist">${client.valor_mensual_servicio || client.valor_mensualidad}</span>
                <span className="ml-1">/mes</span>
              </div>
              <div className="text-xs text-mist-muted">
                Desde: {client.fecha_inicio_servicio || 'N/A'}
              </div>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
};

export default UserProfilePage;
