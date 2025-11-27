
import React, { useState, useEffect } from 'react';
import { MeetingEvent, User } from '../types';
import { X, Save, Trash2, Calendar, Clock, Link as LinkIcon, Users, AlignLeft, AlertTriangle, Building2, Video, MapPin } from 'lucide-react';
import ImageUploadField from './ImageUploadField';

interface MeetingModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (meeting: MeetingEvent) => void;
  onDelete?: (meetingId: string) => void;
  meetingToEdit?: MeetingEvent | null;
  users: User[];
  clients: string[];
}

const MeetingModal: React.FC<MeetingModalProps> = ({ 
  isOpen, 
  onClose, 
  onSave, 
  onDelete, 
  meetingToEdit, 
  users, 
  clients 
}) => {
  const [formData, setFormData] = useState<Partial<MeetingEvent>>({
    date: new Date().toISOString().split('T')[0],
    startTime: '10:00',
    endTime: '11:00',
    attendeeIds: [],
    isRemote: true
  });
  
  const [isDeleteConfirmOpen, setIsDeleteConfirmOpen] = useState(false);

  useEffect(() => {
    if (isOpen) {
      if (meetingToEdit) {
        setFormData({ ...meetingToEdit });
      } else {
        setFormData({
          date: new Date().toISOString().split('T')[0],
          startTime: '10:00',
          endTime: '11:00',
          attendeeIds: [],
          title: '',
          description: '',
          link: '',
          clientId: '',
          isRemote: true,
          coverPosition: { x: 50, y: 50, zoom: 1 }
        });
      }
      setIsDeleteConfirmOpen(false);
    }
  }, [isOpen, meetingToEdit]);

  // Auto Set End Time: Start + 1h if End is empty or same
  const handleStartTimeChange = (newStart: string) => {
      setFormData(prev => {
          let newEnd = prev.endTime;
          if (newStart) {
              const [h, m] = newStart.split(':').map(Number);
              const endH = (h + 1) % 24;
              const endHStr = endH.toString().padStart(2, '0');
              const mStr = m.toString().padStart(2, '0');
              // Auto update if endTime is not set by user yet or effectively same/default
              newEnd = `${endHStr}:${mStr}`;
          }
          return { ...prev, startTime: newStart, endTime: newEnd };
      });
  };

  if (!isOpen) return null;

  const isTimeInRange = (time: string, minHour: number, maxHour: number): boolean => {
    const [h] = time.split(':').map(Number);
    return h >= minHour && h < maxHour;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (formData.title && formData.date && formData.startTime && formData.endTime) {
      if (!isTimeInRange(formData.startTime, 8, 19) || !isTimeInRange(formData.endTime, 8, 20)) {
        alert('Las reuniones deben estar entre 8:00 AM y 7:00 PM');
        return;
      }
      onSave({
        ...formData,
        id: meetingToEdit?.id || Date.now().toString(),
        attendeeIds: formData.attendeeIds || []
      } as MeetingEvent);
    }
  };

  const toggleAttendee = (userId: string) => {
    setFormData(prev => {
      const current = prev.attendeeIds || [];
      if (current.includes(userId)) {
        return { ...prev, attendeeIds: current.filter(id => id !== userId) };
      } else {
        return { ...prev, attendeeIds: [...current, userId] };
      }
    });
  };

  return (
    <div 
        className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-in fade-in duration-200"
        onClick={(e) => {
            if (e.target === e.currentTarget && !isDeleteConfirmOpen) onClose();
        }}
    >
      <div className="bg-night border border-border-subtle rounded-xl w-full max-w-lg shadow-depth overflow-hidden flex flex-col max-h-[90vh]">
        {/* Header */}
        <div className="p-4 border-b border-border-subtle flex justify-between items-center bg-surface-low">
          <h3 className="text-lg font-designer text-mist uppercase tracking-wide">
            {meetingToEdit ? 'Editar Reunión' : 'Nueva Reunión'}
          </h3>
          <button onClick={onClose} className="text-mist-muted hover:text-mist">
            <X size={20} />
          </button>
        </div>

        {/* Scrollable Content */}
        <form id="meeting-form" onSubmit={handleSubmit} className="p-6 space-y-5 overflow-y-auto custom-scrollbar">
          
          {/* Cover Image */}
          <ImageUploadField 
             value={formData.coverUrl} 
             onChange={(url) => setFormData(prev => ({...prev, coverUrl: url}))} 
             position={formData.coverPosition}
             onPositionChange={(pos) => setFormData(prev => ({...prev, coverPosition: pos}))}
          />

          <div className="space-y-1">
            <label className="text-xs uppercase font-bold text-mist-muted">Título de la reunión</label>
            <input 
              type="text" 
              required 
              value={formData.title || ''}
              onChange={(e) => setFormData({...formData, title: e.target.value})}
              className="w-full bg-surface-low border border-border-subtle rounded p-2 text-mist focus:border-neon focus:outline-none"
              placeholder="Ej. Sincronización semanal"
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
             <div className="space-y-1">
               <label className="text-xs uppercase font-bold text-mist-muted flex items-center gap-2">
                 <Calendar size={14} /> Fecha
               </label>
               <input 
                 type="date" 
                 required
                 value={formData.date || ''}
                 onChange={(e) => setFormData({...formData, date: e.target.value})}
                 className="w-full bg-surface-low border border-border-subtle rounded p-2 text-mist focus:border-neon focus:outline-none"
               />
             </div>
             <div className="grid grid-cols-2 gap-2">
                <div className="space-y-1">
                    <label className="text-xs uppercase font-bold text-mist-muted flex items-center gap-2">
                        <Clock size={14} /> Inicio
                    </label>
                    <input 
                        type="time" 
                        required
                        value={formData.startTime || ''}
                        onChange={(e) => handleStartTimeChange(e.target.value)}
                        className="w-full bg-surface-low border border-border-subtle rounded p-2 text-mist focus:border-neon focus:outline-none"
                    />
                </div>
                <div className="space-y-1">
                    <label className="text-xs uppercase font-bold text-mist-muted flex items-center gap-2">
                        Fin
                    </label>
                    <input 
                        type="time" 
                        required
                        value={formData.endTime || ''}
                        onChange={(e) => setFormData({...formData, endTime: e.target.value})}
                        className="w-full bg-surface-low border border-border-subtle rounded p-2 text-mist focus:border-neon focus:outline-none"
                    />
                </div>
             </div>
          </div>

          {/* Attendees */}
          <div className="space-y-2">
            <label className="text-xs uppercase font-bold text-mist-muted flex items-center gap-2">
               <Users size={14} /> Involucrados
            </label>
            <div className="flex flex-wrap gap-2 bg-surface-low p-2 rounded border border-border-subtle max-h-32 overflow-y-auto">
               {users.map(user => (
                   <button
                      key={user.id}
                      type="button"
                      onClick={() => toggleAttendee(user.id)}
                      className={`flex items-center space-x-2 px-2 py-1 rounded border text-xs transition-colors ${
                          formData.attendeeIds?.includes(user.id) 
                          ? 'bg-neon/10 border-neon text-neon font-medium' 
                          : 'bg-night border-border-subtle text-mist-muted hover:border-mist-muted'
                      }`}
                   >
                       <img src={user.avatarUrl} alt="" className="w-4 h-4 rounded-full" />
                       <span>{user.name.split(' ')[0]}</span>
                   </button>
               ))}
            </div>
          </div>
          
          <div className="grid grid-cols-2 gap-4">
             <div className="space-y-1">
                <label className="text-xs uppercase font-bold text-mist-muted flex items-center gap-2">
                   <Building2 size={14} /> Cliente
                </label>
                <select 
                    value={formData.clientId || ''}
                    onChange={(e) => setFormData({...formData, clientId: e.target.value})}
                    className="w-full bg-surface-low border border-border-subtle rounded p-2 text-mist focus:border-neon focus:outline-none"
                >
                    <option value="">(Opcional)</option>
                    {clients.map(c => <option key={c} value={c}>{c}</option>)}
                </select>
             </div>
             <div className="space-y-1">
                <label className="text-xs uppercase font-bold text-mist-muted flex items-center gap-2">
                   <LinkIcon size={14} /> Link Reunión
                </label>
                <input 
                    type="text" 
                    value={formData.link || ''}
                    onChange={(e) => setFormData({...formData, link: e.target.value})}
                    placeholder="https://meet.google.com/..."
                    className="w-full bg-surface-low border border-border-subtle rounded p-2 text-mist focus:border-neon focus:outline-none"
                />
             </div>
          </div>

          <div className="space-y-1">
             <label className="text-xs uppercase font-bold text-mist-muted flex items-center gap-2">
                <AlignLeft size={14} /> Descripción
             </label>
             <textarea 
                value={formData.description || ''}
                onChange={(e) => setFormData({...formData, description: e.target.value})}
                className="w-full bg-surface-low border border-border-subtle rounded p-2 text-mist focus:border-neon focus:outline-none min-h-[80px]"
                placeholder="Temas a tratar..."
             />
          </div>

          <div className="flex items-center space-x-2">
             <div 
                className={`w-4 h-4 rounded border flex items-center justify-center cursor-pointer ${formData.isRemote ? 'bg-neon border-neon' : 'border-mist-muted'}`}
                onClick={() => setFormData({...formData, isRemote: !formData.isRemote})}
             >
                {formData.isRemote && <Video size={10} className="text-night" />}
             </div>
             <span className="text-sm text-mist cursor-pointer select-none" onClick={() => setFormData({...formData, isRemote: !formData.isRemote})}>
                 Reunión Remota
             </span>
             {!formData.isRemote && <span className="text-xs text-mist-muted italic ml-2">(Presencial)</span>}
          </div>

        </form>

        {/* Footer */}
        <div className="p-4 border-t border-border-subtle bg-surface-low flex justify-between items-center">
             {meetingToEdit && onDelete ? (
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
                <button form="meeting-form" type="submit" className="px-6 py-2 rounded bg-gradient-primary text-mist text-sm font-bold shadow-neon-glow hover:brightness-110 flex items-center">
                    <Save size={16} className="mr-2"/> Guardar
                </button>
            </div>
        </div>
      </div>

      {/* Delete Confirmation Overlay */}
      {isDeleteConfirmOpen && (
        <div className="absolute inset-0 z-[60] flex items-center justify-center bg-black/90 p-6 animate-in fade-in duration-200">
           <div className="bg-night border border-neon-orange rounded-xl w-full max-w-sm shadow-[0_0_30px_rgba(240,96,0,0.3)] overflow-hidden text-center p-6">
                <div className="w-16 h-16 rounded-full bg-neon-orange/10 flex items-center justify-center mb-4 text-neon-orange mx-auto">
                    <AlertTriangle size={32} />
                </div>
                <h4 className="text-neon-orange font-bold uppercase mb-2">¿Eliminar reunión?</h4>
                <p className="text-sm text-mist-muted mb-6">Esta acción no se puede deshacer.</p>
                <div className="flex justify-center space-x-3">
                    <button 
                        onClick={() => setIsDeleteConfirmOpen(false)}
                        className="px-4 py-3 rounded-lg border border-border-subtle text-mist hover:bg-white/5 text-sm w-full"
                    >
                        Cancelar
                    </button>
                    <button 
                        onClick={() => {
                            if(meetingToEdit?.id && onDelete) onDelete(meetingToEdit.id);
                        }}
                        className="px-4 py-3 rounded-lg bg-neon-orange text-white text-sm font-bold hover:bg-neon-orange/90 w-full"
                    >
                        Eliminar definitivamente
                    </button>
                </div>
           </div>
        </div>
      )}
    </div>
  );
};

export default MeetingModal;
