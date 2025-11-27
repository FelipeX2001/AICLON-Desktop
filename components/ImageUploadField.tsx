
import React, { useRef, useState, useEffect } from 'react';
import { ImageIcon, X, UploadCloud, Loader2, Move } from 'lucide-react';
import { CoverPosition } from '../types';

interface ImageUploadFieldProps {
  label?: string;
  value?: string;
  onChange: (url: string) => void;
  onPositionChange?: (pos: CoverPosition) => void;
  position?: CoverPosition;
  className?: string;
  maxWidth?: number;
}

const ImageUploadField: React.FC<ImageUploadFieldProps> = ({ 
    label = "Imagen de Portada", 
    value, 
    onChange, 
    onPositionChange,
    position = { x: 50, y: 50, zoom: 1 },
    className = "",
    maxWidth = 1000
}) => {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [isProcessing, setIsProcessing] = useState(false);
  const [showControls, setShowControls] = useState(false);

  const compressImage = (file: File): Promise<string> => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onload = (event) => {
        const img = new Image();
        img.src = event.target?.result as string;
        img.onload = () => {
          const canvas = document.createElement('canvas');
          const MAX_WIDTH = maxWidth; 
          const scaleSize = MAX_WIDTH / img.width;
          const newWidth = Math.min(MAX_WIDTH, img.width);
          const newHeight = img.height * (newWidth / img.width);

          canvas.width = newWidth;
          canvas.height = newHeight;
          const ctx = canvas.getContext('2d');
          
          if (ctx) {
              ctx.drawImage(img, 0, 0, newWidth, newHeight);
              const compressedDataUrl = canvas.toDataURL('image/jpeg', 0.85);
              resolve(compressedDataUrl);
          } else {
              reject(new Error("Canvas context error"));
          }
        };
        img.onerror = (error) => reject(error);
      };
      reader.onerror = (error) => reject(error);
    });
  };

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setIsProcessing(true);
      try {
          const compressedUrl = await compressImage(file);
          onChange(compressedUrl);
          if (onPositionChange) onPositionChange({ x: 50, y: 50, zoom: 1 }); // Reset pos on new image
      } catch (error) {
          console.error("Error processing image:", error);
          alert("Hubo un error al procesar la imagen. Intenta con un archivo más pequeño.");
      } finally {
          setIsProcessing(false);
      }
    }
  };

  const handleRemove = () => {
    onChange('');
    if (fileInputRef.current) fileInputRef.current.value = '';
  };

  return (
    <div className={`space-y-2 ${className}`}>
      <div className="flex justify-between items-center">
          <label className="text-xs uppercase font-bold text-mist-muted flex items-center gap-2">
            <ImageIcon size={14} /> {label}
          </label>
          {value && onPositionChange && (
              <button 
                type="button" 
                onClick={() => setShowControls(!showControls)}
                className={`text-[10px] font-bold uppercase flex items-center gap-1 px-2 py-1 rounded border ${showControls ? 'bg-neon text-night border-neon' : 'border-border-subtle text-mist-muted hover:text-mist'}`}
              >
                  <Move size={10} /> Ajustar
              </button>
          )}
      </div>
      
      {value ? (
        <div className="relative w-full h-32 rounded-lg overflow-hidden border border-border-subtle group">
          <div className="w-full h-full overflow-hidden relative">
              <img 
                src={value} 
                alt="Cover" 
                className="w-full h-full object-cover transition-transform duration-0"
                style={{ 
                    objectPosition: `${position.x}% ${position.y}%`,
                    transform: `scale(${position.zoom})`
                }} 
              />
          </div>
          
          {!showControls && (
              <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center z-10">
                <button 
                  type="button"
                  onClick={handleRemove}
                  className="bg-red-500/80 hover:bg-red-500 text-white px-3 py-1.5 rounded-full text-xs font-bold flex items-center backdrop-blur-sm transition-colors"
                >
                  <X size={14} className="mr-1" /> Quitar
                </button>
              </div>
          )}

          {/* Position Controls Overlay */}
          {showControls && onPositionChange && (
              <div className="absolute bottom-0 left-0 right-0 bg-black/80 backdrop-blur p-2 z-20 flex flex-col gap-2 animate-in slide-in-from-bottom-2">
                  <div className="flex items-center gap-2">
                      <span className="text-[10px] text-mist font-mono w-8">X:</span>
                      <input 
                        type="range" min="0" max="100" 
                        value={position.x} 
                        onChange={(e) => onPositionChange({...position, x: parseInt(e.target.value)})}
                        className="w-full h-1 bg-surface-med rounded-lg appearance-none cursor-pointer accent-neon"
                      />
                  </div>
                  <div className="flex items-center gap-2">
                      <span className="text-[10px] text-mist font-mono w-8">Y:</span>
                      <input 
                        type="range" min="0" max="100" 
                        value={position.y} 
                        onChange={(e) => onPositionChange({...position, y: parseInt(e.target.value)})}
                        className="w-full h-1 bg-surface-med rounded-lg appearance-none cursor-pointer accent-neon"
                      />
                  </div>
                  <div className="flex items-center gap-2">
                      <span className="text-[10px] text-mist font-mono w-8">Zoom:</span>
                      <input 
                        type="range" min="1" max="3" step="0.1"
                        value={position.zoom} 
                        onChange={(e) => onPositionChange({...position, zoom: parseFloat(e.target.value)})}
                        className="w-full h-1 bg-surface-med rounded-lg appearance-none cursor-pointer accent-neon"
                      />
                  </div>
              </div>
          )}
        </div>
      ) : (
        <div 
          onClick={() => !isProcessing && fileInputRef.current?.click()}
          className={`w-full h-20 border-2 border-dashed border-border-subtle hover:border-neon/50 hover:bg-surface-low/50 rounded-lg flex flex-col items-center justify-center cursor-pointer transition-all group ${isProcessing ? 'opacity-50 cursor-wait' : ''}`}
        >
          {isProcessing ? (
              <Loader2 size={20} className="text-neon animate-spin mb-1" />
          ) : (
              <UploadCloud size={20} className="text-mist-muted group-hover:text-neon mb-1" />
          )}
          <span className="text-xs text-mist-muted group-hover:text-mist">
              {isProcessing ? "Procesando..." : "Click para subir imagen"}
          </span>
          <input 
            type="file" 
            ref={fileInputRef} 
            onChange={handleFileChange} 
            accept="image/*" 
            className="hidden" 
            disabled={isProcessing}
          />
        </div>
      )}
    </div>
  );
};

export default ImageUploadField;
