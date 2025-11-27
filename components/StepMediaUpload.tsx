
import React, { useRef, useState } from 'react';
import { ImageIcon, Video, X, UploadCloud, Loader2, Film } from 'lucide-react';
import { StepMediaType } from '../types';

interface StepMediaUploadProps {
  mediaUrl?: string;
  mediaType?: StepMediaType;
  onMediaChange: (url: string, type: StepMediaType | undefined) => void;
}

const StepMediaUpload: React.FC<StepMediaUploadProps> = ({ 
  mediaUrl, 
  mediaType,
  onMediaChange 
}) => {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [isProcessing, setIsProcessing] = useState(false);

  const processFile = (file: File): Promise<{ url: string; type: StepMediaType }> => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onload = (event) => {
        const dataUrl = event.target?.result as string;
        
        if (file.type.startsWith('video/')) {
          resolve({ url: dataUrl, type: 'video' });
        } else if (file.type === 'image/gif') {
          resolve({ url: dataUrl, type: 'gif' });
        } else if (file.type.startsWith('image/')) {
          const img = new Image();
          img.src = dataUrl;
          img.onload = () => {
            const canvas = document.createElement('canvas');
            const MAX_WIDTH = 1200;
            const newWidth = Math.min(MAX_WIDTH, img.width);
            const newHeight = img.height * (newWidth / img.width);

            canvas.width = newWidth;
            canvas.height = newHeight;
            const ctx = canvas.getContext('2d');
            
            if (ctx) {
              ctx.drawImage(img, 0, 0, newWidth, newHeight);
              const compressedDataUrl = canvas.toDataURL('image/jpeg', 0.85);
              resolve({ url: compressedDataUrl, type: 'image' });
            } else {
              reject(new Error("Canvas context error"));
            }
          };
          img.onerror = (error) => reject(error);
        } else {
          reject(new Error("Tipo de archivo no soportado"));
        }
      };
      reader.onerror = (error) => reject(error);
    });
  };

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const maxSize = file.type.startsWith('video/') ? 50 * 1024 * 1024 : 10 * 1024 * 1024;
      if (file.size > maxSize) {
        alert(`El archivo es muy grande. Máximo: ${file.type.startsWith('video/') ? '50MB' : '10MB'}`);
        return;
      }

      setIsProcessing(true);
      try {
        const { url, type } = await processFile(file);
        onMediaChange(url, type);
      } catch (error) {
        console.error("Error processing file:", error);
        alert("Hubo un error al procesar el archivo.");
      } finally {
        setIsProcessing(false);
      }
    }
  };

  const handleRemove = () => {
    onMediaChange('', undefined);
    if (fileInputRef.current) fileInputRef.current.value = '';
  };

  const renderMedia = () => {
    if (!mediaUrl) return null;

    if (mediaType === 'video') {
      return (
        <video 
          src={mediaUrl} 
          controls 
          className="w-full max-h-48 rounded object-contain bg-black"
        />
      );
    }

    return (
      <img 
        src={mediaUrl} 
        alt="Step media" 
        className="w-full max-h-48 rounded object-contain bg-surface-low"
      />
    );
  };

  return (
    <div className="mt-3">
      {mediaUrl ? (
        <div className="relative group">
          {renderMedia()}
          <button 
            type="button"
            onClick={handleRemove}
            className="absolute top-2 right-2 bg-red-500/80 hover:bg-red-500 text-white p-1.5 rounded-full opacity-0 group-hover:opacity-100 transition-opacity"
          >
            <X size={14} />
          </button>
        </div>
      ) : (
        <div 
          onClick={() => !isProcessing && fileInputRef.current?.click()}
          className={`w-full py-3 border border-dashed border-border-subtle hover:border-neon/50 hover:bg-surface-low/30 rounded-lg flex items-center justify-center gap-3 cursor-pointer transition-all ${isProcessing ? 'opacity-50 cursor-wait' : ''}`}
        >
          {isProcessing ? (
            <>
              <Loader2 size={16} className="text-neon animate-spin" />
              <span className="text-xs text-mist-muted">Procesando...</span>
            </>
          ) : (
            <>
              <div className="flex items-center gap-2 text-mist-muted">
                <ImageIcon size={14} />
                <Video size={14} />
                <Film size={14} />
              </div>
              <span className="text-xs text-mist-muted">Agregar imagen, video o GIF</span>
            </>
          )}
          <input 
            type="file" 
            ref={fileInputRef} 
            onChange={handleFileChange} 
            accept="image/*,video/mp4,video/webm,.gif" 
            className="hidden" 
            disabled={isProcessing}
          />
        </div>
      )}
    </div>
  );
};

export default StepMediaUpload;
