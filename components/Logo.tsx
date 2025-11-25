import React from 'react';

interface LogoProps {
  className?: string;
}

const AiclonLogo: React.FC<LogoProps> = ({ className = "w-8 h-8" }) => (
  <img 
    src="https://storage.googleapis.com/aiclon_images/Logo/IMAGOTI%C2%B4PO%20PNG%20ORIGINAL.png" 
    alt="AICLON Logo" 
    className={`${className} object-contain`} 
  />
);

export default AiclonLogo;