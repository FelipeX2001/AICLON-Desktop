
import React, { useState, useEffect } from 'react';
import { Task, TaskStatus, TaskPriority, User, Subtask } from '../types';
import { X, Save, CheckSquare, User as UserIcon, Building2, AlertTriangle, Calendar, Trash2, AlignLeft, ListChecks, Plus, Minus } from 'lucide-react';
import ImageUploadField from './ImageUploadField';

interface TaskModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (task: Task) => void;
  onDelete?: (taskId: string) => void;
  taskToEdit?: Task | null;
  users: User[];
  clients: string[];
  defaultAssigneeId?: string;
}

const TaskModal: React.FC<TaskModalProps> = ({ 
    isOpen, 
    onClose, 
    onSave, 
    onDelete, 
    taskToEdit, 
    users, 
    clients,
    defaultAssigneeId 
}) => {
  const [formData, setFormData] = useState<Partial<Task>>({
    status: TaskStatus.Pending,
    priority: TaskPriority.Medium,
    deadline: new Date().toISOString().split('T')[0]
  });

  const [isDeleteConfirmOpen, setIsDeleteConfirmOpen] = useState(false);
  const [hasSubtasks, setHasSubtasks] = useState(false);
  const [newSubtaskTitle, setNewSubtaskTitle] = useState('');

  useEffect(() => {
    if (isOpen) {
        if (taskToEdit) {
            setFormData({ ...taskToEdit });
            setHasSubtasks((taskToEdit.subtasks?.length || 0) > 0);
        } else {
            setFormData({
                status: TaskStatus.Pending,
                priority: TaskPriority.Medium,
                deadline: new Date().toISOString().split('T')[0],
                assigneeId: defaultAssigneeId || '',
                clientName: '',
                description: '',
                subtasks: [],
                coverPosition: { x: 50, y: 50, zoom: 1 }
            });
            setHasSubtasks(false);
        }
        setIsDeleteConfirmOpen(false);
        setNewSubtaskTitle('');
    }
  }, [isOpen, taskToEdit]);

  const addSubtask = () => {
    if (!newSubtaskTitle.trim()) return;
    const newSubtask: Subtask = {
      id: Date.now().toString(),
      title: newSubtaskTitle.trim(),
      completed: false
    };
    setFormData(prev => ({
      ...prev,
      subtasks: [...(prev.subtasks || []), newSubtask]
    }));
    setNewSubtaskTitle('');
  };

  const removeSubtask = (subtaskId: string) => {
    setFormData(prev => ({
      ...prev,
      subtasks: (prev.subtasks || []).filter(s => s.id !== subtaskId)
    }));
  };

  const toggleSubtaskEnabled = (enabled: boolean) => {
    setHasSubtasks(enabled);
    if (!enabled) {
      setFormData(prev => ({ ...prev, subtasks: [] }));
    }
  };

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (formData.title && formData.assigneeId && formData.clientName) {
      const newTaskData: any = {
        ...formData,
        id: taskToEdit?.id || Date.now().toString(),
      };

      // Handle completedAt logic manually
      if (formData.status === TaskStatus.Completed && (!taskToEdit || taskToEdit.status !== TaskStatus.Completed)) {
          newTaskData.completedAt = new Date().toISOString();
      } else if (formData.status !== TaskStatus.Completed) {
          newTaskData.completedAt = undefined;
      } else if (taskToEdit?.status === TaskStatus.Completed) {
          // Keep existing date if already completed
          newTaskData.completedAt = taskToEdit.completedAt;
      }

      onSave(newTaskData as Task);
    }
  };

  return (
    <div 
        className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-in fade-in duration-200"
        onClick={(e) => {
            if (e.target === e.currentTarget && !isDeleteConfirmOpen) onClose();
        }}
    >
      <div className="bg-night border border-border-subtle rounded-xl w-full max-w-md shadow-depth overflow-hidden flex flex-col max-h-[90vh]">
        <div className="p-4 border-b border-border-subtle flex justify-between items-center bg-surface-low">
          <h3 className="text-lg font-designer text-mist uppercase tracking-wide">
            {taskToEdit ? 'Editar Tarea' : 'Nueva Tarea'}
          </h3>
          <button onClick={onClose} className="text-mist-muted hover:text-mist"><X size={20} /></button>
        </div>
        
        <form id="task-form" onSubmit={handleSubmit} className="p-6 space-y-4 overflow-y-auto custom-scrollbar">
          
          {/* Cover Image */}
          <ImageUploadField 
             value={formData.coverUrl} 
             onChange={(url) => setFormData(prev => ({...prev, coverUrl: url}))} 
             position={formData.coverPosition}
             onPositionChange={(pos) => setFormData(prev => ({...prev, coverPosition: pos}))}
          />

          <div className="space-y-1">
            <label className="text-xs uppercase font-bold text-mist-muted flex items-center gap-2">
                <CheckSquare size={14}/> Tarea
            </label>
            <input 
                type="text" 
                required 
                placeholder="Ej. Configurar dominio"
                value={formData.title || ''} 
                onChange={e => setFormData({...formData, title: e.target.value})} 
                className="w-full bg-surface-low border border-border-subtle rounded p-2 text-mist focus:border-neon focus:outline-none" 
            />
          </div>

          <div className="space-y-1">
            <label className="text-xs uppercase font-bold text-mist-muted flex items-center gap-2">
                <AlignLeft size={14}/> Descripción
            </label>
            <textarea 
                value={formData.description || ''} 
                onChange={e => setFormData({...formData, description: e.target.value})} 
                className="w-full bg-surface-low border border-border-subtle rounded p-2 text-mist focus:border-neon focus:outline-none min-h-[80px]" 
                placeholder="Detalles adicionales..."
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
             <div className="space-y-1">
                <label className="text-xs uppercase font-bold text-mist-muted flex items-center gap-2">
                    <UserIcon size={14}/> Encargado
                </label>
                <select 
                    required
                    value={formData.assigneeId || ''} 
                    onChange={e => setFormData({...formData, assigneeId: e.target.value})} 
                    className="w-full bg-surface-low border border-border-subtle rounded p-2 text-mist focus:border-neon focus:outline-none"
                >
                    <option value="">Seleccionar</option>
                    {users.map(u => <option key={u.id} value={u.id}>{u.name}</option>)}
                </select>
             </div>
             <div className="space-y-1">
                <label className="text-xs uppercase font-bold text-mist-muted flex items-center gap-2">
                    <Building2 size={14}/> Cliente
                </label>
                <select 
                    required
                    value={formData.clientName || ''} 
                    onChange={e => setFormData({...formData, clientName: e.target.value})} 
                    className="w-full bg-surface-low border border-border-subtle rounded p-2 text-mist focus:border-neon focus:outline-none"
                >
                    <option value="">Seleccionar</option>
                    {clients.map(c => <option key={c} value={c}>{c}</option>)}
                </select>
             </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
             <div className="space-y-1">
                <label className="text-xs uppercase font-bold text-mist-muted flex items-center gap-2">
                    <AlertTriangle size={14}/> Prioridad
                </label>
                <select 
                    value={formData.priority} 
                    onChange={e => setFormData({...formData, priority: e.target.value as TaskPriority})} 
                    className="w-full bg-surface-low border border-border-subtle rounded p-2 text-mist focus:border-neon focus:outline-none"
                >
                    {Object.values(TaskPriority).map(p => <option key={p} value={p}>{p}</option>)}
                </select>
             </div>
             <div className="space-y-1">
                <label className="text-xs uppercase font-bold text-mist-muted flex items-center gap-2">
                    <Calendar size={14}/> Fecha Límite
                </label>
                <input 
                    type="date" 
                    required
                    value={formData.deadline || ''} 
                    onChange={e => setFormData({...formData, deadline: e.target.value})} 
                    className="w-full bg-surface-low border border-border-subtle rounded p-2 text-mist focus:border-neon focus:outline-none" 
                />
             </div>
          </div>

          <div className="space-y-1">
             <label className="text-xs uppercase font-bold text-mist-muted">Estado Actual</label>
             <select 
                value={formData.status} 
                onChange={e => setFormData({...formData, status: e.target.value as TaskStatus})} 
                className="w-full bg-surface-low border border-border-subtle rounded p-2 text-mist focus:border-neon focus:outline-none"
             >
                 {Object.values(TaskStatus).map(s => <option key={s} value={s}>{s}</option>)}
             </select>
          </div>

          <div className="space-y-3 pt-2 border-t border-border-subtle">
            <div className="flex items-center justify-between">
              <label className="text-xs uppercase font-bold text-mist-muted flex items-center gap-2">
                <ListChecks size={14}/> Lista de Tareas (Opcional)
              </label>
              <label className="flex items-center gap-2 cursor-pointer">
                <input 
                  type="checkbox"
                  checked={hasSubtasks}
                  onChange={(e) => toggleSubtaskEnabled(e.target.checked)}
                  className="w-4 h-4 rounded border-border-subtle bg-surface-low text-neon focus:ring-neon"
                />
                <span className="text-xs text-mist-muted">Activar</span>
              </label>
            </div>

            {hasSubtasks && (
              <div className="space-y-3 animate-in slide-in-from-top-2 duration-200">
                <div className="flex gap-2">
                  <input 
                    type="text"
                    placeholder="Nueva subtarea..."
                    value={newSubtaskTitle}
                    onChange={(e) => setNewSubtaskTitle(e.target.value)}
                    onKeyDown={(e) => {
                      if (e.key === 'Enter') {
                        e.preventDefault();
                        addSubtask();
                      }
                    }}
                    className="flex-1 bg-surface-low border border-border-subtle rounded p-2 text-mist text-sm focus:border-neon focus:outline-none"
                  />
                  <button 
                    type="button"
                    onClick={addSubtask}
                    className="px-3 py-2 bg-neon/20 text-neon rounded border border-neon/30 hover:bg-neon/30 transition-all"
                  >
                    <Plus size={16} />
                  </button>
                </div>

                {(formData.subtasks || []).length > 0 && (
                  <div className="space-y-2 max-h-40 overflow-y-auto custom-scrollbar">
                    {(formData.subtasks || []).map((subtask, index) => (
                      <div 
                        key={subtask.id}
                        className="flex items-center justify-between gap-2 p-2 bg-surface-low/50 rounded border border-border-subtle group"
                      >
                        <div className="flex items-center gap-2 flex-1 min-w-0">
                          <span className="text-xs text-mist-muted">{index + 1}.</span>
                          <span className="text-sm text-mist truncate">{subtask.title}</span>
                        </div>
                        <button 
                          type="button"
                          onClick={() => removeSubtask(subtask.id)}
                          className="p-1 text-mist-muted hover:text-neon-orange opacity-0 group-hover:opacity-100 transition-all"
                        >
                          <Minus size={14} />
                        </button>
                      </div>
                    ))}
                  </div>
                )}

                {(formData.subtasks || []).length === 0 && (
                  <p className="text-xs text-mist-faint text-center py-2 italic">
                    Agrega elementos a la lista de tareas
                  </p>
                )}
              </div>
            )}
          </div>
        </form>

        <div className="p-4 border-t border-border-subtle bg-surface-low flex justify-between items-center">
             {taskToEdit && onDelete ? (
                 <button 
                    type="button"
                    onClick={() => setIsDeleteConfirmOpen(true)}
                    className="text-neon-orange hover:bg-neon-orange/10 px-3 py-2 rounded-lg border border-neon-orange/30 hover:border-neon-orange text-xs font-bold uppercase flex items-center transition-all"
                 >
                     <Trash2 size={14} className="mr-2" /> Eliminar
                 </button>
             ) : (
                 <div></div>
             )}

            <div className="flex space-x-3">
                <button type="button" onClick={onClose} className="px-4 py-2 text-sm text-mist-muted hover:text-mist">Cancelar</button>
                <button form="task-form" type="submit" className="px-6 py-2 rounded bg-gradient-primary text-mist text-sm font-bold shadow-neon-glow hover:brightness-110 flex items-center">
                    <Save size={16} className="mr-2"/> Guardar
                </button>
            </div>
        </div>

        {/* Delete Confirmation Modal Overlay */}
        {isDeleteConfirmOpen && (
            <div className="absolute inset-0 z-[60] flex items-center justify-center bg-black/90 p-6 animate-in fade-in duration-200">
                <div className="text-center">
                    <h4 className="text-neon-orange font-bold uppercase mb-2">¿Eliminar esta tarea?</h4>
                    <p className="text-sm text-mist-muted mb-4">Esta acción no se puede deshacer.</p>
                    <div className="flex justify-center space-x-3">
                        <button 
                            onClick={() => setIsDeleteConfirmOpen(false)}
                            className="px-4 py-2 rounded border border-border-subtle text-mist hover:bg-white/5 text-xs"
                        >
                            Cancelar
                        </button>
                        <button 
                            onClick={() => {
                                if(taskToEdit?.id && onDelete) onDelete(taskToEdit.id);
                            }}
                            className="px-4 py-2 rounded bg-neon-orange text-white text-xs font-bold hover:bg-neon-orange/90"
                        >
                            Confirmar
                        </button>
                    </div>
                </div>
            </div>
        )}
      </div>
    </div>
  );
};

export default TaskModal;
