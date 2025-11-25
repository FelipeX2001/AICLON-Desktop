
import React, { useState } from 'react';
import { User, Task, MeetingEvent, ActiveClient, Lead } from '../types';
import { X, Edit2, Calendar, CheckSquare, Building2, Clock, Mail, Shield, Briefcase, MapPin } from 'lucide-react';

interface UserProfileDetailModalProps {
  isOpen: boolean;
  onClose: () => void;
  user: User;
  currentUser: User;
  onEditProfile: (user: User) => void;
  tasks: Task[];
  meetings: MeetingEvent[];
  activeClients: ActiveClient[];
  leads: Lead[];
}

const UserProfileDetailModal: React.FC<UserProfileDetailModalProps> = ({
  isOpen,
  onClose,
  user,
  currentUser,
  onEditProfile,
  tasks,
  meetings,
  activeClients,
  leads
}) => {
  const [activeTab, setActiveTab] = useState<'tasks' | 'calendar' | 'clients'>('tasks');

  if (!isOpen) return null;

  const isAdmin = currentUser.role === 'admin';
  const isMe = currentUser.id === user.id;
  const canEdit = isAdmin || isMe;

  // --- FILTER DATA ---
  const userTasks = tasks.filter(t => t.assigneeId === user.id);
  const userMeetings = meetings.filter(m => m.attendeeIds.includes(user.id));
  
  // Derive Clients: Clients linked via Tasks or Meetings
  const userClientNames = new Set<string>();
  userTasks.forEach(t => userClientNames.add(t.clientName));
  userMeetings.forEach(m => {
      if (m.clientId) userClientNames.add(m.clientId);
  });

  const relatedActiveClients = activeClients.filter(c => userClientNames.has(c.nombre_empresa));
  const relatedLeads = leads.filter(l => userClientNames.has(l.nombre_empresa) || userClientNames.has(l.nombre_contacto));

  return (
    <div 
        className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md animate-in fade-in duration-200"
        onClick={(e) => {
            if (e.target === e.currentTarget) onClose();
        }}
    >
      <div className="bg-night border border-border-subtle rounded-2xl w-full max-w-4xl shadow-depth overflow-hidden flex flex-col max-h-[90vh]">
        
        {/* Header / Cover */}
        <div className="relative bg-gradient-to-b from-surface-med to-night p-8 flex flex-col items-center border-b border-border-subtle">
            <button onClick={onClose} className="absolute top-4 right-4 text-mist-muted hover:text-mist p-2 rounded-full hover:bg-white/5 transition-colors">
                <X size={24} />
            </button>

            <div className="relative">
                <img 
                    src={user.avatarUrl} 
                    alt={user.name} 
                    className="w-40 h-40 rounded-full object-cover border-4 border-night shadow-[0_0_30px_rgba(0,200,255,0.3)]"
                />
                <div className={`absolute bottom-2 right-2 px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider border shadow-lg ${
                    user.role === 'admin' 
                    ? 'bg-night text-neon-orange border-neon-orange' 
                    : 'bg-night text-neon border-neon'
                }`}>
                    {user.role}
                </div>
            </div>

            <h2 className="text-3xl font-designer text-mist mt-4">{user.name}</h2>
            <div className="flex items-center text-mist-muted text-sm mt-1 space-x-4">
                <span className="flex items-center"><Mail size={14} className="mr-1.5"/> {user.email}</span>
            </div>

            {canEdit && (
                <button 
                    onClick={() => onEditProfile(user)}
                    className="mt-6 px-6 py-2 rounded-full border border-neon/50 text-neon hover:bg-neon hover:text-night font-bold text-sm transition-all flex items-center"
                >
                    <Edit2 size={14} className="mr-2" /> Editar Perfil
                </button>
            )}
        </div>

        {/* Tabs */}
        <div className="flex border-b border-border-subtle bg-surface-low">
            <button 
                onClick={() => setActiveTab('tasks')}
                className={`flex-1 py-4 text-sm font-bold uppercase tracking-wide transition-colors relative ${activeTab === 'tasks' ? 'text-neon' : 'text-mist-muted hover:text-mist'}`}
            >
                <CheckSquare size={16} className="inline mr-2 -mt-0.5" /> Tareas ({userTasks.length})
                {activeTab === 'tasks' && <div className="absolute bottom-0 left-0 w-full h-0.5 bg-neon shadow-[0_0_10px_rgba(0,200,255,0.8)]"></div>}
            </button>
            <button 
                onClick={() => setActiveTab('calendar')}
                className={`flex-1 py-4 text-sm font-bold uppercase tracking-wide transition-colors relative ${activeTab === 'calendar' ? 'text-neon' : 'text-mist-muted hover:text-mist'}`}
            >
                <Calendar size={16} className="inline mr-2 -mt-0.5" /> Calendario ({userMeetings.length})
                {activeTab === 'calendar' && <div className="absolute bottom-0 left-0 w-full h-0.5 bg-neon shadow-[0_0_10px_rgba(0,200,255,0.8)]"></div>}
            </button>
            <button 
                onClick={() => setActiveTab('clients')}
                className={`flex-1 py-4 text-sm font-bold uppercase tracking-wide transition-colors relative ${activeTab === 'clients' ? 'text-neon' : 'text-mist-muted hover:text-mist'}`}
            >
                <Building2 size={16} className="inline mr-2 -mt-0.5" /> Clientes ({relatedActiveClients.length + relatedLeads.length})
                {activeTab === 'clients' && <div className="absolute bottom-0 left-0 w-full h-0.5 bg-neon shadow-[0_0_10px_rgba(0,200,255,0.8)]"></div>}
            </button>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-y-auto p-6 bg-night/50 custom-scrollbar">
            
            {/* --- TASKS TAB --- */}
            {activeTab === 'tasks' && (
                <div className="space-y-3">
                    {userTasks.length === 0 ? (
                        <div className="text-center py-10 text-mist-faint text-sm italic">Sin tareas asignadas.</div>
                    ) : (
                        userTasks.map(task => (
                            <div key={task.id} className="bg-surface-low border border-border-subtle rounded-lg p-4 flex items-center justify-between hover:border-neon/30 transition-colors">
                                <div>
                                    <h4 className="text-mist font-bold text-sm">{task.title}</h4>
                                    <div className="flex items-center text-xs text-mist-muted mt-1 space-x-3">
                                        <span className="flex items-center"><Building2 size={12} className="mr-1"/> {task.clientName}</span>
                                        <span className="flex items-center"><Clock size={12} className="mr-1"/> {task.deadline}</span>
                                    </div>
                                </div>
                                <div className="text-right">
                                    <span className={`text-[10px] px-2 py-1 rounded font-bold uppercase border ${
                                        task.priority === 'Urgente' ? 'text-red-500 border-red-500/20 bg-red-500/10' : 
                                        task.priority === 'Alta' ? 'text-neon-orange border-neon-orange/20 bg-neon-orange/10' : 
                                        'text-blue-400 border-blue-400/20 bg-blue-400/10'
                                    }`}>
                                        {task.priority}
                                    </span>
                                    <p className="text-[10px] text-mist-muted mt-2 uppercase tracking-wider">{task.status}</p>
                                </div>
                            </div>
                        ))
                    )}
                </div>
            )}

            {/* --- CALENDAR TAB --- */}
            {activeTab === 'calendar' && (
                <div className="space-y-3">
                    {userMeetings.length === 0 ? (
                        <div className="text-center py-10 text-mist-faint text-sm italic">Sin reuniones programadas.</div>
                    ) : (
                        userMeetings.map(meeting => (
                            <div key={meeting.id} className="bg-surface-low border border-border-subtle rounded-lg p-4 flex items-start space-x-4">
                                <div className="bg-surface-med rounded-lg p-2 text-center min-w-[60px] border border-border-subtle">
                                    <span className="block text-xs text-neon-blue font-bold uppercase">{new Date(meeting.date).toLocaleDateString('es-ES', { weekday: 'short' })}</span>
                                    <span className="block text-lg text-mist font-bold">{new Date(meeting.date).getDate()}</span>
                                </div>
                                <div>
                                    <h4 className="text-mist font-bold text-sm">{meeting.title}</h4>
                                    <div className="text-xs text-mist-muted mt-1 font-mono">
                                        {meeting.startTime} - {meeting.endTime}
                                    </div>
                                    {meeting.clientId && (
                                        <div className="mt-2 inline-flex items-center px-2 py-0.5 rounded bg-white/5 text-[10px] text-mist-muted border border-border-subtle">
                                            <Building2 size={10} className="mr-1"/> {meeting.clientId}
                                        </div>
                                    )}
                                </div>
                            </div>
                        ))
                    )}
                </div>
            )}

            {/* --- CLIENTS TAB --- */}
            {activeTab === 'clients' && (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {relatedActiveClients.map(client => (
                        <div key={client.activeId} className="bg-surface-low border border-border-subtle rounded-lg p-4 relative overflow-hidden">
                            <div className="absolute top-0 left-0 w-1 h-full bg-neon"></div>
                            <h4 className="text-mist font-bold text-sm ml-2">{client.nombre_empresa}</h4>
                            <p className="text-xs text-mist-muted ml-2 mt-0.5 flex items-center"><Briefcase size={10} className="mr-1"/> {client.sector}</p>
                            <div className="mt-3 ml-2 flex items-center justify-between">
                                <span className="text-[10px] uppercase font-bold text-neon bg-neon/10 px-2 py-0.5 rounded">Activo</span>
                                <span className="text-xs font-mono text-mist">{client.valor_mensual_servicio}</span>
                            </div>
                        </div>
                    ))}
                    {relatedLeads.map(lead => (
                        <div key={lead.id} className="bg-surface-low border border-border-subtle rounded-lg p-4 relative overflow-hidden opacity-80">
                            <div className="absolute top-0 left-0 w-1 h-full bg-neon-orange"></div>
                            <h4 className="text-mist font-bold text-sm ml-2">{lead.nombre_empresa || lead.nombre_contacto}</h4>
                            <p className="text-xs text-mist-muted ml-2 mt-0.5 flex items-center"><MapPin size={10} className="mr-1"/> {lead.ciudad}</p>
                            <div className="mt-3 ml-2">
                                <span className="text-[10px] uppercase font-bold text-neon-orange bg-neon-orange/10 px-2 py-0.5 rounded">Lead: {lead.etapa}</span>
                            </div>
                        </div>
                    ))}
                    {relatedActiveClients.length === 0 && relatedLeads.length === 0 && (
                        <div className="col-span-full text-center py-10 text-mist-faint text-sm italic">
                            No hay clientes asociados a sus tareas o reuniones.
                        </div>
                    )}
                </div>
            )}

        </div>
      </div>
    </div>
  );
};

export default UserProfileDetailModal;
