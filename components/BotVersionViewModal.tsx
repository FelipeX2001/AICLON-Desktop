import React from 'react';
import { BotVersion, BotType, User } from '../types';
import { X, Edit, Calendar, FileText, Bot, MessageSquare, Phone } from 'lucide-react';

interface BotVersionViewModalProps {
  isOpen: boolean;
  onClose: () => void;
  botVersion: BotVersion;
  currentUser?: User;
  onEdit: () => void;
}

const BotVersionViewModal: React.FC<BotVersionViewModalProps> = ({ 
  isOpen, 
  onClose, 
  botVersion, 
  currentUser,
  onEdit
}) => {
  const isAdmin = currentUser?.role === 'admin';
  if (!isOpen || !botVersion) return null;

  const getBotIcon = (type: BotType) => {
    switch(type) {
      case 'evolution': return <Phone size={16} className="text-green-400" />;
      case 'meta': return <MessageSquare size={16} className="text-blue-400" />;
      case 'chatbot': return <Bot size={16} className="text-purple-400" />;
      default: return <Bot size={16} className="text-mist" />;
    }
  };

  const getBotColor = (type: BotType) => {
    switch(type) {
      case 'evolution': return 'bg-green-500/20 text-green-400 border-green-500/30';
      case 'meta': return 'bg-blue-500/20 text-blue-400 border-blue-500/30';
      case 'chatbot': return 'bg-purple-500/20 text-purple-400 border-purple-500/30';
      default: return 'bg-surface-low text-mist border-border-subtle';
    }
  };

  const getBotLabel = (type: BotType) => {
    switch(type) {
      case 'evolution': return 'Evolution';
      case 'meta': return 'Meta';
      case 'chatbot': return 'Chatbot';
      default: return type;
    }
  };

  return (
    <div 
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-in fade-in duration-200"
      onClick={(e) => {
        if (e.target === e.currentTarget) onClose();
      }}
    >
      <div className="bg-night border border-border-subtle rounded-xl w-full max-w-lg shadow-depth overflow-hidden flex flex-col max-h-[90vh]">
        {botVersion.coverUrl && (
          <div className="relative h-32 overflow-hidden">
            <img 
              src={botVersion.coverUrl} 
              alt="Cover" 
              className="w-full h-full object-cover"
              style={{
                objectPosition: botVersion.coverPosition 
                  ? `${botVersion.coverPosition.x}% ${botVersion.coverPosition.y}%` 
                  : 'center'
              }}
            />
            <div className="absolute inset-0 bg-gradient-to-t from-night via-night/40 to-transparent"></div>
          </div>
        )}

        <div className="p-4 border-b border-border-subtle flex justify-between items-center bg-surface-low">
          <h3 className="text-lg font-designer text-mist uppercase tracking-wide">
            Detalle de Versión
          </h3>
          <button onClick={onClose} className="text-mist-muted hover:text-mist"><X size={20} /></button>
        </div>
        
        <div className="p-6 space-y-5 overflow-y-auto custom-scrollbar">
          <div>
            <h2 className="text-xl font-bold text-mist mb-3">{botVersion.name}</h2>
            <div className="flex flex-wrap gap-2">
              <span className={`px-3 py-1.5 rounded text-xs font-bold flex items-center gap-2 border ${getBotColor(botVersion.type)}`}>
                {getBotIcon(botVersion.type)}
                {getBotLabel(botVersion.type)}
              </span>
            </div>
          </div>

          <div className="space-y-1">
            <label className="text-xs uppercase font-bold text-mist-muted flex items-center gap-2">
              <Calendar size={14}/> Fecha de Versión
            </label>
            <div className="bg-surface-low/50 rounded-lg p-3 border border-border-subtle">
              <span className="text-sm text-mist">
                {botVersion.date ? new Date(botVersion.date).toLocaleDateString('es-ES', {
                  weekday: 'long',
                  year: 'numeric',
                  month: 'long',
                  day: 'numeric'
                }) : '-'}
              </span>
            </div>
          </div>

          {botVersion.notes && (
            <div className="space-y-1">
              <label className="text-xs uppercase font-bold text-mist-muted flex items-center gap-2">
                <FileText size={14}/> Notas de Versión
              </label>
              <div className="bg-surface-low/50 rounded-lg p-4 border border-border-subtle">
                <p className="text-sm text-mist whitespace-pre-wrap">{botVersion.notes}</p>
              </div>
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

export default BotVersionViewModal;
