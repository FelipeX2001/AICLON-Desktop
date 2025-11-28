import React from 'react';
import { Task, TaskStatus, TaskPriority, User, Subtask } from '../types';
import { X, Edit, User as UserIcon, Building2, AlertTriangle, Calendar, CheckSquare, Square, AlignLeft, ListChecks } from 'lucide-react';

interface TaskViewModalProps {
  isOpen: boolean;
  onClose: () => void;
  task: Task;
  users: User[];
  onEdit: () => void;
  onSubtaskToggle: (taskId: string, subtaskId: string, completed: boolean) => void;
}

const TaskViewModal: React.FC<TaskViewModalProps> = ({ 
  isOpen, 
  onClose, 
  task, 
  users,
  onEdit,
  onSubtaskToggle
}) => {
  if (!isOpen || !task) return null;

  const assignees = users.filter(u => task.assigneeIds?.includes(u.id));

  const getPriorityColor = (priority: TaskPriority) => {
    switch(priority) {
      case TaskPriority.Urgent: return 'text-red-400 bg-red-500/10 border-red-500/30';
      case TaskPriority.High: return 'text-orange-400 bg-orange-500/10 border-orange-500/30';
      case TaskPriority.Medium: return 'text-yellow-400 bg-yellow-500/10 border-yellow-500/30';
      case TaskPriority.Low: return 'text-green-400 bg-green-500/10 border-green-500/30';
      default: return 'text-mist bg-surface-low border-border-subtle';
    }
  };

  const getStatusColor = (status: TaskStatus) => {
    switch(status) {
      case TaskStatus.Pending: return 'bg-gray-500/20 text-gray-300';
      case TaskStatus.InProcess: return 'bg-blue-500/20 text-blue-300';
      case TaskStatus.InReview: return 'bg-purple-500/20 text-purple-300';
      case TaskStatus.Completed: return 'bg-[#00C8FF]/20 text-[#00C8FF]';
      default: return 'bg-surface-low text-mist';
    }
  };

  const subtasks = task.subtasks || [];
  const completedSubtasks = subtasks.filter(s => s.completed).length;
  const totalSubtasks = subtasks.length;
  const progressPercent = totalSubtasks > 0 ? Math.round((completedSubtasks / totalSubtasks) * 100) : 0;

  const handleSubtaskClick = (subtask: Subtask) => {
    onSubtaskToggle(task.id, subtask.id, !subtask.completed);
  };

  return (
    <div 
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-in fade-in duration-200"
      onClick={(e) => {
        if (e.target === e.currentTarget) onClose();
      }}
    >
      <div className="bg-night border border-border-subtle rounded-xl w-full max-w-lg shadow-depth overflow-hidden flex flex-col max-h-[90vh]">
        {task.coverUrl && (
          <div className="relative h-32 overflow-hidden">
            <img 
              src={task.coverUrl} 
              alt="Cover" 
              className="w-full h-full object-cover"
              style={{
                objectPosition: task.coverPosition 
                  ? `${task.coverPosition.x}% ${task.coverPosition.y}%` 
                  : 'center'
              }}
            />
            <div className="absolute inset-0 bg-gradient-to-t from-night via-night/40 to-transparent"></div>
          </div>
        )}

        <div className="p-4 border-b border-border-subtle flex justify-between items-center bg-surface-low">
          <h3 className="text-lg font-designer text-mist uppercase tracking-wide">
            Detalle de Tarea
          </h3>
          <button onClick={onClose} className="text-mist-muted hover:text-mist"><X size={20} /></button>
        </div>
        
        <div className="p-6 space-y-5 overflow-y-auto custom-scrollbar">
          <div>
            <h2 className="text-xl font-bold text-mist mb-2">{task.title}</h2>
            <div className="flex flex-wrap gap-2">
              <span className={`px-2 py-1 rounded text-xs font-bold ${getStatusColor(task.status)}`}>
                {task.status}
              </span>
              <span className={`px-2 py-1 rounded text-xs font-bold border ${getPriorityColor(task.priority)}`}>
                {task.priority}
              </span>
            </div>
          </div>

          {task.description && (
            <div className="space-y-1">
              <label className="text-xs uppercase font-bold text-mist-muted flex items-center gap-2">
                <AlignLeft size={14}/> Descripción
              </label>
              <p className="text-sm text-mist bg-surface-low/50 rounded-lg p-3 border border-border-subtle">
                {task.description}
              </p>
            </div>
          )}

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-1">
              <label className="text-xs uppercase font-bold text-mist-muted flex items-center gap-2">
                <UserIcon size={14}/> Encargados {assignees.length > 0 && <span className="text-neon">({assignees.length})</span>}
              </label>
              <div className="flex flex-wrap gap-2 bg-surface-low/50 rounded-lg p-2 border border-border-subtle min-h-[40px]">
                {assignees.length > 0 ? assignees.map(assignee => (
                  <div key={assignee.id} className="flex items-center gap-1.5 px-2 py-1 rounded-full bg-neon/10 border border-neon/30">
                    {assignee.avatarUrl ? (
                      <img src={assignee.avatarUrl} alt={assignee.name} className="w-5 h-5 rounded-full object-cover" />
                    ) : (
                      <div className="w-5 h-5 rounded-full bg-neon/20 flex items-center justify-center">
                        <UserIcon size={10} className="text-neon" />
                      </div>
                    )}
                    <span className="text-xs text-mist">{assignee.name}</span>
                  </div>
                )) : (
                  <span className="text-sm text-mist-muted">Sin asignar</span>
                )}
              </div>
            </div>
            <div className="space-y-1">
              <label className="text-xs uppercase font-bold text-mist-muted flex items-center gap-2">
                <Building2 size={14}/> Cliente
              </label>
              <div className="bg-surface-low/50 rounded-lg p-2 border border-border-subtle">
                <span className="text-sm text-mist">{task.clientName || 'Sin cliente'}</span>
              </div>
            </div>
          </div>

          <div className="space-y-1">
            <label className="text-xs uppercase font-bold text-mist-muted flex items-center gap-2">
              <Calendar size={14}/> Fecha Límite
            </label>
            <div className="bg-surface-low/50 rounded-lg p-2 border border-border-subtle">
              <span className="text-sm text-mist">
                {task.deadline ? (() => {
                  const [year, month, day] = task.deadline.split('-').map(Number);
                  return new Date(year, month - 1, day).toLocaleDateString('es-ES', { 
                    weekday: 'long', 
                    year: 'numeric', 
                    month: 'long', 
                    day: 'numeric' 
                  });
                })() : 'Sin fecha'}
              </span>
            </div>
          </div>

          {subtasks.length > 0 && (
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <label className="text-xs uppercase font-bold text-mist-muted flex items-center gap-2">
                  <ListChecks size={14}/> Lista de Tareas
                </label>
                <span className="text-xs text-mist-muted">{completedSubtasks}/{totalSubtasks}</span>
              </div>
              
              <div className="w-full bg-surface-low rounded-full h-2 overflow-hidden">
                <div 
                  className="h-full bg-gradient-to-r from-neon to-neon-blue transition-all duration-300"
                  style={{ width: `${progressPercent}%` }}
                />
              </div>
              <div className="text-center text-xs text-mist-muted">{progressPercent}% completado</div>

              <div className="space-y-2 mt-2">
                {subtasks.map((subtask) => (
                  <div 
                    key={subtask.id}
                    onClick={() => handleSubtaskClick(subtask)}
                    className={`flex items-center gap-3 p-3 rounded-lg border cursor-pointer transition-all ${
                      subtask.completed 
                        ? 'bg-[#00C8FF]/10 border-[#00C8FF]/30 hover:bg-[#00C8FF]/20' 
                        : 'bg-surface-low/50 border-border-subtle hover:border-neon/50'
                    }`}
                  >
                    {subtask.completed ? (
                      <CheckSquare size={18} className="text-[#00C8FF] flex-shrink-0" />
                    ) : (
                      <Square size={18} className="text-mist-muted flex-shrink-0" />
                    )}
                    <span className={`text-sm ${subtask.completed ? 'text-mist-muted line-through' : 'text-mist'}`}>
                      {subtask.title}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          )}

          {task.comments && (
            <div className="space-y-1">
              <label className="text-xs uppercase font-bold text-mist-muted">Comentarios</label>
              <p className="text-sm text-mist bg-surface-low/50 rounded-lg p-3 border border-border-subtle">
                {task.comments}
              </p>
            </div>
          )}
        </div>

        <div className="p-4 border-t border-border-subtle bg-surface-low flex justify-end items-center">
          <button 
            onClick={onEdit}
            className="px-6 py-2 rounded bg-gradient-primary text-mist text-sm font-bold shadow-neon-glow hover:brightness-110 flex items-center"
          >
            <Edit size={16} className="mr-2"/> Editar
          </button>
        </div>
      </div>
    </div>
  );
};

export default TaskViewModal;
