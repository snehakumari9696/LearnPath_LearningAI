import React from 'react';

interface HeroContentProps {
  onOpenTrial: () => void;
}

export const HeroContent: React.FC<HeroContentProps> = ({ onOpenTrial }) => {
  return (
    <div className="relative z-10 max-w-2xl text-left">
      {/* Primary Display Title */}
      <h1 className="text-4xl sm:text-5xl lg:text-[58px] font-extrabold text-white leading-[1.12] tracking-tight mb-5 drop-shadow-[0_2px_10px_rgba(0,0,0,0.4)]">
        Built With Purpose.<br />
        Driven by Vision.
      </h1>

      {/* Subtitle / Paragraph */}
      <p className="text-base sm:text-lg lg:text-[17px] text-[#cbd5e1] leading-[1.65] max-w-xl mb-8 font-normal">
        Master the principles of machine learning, neural networks, and
        prompt engineering with curated learning paths and hands-on
        projects designed for practical skills.
      </p>

      {/* Primary Action Button */}
      <div className="mb-14 sm:mb-16">
        <button
          id="hero-start-trial-btn"
          onClick={onOpenTrial}
          className="relative group cursor-pointer inline-flex items-center justify-center px-8 py-3 rounded-full text-white text-[15px] sm:text-base font-semibold tracking-wide transition-all duration-300 bg-gradient-to-r from-[#0284c7] via-[#0ea5e9] to-[#0284c7] shadow-[0_0_24px_rgba(14,165,233,0.85),0_0_45px_rgba(2,132,199,0.55),inset_0_1px_1px_rgba(255,255,255,0.4)] hover:shadow-[0_0_35px_rgba(56,189,248,1),0_0_60px_rgba(14,165,233,0.8),inset_0_1px_2px_rgba(255,255,255,0.8)] hover:scale-105 active:scale-95 border border-cyan-300/40"
        >
          {/* Cyan bloom halo backdrop */}
          <span className="absolute -inset-[3px] rounded-full bg-cyan-400/40 blur-[8px] -z-10 group-hover:bg-cyan-300/60 transition-all duration-300"></span>
          <span>Start Free Trial</span>
        </button>
      </div>
    </div>
  );
};
