import React from 'react';
import { Lead, User, LeadMilestones, LEAD_STAGES } from '../types';
import { X, Edit, User as UserIcon, Building2, Phone, Mail, Globe, MapPin, Calendar, DollarSign, MessageSquare, CheckSquare, Square, TrendingUp, Briefcase, Target } from 'lucide-react';

interface LeadViewModalProps {
  isOpen: boolean;
  onClose: () => void;
  lead: Lead;
  users: User[];
  onEdit: () => void;
}

const LeadViewModal: React.FC<LeadViewModalProps> = ({ 
  isOpen, 
  onClose, 
  lead, 
  users,
  onEdit
}) => {
  if (!isOpen || !lead) return null;

  const assignee = users.find(u => u.id === lead.assignedUserId);

  const milestones = lead.hitos || {};
  const milestoneLabels: Record<keyof LeadMilestones, string> = {
    envio_propuesta: 'Envío Propuesta',
    envio_contrato: 'Envío Contrato',
    pago_primer_50: 'Pago Primer 50%',
    envio_capacitaciones: 'Envío Capacitaciones',
    envio_accesos: 'Envío Accesos',
    pago_50_final: 'Pago 50% Final',
    ia_activada: 'IA Activada'
  };

  const totalMilestones = Object.keys(milestoneLabels).length;
  const completedMilestones = Object.values(milestones).filter(Boolean).length;
  const progressPercent = Math.round((completedMilestones / totalMilestones) * 100);

  const getStageColor = (stage: string) => {
    const index = LEAD_STAGES.indexOf(stage as any);
    if (index <= 2) return 'bg-gray-500/20 text-gray-300';
    if (index <= 5) return 'bg-blue-500/20 text-blue-300';
    if (index <= 8) return 'bg-purple-500/20 text-purple-300';
    if (index <= 10) return 'bg-[#F06000]/20 text-[#F06000]';
    return 'bg-[#00C8FF]/20 text-[#00C8FF]';
  };

  return (
    <div 
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-in fade-in duration-200"
      onClick={(e) => {
        if (e.target === e.currentTarget) onClose();
      }}
    >
      <div className="bg-night border border-border-subtle rounded-xl w-full max-w-2xl shadow-depth overflow-hidden flex flex-col max-h-[90vh]">
        {lead.coverUrl && (
          <div className="relative h-32 overflow-hidden">
            <img 
              src={lead.coverUrl} 
              alt="Cover" 
              className="w-full h-full object-cover"
              style={{
                objectPosition: lead.coverPosition 
                  ? `${lead.coverPosition.x}% ${lead.coverPosition.y}%` 
                  : 'center'
              }}
            />
            <div className="absolute inset-0 bg-gradient-to-t from-night via-night/40 to-transparent"></div>
          </div>
        )}

        <div className="p-4 border-b border-border-subtle flex justify-between items-center bg-surface-low">
          <h3 className="text-lg font-designer text-mist uppercase tracking-wide">
            Detalle de Lead
          </h3>
          <button onClick={onClose} className="text-mist-muted hover:text-mist"><X size={20} /></button>
        </div>
        
        <div className="p-6 space-y-5 overflow-y-auto custom-scrollbar">
          <div>
            <h2 className="text-xl font-bold text-mist mb-2">{lead.nombre_empresa || lead.nombre_contacto}</h2>
            <div className="flex flex-wrap gap-2">
              <span className={`px-2 py-1 rounded text-xs font-bold ${getStageColor(lead.etapa)}`}>
                {lead.etapa}
              </span>
              {lead.servicio_interes && (
                <span className="px-2 py-1 rounded text-xs font-bold bg-neon-blue/20 text-neon-blue">
                  {lead.servicio_interes}
                </span>
              )}
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-1">
              <label className="text-xs uppercase font-bold text-mist-muted flex items-center gap-2">
                <Building2 size={14}/> Empresa
              </label>
              <div className="bg-surface-low/50 rounded-lg p-2 border border-border-subtle">
                <span className="text-sm text-mist">{lead.nombre_empresa || '-'}</span>
              </div>
            </div>
            <div className="space-y-1">
              <label className="text-xs uppercase font-bold text-mist-muted flex items-center gap-2">
                <UserIcon size={14}/> Contacto
              </label>
              <div className="bg-surface-low/50 rounded-lg p-2 border border-border-subtle">
                <span className="text-sm text-mist">{lead.nombre_contacto || '-'}</span>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-1">
              <label className="text-xs uppercase font-bold text-mist-muted flex items-center gap-2">
                <Phone size={14}/> Teléfono
              </label>
              <div className="bg-surface-low/50 rounded-lg p-2 border border-border-subtle">
                <span className="text-sm text-mist">{lead.telefono || '-'}</span>
              </div>
            </div>
            <div className="space-y-1">
              <label className="text-xs uppercase font-bold text-mist-muted flex items-center gap-2">
                <Mail size={14}/> Email
              </label>
              <div className="bg-surface-low/50 rounded-lg p-2 border border-border-subtle">
                <span className="text-sm text-mist truncate">{lead.email || '-'}</span>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-1">
              <label className="text-xs uppercase font-bold text-mist-muted flex items-center gap-2">
                <Briefcase size={14}/> Sector
              </label>
              <div className="bg-surface-low/50 rounded-lg p-2 border border-border-subtle">
                <span className="text-sm text-mist">{lead.sector || '-'}</span>
              </div>
            </div>
            <div className="space-y-1">
              <label className="text-xs uppercase font-bold text-mist-muted flex items-center gap-2">
                <MapPin size={14}/> Ciudad
              </label>
              <div className="bg-surface-low/50 rounded-lg p-2 border border-border-subtle">
                <span className="text-sm text-mist">{lead.ciudad || '-'}</span>
              </div>
            </div>
          </div>

          {lead.web && (
            <div className="space-y-1">
              <label className="text-xs uppercase font-bold text-mist-muted flex items-center gap-2">
                <Globe size={14}/> Web
              </label>
              <div className="bg-surface-low/50 rounded-lg p-2 border border-border-subtle">
                <a href={lead.web} target="_blank" rel="noopener noreferrer" className="text-sm text-neon hover:underline">
                  {lead.web}
                </a>
              </div>
            </div>
          )}

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-1">
              <label className="text-xs uppercase font-bold text-mist-muted flex items-center gap-2">
                <DollarSign size={14}/> Valor Implementación
              </label>
              <div className="bg-surface-low/50 rounded-lg p-2 border border-border-subtle">
                <span className="text-sm text-mist font-mono">{lead.valor_implementacion || '-'}</span>
              </div>
            </div>
            <div className="space-y-1">
              <label className="text-xs uppercase font-bold text-mist-muted flex items-center gap-2">
                <DollarSign size={14}/> Valor Mensualidad
              </label>
              <div className="bg-surface-low/50 rounded-lg p-2 border border-border-subtle">
                <span className="text-sm text-mist font-mono">{lead.valor_mensualidad || '-'}</span>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-1">
              <label className="text-xs uppercase font-bold text-mist-muted flex items-center gap-2">
                <Calendar size={14}/> Primer Contacto
              </label>
              <div className="bg-surface-low/50 rounded-lg p-2 border border-border-subtle">
                <span className="text-sm text-mist">
                  {lead.fecha_primer_contacto ? new Date(lead.fecha_primer_contacto).toLocaleDateString('es-ES') : '-'}
                </span>
              </div>
            </div>
            <div className="space-y-1">
              <label className="text-xs uppercase font-bold text-mist-muted flex items-center gap-2">
                <UserIcon size={14}/> Encargado
              </label>
              <div className="flex items-center gap-2 bg-surface-low/50 rounded-lg p-2 border border-border-subtle">
                {assignee?.avatarUrl ? (
                  <img src={assignee.avatarUrl} alt={assignee.name} className="w-6 h-6 rounded-full object-cover" />
                ) : (
                  <div className="w-6 h-6 rounded-full bg-neon/20 flex items-center justify-center">
                    <UserIcon size={12} className="text-neon" />
                  </div>
                )}
                <span className="text-sm text-mist">{assignee?.name || 'Sin asignar'}</span>
              </div>
            </div>
          </div>

          <div className="space-y-3 bg-surface-low/30 p-4 rounded-xl border border-border-subtle">
            <div className="flex items-center justify-between">
              <label className="text-xs uppercase font-bold text-mist-muted flex items-center gap-2">
                <TrendingUp size={14}/> Progreso de Hitos
              </label>
              <span className="text-xs text-mist-muted">{completedMilestones}/{totalMilestones}</span>
            </div>
            
            <div className="w-full bg-surface-low rounded-full h-2 overflow-hidden">
              <div 
                className="h-full bg-gradient-to-r from-neon to-neon-blue transition-all duration-300"
                style={{ width: `${progressPercent}%` }}
              />
            </div>
            <div className="text-center text-xs text-mist-muted">{progressPercent}% completado</div>

            <div className="grid grid-cols-2 gap-2 mt-3">
              {Object.entries(milestoneLabels).map(([key, label]) => (
                <div 
                  key={key}
                  className={`flex items-center gap-2 p-2 rounded-lg border ${
                    milestones[key as keyof LeadMilestones] 
                      ? 'bg-[#00C8FF]/10 border-[#00C8FF]/30' 
                      : 'bg-surface-low/50 border-border-subtle'
                  }`}
                >
                  {milestones[key as keyof LeadMilestones] ? (
                    <CheckSquare size={16} className="text-[#00C8FF] flex-shrink-0" />
                  ) : (
                    <Square size={16} className="text-mist-muted flex-shrink-0" />
                  )}
                  <span className={`text-xs ${milestones[key as keyof LeadMilestones] ? 'text-mist' : 'text-mist-muted'}`}>
                    {label}
                  </span>
                </div>
              ))}
            </div>
          </div>

          {lead.necesidad && (
            <div className="space-y-1">
              <label className="text-xs uppercase font-bold text-mist-muted flex items-center gap-2">
                <Target size={14}/> Necesidad
              </label>
              <p className="text-sm text-mist bg-surface-low/50 rounded-lg p-3 border border-border-subtle">
                {lead.necesidad}
              </p>
            </div>
          )}

          {lead.comentarios && (
            <div className="space-y-1">
              <label className="text-xs uppercase font-bold text-mist-muted flex items-center gap-2">
                <MessageSquare size={14}/> Comentarios
              </label>
              <p className="text-sm text-mist bg-surface-low/50 rounded-lg p-3 border border-border-subtle">
                {lead.comentarios}
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

export default LeadViewModal;
