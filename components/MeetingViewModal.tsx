import React from 'react';
import { MeetingEvent, User } from '../types';
import { X, Edit, Calendar, Clock, Link as LinkIcon, Users, AlignLeft, Building2, Video, MapPin } from 'lucide-react';

interface MeetingViewModalProps {
  isOpen: boolean;
  onClose: () => void;
  meeting: MeetingEvent;
  users: User[];
  clients: string[];
  onEdit: () => void;
}

const MeetingViewModal: React.FC<MeetingViewModalProps> = ({ 
  isOpen, 
  onClose, 
  meeting, 
  users,
  clients,
  onEdit
}) => {
  if (!isOpen || !meeting) return null;

  const attendees = users.filter(u => meeting.attendeeIds?.includes(u.id));
  const clientDisplayName = meeting.clientName || null;

  const parseLocalDate = (dateStr: string) => {
    const [year, month, day] = dateStr.split('-').map(Number);
    return new Date(year, month - 1, day);
  };

  const formatDate = (dateStr: string) => {
    return parseLocalDate(dateStr).toLocaleDateString('es-ES', {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  const formatTime = (time: string) => {
    const [h, m] = time.split(':');
    const hour = parseInt(h);
    const ampm = hour >= 12 ? 'PM' : 'AM';
    const hour12 = hour % 12 || 12;
    return `${hour12}:${m} ${ampm}`;
  };

  return (
    <div 
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-in fade-in duration-200"
      onClick={(e) => {
        if (e.target === e.currentTarget) onClose();
      }}
    >
      <div className="bg-night border border-border-subtle rounded-xl w-full max-w-lg shadow-depth overflow-hidden flex flex-col max-h-[90vh]">
        {meeting.coverUrl && (
          <div className="relative h-32 overflow-hidden">
            <img 
              src={meeting.coverUrl} 
              alt="Cover" 
              className="w-full h-full object-cover"
              style={{
                objectPosition: meeting.coverPosition 
                  ? `${meeting.coverPosition.x}% ${meeting.coverPosition.y}%` 
                  : 'center'
              }}
            />
            <div className="absolute inset-0 bg-gradient-to-t from-night via-night/40 to-transparent"></div>
          </div>
        )}

        <div className="p-4 border-b border-border-subtle flex justify-between items-center bg-surface-low">
          <h3 className="text-lg font-designer text-mist uppercase tracking-wide">
            Detalle de Reunión
          </h3>
          <button onClick={onClose} className="text-mist-muted hover:text-mist"><X size={20} /></button>
        </div>
        
        <div className="p-6 space-y-5 overflow-y-auto custom-scrollbar">
          <div>
            <h2 className="text-xl font-bold text-mist mb-2">{meeting.title}</h2>
            <div className="flex flex-wrap gap-2">
              <span className={`px-2 py-1 rounded text-xs font-bold flex items-center gap-1 ${meeting.isRemote ? 'bg-purple-500/20 text-purple-300' : 'bg-green-500/20 text-green-300'}`}>
                {meeting.isRemote ? <Video size={12}/> : <MapPin size={12}/>}
                {meeting.isRemote ? 'Remota' : 'Presencial'}
              </span>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-1">
              <label className="text-xs uppercase font-bold text-mist-muted flex items-center gap-2">
                <Calendar size={14}/> Fecha
              </label>
              <div className="bg-surface-low/50 rounded-lg p-2 border border-border-subtle">
                <span className="text-sm text-mist">{formatDate(meeting.date)}</span>
              </div>
            </div>
            <div className="space-y-1">
              <label className="text-xs uppercase font-bold text-mist-muted flex items-center gap-2">
                <Clock size={14}/> Horario
              </label>
              <div className="bg-surface-low/50 rounded-lg p-2 border border-border-subtle">
                <span className="text-sm text-mist">
                  {formatTime(meeting.startTime)} - {formatTime(meeting.endTime)}
                </span>
              </div>
            </div>
          </div>

          {meeting.description && (
            <div className="space-y-1">
              <label className="text-xs uppercase font-bold text-mist-muted flex items-center gap-2">
                <AlignLeft size={14}/> Descripción
              </label>
              <p className="text-sm text-mist bg-surface-low/50 rounded-lg p-3 border border-border-subtle">
                {meeting.description}
              </p>
            </div>
          )}

          {clientDisplayName && (
            <div className="space-y-1">
              <label className="text-xs uppercase font-bold text-mist-muted flex items-center gap-2">
                <Building2 size={14}/> Cliente
              </label>
              <div className="bg-surface-low/50 rounded-lg p-2 border border-border-subtle">
                <span className="text-sm text-mist">{clientDisplayName}</span>
              </div>
            </div>
          )}

          <div className="space-y-2">
            <label className="text-xs uppercase font-bold text-mist-muted flex items-center gap-2">
              <Users size={14}/> Asistentes
            </label>
            <div className="flex flex-wrap gap-2">
              {attendees.length === 0 ? (
                <span className="text-sm text-mist-muted italic">Sin asistentes asignados</span>
              ) : (
                attendees.map(user => (
                  <div key={user.id} className="flex items-center gap-2 bg-surface-low/50 rounded-lg px-3 py-2 border border-border-subtle">
                    {user.avatarUrl ? (
                      <img src={user.avatarUrl} alt={user.name} className="w-6 h-6 rounded-full object-cover" />
                    ) : (
                      <div className="w-6 h-6 rounded-full bg-neon/20 flex items-center justify-center">
                        <Users size={12} className="text-neon" />
                      </div>
                    )}
                    <span className="text-sm text-mist">{user.name}</span>
                  </div>
                ))
              )}
            </div>
          </div>

          {meeting.link && (
            <div className="space-y-1">
              <label className="text-xs uppercase font-bold text-mist-muted flex items-center gap-2">
                <LinkIcon size={14}/> Enlace
              </label>
              <div className="bg-surface-low/50 rounded-lg p-2 border border-border-subtle">
                <a 
                  href={meeting.link} 
                  target="_blank" 
                  rel="noopener noreferrer" 
                  className="text-sm text-neon hover:underline flex items-center gap-2"
                >
                  <Video size={14}/>
                  {meeting.link}
                </a>
              </div>
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

export default MeetingViewModal;
