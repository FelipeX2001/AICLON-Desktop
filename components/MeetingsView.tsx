
import React, { useState, useEffect } from 'react';
import { MeetingEvent, User, CurrentClient, Lead } from '../types';
import MeetingModal from './MeetingModal';
import { ChevronLeft, ChevronRight, Plus, Video, MapPin, ExternalLink, Users } from 'lucide-react';

interface MeetingsViewProps {
  user: User;
  users: User[];
}

// Default meetings for demo
const DEFAULT_MEETINGS: MeetingEvent[] = [
  {
    id: '1',
    title: 'Daily Standup',
    date: new Date().toISOString().split('T')[0], // Today
    startTime: '10:00',
    endTime: '10:30',
    attendeeIds: ['1', '2'],
    isRemote: true,
    description: 'Sincronización diaria del equipo'
  },
  {
    id: '2',
    title: 'Revisión con Cliente',
    date: new Date().toISOString().split('T')[0], // Today
    startTime: '14:00',
    endTime: '15:00',
    attendeeIds: ['1'],
    clientId: 'TechCorp',
    isRemote: true,
    link: 'https://meet.google.com/abc-defg-hij'
  }
];

const MeetingsView: React.FC<MeetingsViewProps> = ({ user, users }) => {
  const [currentDate, setCurrentDate] = useState(new Date());
  const [events, setEvents] = useState<MeetingEvent[]>(() => {
    try {
      const saved = localStorage.getItem('aiclon_meetings');
      return saved ? JSON.parse(saved) : DEFAULT_MEETINGS;
    } catch { return DEFAULT_MEETINGS; }
  });

  const [clients, setClients] = useState<string[]>([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingEvent, setEditingEvent] = useState<MeetingEvent | null>(null);

  // Persistence
  useEffect(() => {
    localStorage.setItem('aiclon_meetings', JSON.stringify(events));
  }, [events]);

  // Load clients for dropdown
  useEffect(() => {
    const currentClientsStr = localStorage.getItem('aiclon_current_clients');
    const leadsStr = localStorage.getItem('aiclon_leads');
    const clientNames = new Set<string>();
    if (currentClientsStr) JSON.parse(currentClientsStr).forEach((c: CurrentClient) => clientNames.add(c.name));
    if (leadsStr) JSON.parse(leadsStr).forEach((l: Lead) => {
        if (l.nombre_empresa) clientNames.add(l.nombre_empresa);
        else if (l.nombre_contacto) clientNames.add(l.nombre_contacto);
    });
    if (clientNames.size === 0) ['TechCorp', 'Imperio de la Moda'].forEach(n => clientNames.add(n));
    setClients(Array.from(clientNames));
  }, []);

  // --- CALENDAR LOGIC ---
  const getStartOfWeek = (d: Date) => {
    const date = new Date(d);
    const day = date.getDay();
    const diff = date.getDate() - day + (day === 0 ? -6 : 1); // Adjust when day is Sunday
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

  // --- CRUD ---
  const handleSaveEvent = (event: MeetingEvent) => {
    if (editingEvent) {
      setEvents(prev => prev.map(e => e.id === event.id ? event : e));
    } else {
      setEvents(prev => [...prev, event]);
    }
    setIsModalOpen(false);
  };

  const handleDeleteEvent = (id: string) => {
    setEvents(prev => prev.filter(e => e.id !== id));
    setIsModalOpen(false);
  };

  const openCreateModal = () => {
    setEditingEvent(null);
    setIsModalOpen(true);
  };

  const openEditModal = (event: MeetingEvent) => {
    setEditingEvent(event);
    setIsModalOpen(true);
  };

  // --- RENDER HELPERS ---
  const hours = Array.from({ length: 14 }, (_, i) => i + 7); // 7:00 to 20:00

  const getEventStyle = (event: MeetingEvent) => {
    const startH = parseInt(event.startTime.split(':')[0]);
    const startM = parseInt(event.startTime.split(':')[1]);
    const endH = parseInt(event.endTime.split(':')[0]);
    const endM = parseInt(event.endTime.split(':')[1]);

    const startMinutes = (startH - 7) * 60 + startM;
    const endMinutes = (endH - 7) * 60 + endM;
    const duration = endMinutes - startMinutes;

    return {
      top: `${(startMinutes / 60) * 80}px`, // 80px per hour height
      height: `${(duration / 60) * 80}px`,
    };
  };

  return (
    <div className="h-full flex flex-col">
      <div className="flex justify-between items-center mb-6">
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
        
        {/* Header Grid (Days) */}
        <div className="flex border-b border-border-subtle bg-surface-med/80">
          <div className="w-16 border-r border-border-subtle flex-shrink-0"></div> {/* Time axis header */}
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

        {/* Body Grid (Hours) */}
        <div className="flex-1 overflow-y-auto custom-scrollbar relative">
          <div className="flex min-h-[1120px]"> {/* 14 hours * 80px */}
            
            {/* Time Column */}
            <div className="w-16 flex-shrink-0 border-r border-border-subtle bg-surface-low">
               {hours.map(h => (
                  <div key={h} className="h-20 border-b border-border-subtle/50 text-[10px] text-mist-muted font-mono p-2 text-right relative">
                     {h}:00
                     <div className="absolute top-0 right-0 w-2 h-[1px] bg-border-subtle"></div>
                  </div>
               ))}
            </div>

            {/* Days Columns */}
            <div className="flex-1 grid grid-cols-6 relative">
               {/* Background Grid Lines */}
               {weekDays.map((day, dayIndex) => (
                  <div key={dayIndex} className="border-r border-border-subtle/30 last:border-r-0 relative h-full">
                      {hours.map(h => (
                          <div key={h} className="h-20 border-b border-border-subtle/30 w-full"></div>
                      ))}

                      {/* Events for this day */}
                      {events
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
               
               {/* Current Time Line (if visible week) */}
               {weekDays.some(d => d.toDateString() === new Date().toDateString()) && (
                   (() => {
                       const now = new Date();
                       const currentHour = now.getHours();
                       const currentMin = now.getMinutes();
                       if (currentHour >= 7 && currentHour < 21) {
                           const top = ((currentHour - 7) * 60 + currentMin) / 60 * 80;
                           const dayIndex = (now.getDay() + 6) % 7; // Mon=0, Sat=5
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
      />
    </div>
  );
};

export default MeetingsView;
