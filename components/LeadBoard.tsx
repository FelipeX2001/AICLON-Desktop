
import React, { useState, useEffect, useRef } from 'react';
import { Lead, LEAD_STAGES, LeadStage, LeadMilestones, User, ActiveClient, DroppedClient } from '../types';
import LeadModal from './LeadModal';
import { Plus, GripVertical, Building2, MapPin, User as UserIcon, Briefcase, ArrowRightCircle, X, Save, DollarSign, Calendar } from 'lucide-react';

interface LeadBoardProps {
  user?: User; 
}

const DEFAULT_MILESTONES: LeadMilestones = {
  envio_propuesta: false,
  envio_contrato: false,
  pago_primer_50: false,
  envio_capacitaciones: false,
  envio_accesos: false,
  pago_50_final: false,
  ia_activada: false
};

const DEFAULT_LEADS: Lead[] = [
  {
    id: 'lead-1',
    etapa: 'Primer Contacto',
    nombre_empresa: 'Dr. Jhon García',
    nombre_contacto: '',
    sector: 'Médico',
    ciudad: '',
    telefono: '',
    email: '',
    email_secundario: '',
    web: '',
    fuente_origen: 'Ocean',
    servicio_interes: 'Agente IA',
    necesidad: 'Agendar citas, mientras se acompaña al paciente con seguridad y tranquilidad. (Agendamiento)',
    fecha_envio_propuesta: '2025-11-12',
    valor_implementacion: '',
    valor_mensualidad: '',
    fecha_primer_contacto: '2025-11-10',
    comentarios: '',
    resultado_final: '',
    fecha_cierre_real: '',
    hitos: DEFAULT_MILESTONES
  },
  {
    id: 'lead-3',
    etapa: 'Pendiente de Propuesta',
    nombre_empresa: 'Imperio de la Moda',
    nombre_contacto: 'Juan Pablo Quintero',
    sector: 'Moda',
    ciudad: 'Medellín',
    telefono: '3013161019',
    email: 'juanpablo5463917@gmail.com',
    email_secundario: '',
    web: 'IMPERIO DE LA MODA (@imperiode_lamoda) • Perfil de Instagram',
    fuente_origen: 'Evento Col 4.0 Medellín',
    servicio_interes: 'Agente IA',
    necesidad: 'Necesita atender a los clientes que llegan desde anuncio. Aproximadamente 2400 mensajes mensuales. Implementar despues en sus 11 tiendas',
    fecha_envio_propuesta: '2025-11-06',
    valor_implementacion: '',
    valor_mensualidad: '',
    fecha_primer_contacto: '2025-11-01',
    comentarios: 'Pausado por Diciembre',
    resultado_final: '',
    fecha_cierre_real: '',
    hitos: DEFAULT_MILESTONES
  }
];

const LeadBoard: React.FC<LeadBoardProps> = ({ user }) => {
  // --- STATE ---
  const [leads, setLeads] = useState<Lead[]>(() => {
    try {
      const saved = localStorage.getItem('aiclon_leads');
      return saved && JSON.parse(saved).length > 0 ? JSON.parse(saved) : DEFAULT_LEADS;
    } catch (e) {
      return DEFAULT_LEADS;
    }
  });

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingLead, setEditingLead] = useState<Lead | null>(null);

  // Conversion State
  const [isConversionModalOpen, setIsConversionModalOpen] = useState(false);
  const [leadToConvert, setLeadToConvert] = useState<Lead | null>(null);
  const [conversionData, setConversionData] = useState({
    valor_mensual: '',
    fecha_inicio: new Date().toISOString().split('T')[0],
    fecha_corte: '',
    pago_mes: false
  });

  // --- PERSISTENCE ---
  useEffect(() => {
    localStorage.setItem('aiclon_leads', JSON.stringify(leads));
  }, [leads]);

  // --- DRAG TO SCROLL REFS ---
  const scrollContainerRef = useRef<HTMLDivElement>(null);
  const isDraggingScroll = useRef(false);
  const startX = useRef(0);
  const scrollLeft = useRef(0);

  // --- HANDLERS ---
  const handleSaveLead = (lead: Lead) => {
    if (editingLead) {
      setLeads(prev => prev.map(l => l.id === lead.id ? lead : l));
    } else {
      setLeads(prev => [...prev, lead]);
    }
    setIsModalOpen(false);
  };

  const handleDeleteLead = (leadId: string) => {
    setLeads(prev => prev.filter(l => l.id !== leadId));
    setIsModalOpen(false);
  };

  const handleDropLead = (dropped: DroppedClient) => {
      // 1. Save to dropped
      try {
          const existing = localStorage.getItem('aiclon_dropped_clients');
          const droppedList = existing ? JSON.parse(existing) : [];
          droppedList.push(dropped);
          localStorage.setItem('aiclon_dropped_clients', JSON.stringify(droppedList));
      } catch (e) {
          console.error("Error saving dropped client", e);
      }

      // 2. Remove from leads
      setLeads(prev => prev.filter(l => l.id !== dropped.originalId));
      setIsModalOpen(false);
  };

  const openCreateModal = () => {
    setEditingLead(null);
    setIsModalOpen(true);
  };

  const openEditModal = (lead: Lead) => {
    setEditingLead(lead);
    setIsModalOpen(true);
  };

  const openConversionModal = (e: React.MouseEvent, lead: Lead) => {
      e.stopPropagation();
      setLeadToConvert(lead);
      setConversionData({
          valor_mensual: lead.valor_mensualidad || '',
          fecha_inicio: new Date().toISOString().split('T')[0],
          fecha_corte: '',
          pago_mes: false
      });
      setIsConversionModalOpen(true);
  };

  const handleConvertClient = (e: React.FormEvent) => {
      e.preventDefault();
      if (!leadToConvert) return;

      // 1. Create Active Client Object
      const newActiveClient: ActiveClient = {
          ...leadToConvert,
          activeId: Date.now().toString(),
          leadId: leadToConvert.id,
          valor_mensual_servicio: conversionData.valor_mensual,
          fecha_inicio_servicio: conversionData.fecha_inicio,
          fecha_corte: conversionData.fecha_corte,
          pago_mes_actual: conversionData.pago_mes,
          estado_servicio: 'En servicio'
      };

      // 2. Save to Active Clients LocalStorage
      try {
          const existing = localStorage.getItem('aiclon_active_clients');
          const clients = existing ? JSON.parse(existing) : [];
          clients.push(newActiveClient);
          localStorage.setItem('aiclon_active_clients', JSON.stringify(clients));
          alert('Lead convertido exitosamente a Cliente Activo!');
      } catch (err) {
          console.error("Error saving active client", err);
          alert('Error al convertir lead.');
      }

      // 3. Optional: Update Lead Status? (Leaving as Lead Cerrado for now)
      setIsConversionModalOpen(false);
      setLeadToConvert(null);
  };

  // --- DRAG AND DROP (CARDS) ---
  const handleDragStart = (e: React.DragEvent, leadId: string) => {
    e.dataTransfer.setData('leadId', leadId);
    e.dataTransfer.effectAllowed = 'move';
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    e.dataTransfer.dropEffect = 'move';
  };

  const handleDrop = (e: React.DragEvent, stage: LeadStage) => {
    e.preventDefault();
    const leadId = e.dataTransfer.getData('leadId');
    const lead = leads.find(l => l.id === leadId);
    
    if (lead && lead.etapa !== stage) {
      setLeads(prev => prev.map(l => 
        l.id === leadId ? { ...l, etapa: stage } : l
      ));
    }
  };

  // --- DRAG TO SCROLL (BOARD) HANDLERS ---
  const handleMouseDown = (e: React.MouseEvent) => {
    if ((e.target as HTMLElement).closest('.lead-card')) return;
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

  const getProgress = (lead: Lead) => {
    const total = Object.keys(lead.hitos).length;
    const completed = Object.values(lead.hitos).filter(Boolean).length;
    return Math.round((completed / total) * 100);
  };

  const isAdmin = user?.role === 'admin';

  return (
    <div className="h-full flex flex-col">
      <div className="flex justify-between items-center mb-6 px-1">
        <div>
          <h2 className="text-3xl font-designer text-mist">Clientes en Proceso</h2>
          <p className="text-mist-muted text-sm mt-1">Gestiona el flujo de leads desde el primer contacto hasta el cierre.</p>
        </div>
        <button 
          onClick={openCreateModal}
          className="px-6 py-2.5 rounded-lg bg-gradient-primary text-mist font-bold shadow-neon-glow hover:brightness-110 transition-all flex items-center"
        >
          <Plus size={18} className="mr-2" /> Crear Lead
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
          {LEAD_STAGES.map((stage) => {
            const stageLeads = leads.filter(l => l.etapa === stage);
            
            return (
              <div 
                key={stage}
                className="w-80 flex flex-col bg-surface-low/50 border border-border-subtle rounded-xl overflow-hidden"
                onDragOver={handleDragOver}
                onDrop={(e) => handleDrop(e, stage)}
              >
                <div className="p-3 bg-surface-med border-b border-border-subtle flex justify-between items-center sticky top-0 z-10">
                  <span className="font-bold text-sm text-mist uppercase tracking-wide truncate max-w-[200px]" title={stage}>
                    {stage}
                  </span>
                  <span className="bg-night border border-border-subtle text-neon text-xs font-bold px-2 py-0.5 rounded-full">
                    {stageLeads.length}
                  </span>
                </div>

                <div className="flex-1 overflow-y-auto p-3 space-y-3 custom-scrollbar">
                  {stageLeads.map((lead) => (
                    <div
                      key={lead.id}
                      draggable
                      onDragStart={(e) => handleDragStart(e, lead.id)}
                      onClick={() => openEditModal(lead)}
                      className="lead-card bg-night border border-border-subtle rounded-lg hover:border-neon/50 hover:shadow-card-glow transition-all cursor-pointer group relative flex flex-col overflow-hidden"
                    >
                      {/* Cover Image */}
                      {lead.coverUrl && (
                          <div className="h-24 w-full relative border-b border-border-subtle -mt-4 -mx-4 mb-4 w-[calc(100%+2rem)]">
                              <img src={lead.coverUrl} alt="Cover" className="w-full h-full object-cover" />
                              <div className="absolute inset-0 bg-gradient-to-t from-night/80 to-transparent pointer-events-none" />
                          </div>
                      )}

                      <div className="absolute top-2 right-2 text-mist-muted/20 group-hover:text-mist-muted cursor-grab z-10">
                        <GripVertical size={14} />
                      </div>
                      <h4 className="font-montserrat font-bold text-mist text-base pr-4 mb-2 truncate relative z-10">
                        {lead.nombre_empresa || 'Cliente Sin Nombre'}
                      </h4>
                      <div className="space-y-1.5 mb-3 border-l-2 border-border-subtle pl-2 ml-1">
                        <div className="flex items-center text-xs text-mist-muted truncate" title="Nombre Contacto">
                           <UserIcon size={12} className="mr-2 text-neon" />
                           {lead.nombre_contacto || 'Sin contacto'}
                        </div>
                        <div className="flex items-center text-xs text-mist-muted truncate" title="Sector">
                           <Briefcase size={12} className="mr-2 text-neon-blue" />
                           {lead.sector || 'Sin sector'}
                        </div>
                      </div>
                      <div className="mt-auto pt-2">
                        <div className="flex justify-between text-[10px] text-mist-muted mb-1">
                           <span className="font-medium">Progreso</span>
                           <span className={getProgress(lead) === 100 ? 'text-neon font-bold' : ''}>{getProgress(lead)}%</span>
                        </div>
                        <div className="w-full h-1.5 bg-surface-med rounded-full overflow-hidden">
                           <div 
                             className={`h-full transition-all duration-300 ${getProgress(lead) === 100 ? 'bg-neon' : 'bg-neon-blue'}`}
                             style={{ width: `${getProgress(lead)}%` }}
                           />
                        </div>
                      </div>

                      {/* Conversion Button for Closed Leads */}
                      {stage === 'Lead Cerrado' && (
                          <button
                            onClick={(e) => openConversionModal(e, lead)}
                            className="mt-3 w-full py-1.5 rounded bg-neon/10 border border-neon/30 text-neon text-xs font-bold uppercase hover:bg-neon hover:text-night transition-all flex items-center justify-center"
                          >
                             Inicio de Servicio <ArrowRightCircle size={12} className="ml-1.5" />
                          </button>
                      )}

                      {lead.comentarios && (
                         <div className="absolute bottom-2 right-2 w-1.5 h-1.5 bg-neon-orange rounded-full animate-pulse" title="Tiene comentarios"></div>
                      )}
                    </div>
                  ))}
                  {stageLeads.length === 0 && (
                     <div className="h-20 border-2 border-dashed border-border-subtle rounded-lg flex items-center justify-center text-xs text-mist-faint bg-night/30">
                        Arrastra leads aquí
                     </div>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </div>
      
      {/* Modals */}
      <LeadModal 
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        leadToEdit={editingLead}
        onSave={handleSaveLead}
        onDelete={handleDeleteLead}
        onDrop={handleDropLead}
        isAdmin={isAdmin}
      />

      {/* Conversion Modal */}
      {isConversionModalOpen && (
          <div className="fixed inset-0 z-[60] flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-in fade-in duration-200">
             <div className="bg-night border border-border-subtle rounded-xl w-full max-w-md shadow-depth overflow-hidden">
                 <div className="p-4 border-b border-border-subtle flex justify-between items-center bg-surface-low">
                    <h3 className="text-lg font-designer text-mist uppercase">Iniciar Servicio</h3>
                    <button onClick={() => setIsConversionModalOpen(false)} className="text-mist-muted hover:text-mist"><X size={20}/></button>
                 </div>
                 <form onSubmit={handleConvertClient} className="p-6 space-y-4">
                    <p className="text-sm text-mist-muted mb-2">
                        Convirtiendo a <strong>{leadToConvert?.nombre_empresa}</strong> en Cliente Activo.
                    </p>
                    
                    <div className="space-y-1">
                        <label className="text-xs uppercase font-bold text-mist-muted flex items-center gap-2">
                            <DollarSign size={14}/> Valor Mensual
                        </label>
                        <input 
                            type="text" 
                            required 
                            value={conversionData.valor_mensual} 
                            onChange={e => setConversionData({...conversionData, valor_mensual: e.target.value})} 
                            className="w-full bg-surface-low border border-border-subtle rounded p-2 text-mist focus:border-neon focus:outline-none"
                        />
                    </div>
                    <div className="space-y-1">
                        <label className="text-xs uppercase font-bold text-mist-muted flex items-center gap-2">
                            <Calendar size={14}/> Fecha Inicio
                        </label>
                        <input 
                            type="date" 
                            required 
                            value={conversionData.fecha_inicio} 
                            onChange={e => setConversionData({...conversionData, fecha_inicio: e.target.value})} 
                            className="w-full bg-surface-low border border-border-subtle rounded p-2 text-mist focus:border-neon focus:outline-none"
                        />
                    </div>
                    <div className="space-y-1">
                        <label className="text-xs uppercase font-bold text-mist-muted flex items-center gap-2">
                            <Calendar size={14}/> Fecha Corte / Facturación
                        </label>
                        <input 
                            type="text" 
                            required 
                            placeholder="Ej. Día 5 de cada mes"
                            value={conversionData.fecha_corte} 
                            onChange={e => setConversionData({...conversionData, fecha_corte: e.target.value})} 
                            className="w-full bg-surface-low border border-border-subtle rounded p-2 text-mist focus:border-neon focus:outline-none"
                        />
                    </div>
                    
                    <label className="flex items-center space-x-3 cursor-pointer p-2 rounded hover:bg-surface-low transition-colors">
                        <input 
                            type="checkbox" 
                            checked={conversionData.pago_mes}
                            onChange={(e) => setConversionData({...conversionData, pago_mes: e.target.checked})}
                            className="w-4 h-4 rounded border-border-subtle bg-night checked:bg-neon checked:border-neon text-neon focus:ring-neon"
                        />
                        <span className="text-sm text-mist">Pago del mes inicial recibido</span>
                    </label>

                    <div className="pt-4 flex justify-end space-x-3">
                        <button type="button" onClick={() => setIsConversionModalOpen(false)} className="px-4 py-2 text-sm text-mist-muted">Cancelar</button>
                        <button type="submit" className="px-6 py-2 rounded bg-gradient-primary text-mist text-sm font-bold shadow-neon-glow hover:brightness-110 flex items-center">
                            <Save size={16} className="mr-2"/> Confirmar
                        </button>
                    </div>
                 </form>
             </div>
          </div>
      )}
    </div>
  );
};

export default LeadBoard;
