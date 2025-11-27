import React from 'react';
import { Tutorial, TutorialStep, User } from '../types';
import { ArrowLeft, ExternalLink, Calendar, Edit } from 'lucide-react';

interface TutorialPageProps {
  tutorial: Tutorial;
  currentUser?: User;
  onBack: () => void;
  onEdit: () => void;
}

const TutorialPage: React.FC<TutorialPageProps> = ({ tutorial, currentUser, onBack, onEdit }) => {
  const isAdmin = currentUser?.role === 'admin';
  const steps = tutorial.steps?.sort((a, b) => a.order - b.order) || [];

  return (
    <div className="h-full flex flex-col bg-night">
      <div className="flex items-center justify-between px-6 py-4 border-b border-border-subtle bg-surface-low/50">
        <button
          onClick={onBack}
          className="flex items-center text-mist-muted hover:text-neon transition-colors"
        >
          <ArrowLeft size={20} className="mr-2" />
          <span className="text-sm font-medium">Volver a Tutoriales</span>
        </button>
        
        {isAdmin && (
          <button
            onClick={onEdit}
            className="px-4 py-2 rounded-lg bg-gradient-primary text-mist font-bold text-sm shadow-neon-glow hover:brightness-110 transition-all flex items-center"
          >
            <Edit size={16} className="mr-2" />
            Editar Tutorial
          </button>
        )}
      </div>

      <div className="flex-1 overflow-y-auto custom-scrollbar">
        {tutorial.coverUrl && (
          <div className="relative w-full h-64 md:h-80 lg:h-96">
            <img 
              src={tutorial.coverUrl} 
              alt={tutorial.title}
              className="w-full h-full object-cover"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-night via-night/50 to-transparent" />
            
            <div className="absolute bottom-0 left-0 right-0 p-6 md:p-8">
              <div className="max-w-4xl mx-auto">
                <h1 className="text-3xl md:text-4xl lg:text-5xl font-designer text-mist mb-2">
                  {tutorial.title}
                </h1>
                <div className="flex items-center text-mist-muted text-sm">
                  <Calendar size={14} className="mr-2" />
                  {tutorial.date}
                </div>
              </div>
            </div>
          </div>
        )}

        {!tutorial.coverUrl && (
          <div className="px-6 md:px-8 pt-8">
            <div className="max-w-4xl mx-auto">
              <h1 className="text-3xl md:text-4xl lg:text-5xl font-designer text-mist mb-2">
                {tutorial.title}
              </h1>
              <div className="flex items-center text-mist-muted text-sm">
                <Calendar size={14} className="mr-2" />
                {tutorial.date}
              </div>
            </div>
          </div>
        )}

        <div className="px-6 md:px-8 py-8">
          <div className="max-w-4xl mx-auto">
            {tutorial.description && (
              <div className="mb-8">
                <p className="text-lg text-mist-muted leading-relaxed">
                  {tutorial.description}
                </p>
              </div>
            )}

            {tutorial.link && (
              <div className="mb-8">
                <a 
                  href={tutorial.link}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center px-5 py-3 rounded-lg bg-surface-med border border-border-subtle hover:border-neon/50 hover:shadow-neon-glow/20 transition-all text-neon font-medium"
                >
                  <ExternalLink size={18} className="mr-2" />
                  Abrir Enlace Principal
                </a>
              </div>
            )}

            {steps.length > 0 && (
              <div className="mb-10">
                <h2 className="text-2xl font-designer text-mist mb-6 flex items-center">
                  <span className="w-8 h-8 rounded-full bg-gradient-primary flex items-center justify-center mr-3 text-sm font-bold">
                    {steps.length}
                  </span>
                  Paso a Paso
                </h2>
                
                <div className="space-y-6">
                  {steps.map((step, index) => (
                    <div 
                      key={step.id}
                      className="bg-surface-low border border-border-subtle rounded-xl p-6 hover:border-neon/30 transition-all"
                    >
                      <div className="flex items-start">
                        <div className="w-10 h-10 rounded-full bg-gradient-primary flex items-center justify-center mr-4 flex-shrink-0 text-mist font-bold shadow-neon-glow">
                          {index + 1}
                        </div>
                        <div className="flex-1">
                          <h3 className="text-lg font-bold text-mist mb-2">
                            {step.title}
                          </h3>
                          <div className="text-mist-muted leading-relaxed whitespace-pre-wrap">
                            {step.content}
                          </div>
                          
                          {step.mediaUrl && (
                            <div className="mt-4 rounded-lg overflow-hidden border border-border-subtle">
                              {step.mediaType === 'video' ? (
                                <video 
                                  src={step.mediaUrl} 
                                  controls 
                                  className="w-full max-h-96 object-contain bg-black"
                                >
                                  Tu navegador no soporta video.
                                </video>
                              ) : (
                                <img 
                                  src={step.mediaUrl} 
                                  alt={`Paso ${index + 1}`}
                                  className="w-full max-h-96 object-contain bg-surface-med"
                                />
                              )}
                            </div>
                          )}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

          </div>
        </div>
      </div>
    </div>
  );
};

export default TutorialPage;
