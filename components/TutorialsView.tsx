import React, { useState } from 'react';
import { Tutorial, User } from '../types';
import { Plus, Calendar, Image as ImageIcon, Video, ExternalLink, BookOpen } from 'lucide-react';
import TutorialModal from './TutorialModal';

interface TutorialsViewProps {
  tutorials: Tutorial[];
  currentUser?: User;
  onSaveTutorial: (tutorial: Tutorial) => void;
  onDeleteTutorial: (tutorialId: string) => void;
  onViewTutorial: (tutorial: Tutorial) => void;
}

const TutorialsView: React.FC<TutorialsViewProps> = ({ 
  tutorials, 
  currentUser,
  onSaveTutorial, 
  onDeleteTutorial,
  onViewTutorial 
}) => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const isAdmin = currentUser?.role === 'admin';

  const handleSave = (tutorial: Tutorial) => {
    onSaveTutorial(tutorial);
    setIsModalOpen(false);
  };

  const openNewModal = () => {
    setIsModalOpen(true);
  };

  const validTutorials = tutorials.filter(t => !t.isDeleted);

  return (
    <div className="h-full flex flex-col">
      {isAdmin && (
        <div className="flex justify-end items-center mb-6">
          <button 
            onClick={openNewModal}
            className="px-6 py-2.5 rounded-lg bg-gradient-primary text-mist font-bold shadow-neon-glow hover:brightness-110 transition-all flex items-center"
          >
            <Plus size={18} className="mr-2" /> Nuevo Tutorial
          </button>
        </div>
      )}

      <div className="flex-1 overflow-y-auto custom-scrollbar pb-4">
        {validTutorials.length === 0 ? (
          <div className="h-64 flex items-center justify-center text-mist-faint text-lg italic border-2 border-dashed border-border-subtle rounded-xl">
            No hay tutoriales creados aún.
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {validTutorials
              .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
              .map(tutorial => (
                <div 
                  key={tutorial.id}
                  onClick={() => onViewTutorial(tutorial)}
                  className="bg-surface-low border border-border-subtle rounded-xl overflow-hidden hover:border-neon/50 hover:shadow-card-glow transition-all cursor-pointer group flex flex-col h-full"
                >
                  {tutorial.coverUrl ? (
                    <div className="w-full h-48 relative overflow-hidden border-b border-border-subtle">
                      <img 
                        src={tutorial.coverUrl} 
                        alt={tutorial.title} 
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" 
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-surface-low to-transparent opacity-60" />
                    </div>
                  ) : (
                    <div className="w-full h-48 relative overflow-hidden border-b border-border-subtle bg-gradient-to-br from-surface-med to-night flex items-center justify-center">
                      <BookOpen size={48} className="text-mist-faint" />
                    </div>
                  )}

                  <div className="p-5 flex-1">
                    <h3 className="text-xl font-bold text-mist group-hover:text-neon transition-colors mb-2 line-clamp-2">
                      {tutorial.title}
                    </h3>
                    <p className="text-sm text-mist-muted line-clamp-3 mb-4">
                      {tutorial.description}
                    </p>
                    
                    {tutorial.steps && tutorial.steps.length > 0 && (
                      <div className="flex items-center text-xs text-neon">
                        <span className="px-2 py-0.5 rounded-full bg-neon/10 border border-neon/20">
                          {tutorial.steps.length} pasos
                        </span>
                      </div>
                    )}
                  </div>

                  <div className="p-4 bg-surface-med/50 border-t border-border-subtle flex justify-between items-center">
                    <div className="flex items-center text-xs text-mist-muted">
                      <Calendar size={14} className="mr-1.5" />
                      {tutorial.date}
                    </div>
                    
                    <div className="flex items-center space-x-3">
                      {tutorial.link && <ExternalLink size={14} className="text-neon-blue" />}
                      {tutorial.media?.some(m => m.type === 'image') && <ImageIcon size={14} className="text-neon" />}
                      {tutorial.media?.some(m => m.type.includes('video')) && <Video size={14} className="text-neon-orange" />}
                    </div>
                  </div>
                </div>
              ))}
          </div>
        )}
      </div>

      <TutorialModal 
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        tutorialToEdit={null}
        onSave={handleSave}
        onDelete={onDeleteTutorial}
        isAdmin={isAdmin} 
      />
    </div>
  );
};

export default TutorialsView;
