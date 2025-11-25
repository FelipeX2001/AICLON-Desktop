
import React, { useState, useEffect } from 'react';
import { BotVersion, BotType, User } from '../types';
import { Plus, Bot, Calendar, Edit, Image as ImageIcon, X } from 'lucide-react';
import BotVersionModal from './BotVersionModal';
import ImageUploadField from './ImageUploadField';

interface BotVersionsViewProps {
    user?: User;
}

const BotVersionsView: React.FC<BotVersionsViewProps> = ({ user }) => {
  const [versions, setVersions] = useState<BotVersion[]>(() => {
    try {
      const saved = localStorage.getItem('aiclon_bot_versions');
      return saved ? JSON.parse(saved) : [];
    } catch { return []; }
  });

  // Store covers for each bot type (evolution, meta, chatwoot)
  const [listCovers, setListCovers] = useState<Record<string, string>>(() => {
      try {
          const saved = localStorage.getItem('aiclon_bot_covers');
          return saved ? JSON.parse(saved) : {};
      } catch { return {}; }
  });

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [currentType, setCurrentType] = useState<BotType>('evolution');
  const [versionToEdit, setVersionToEdit] = useState<BotVersion | null>(null);

  // Cover Edit Modal State
  const [isCoverModalOpen, setIsCoverModalOpen] = useState(false);
  const [coverTypeToEdit, setCoverTypeToEdit] = useState<BotType | null>(null);
  const [tempCoverUrl, setTempCoverUrl] = useState('');

  useEffect(() => {
    localStorage.setItem('aiclon_bot_versions', JSON.stringify(versions));
  }, [versions]);

  useEffect(() => {
    localStorage.setItem('aiclon_bot_covers', JSON.stringify(listCovers));
  }, [listCovers]);

  const handleSave = (version: BotVersion) => {
    if (versionToEdit) {
      setVersions(prev => prev.map(v => v.id === version.id ? version : v));
    } else {
      setVersions(prev => [...prev, version]);
    }
    setIsModalOpen(false);
  };

  const handleDelete = (id: string) => {
    setVersions(prev => prev.filter(v => v.id !== id));
  };

  const openNewModal = (type: BotType) => {
    setCurrentType(type);
    setVersionToEdit(null);
    setIsModalOpen(true);
  };

  const openEditModal = (version: BotVersion) => {
    setCurrentType(version.type);
    setVersionToEdit(version);
    setIsModalOpen(true);
  };

  const openCoverEdit = (type: BotType) => {
      setCoverTypeToEdit(type);
      setTempCoverUrl(listCovers[type] || '');
      setIsCoverModalOpen(true);
  };

  const saveCover = () => {
      if (coverTypeToEdit) {
          setListCovers(prev => ({
              ...prev,
              [coverTypeToEdit]: tempCoverUrl
          }));
          setIsCoverModalOpen(false);
      }
  };

  const BotList = ({ type, title }: { type: BotType, title: string }) => {
    const botVersions = versions
      .filter(v => v.type === type)
      .sort((a, b) => {
          const dateDiff = new Date(b.date).getTime() - new Date(a.date).getTime();
          if (dateDiff !== 0) return dateDiff;
          return b.id.localeCompare(a.id);
      });

    const coverUrl = listCovers[type];
    const isAdmin = user?.role === 'admin';

    return (
      <div className="bg-surface-low/30 border border-border-subtle rounded-xl overflow-hidden flex flex-col h-full shadow-lg transition-all hover:shadow-neon-glow/10">
        
        {/* List Header with Prominent Cover Support */}
        <div 
            className={`relative group/header transition-all duration-300 ${coverUrl ? 'h-48' : 'min-h-[80px]'}`}
        >
            {coverUrl && (
                <div className="absolute inset-0 z-0">
                    <img src={coverUrl} alt="Cover" className="w-full h-full object-cover" />
                    {/* Stronger gradient for text readability */}
                    <div className="absolute inset-0 bg-gradient-to-t from-night via-night/60 to-transparent"></div>
                </div>
            )}
            
            <div className={`relative z-10 p-4 border-b border-border-subtle flex justify-between items-center h-full ${coverUrl ? 'items-end' : 'items-center'}`}>
                <div className="flex items-center space-x-3">
                    <div className={`p-2 rounded-lg border shadow-sm backdrop-blur-sm ${coverUrl ? 'bg-night/60 border-neon/30' : 'bg-surface-low/80 border-border-subtle'}`}>
                        <Bot className="text-neon" size={coverUrl ? 24 : 20} />
                    </div>
                    <h3 className={`font-designer text-mist drop-shadow-lg ${coverUrl ? 'text-3xl' : 'text-xl'}`}>{title}</h3>
                </div>
                
                <div className="flex items-center space-x-2">
                    {/* Admin Only Edit Cover Button */}
                    {isAdmin && (
                        <button 
                            onClick={() => openCoverEdit(type)}
                            className={`p-1.5 rounded transition-all opacity-0 group-hover/header:opacity-100 ${coverUrl ? 'bg-black/60 text-white hover:bg-neon/20' : 'bg-black/40 text-mist-muted hover:text-white'}`}
                            title="Cambiar Portada"
                        >
                            <Edit size={14} />
                        </button>
                    )}

                    <button 
                        onClick={() => openNewModal(type)}
                        className="text-xs font-bold text-mist bg-gradient-primary px-3 py-1.5 rounded shadow-neon-glow hover:brightness-110 transition-all flex items-center"
                    >
                        <Plus size={14} className="mr-1" /> Nueva
                    </button>
                </div>
            </div>
        </div>
        
        <div className="p-4 flex-1 overflow-y-auto custom-scrollbar space-y-3 min-h-[200px] bg-night/30">
          {botVersions.length === 0 ? (
            <div className="h-full flex items-center justify-center text-mist-faint text-sm italic">
              No hay versiones registradas.
            </div>
          ) : (
            botVersions.map(version => (
              <div 
                key={version.id}
                onClick={() => openEditModal(version)}
                className="bg-night border border-border-subtle rounded-lg p-4 hover:border-neon/50 hover:shadow-card-glow transition-all cursor-pointer group"
              >
                <div className="flex justify-between items-start mb-1">
                  <h4 className="font-bold text-mist text-base group-hover:text-neon transition-colors">{version.name}</h4>
                </div>
                <div className="flex items-center text-xs text-mist-muted">
                  <Calendar size={12} className="mr-1.5" />
                  {version.date}
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    );
  };

  return (
    <div className="h-full flex flex-col">
      <div className="flex-1 overflow-y-auto">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 h-full pb-4">
          <BotList type="evolution" title="Bot Evolution" />
          <BotList type="meta" title="Bot Meta" />
          <BotList type="chatwoot" title="Bot Chatwoot" />
        </div>
      </div>

      <BotVersionModal 
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        versionToEdit={versionToEdit}
        botType={currentType}
        onSave={handleSave}
        onDelete={handleDelete}
      />

      {/* Mini Modal for Cover Edit */}
      {isCoverModalOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm">
              <div className="bg-night border border-border-subtle rounded-xl w-full max-w-sm shadow-depth overflow-hidden">
                  <div className="p-4 border-b border-border-subtle flex justify-between items-center bg-surface-low">
                      <h3 className="text-sm font-designer text-mist uppercase">Portada de Lista</h3>
                      <button onClick={() => setIsCoverModalOpen(false)}><X size={18} className="text-mist-muted"/></button>
                  </div>
                  <div className="p-4">
                      <ImageUploadField 
                          value={tempCoverUrl}
                          onChange={setTempCoverUrl}
                          label="Imagen de fondo"
                      />
                      <div className="mt-4 flex justify-end">
                          <button 
                            onClick={saveCover}
                            className="px-4 py-2 bg-gradient-primary text-mist text-xs font-bold rounded shadow-neon-glow"
                          >
                              Guardar Portada
                          </button>
                      </div>
                  </div>
              </div>
          </div>
      )}
    </div>
  );
};

export default BotVersionsView;
