import React, { useEffect, useRef } from 'react';

interface Particle {
  x: number;
  y: number;
  vx: number;
  vy: number;
  radius: number;
  baseRadius: number;
  color: string;
  alpha: number;
  pulseSpeed: number;
  pulsePhase: number;
  isMainNode?: boolean;
}

interface CircuitPulse {
  pathIndex: number;
  progress: number;
  speed: number;
  size: number;
}

export const TechBackgroundCanvas: React.FC = () => {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let animationFrameId: number;
    let width = (canvas.width = window.innerWidth);
    let height = (canvas.height = window.innerHeight);

    const handleResize = () => {
      if (!canvas) return;
      width = canvas.width = window.innerWidth;
      height = canvas.height = window.innerHeight;
      initParticles();
    };

    window.addEventListener('resize', handleResize);

    // Mouse coordinates for subtle interactive reaction
    let mouseX = -1000;
    let mouseY = -1000;

    const handleMouseMove = (e: MouseEvent) => {
      const rect = canvas.getBoundingClientRect();
      mouseX = e.clientX - rect.left;
      mouseY = e.clientY - rect.top;
    };

    const handleMouseLeave = () => {
      mouseX = -1000;
      mouseY = -1000;
    };

    window.addEventListener('mousemove', handleMouseMove);
    window.addEventListener('mouseleave', handleMouseLeave);

    let particles: Particle[] = [];

    // Predefined right-side constellation anchor points (normalized coordinates 0..1)
    const constellationAnchors = [
      { x: 0.62, y: 0.22, isMain: true, r: 3.5 },
      { x: 0.69, y: 0.28, isMain: true, r: 4.2 },
      { x: 0.64, y: 0.38, isMain: true, r: 4.8 },
      { x: 0.73, y: 0.44, isMain: true, r: 3.8 },
      { x: 0.58, y: 0.29, isMain: false, r: 2.5 },
      { x: 0.54, y: 0.34, isMain: false, r: 2.2 },
      { x: 0.56, y: 0.47, isMain: true, r: 3.2 },
      { x: 0.50, y: 0.34, isMain: false, r: 1.8 },
      { x: 0.65, y: 0.52, isMain: true, r: 3.6 },
      { x: 0.70, y: 0.53, isMain: false, r: 2.4 },
      { x: 0.76, y: 0.32, isMain: false, r: 2.6 },
      { x: 0.78, y: 0.23, isMain: false, r: 2.2 },
      { x: 0.81, y: 0.42, isMain: false, r: 2.0 },
      { x: 0.83, y: 0.51, isMain: false, r: 2.4 },
      { x: 0.59, y: 0.65, isMain: true, r: 3.2 },
      { x: 0.53, y: 0.62, isMain: false, r: 2.0 },
      { x: 0.45, y: 0.64, isMain: false, r: 1.8 },
      { x: 0.66, y: 0.69, isMain: true, r: 3.0 },
      { x: 0.72, y: 0.62, isMain: false, r: 2.2 },
      { x: 0.78, y: 0.68, isMain: false, r: 2.0 },
      { x: 0.68, y: 0.78, isMain: false, r: 2.2 },
      { x: 0.77, y: 0.82, isMain: false, r: 2.4 },
      { x: 0.82, y: 0.72, isMain: false, r: 1.8 },
    ];

    const initParticles = () => {
      particles = [];

      // Add constellation nodes
      constellationAnchors.forEach((node, i) => {
        particles.push({
          x: node.x * width + (Math.random() - 0.5) * 15,
          y: node.y * height + (Math.random() - 0.5) * 15,
          vx: (Math.random() - 0.5) * 0.15,
          vy: (Math.random() - 0.5) * 0.15,
          baseRadius: node.r,
          radius: node.r,
          color: node.isMain ? '#e0f2fe' : '#38bdf8',
          alpha: node.isMain ? 0.95 : 0.7,
          pulseSpeed: 0.02 + Math.random() * 0.02,
          pulsePhase: Math.random() * Math.PI * 2,
          isMainNode: node.isMain,
        });
      });

      // Add background ambient floating micro particles
      const count = Math.floor(width / 35);
      for (let i = 0; i < count; i++) {
        // Bias particles towards right half to match the reference composition
        const xPercent = 0.4 + Math.random() * 0.58;
        const yPercent = 0.1 + Math.random() * 0.85;
        particles.push({
          x: xPercent * width,
          y: yPercent * height,
          vx: (Math.random() - 0.5) * 0.2,
          vy: (Math.random() - 0.5) * 0.2,
          baseRadius: 1 + Math.random() * 1.5,
          radius: 1 + Math.random() * 1.5,
          color: '#38bdf8',
          alpha: 0.3 + Math.random() * 0.5,
          pulseSpeed: 0.01 + Math.random() * 0.02,
          pulsePhase: Math.random() * Math.PI * 2,
          isMainNode: false,
        });
      }
    };

    initParticles();

    // Circuit track paths for animated signal pulses
    const circuitPulses: CircuitPulse[] = [
      { pathIndex: 0, progress: 0.1, speed: 0.003, size: 2.5 },
      { pathIndex: 1, progress: 0.45, speed: 0.0025, size: 2.5 },
      { pathIndex: 2, progress: 0.7, speed: 0.0035, size: 2 },
      { pathIndex: 3, progress: 0.2, speed: 0.002, size: 3 },
      { pathIndex: 4, progress: 0.85, speed: 0.004, size: 2 },
    ];

    let tick = 0;

    const render = () => {
      tick += 1;
      ctx.clearRect(0, 0, width, height);

      // 1. Base Gradient Background (Deep Sapphire Navy to Midnight Electric Blue)
      const bgGrad = ctx.createLinearGradient(0, 0, width, height);
      bgGrad.addColorStop(0, '#0a3a78'); // Top-left sapphire blue
      bgGrad.addColorStop(0.25, '#072450');
      bgGrad.addColorStop(0.55, '#041530');
      bgGrad.addColorStop(0.85, '#030c1c');
      bgGrad.addColorStop(1, '#020813');
      ctx.fillStyle = bgGrad;
      ctx.fillRect(0, 0, width, height);

      // Radial bloom around the central neural cluster
      const clusterX = width * 0.65;
      const clusterY = height * 0.42;
      const bloomGrad = ctx.createRadialGradient(clusterX, clusterY, 10, clusterX, clusterY, width * 0.4);
      bloomGrad.addColorStop(0, 'rgba(14, 165, 233, 0.22)');
      bloomGrad.addColorStop(0.4, 'rgba(2, 132, 199, 0.12)');
      bloomGrad.addColorStop(0.8, 'rgba(3, 105, 161, 0.03)');
      bloomGrad.addColorStop(1, 'rgba(0, 0, 0, 0)');
      ctx.fillStyle = bloomGrad;
      ctx.fillRect(0, 0, width, height);

      // 2. Render Constellation Lines
      ctx.lineWidth = 1;
      for (let i = 0; i < particles.length; i++) {
        for (let j = i + 1; j < particles.length; j++) {
          const dx = particles[i].x - particles[j].x;
          const dy = particles[i].y - particles[j].y;
          const dist = Math.sqrt(dx * dx + dy * dy);
          const maxDist = width < 768 ? 90 : 130;

          if (dist < maxDist) {
            const lineAlpha = (1 - dist / maxDist) * 0.35 * (particles[i].alpha + particles[j].alpha) / 2;
            ctx.strokeStyle = `rgba(56, 189, 248, ${lineAlpha})`;
            ctx.beginPath();
            ctx.moveTo(particles[i].x, particles[i].y);
            ctx.lineTo(particles[j].x, particles[j].y);
            ctx.stroke();
          }
        }
      }

      // 3. Update & Draw Particles / Constellation Nodes
      for (let i = 0; i < particles.length; i++) {
        const p = particles[i];

        // Slight drift
        p.x += p.vx;
        p.y += p.vy;

        // Boundaries bounce softly
        if (p.x < width * 0.35) { p.x = width * 0.35; p.vx *= -1; }
        if (p.x > width * 0.98) { p.x = width * 0.98; p.vx *= -1; }
        if (p.y < height * 0.08) { p.y = height * 0.08; p.vy *= -1; }
        if (p.y > height * 0.92) { p.y = height * 0.92; p.vy *= -1; }

        // Pulsing radius and alpha
        p.pulsePhase += p.pulseSpeed;
        const currentRadius = p.baseRadius + Math.sin(p.pulsePhase) * (p.isMainNode ? 1.2 : 0.5);
        const currentAlpha = p.alpha + Math.sin(p.pulsePhase) * 0.15;

        // Interactive mouse interaction
        const mdx = p.x - mouseX;
        const mdy = p.y - mouseY;
        const mdist = Math.sqrt(mdx * mdx + mdy * mdy);
        if (mdist < 100) {
          const force = (1 - mdist / 100) * 2;
          p.x += (mdx / mdist) * force;
          p.y += (mdy / mdist) * force;
        }

        // Draw Outer Glow for Main Nodes
        if (p.isMainNode || p.baseRadius > 3) {
          const glowGrad = ctx.createRadialGradient(p.x, p.y, 0, p.x, p.y, currentRadius * 5);
          glowGrad.addColorStop(0, 'rgba(56, 189, 248, 0.6)');
          glowGrad.addColorStop(0.4, 'rgba(14, 165, 233, 0.25)');
          glowGrad.addColorStop(1, 'rgba(2, 132, 199, 0)');
          ctx.fillStyle = glowGrad;
          ctx.beginPath();
          ctx.arc(p.x, p.y, currentRadius * 5, 0, Math.PI * 2);
          ctx.fill();
        }

        // Draw Node Core
        ctx.fillStyle = p.isMainNode ? '#ffffff' : `rgba(125, 211, 252, ${currentAlpha})`;
        ctx.beginPath();
        ctx.arc(p.x, p.y, currentRadius, 0, Math.PI * 2);
        ctx.fill();

        // White core highlight for bright nodes
        if (p.isMainNode) {
          ctx.fillStyle = '#ffffff';
          ctx.beginPath();
          ctx.arc(p.x, p.y, currentRadius * 0.5, 0, Math.PI * 2);
          ctx.fill();
        }
      }

      // 4. Subtle Specular Star Flare on bottom right
      const starX = width * 0.91;
      const starY = height * 0.84;
      drawSpecularStar(ctx, starX, starY, 28, tick);

      animationFrameId = requestAnimationFrame(render);
    };

    const drawSpecularStar = (
      context: CanvasRenderingContext2D,
      cx: number,
      cy: number,
      size: number,
      frame: number
    ) => {
      const pulse = 0.85 + Math.sin(frame * 0.03) * 0.15;
      const actualSize = size * pulse;

      context.save();
      context.translate(cx, cy);

      // Star shape (4 pointed flare)
      const grad = context.createRadialGradient(0, 0, 1, 0, 0, actualSize * 1.5);
      grad.addColorStop(0, 'rgba(224, 242, 254, 0.8)');
      grad.addColorStop(0.3, 'rgba(56, 189, 248, 0.4)');
      grad.addColorStop(0.7, 'rgba(14, 165, 233, 0.1)');
      grad.addColorStop(1, 'rgba(0, 0, 0, 0)');

      context.fillStyle = grad;
      context.beginPath();
      // Draw 4-point diamond star
      context.moveTo(0, -actualSize);
      context.quadraticCurveTo(0, 0, actualSize, 0);
      context.quadraticCurveTo(0, 0, 0, actualSize);
      context.quadraticCurveTo(0, 0, -actualSize, 0);
      context.quadraticCurveTo(0, 0, 0, -actualSize);
      context.closePath();
      context.fill();

      // Soft center cross glint
      context.strokeStyle = 'rgba(255, 255, 255, 0.85)';
      context.lineWidth = 1;
      context.beginPath();
      context.moveTo(-actualSize * 0.6, 0);
      context.lineTo(actualSize * 0.6, 0);
      context.moveTo(0, -actualSize * 0.6);
      context.lineTo(0, actualSize * 0.6);
      context.stroke();

      context.restore();
    };

    render();

    return () => {
      window.removeEventListener('resize', handleResize);
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('mouseleave', handleMouseLeave);
      cancelAnimationFrame(animationFrameId);
    };
  }, []);

  return (
    <div className="absolute inset-0 pointer-events-none overflow-hidden z-0">
      {/* Background Interactive Canvas */}
      <canvas ref={canvasRef} className="absolute inset-0 w-full h-full" />

      {/* High-Fidelity SVG Circuit Board Traces Overlay matching the reference image */}
      <svg
        className="absolute inset-0 w-full h-full"
        xmlns="http://www.w3.org/2000/svg"
        preserveAspectRatio="none"
        viewBox="0 0 1440 900"
      >
        <defs>
          {/* Subtle cyan glow for circuit tracks */}
          <filter id="circuitGlow" x="-10%" y="-10%" width="120%" height="120%">
            <feGaussianBlur stdDeviation="1.5" result="blur" />
            <feMerge>
              <feMergeNode in="blur" />
              <feMergeNode in="SourceGraphic" />
            </feMerge>
          </filter>

          <linearGradient id="traceGradRight" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#0284c7" stopOpacity="0.2" />
            <stop offset="50%" stopColor="#0ea5e9" stopOpacity="0.6" />
            <stop offset="100%" stopColor="#0284c7" stopOpacity="0.3" />
          </linearGradient>

          <linearGradient id="traceGradLeft" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#0369a1" stopOpacity="0.45" />
            <stop offset="100%" stopColor="#0284c7" stopOpacity="0.1" />
          </linearGradient>

          <linearGradient id="pulseGrad" x1="0%" y1="0%" x2="100%" y2="0%">
            <stop offset="0%" stopColor="#38bdf8" stopOpacity="0" />
            <stop offset="50%" stopColor="#ffffff" stopOpacity="1" />
            <stop offset="100%" stopColor="#38bdf8" stopOpacity="0" />
          </linearGradient>
        </defs>

        {/* ----------------- TOP RIGHT CIRCUIT TRACES ----------------- */}
        <g stroke="#0ea5e9" strokeWidth="1.5" fill="none" opacity="0.45" strokeLinecap="round" strokeLinejoin="round">
          {/* Top right outer concentric bus lines */}
          <path d="M960 20 L1180 20 L1260 80 L1380 80 L1440 120" />
          <circle cx="960" cy="20" r="3.5" fill="#0c2d58" stroke="#38bdf8" strokeWidth="1.5" />
          <circle cx="960" cy="20" r="1.5" fill="#38bdf8" />

          <path d="M1020 40 L1200 40 L1270 95 L1400 95 L1440 135" />
          <circle cx="1020" cy="40" r="3" fill="#0c2d58" stroke="#38bdf8" strokeWidth="1.5" />

          <path d="M990 70 L1150 70 L1220 125 L1350 125 L1440 190" />
          <circle cx="990" cy="70" r="3.5" fill="#0c2d58" stroke="#38bdf8" strokeWidth="1.5" />
          <circle cx="990" cy="70" r="1.5" fill="#38bdf8" />

          <path d="M1060 100 L1170 100 L1240 155 L1370 155 L1440 210" />
          <circle cx="1060" cy="100" r="3" fill="#0c2d58" stroke="#38bdf8" strokeWidth="1.5" />

          {/* Flowing circuit arches wrapping the right side cluster */}
          <path d="M1100 130 L1190 130 L1260 190 L1360 190 L1420 240 L1440 240" />
          <path d="M1130 160 L1220 160 L1280 220 L1370 220 L1430 270 L1440 270" />
          <circle cx="1130" cy="160" r="3.5" fill="#0c2d58" stroke="#38bdf8" strokeWidth="1.5" />
          <circle cx="1130" cy="160" r="1.5" fill="#38bdf8" />

          <path d="M1180 190 L1250 190 L1300 245 L1380 245 L1440 300" />
          <circle cx="1180" cy="190" r="3" fill="#0c2d58" stroke="#38bdf8" strokeWidth="1.5" />

          <path d="M1200 220 L1270 220 L1320 270 L1390 270 L1440 320" />
          <path d="M1230 250 L1290 250 L1340 300 L1400 300 L1440 340" />
          <circle cx="1230" cy="250" r="3.5" fill="#0c2d58" stroke="#38bdf8" strokeWidth="1.5" />

          {/* Right Middle tracks wrapping inward */}
          <path d="M1150 280 L1240 280 L1310 350 L1360 350 L1420 400 L1440 400" />
          <path d="M1110 320 L1200 320 L1270 390 L1340 390 L1400 440 L1440 440" />
          <circle cx="1110" cy="320" r="3" fill="#0c2d58" stroke="#38bdf8" strokeWidth="1.5" />

          {/* Deep concentric curves around the neural mesh */}
          <path d="M1040 360 L1140 360 L1210 430 L1320 430 L1390 490 L1440 490" />
          <path d="M980 400 L1080 400 L1160 475 L1290 475 L1370 545 L1440 545" />
          <circle cx="980" cy="400" r="3.5" fill="#0c2d58" stroke="#38bdf8" strokeWidth="1.5" />
          <circle cx="980" cy="400" r="1.5" fill="#38bdf8" />

          <path d="M950 440 L1040 440 L1120 520 L1250 520 L1340 600 L1440 600" />
          <circle cx="950" cy="440" r="3" fill="#0c2d58" stroke="#38bdf8" strokeWidth="1.5" />

          <path d="M920 480 L1000 480 L1080 560 L1220 560 L1300 640 L1440 640" />
          <path d="M880 520 L960 520 L1040 600 L1180 600 L1260 680 L1440 680" />
          <circle cx="880" cy="520" r="3.5" fill="#0c2d58" stroke="#38bdf8" strokeWidth="1.5" />
          <circle cx="880" cy="520" r="1.5" fill="#38bdf8" />

          {/* Bottom Right nested tracks */}
          <path d="M850 560 L930 560 L1000 640 L1140 640 L1220 720 L1440 720" />
          <path d="M820 600 L890 600 L960 680 L1100 680 L1180 760 L1440 760" />
          <circle cx="820" cy="600" r="3" fill="#0c2d58" stroke="#38bdf8" strokeWidth="1.5" />

          <path d="M780 650 L850 650 L920 725 L1060 725 L1130 800 L1440 800" />
          <path d="M740 690 L810 690 L880 765 L1020 765 L1090 840 L1440 840" />
          <circle cx="740" cy="690" r="3.5" fill="#0c2d58" stroke="#38bdf8" strokeWidth="1.5" />
          <circle cx="740" cy="690" r="1.5" fill="#38bdf8" />

          <path d="M690 730 L760 730 L830 805 L970 805 L1040 880 L1440 880" />
          <circle cx="690" cy="730" r="3" fill="#0c2d58" stroke="#38bdf8" strokeWidth="1.5" />
        </g>

        {/* ----------------- BOTTOM LEFT & MAIN AREA CIRCUIT TRACES ----------------- */}
        <g stroke="#0ea5e9" strokeWidth="1.5" fill="none" opacity="0.35" strokeLinecap="round" strokeLinejoin="round">
          {/* Under "Start Free Trial" and skills */}
          <path d="M0 580 L120 580 L220 670 L480 670 L540 730 L660 730" />
          <circle cx="660" cy="730" r="3.5" fill="#0c2d58" stroke="#38bdf8" strokeWidth="1.5" />
          <circle cx="660" cy="730" r="1.5" fill="#38bdf8" />

          <path d="M0 620 L90 620 L190 710 L440 710 L500 770 L620 770" />
          <circle cx="620" cy="770" r="3" fill="#0c2d58" stroke="#38bdf8" strokeWidth="1.5" />

          <path d="M0 660 L60 660 L160 750 L400 750 L460 810 L580 810" />
          <circle cx="580" cy="810" r="3.5" fill="#0c2d58" stroke="#38bdf8" strokeWidth="1.5" />
          <circle cx="580" cy="810" r="1.5" fill="#38bdf8" />

          <path d="M0 700 L40 700 L130 790 L360 790 L420 850 L540 850" />
          <circle cx="540" cy="850" r="3" fill="#0c2d58" stroke="#38bdf8" strokeWidth="1.5" />

          <path d="M0 740 L20 740 L100 825 L320 825 L380 885 L500 885" />
          <path d="M0 780 L80 860 L280 860 L340 910" />
          <path d="M0 820 L60 890 L240 890" />

          {/* Subtle circuit bus branching right under Key Skills */}
          <path d="M470 615 L520 615 L570 665 L680 665" />
          <circle cx="470" cy="615" r="3" fill="#0c2d58" stroke="#38bdf8" strokeWidth="1.5" />
          <circle cx="680" cy="665" r="3" fill="#0c2d58" stroke="#38bdf8" strokeWidth="1.5" />

          <path d="M380 615 L430 615" />
          <circle cx="380" cy="615" r="2.5" fill="#38bdf8" />

          <path d="M260 550 L340 550 L400 610 L500 610" />
          <circle cx="260" cy="550" r="3.5" fill="#0c2d58" stroke="#38bdf8" strokeWidth="1.5" />
          <circle cx="260" cy="550" r="1.5" fill="#38bdf8" />

          {/* Left vertical terminal connections */}
          <path d="M480 810 L530 860 L650 860" />
          <circle cx="650" cy="860" r="3" fill="#0c2d58" stroke="#38bdf8" strokeWidth="1.5" />
        </g>

        {/* ----------------- SUBTLE HIGH-TECH GLOWING ACCENT VECTORS ----------------- */}
        <g stroke="#38bdf8" strokeWidth="1.5" opacity="0.6">
          {/* Small cyan connector crosses */}
          <path d="M680 435 L690 435 M685 430 L685 440" />
          <path d="M840 280 L850 280 M845 275 L845 285" />
          <path d="M610 590 L620 590 M615 585 L615 595" />
        </g>
      </svg>
    </div>
  );
};
