import React from 'react';
import { ActiveClient, User, ACTIVE_CLIENT_STAGES } from '../types';
import { X, Edit, User as UserIcon, Building2, Phone, Mail, Globe, MapPin, Calendar, DollarSign, CheckSquare, Square, Briefcase, Activity } from 'lucide-react';

interface ActiveClientViewModalProps {
  isOpen: boolean;
  onClose: () => void;
  client: ActiveClient;
  users: User[];
  currentUser?: User;
  onEdit: () => void;
}

const ActiveClientViewModal: React.FC<ActiveClientViewModalProps> = ({ 
  isOpen, 
  onClose, 
  client, 
  users,
  currentUser,
  onEdit
}) => {
  const isAdmin = currentUser?.role === 'admin';
  if (!isOpen || !client) return null;

  const assignee = users.find(u => u.id === client.assignedUserId);

  const getStatusColor = (status: string) => {
    switch(status) {
      case 'En servicio': return 'bg-[#00C8FF]/20 text-[#00C8FF]';
      case 'Pendiente de factura': return 'bg-[#F06000]/20 text-[#F06000]';
      case 'Desarrollos extra': return 'bg-[#005AB7]/20 text-[#005AB7]';
      default: return 'bg-surface-low text-mist';
    }
  };

  return (
    <div 
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-in fade-in duration-200"
      onClick={(e) => {
        if (e.target === e.currentTarget) onClose();
      }}
    >
      <div className="bg-night border border-border-subtle rounded-xl w-full max-w-2xl shadow-depth overflow-hidden flex flex-col max-h-[90vh]">
        {client.coverUrl && (
          <div className="relative h-32 overflow-hidden">
            <img 
              src={client.coverUrl} 
              alt="Cover" 
              className="w-full h-full object-cover"
              style={{
                objectPosition: client.coverPosition 
                  ? `${client.coverPosition.x}% ${client.coverPosition.y}%` 
                  : 'center'
              }}
            />
            <div className="absolute inset-0 bg-gradient-to-t from-night via-night/40 to-transparent"></div>
          </div>
        )}

        <div className="p-4 border-b border-border-subtle flex justify-between items-center bg-surface-low">
          <h3 className="text-lg font-designer text-mist uppercase tracking-wide">
            Detalle Cliente Activo
          </h3>
          <button onClick={onClose} className="text-mist-muted hover:text-mist"><X size={20} /></button>
        </div>
        
        <div className="p-6 space-y-5 overflow-y-auto custom-scrollbar">
          <div>
            <h2 className="text-xl font-bold text-mist mb-2">{client.nombre_empresa}</h2>
            <div className="flex flex-wrap gap-2">
              <span className={`px-2 py-1 rounded text-xs font-bold ${getStatusColor(client.estado_servicio)}`}>
                {client.estado_servicio}
              </span>
              <span className={`px-2 py-1 rounded text-xs font-bold ${client.pago_mes_actual ? 'bg-[#00C8FF]/20 text-[#00C8FF]' : 'bg-[#F06000]/20 text-[#F06000]'}`}>
                {client.pago_mes_actual ? 'Pago al día' : 'Pago pendiente'}
              </span>
            </div>
          </div>

          <div className="bg-surface-low/30 p-4 rounded-xl border border-border-subtle">
            <h4 className="text-neon font-bold uppercase text-xs mb-3 flex items-center gap-2">
              <Activity size={14}/> Datos del Servicio
            </h4>
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-1">
                <label className="text-xs uppercase font-bold text-mist-muted flex items-center gap-2">
                  <DollarSign size={12}/> Valor Mensual
                </label>
                <div className="bg-surface-low/50 rounded-lg p-2 border border-border-subtle">
                  <span className="text-sm text-neon font-mono font-bold">{client.valor_mensual_servicio || '-'}</span>
                </div>
              </div>
              <div className="space-y-1">
                <label className="text-xs uppercase font-bold text-mist-muted flex items-center gap-2">
                  <Calendar size={12}/> Fecha Corte
                </label>
                <div className="bg-surface-low/50 rounded-lg p-2 border border-border-subtle">
                  <span className="text-sm text-mist">
                    {client.fecha_corte ? (() => {
                      const [year, month, day] = client.fecha_corte.split('-').map(Number);
                      return new Date(year, month - 1, day).toLocaleDateString('es-ES');
                    })() : '-'}
                  </span>
                </div>
              </div>
              <div className="space-y-1">
                <label className="text-xs uppercase font-bold text-mist-muted flex items-center gap-2">
                  <Calendar size={12}/> Inicio Servicio
                </label>
                <div className="bg-surface-low/50 rounded-lg p-2 border border-border-subtle">
                  <span className="text-sm text-mist">
                    {client.fecha_inicio_servicio ? (() => {
                      const [year, month, day] = client.fecha_inicio_servicio.split('-').map(Number);
                      return new Date(year, month - 1, day).toLocaleDateString('es-ES');
                    })() : '-'}
                  </span>
                </div>
              </div>
              <div className="space-y-1">
                <label className="text-xs uppercase font-bold text-mist-muted flex items-center gap-2">
                  <UserIcon size={12}/> Encargado
                </label>
                <div className="flex items-center gap-2 bg-surface-low/50 rounded-lg p-2 border border-border-subtle">
                  {assignee?.avatarUrl ? (
                    <img src={assignee.avatarUrl} alt={assignee.name} className="w-5 h-5 rounded-full object-cover" />
                  ) : (
                    <div className="w-5 h-5 rounded-full bg-neon/20 flex items-center justify-center">
                      <UserIcon size={10} className="text-neon" />
                    </div>
                  )}
                  <span className="text-sm text-mist">{assignee?.name || 'Sin asignar'}</span>
                </div>
              </div>
            </div>
          </div>

          <div className="bg-surface-low/30 p-4 rounded-xl border border-border-subtle">
            <h4 className="text-neon-blue font-bold uppercase text-xs mb-3 flex items-center gap-2">
              <Building2 size={14}/> Información de Empresa
            </h4>
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-1">
                <label className="text-xs uppercase font-bold text-mist-muted flex items-center gap-2">
                  <UserIcon size={12}/> Contacto
                </label>
                <div className="bg-surface-low/50 rounded-lg p-2 border border-border-subtle">
                  <span className="text-sm text-mist">{client.nombre_contacto || '-'}</span>
                </div>
              </div>
              <div className="space-y-1">
                <label className="text-xs uppercase font-bold text-mist-muted flex items-center gap-2">
                  <Briefcase size={12}/> Sector
                </label>
                <div className="bg-surface-low/50 rounded-lg p-2 border border-border-subtle">
                  <span className="text-sm text-mist">{client.sector || '-'}</span>
                </div>
              </div>
              <div className="space-y-1">
                <label className="text-xs uppercase font-bold text-mist-muted flex items-center gap-2">
                  <MapPin size={12}/> Ciudad
                </label>
                <div className="bg-surface-low/50 rounded-lg p-2 border border-border-subtle">
                  <span className="text-sm text-mist">{client.ciudad || '-'}</span>
                </div>
              </div>
              <div className="space-y-1">
                <label className="text-xs uppercase font-bold text-mist-muted flex items-center gap-2">
                  <Phone size={12}/> Teléfono
                </label>
                <div className="bg-surface-low/50 rounded-lg p-2 border border-border-subtle">
                  <span className="text-sm text-mist">{client.telefono || '-'}</span>
                </div>
              </div>
            </div>
            
            <div className="grid grid-cols-1 gap-4 mt-4">
              <div className="space-y-1">
                <label className="text-xs uppercase font-bold text-mist-muted flex items-center gap-2">
                  <Mail size={12}/> Email
                </label>
                <div className="bg-surface-low/50 rounded-lg p-2 border border-border-subtle">
                  <span className="text-sm text-mist">{client.email || '-'}</span>
                </div>
              </div>
              {client.web && (
                <div className="space-y-1">
                  <label className="text-xs uppercase font-bold text-mist-muted flex items-center gap-2">
                    <Globe size={12}/> Web
                  </label>
                  <div className="bg-surface-low/50 rounded-lg p-2 border border-border-subtle">
                    <a href={client.web} target="_blank" rel="noopener noreferrer" className="text-sm text-neon hover:underline">
                      {client.web}
                    </a>
                  </div>
                </div>
              )}
            </div>
          </div>

          {client.servicio_interes && Array.isArray(client.servicio_interes) && client.servicio_interes.length > 0 && (
            <div className="space-y-1">
              <label className="text-xs uppercase font-bold text-mist-muted">Servicio Contratado</label>
              <div className="bg-surface-low/50 rounded-lg p-2 border border-border-subtle flex flex-wrap gap-2">
                {client.servicio_interes.map((servicio, idx) => (
                  <span key={idx} className="px-2 py-1 rounded text-xs font-bold bg-neon-blue/20 text-neon-blue">
                    {servicio}
                  </span>
                ))}
              </div>
            </div>
          )}

          {client.comentarios && (
            <div className="space-y-1">
              <label className="text-xs uppercase font-bold text-mist-muted">Comentarios</label>
              <p className="text-sm text-mist bg-surface-low/50 rounded-lg p-3 border border-border-subtle">
                {client.comentarios}
              </p>
            </div>
          )}
        </div>

        {isAdmin && (
          <div className="p-4 border-t border-border-subtle bg-surface-low flex justify-end items-center">
            <button 
              onClick={onEdit}
              className="px-6 py-2 rounded bg-gradient-primary text-mist text-sm font-bold shadow-neon-glow hover:brightness-110 flex items-center"
            >
              <Edit size={16} className="mr-2"/> Editar
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default ActiveClientViewModal;
