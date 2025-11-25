
import React, { useState, useEffect } from 'react';
import { DroppedClient, ActiveClient, Lead } from '../types';
import { RefreshCw, Trash2, Search, Calendar, FileText, User } from 'lucide-react';

const DroppedClientsView: React.FC = () => {
  const [droppedClients, setDroppedClients] = useState<DroppedClient[]>(() => {
    try {
      const saved = localStorage.getItem('aiclon_dropped_clients');
      return saved ? JSON.parse(saved) : [];
    } catch { return []; }
  });

  useEffect(() => {
    localStorage.setItem('aiclon_dropped_clients', JSON.stringify(droppedClients));
  }, [droppedClients]);

  const handleRecover = (client: DroppedClient) => {
    try {
      if (client.type === 'active') {
        const savedActive = localStorage.getItem('aiclon_active_clients');
        const activeClients: ActiveClient[] = savedActive ? JSON.parse(savedActive) : [];
        // Add back
        activeClients.push(client.originalData as ActiveClient);
        localStorage.setItem('aiclon_active_clients', JSON.stringify(activeClients));
      } else {
        const savedLeads = localStorage.getItem('aiclon_leads');
        const leads: Lead[] = savedLeads ? JSON.parse(savedLeads) : [];
        // Add back
        leads.push(client.originalData as Lead);
        localStorage.setItem('aiclon_leads', JSON.stringify(leads));
      }

      // Remove from dropped list
      setDroppedClients(prev => prev.filter(c => c.id !== client.id));
      alert('Cliente recuperado exitosamente.');
      // Ideally trigger a global refresh or context update, but localstorage works on next mount
    } catch (error) {
      console.error("Error recovering client", error);
    }
  };

  return (
    <div className="bg-night/50 rounded-xl border border-border-subtle overflow-hidden animate-in slide-in-from-bottom-4 duration-300">
      <div className="p-6 border-b border-border-subtle bg-surface-low/30 flex justify-between items-center">
        <div>
            <h3 className="text-xl font-designer text-neon-orange">Clientes Dados de Baja</h3>
            <p className="text-xs text-mist-muted mt-1">Historial de bajas y recuperación de cuentas.</p>
        </div>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="border-b border-border-subtle bg-surface-med/50 text-xs uppercase font-bold text-mist-muted">
              <th className="p-4">Cliente / Empresa</th>
              <th className="p-4">Tipo</th>
              <th className="p-4">Motivo de Baja</th>
              <th className="p-4">Fecha Baja</th>
              <th className="p-4 text-center">Acción</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-border-subtle">
            {droppedClients.length === 0 ? (
                <tr>
                    <td colSpan={5} className="p-8 text-center text-mist-faint text-sm italic">
                        No hay clientes dados de baja.
                    </td>
                </tr>
            ) : (
                droppedClients.map(client => (
                    <tr key={client.id} className="hover:bg-surface-low transition-colors">
                        <td className="p-4">
                            <div className="font-bold text-mist">{client.name}</div>
                        </td>
                        <td className="p-4">
                            <span className={`text-[10px] uppercase font-bold px-2 py-1 rounded ${client.type === 'active' ? 'bg-neon/10 text-neon' : 'bg-purple-500/10 text-purple-400'}`}>
                                {client.type === 'active' ? 'Cliente Activo' : 'Lead'}
                            </span>
                        </td>
                        <td className="p-4 max-w-xs">
                            <div className="text-sm text-mist-muted truncate" title={client.reason}>
                                {client.reason}
                            </div>
                        </td>
                        <td className="p-4">
                            <div className="flex items-center text-xs text-mist-muted font-mono">
                                <Calendar size={12} className="mr-2" />
                                {client.droppedDate}
                            </div>
                        </td>
                        <td className="p-4 text-center">
                            <button 
                                onClick={() => handleRecover(client)}
                                className="text-xs font-bold text-neon hover:bg-neon/10 border border-neon/30 px-3 py-1.5 rounded-lg transition-colors flex items-center justify-center mx-auto"
                            >
                                <RefreshCw size={12} className="mr-1.5" /> Recuperar
                            </button>
                        </td>
                    </tr>
                ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default DroppedClientsView;
