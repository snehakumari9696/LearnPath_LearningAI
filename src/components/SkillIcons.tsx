import React from 'react';

export const DataScientistIcon: React.FC<{ className?: string }> = ({ className = "w-16 h-16" }) => {
  return (
    <svg viewBox="0 0 64 64" fill="none" xmlns="http://www.w3.org/2000/svg" className={className}>
      <defs>
        <linearGradient id="cyanBlueGrad" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#38bdf8" />
          <stop offset="100%" stopColor="#0284c7" />
        </linearGradient>
        <filter id="cyanGlow" x="-20%" y="-20%" width="140%" height="140%">
          <feGaussianBlur stdDeviation="1.5" result="blur" />
          <feMerge>
            <feMergeNode in="blur" />
            <feMergeNode in="SourceGraphic" />
          </feMerge>
        </filter>
      </defs>
      
      {/* Brain Left Hemisphere with circuit traces */}
      <path 
        d="M26 12C20 12 14 17 14 24C14 26.5 14.8 28.8 16.2 30.7C13.6 32.5 12 35.6 12 39C12 43.5 14.8 47.3 18.8 48.7C19.5 53.4 23.5 57 28.5 57C29.7 57 30.9 56.7 32 56.2" 
        stroke="#38bdf8" 
        strokeWidth="2.2" 
        strokeLinecap="round" 
        strokeLinejoin="round" 
      />
      <path 
        d="M26 12C28.5 12 30.7 13.2 32 15" 
        stroke="#38bdf8" 
        strokeWidth="2.2" 
        strokeLinecap="round" 
      />
      {/* Brain internal convoluted gyri */}
      <path 
        d="M20 23C23 23 25 21 26 18M18 31C22 31 25 28 27 24M16 38C20 38 23 35 24 31M21 46C24 45 26 42 27 38M25 53C27 51 28 47 28 44" 
        stroke="#38bdf8" 
        strokeWidth="1.8" 
        strokeLinecap="round" 
        strokeLinejoin="round" 
        opacity="0.9"
      />
      {/* Brain Nodes */}
      <circle cx="26" cy="18" r="1.8" fill="#7dd3fc" />
      <circle cx="27" cy="24" r="1.8" fill="#7dd3fc" />
      <circle cx="24" cy="31" r="1.8" fill="#7dd3fc" />
      <circle cx="27" cy="38" r="1.8" fill="#7dd3fc" />

      {/* Right Hemisphere Cog / Gear Mechanical System */}
      <path 
        d="M32 15V19M32 51V55M48.5 22.5L45.5 25.5M48.5 47.5L45.5 44.5M54 35H50M38 16L39.5 20M45 17.5L44 21.5M51 23L48 26M54 30L49.5 31.5M54 40L49.5 38.5M51 47L48 44M45 52.5L44 48.5M38 54L39.5 50" 
        stroke="#38bdf8" 
        strokeWidth="2" 
        strokeLinecap="round" 
      />
      {/* Outer Gear Outline Arc */}
      <path 
        d="M32 19C40.8 19 48 26.2 48 35C48 43.8 40.8 51 32 51" 
        stroke="#38bdf8" 
        strokeWidth="2.2" 
        strokeLinecap="round" 
      />
      {/* Inner Central Hub Arc */}
      <path 
        d="M32 27C36.4 27 40 30.6 40 35C40 39.4 36.4 43 32 43" 
        stroke="#38bdf8" 
        strokeWidth="2" 
        strokeLinecap="round" 
      />
      {/* Hub center dot */}
      <circle cx="32" cy="35" r="2.5" fill="#38bdf8" />
    </svg>
  );
};

export const MLEngineerIcon: React.FC<{ className?: string }> = ({ className = "w-16 h-16" }) => {
  return (
    <svg viewBox="0 0 64 64" fill="none" xmlns="http://www.w3.org/2000/svg" className={className}>
      {/* Base mounting */}
      <path d="M12 52H26" stroke="#38bdf8" strokeWidth="2.2" strokeLinecap="round" />
      <path d="M15 52C15 47 18 43 23 43C25 43 26 44 27 45" stroke="#38bdf8" strokeWidth="2" strokeLinecap="round" />
      <circle cx="19" cy="47.5" r="2" fill="#38bdf8" />
      
      {/* Lower Arm Link */}
      <path d="M19 47.5L29 27" stroke="#38bdf8" strokeWidth="2.5" strokeLinecap="round" />
      <circle cx="29" cy="27" r="3.5" stroke="#38bdf8" strokeWidth="2" fill="#0c2340" />
      <circle cx="29" cy="27" r="1.5" fill="#7dd3fc" />

      {/* Upper Arm Link */}
      <path d="M30 25.5L42 20" stroke="#38bdf8" strokeWidth="2.5" strokeLinecap="round" />
      <circle cx="42" cy="20" r="3" stroke="#38bdf8" strokeWidth="2" fill="#0c2340" />
      <circle cx="42" cy="20" r="1.2" fill="#7dd3fc" />

      {/* Robotic End Effector / Gripper */}
      <path d="M44 19L50 20M44 21L49 24" stroke="#38bdf8" strokeWidth="2" strokeLinecap="round" />
      <path d="M50 18V21M49 23V26" stroke="#38bdf8" strokeWidth="2" strokeLinecap="round" />
      <path d="M50 21L53 23M49 23L53 23" stroke="#38bdf8" strokeWidth="1.5" strokeLinecap="round" />

      {/* Target Data Matrix / Cybernetic Processor Box with Brackets */}
      {/* Left bracket */}
      <path d="M36 34H33V49H36" stroke="#38bdf8" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
      {/* Right bracket */}
      <path d="M52 34H55V49H52" stroke="#38bdf8" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
      
      {/* Microchip Matrix Dots / Lines inside bracket */}
      <line x1="37" y1="37" x2="43" y2="37" stroke="#38bdf8" strokeWidth="1.5" strokeLinecap="round" />
      <circle cx="46" cy="37" r="1" fill="#7dd3fc" />
      <circle cx="50" cy="37" r="1" fill="#7dd3fc" />

      <circle cx="38" cy="41.5" r="1" fill="#7dd3fc" />
      <line x1="41" y1="41.5" x2="51" y2="41.5" stroke="#38bdf8" strokeWidth="1.5" strokeLinecap="round" />

      <line x1="37" y1="46" x2="45" y2="46" stroke="#38bdf8" strokeWidth="1.5" strokeLinecap="round" />
      <circle cx="48" cy="46" r="1" fill="#7dd3fc" />
      <circle cx="51" cy="46" r="1" fill="#7dd3fc" />
    </svg>
  );
};

export const DeepLearningIcon: React.FC<{ className?: string }> = ({ className = "w-16 h-16" }) => {
  return (
    <svg viewBox="0 0 64 64" fill="none" xmlns="http://www.w3.org/2000/svg" className={className}>
      <defs>
        <radialGradient id="purpleGlow" cx="50%" cy="50%" r="50%">
          <stop offset="0%" stopColor="#d8b4fe" />
          <stop offset="100%" stopColor="#a855f7" />
        </radialGradient>
        <radialGradient id="cyanGlowNode" cx="50%" cy="50%" r="50%">
          <stop offset="0%" stopColor="#7dd3fc" />
          <stop offset="100%" stopColor="#0ea5e9" />
        </radialGradient>
        <radialGradient id="pinkGlow" cx="50%" cy="50%" r="50%">
          <stop offset="0%" stopColor="#f472b6" />
          <stop offset="100%" stopColor="#db2777" />
        </radialGradient>
        <radialGradient id="yellowGlow" cx="50%" cy="50%" r="50%">
          <stop offset="0%" stopColor="#fde047" />
          <stop offset="100%" stopColor="#eab308" />
        </radialGradient>
        <radialGradient id="orangeGlow" cx="50%" cy="50%" r="50%">
          <stop offset="0%" stopColor="#fdba74" />
          <stop offset="100%" stopColor="#f97316" />
        </radialGradient>
        <radialGradient id="greenGlow" cx="50%" cy="50%" r="50%">
          <stop offset="0%" stopColor="#86efac" />
          <stop offset="100%" stopColor="#22c55e" />
        </radialGradient>
        <radialGradient id="blueGlow" cx="50%" cy="50%" r="50%">
          <stop offset="0%" stopColor="#93c5fd" />
          <stop offset="100%" stopColor="#3b82f6" />
        </radialGradient>
      </defs>

      {/* Layer Interconnections */}
      {/* Input Layer (x=16) -> Hidden Layer (x=32) */}
      <line x1="16" y1="18" x2="32" y2="14" stroke="#0284c7" strokeWidth="1.2" opacity="0.65" />
      <line x1="16" y1="18" x2="32" y2="26" stroke="#0284c7" strokeWidth="1.2" opacity="0.65" />
      <line x1="16" y1="18" x2="32" y2="38" stroke="#0284c7" strokeWidth="1.2" opacity="0.65" />
      <line x1="16" y1="18" x2="32" y2="50" stroke="#0284c7" strokeWidth="1.2" opacity="0.65" />

      <line x1="16" y1="34" x2="32" y2="14" stroke="#0284c7" strokeWidth="1.2" opacity="0.65" />
      <line x1="16" y1="34" x2="32" y2="26" stroke="#0284c7" strokeWidth="1.2" opacity="0.65" />
      <line x1="16" y1="34" x2="32" y2="38" stroke="#0284c7" strokeWidth="1.2" opacity="0.65" />
      <line x1="16" y1="34" x2="32" y2="50" stroke="#0284c7" strokeWidth="1.2" opacity="0.65" />

      <line x1="16" y1="50" x2="32" y2="14" stroke="#0284c7" strokeWidth="1.2" opacity="0.65" />
      <line x1="16" y1="50" x2="32" y2="26" stroke="#0284c7" strokeWidth="1.2" opacity="0.65" />
      <line x1="16" y1="50" x2="32" y2="38" stroke="#0284c7" strokeWidth="1.2" opacity="0.65" />
      <line x1="16" y1="50" x2="32" y2="50" stroke="#0284c7" strokeWidth="1.2" opacity="0.65" />

      {/* Hidden Layer (x=32) -> Output Layer (x=48) */}
      <line x1="32" y1="14" x2="48" y2="20" stroke="#0284c7" strokeWidth="1.2" opacity="0.65" />
      <line x1="32" y1="14" x2="48" y2="34" stroke="#0284c7" strokeWidth="1.2" opacity="0.65" />
      <line x1="32" y1="14" x2="48" y2="48" stroke="#0284c7" strokeWidth="1.2" opacity="0.65" />

      <line x1="32" y1="26" x2="48" y2="20" stroke="#0284c7" strokeWidth="1.2" opacity="0.65" />
      <line x1="32" y1="26" x2="48" y2="34" stroke="#0284c7" strokeWidth="1.2" opacity="0.65" />
      <line x1="32" y1="26" x2="48" y2="48" stroke="#0284c7" strokeWidth="1.2" opacity="0.65" />

      <line x1="32" y1="38" x2="48" y2="20" stroke="#0284c7" strokeWidth="1.2" opacity="0.65" />
      <line x1="32" y1="38" x2="48" y2="34" stroke="#0284c7" strokeWidth="1.2" opacity="0.65" />
      <line x1="32" y1="38" x2="48" y2="48" stroke="#0284c7" strokeWidth="1.2" opacity="0.65" />

      <line x1="32" y1="50" x2="48" y2="20" stroke="#0284c7" strokeWidth="1.2" opacity="0.65" />
      <line x1="32" y1="50" x2="48" y2="34" stroke="#0284c7" strokeWidth="1.2" opacity="0.65" />
      <line x1="32" y1="50" x2="48" y2="48" stroke="#0284c7" strokeWidth="1.2" opacity="0.65" />

      {/* Layer 1 Nodes (Left) */}
      <circle cx="16" cy="18" r="3.8" fill="url(#purpleGlow)" stroke="#c084fc" strokeWidth="1" />
      <circle cx="16" cy="34" r="3.8" fill="url(#cyanGlowNode)" stroke="#38bdf8" strokeWidth="1" />
      <circle cx="16" cy="50" r="3.8" fill="url(#pinkGlow)" stroke="#f472b6" strokeWidth="1" />

      {/* Layer 2 Nodes (Middle) */}
      <circle cx="32" cy="14" r="3.6" fill="url(#yellowGlow)" stroke="#facc15" strokeWidth="1" />
      <circle cx="32" cy="26" r="3.6" fill="url(#orangeGlow)" stroke="#fb923c" strokeWidth="1" />
      <circle cx="32" cy="38" r="3.6" fill="url(#blueGlow)" stroke="#60a5fa" strokeWidth="1" />
      <circle cx="32" cy="50" r="3.6" fill="url(#greenGlow)" stroke="#4ade80" strokeWidth="1" />

      {/* Layer 3 Nodes (Right) */}
      <circle cx="48" cy="20" r="3.8" fill="url(#yellowGlow)" stroke="#facc15" strokeWidth="1" />
      <circle cx="48" cy="34" r="3.8" fill="url(#purpleGlow)" stroke="#c084fc" strokeWidth="1" />
      <circle cx="48" cy="48" r="3.8" fill="url(#cyanGlowNode)" stroke="#38bdf8" strokeWidth="1" />
    </svg>
  );
};

export const NLPSpecialistIcon: React.FC<{ className?: string }> = ({ className = "w-16 h-16" }) => {
  return (
    <svg viewBox="0 0 64 64" fill="none" xmlns="http://www.w3.org/2000/svg" className={className}>
      {/* Top Tag Bubble "TEXT" */}
      <rect x="14" y="12" width="28" height="15" rx="3.5" stroke="#38bdf8" strokeWidth="2.2" fill="#08203e" />
      {/* Text Characters: T E X T */}
      <text 
        x="28" 
        y="23.5" 
        textAnchor="middle" 
        fill="#38bdf8" 
        fontSize="9.5" 
        fontWeight="800" 
        fontFamily="sans-serif"
        letterSpacing="0.8px"
      >
        TEXT
      </text>

      {/* Lower Left Chat Prompt Box */}
      <rect x="14" y="32" width="20" height="15" rx="3" stroke="#38bdf8" strokeWidth="2" fill="#08203e" />
      {/* Lines inside left bubble */}
      <line x1="18" y1="36.5" x2="29" y2="36.5" stroke="#38bdf8" strokeWidth="1.8" strokeLinecap="round" />
      <line x1="18" y1="40" x2="30" y2="40" stroke="#38bdf8" strokeWidth="1.8" strokeLinecap="round" />
      <line x1="18" y1="43.5" x2="26" y2="43.5" stroke="#38bdf8" strokeWidth="1.8" strokeLinecap="round" />

      {/* Lower Right Speech Bubble with pointer tail */}
      <path 
        d="M38 31H52C53.7 31 55 32.3 55 34V46C55 47.7 53.7 49 52 49H43L37 54V49H38C36.3 49 35 47.7 35 46V34C35 32.3 36.3 31 38 31Z" 
        stroke="#38bdf8" 
        strokeWidth="2.2" 
        strokeLinecap="round" 
        strokeLinejoin="round" 
        fill="#08203e" 
      />
      {/* Content lines inside right speech bubble */}
      <line x1="40" y1="36.5" x2="50" y2="36.5" stroke="#38bdf8" strokeWidth="1.8" strokeLinecap="round" />
      <line x1="40" y1="41" x2="48" y2="41" stroke="#38bdf8" strokeWidth="1.8" strokeLinecap="round" />
    </svg>
  );
};
