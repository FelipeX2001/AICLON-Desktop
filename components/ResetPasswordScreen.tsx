
import React, { useState } from 'react';
import { ArrowLeft } from 'lucide-react';

interface Props { onBack: () => void; }

const ResetPasswordScreen: React.FC<Props> = ({ onBack }) => {
  const [pass, setPass] = useState('');
  const [confirm, setConfirm] = useState('');
  const [success, setSuccess] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
      e.preventDefault();
      if (pass === confirm) {
          setSuccess(true);
      } else {
          alert("Contraseñas no coinciden");
      }
  };

  return (
    <div className="w-full h-screen flex items-center justify-center bg-gradient-bg p-4">
        <div className="w-full max-w-md bg-night border border-border-subtle rounded-xl p-8 shadow-depth">
            <button onClick={onBack} className="flex items-center text-mist-muted hover:text-mist mb-6 text-sm transition-colors">
                <ArrowLeft size={16} className="mr-1" /> Volver al Login
            </button>
            
            <h2 className="text-3xl font-designer text-mist mb-2">Nueva Contraseña</h2>
            
            {success ? (
                <div className="text-center">
                    <p className="text-neon font-bold mb-4">¡Contraseña actualizada!</p>
                    <button onClick={onBack} className="w-full py-3 rounded bg-surface-med border border-neon text-neon font-bold">
                        Ir a Iniciar Sesión
                    </button>
                </div>
            ) : (
                <form onSubmit={handleSubmit} className="space-y-4">
                    <div className="space-y-1">
                        <label className="text-xs uppercase font-bold text-mist-muted">Nueva Contraseña</label>
                        <input 
                            type="password" 
                            required
                            value={pass}
                            onChange={(e) => setPass(e.target.value)}
                            className="w-full bg-surface-low border border-border-subtle rounded p-3 text-mist focus:border-neon focus:outline-none"
                        />
                    </div>
                    <div className="space-y-1">
                        <label className="text-xs uppercase font-bold text-mist-muted">Confirmar</label>
                        <input 
                            type="password" 
                            required
                            value={confirm}
                            onChange={(e) => setConfirm(e.target.value)}
                            className="w-full bg-surface-low border border-border-subtle rounded p-3 text-mist focus:border-neon focus:outline-none"
                        />
                    </div>
                    <button type="submit" className="w-full py-3 rounded bg-gradient-primary text-mist font-bold shadow-neon-glow mt-2">
                        Restablecer
                    </button>
                </form>
            )}
        </div>
    </div>
  );
};

export default ResetPasswordScreen;
