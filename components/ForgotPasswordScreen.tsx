
import React, { useState } from 'react';
import { ArrowLeft, Mail } from 'lucide-react';

interface Props { onBack: () => void; }

const ForgotPasswordScreen: React.FC<Props> = ({ onBack }) => {
  const [email, setEmail] = useState('');
  const [sent, setSent] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
      e.preventDefault();
      // Mock Send
      setSent(true);
  };

  return (
    <div className="w-full h-screen flex items-center justify-center bg-gradient-bg p-4">
        <div className="w-full max-w-md bg-night border border-border-subtle rounded-xl p-8 shadow-depth">
            <button onClick={onBack} className="flex items-center text-mist-muted hover:text-mist mb-6 text-sm transition-colors">
                <ArrowLeft size={16} className="mr-1" /> Volver al Login
            </button>
            
            <h2 className="text-3xl font-designer text-mist mb-2">Recuperar Contraseña</h2>
            <p className="text-mist-muted text-sm mb-6">Ingresa tu correo para recibir el link de recuperación.</p>

            {sent ? (
                <div className="bg-neon/10 border border-neon/30 p-4 rounded text-center">
                    <p className="text-neon font-bold text-sm">¡Correo enviado!</p>
                    <p className="text-mist-muted text-xs mt-1">Si el correo existe, recibirás instrucciones en breve.</p>
                </div>
            ) : (
                <form onSubmit={handleSubmit} className="space-y-6">
                    <div className="space-y-1">
                        <label className="text-xs uppercase font-bold text-mist-muted">Email</label>
                        <input 
                            type="email" 
                            required
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            className="w-full bg-surface-low border border-border-subtle rounded p-3 text-mist focus:border-neon focus:outline-none"
                        />
                    </div>
                    <button type="submit" className="w-full py-3 rounded bg-gradient-primary text-mist font-bold shadow-neon-glow">
                        Enviar Instrucciones
                    </button>
                </form>
            )}
        </div>
    </div>
  );
};

export default ForgotPasswordScreen;
