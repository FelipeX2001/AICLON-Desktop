
import React from 'react';
import { DroppedClient, User } from '../types';
import { RefreshCw, Trash2, Calendar } from 'lucide-react';

interface DroppedClientsViewProps {
  droppedClients: DroppedClient[];
  currentUser?: User;
  onRecover: (client: DroppedClient) => void;
  onDelete: (id: string) => void;
}

const DroppedClientsView: React.FC<DroppedClientsViewProps> = ({
  droppedClients,
  currentUser,
  onRecover,
  onDelete
}) => {
  const isAdmin = currentUser?.role === 'admin';
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
                        <td className="p-4">
                            {isAdmin ? (
                              <div className="flex items-center justify-center gap-2">
                                <button 
                                    onClick={() => onRecover(client)}
                                    className="text-xs font-bold text-neon hover:bg-neon/10 border border-neon/30 px-3 py-1.5 rounded-lg transition-colors flex items-center"
                                >
                                    <RefreshCw size={12} className="mr-1.5" /> Recuperar
                                </button>
                                <button 
                                    onClick={() => onDelete(client.id)}
                                    className="text-xs font-bold text-red-400 hover:bg-red-500/10 border border-red-500/30 px-2 py-1.5 rounded-lg transition-colors"
                                >
                                    <Trash2 size={12} />
                                </button>
                              </div>
                            ) : (
                              <span className="text-xs text-mist-faint italic">Solo lectura</span>
                            )}
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
