
import React, { useState, useEffect, useRef } from 'react';
import { Task, TaskStatus, TaskPriority, User, CurrentClient, Lead } from '../types';
import TaskModal from './TaskModal';
import { Plus, Search, Filter, Calendar, User as UserIcon, CheckCircle2, AlertTriangle, GripVertical, Building2, Clock } from 'lucide-react';

interface TaskBoardProps {
  user: User; // Current User
  users: User[]; // All users for dropdown
}

const DEFAULT_TASKS: Task[] = [
  { id: '1', title: 'Configurar servidor VPS', status: TaskStatus.Pending, assigneeId: '2', clientName: 'TechCorp', priority: TaskPriority.High, deadline: '2025-11-20' },
  { id: '2', title: 'Diseñar flujo de conversación', status: TaskStatus.InProcess, assigneeId: '1', clientName: 'Imperio de la Moda', priority: TaskPriority.Urgent, deadline: '2025-11-15' },
  { id: '3', title: 'Revisión mensual de métricas', status: TaskStatus.Completed, assigneeId: '3', clientName: 'Dr. Jhon García', priority: TaskPriority.Medium, deadline: '2025-11-01' },
];

const TaskBoard: React.FC<TaskBoardProps> = ({ user, users }) => {
  // Load Tasks
  const [tasks, setTasks] = useState<Task[]>(() => {
    try {
      const saved = localStorage.getItem('aiclon_tasks');
      return saved ? JSON.parse(saved) : DEFAULT_TASKS;
    } catch { return DEFAULT_TASKS; }
  });

  // Load Clients (Both Actual and Leads for dropdowns)
  const [clients, setClients] = useState<string[]>([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingTask, setEditingTask] = useState<Task | null>(null);

  // Drag to Scroll Refs
  const scrollContainerRef = useRef<HTMLDivElement>(null);
  const isDraggingScroll = useRef(false);
  const startX = useRef(0);
  const scrollLeft = useRef(0);

  useEffect(() => {
    localStorage.setItem('aiclon_tasks', JSON.stringify(tasks));
  }, [tasks]);

  useEffect(() => {
    // Aggregate client names from both sources
    const currentClientsStr = localStorage.getItem('aiclon_current_clients');
    const leadsStr = localStorage.getItem('aiclon_leads');
    
    const clientNames = new Set<string>();
    if (currentClientsStr) JSON.parse(currentClientsStr).forEach((c: CurrentClient) => clientNames.add(c.name));
    if (leadsStr) JSON.parse(leadsStr).forEach((l: Lead) => {
        if (l.nombre_empresa) clientNames.add(l.nombre_empresa);
        else if (l.nombre_contacto) clientNames.add(l.nombre_contacto);
    });
    // Add default clients if empty for demo
    if (clientNames.size === 0) {
        ['TechCorp', 'Imperio de la Moda', 'Dr. Jhon García', 'Witnam'].forEach(n => clientNames.add(n));
    }
    setClients(Array.from(clientNames));
  }, []);

  const handleSaveTask = (task: Task) => {
    if (editingTask) {
      setTasks(prev => prev.map(t => t.id === task.id ? task : t));
    } else {
      setTasks(prev => [...prev, task]);
    }
    setIsModalOpen(false);
  };

  const handleDeleteTask = (taskId: string) => {
    setTasks(prev => prev.filter(t => t.id !== taskId));
    setIsModalOpen(false);
  };

  const openCreateModal = () => {
    setEditingTask(null);
    setIsModalOpen(true);
  };

  const openEditModal = (task: Task) => {
    setEditingTask(task);
    setIsModalOpen(true);
  };

  // --- DRAG AND DROP (CARDS) ---
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
      setTasks(prev => prev.map(t => 
        t.id === taskId ? { ...t, status: status } : t
      ));
    }
  };

  // --- DRAG TO SCROLL (BOARD) HANDLERS ---
  const handleMouseDown = (e: React.MouseEvent) => {
    if ((e.target as HTMLElement).closest('.task-card')) return;
    isDraggingScroll.current = true;
    if (scrollContainerRef.current) {
      scrollContainerRef.current.style.cursor = 'grabbing';
      startX.current = e.pageX - scrollContainerRef.current.offsetLeft;
      scrollLeft.current = scrollContainerRef.current.scrollLeft;
    }
  };

  const handleMouseLeave = () => {
    isDraggingScroll.current = false;
    if (scrollContainerRef.current) scrollContainerRef.current.style.cursor = 'grab';
  };

  const handleMouseUp = () => {
    isDraggingScroll.current = false;
    if (scrollContainerRef.current) scrollContainerRef.current.style.cursor = 'grab';
  };

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

  // Sort tasks: Priority then Deadline
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
      <div className="flex justify-between items-center mb-6">
        <div>
           <h2 className="text-3xl font-designer text-mist">Tareas</h2>
           <p className="text-mist-muted text-sm mt-1">Gestión operativa y seguimiento por estados.</p>
        </div>
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
                const statusTasks = tasks.filter(t => t.status === status);
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
                                const assignee = users.find(u => u.id === task.assigneeId);
                                return (
                                    <div
                                        key={task.id}
                                        draggable
                                        onDragStart={(e) => handleDragStart(e, task.id)}
                                        onClick={() => openEditModal(task)}
                                        className="task-card bg-night border border-border-subtle rounded-lg hover:border-neon/50 hover:shadow-card-glow transition-all cursor-pointer group relative flex flex-col shadow-sm overflow-hidden"
                                    >
                                        {/* Cover Image */}
                                        {task.coverUrl && (
                                            <div className="h-24 w-full relative border-b border-border-subtle -mt-px -mx-px w-[calc(100%+2px)] rounded-t-lg mb-3">
                                                <img src={task.coverUrl} alt="Cover" className="w-full h-full object-cover" />
                                            </div>
                                        )}

                                        <div className={task.coverUrl ? 'px-4 pb-4' : 'p-4'}>
                                            <div className="absolute top-2 right-2 text-mist-muted/20 group-hover:text-mist-muted cursor-grab z-10 drop-shadow-md">
                                                <GripVertical size={14} />
                                            </div>
                                            
                                            {/* Priority Badge */}
                                            <div className="mb-2">
                                                <span className={`text-[10px] uppercase font-bold px-2 py-0.5 rounded border ${getPriorityColor(task.priority)}`}>
                                                    {task.priority}
                                                </span>
                                            </div>

                                            <h4 className="font-montserrat font-bold text-mist text-sm mb-3 pr-4 leading-tight">
                                                {task.title}
                                            </h4>

                                            <div className="mt-auto space-y-2">
                                                <div className="flex items-center text-xs text-mist-muted">
                                                    <Building2 size={12} className="mr-2 text-neon" />
                                                    <span className="truncate">{task.clientName}</span>
                                                </div>
                                                
                                                <div className="flex justify-between items-center pt-2 border-t border-border-subtle/50">
                                                    <div className="flex items-center" title={`Encargado: ${assignee?.name || 'Sin asignar'}`}>
                                                        {assignee ? (
                                                            <img src={assignee.avatarUrl} alt={assignee.name} className="w-5 h-5 rounded-full border border-border-subtle object-cover mr-2" />
                                                        ) : (
                                                            <div className="w-5 h-5 rounded-full bg-surface-med border border-border-subtle flex items-center justify-center mr-2">
                                                                <UserIcon size={12} className="text-mist-muted" />
                                                            </div>
                                                        )}
                                                        <span className="text-[10px] text-mist-muted truncate max-w-[80px]">
                                                            {assignee?.name.split(' ')[0] || 'N/A'}
                                                        </span>
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

      <TaskModal 
         isOpen={isModalOpen}
         onClose={() => setIsModalOpen(false)}
         onSave={handleSaveTask}
         onDelete={handleDeleteTask}
         taskToEdit={editingTask}
         users={users}
         clients={clients}
      />
    </div>
  );
};

export default TaskBoard;
