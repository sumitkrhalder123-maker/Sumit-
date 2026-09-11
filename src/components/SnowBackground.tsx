import React, { useEffect, useRef, useState } from 'react';
import { Snowflake } from 'lucide-react';

interface SnowflakeParticle {
  x: number;
  y: number;
  radius: number;
  speedY: number;
  speedX: number;
  swayAngle: number;
  swaySpeed: number;
  swayAmplitude: number;
  opacity: number;
  color: string;
}

export const SnowBackground: React.FC = () => {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const [isEnabled, setIsEnabled] = useState(true);
  const mouseRef = useRef<{ x: number; y: number }>({ x: -1000, y: -1000 });

  useEffect(() => {
    if (!isEnabled) return;

    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d', { alpha: true });
    if (!ctx) return;

    let animationFrameId: number;
    let width = (canvas.width = window.innerWidth);
    let height = (canvas.height = window.innerHeight);

    // Number of flakes based on viewport width (chota chota, subtle density)
    const getFlakeCount = () => {
      if (width < 640) return 40;
      if (width < 1024) return 65;
      return 95;
    };

    const colors = [
      'rgba(255, 255, 255, ',
      'rgba(224, 242, 254, ', // soft icy cyan tint
      'rgba(186, 230, 253, ', // soft sky tint
    ];

    const createFlake = (initialY?: number): SnowflakeParticle => {
      const radius = Math.random() * 1.6 + 0.7; // 0.7px to 2.3px (delicate & tiny)
      return {
        x: Math.random() * width,
        y: initialY !== undefined ? initialY : Math.random() * height,
        radius,
        speedY: Math.random() * 0.7 + 0.35, // gentle falling speed
        speedX: (Math.random() - 0.5) * 0.25,
        swayAngle: Math.random() * Math.PI * 2,
        swaySpeed: Math.random() * 0.015 + 0.008,
        swayAmplitude: Math.random() * 0.8 + 0.4,
        opacity: Math.random() * 0.45 + 0.25, // 0.25 to 0.70 (translucent, never blinding)
        color: colors[Math.floor(Math.random() * colors.length)],
      };
    };

    let flakes: SnowflakeParticle[] = Array.from({ length: getFlakeCount() }, () =>
      createFlake()
    );

    const handleResize = () => {
      if (!canvas) return;
      width = canvas.width = window.innerWidth;
      height = canvas.height = window.innerHeight;
      flakes = Array.from({ length: getFlakeCount() }, () => createFlake());
    };

    const handleMouseMove = (e: MouseEvent) => {
      mouseRef.current = { x: e.clientX, y: e.clientY };
    };

    const handleMouseLeave = () => {
      mouseRef.current = { x: -1000, y: -1000 };
    };

    let isTabVisible = true;
    const handleVisibilityChange = () => {
      isTabVisible = !document.hidden;
      if (isTabVisible) {
        lastTime = performance.now();
      }
    };

    window.addEventListener('resize', handleResize);
    window.addEventListener('mousemove', handleMouseMove);
    window.addEventListener('mouseleave', handleMouseLeave);
    document.addEventListener('visibilitychange', handleVisibilityChange);

    let lastTime = performance.now();

    const render = (time: number) => {
      if (!isTabVisible) {
        animationFrameId = requestAnimationFrame(render);
        return;
      }

      const deltaTime = Math.min((time - lastTime) / 16.666, 2.5); // cap frame skip
      lastTime = time;

      ctx.clearRect(0, 0, width, height);

      const mx = mouseRef.current.x;
      const my = mouseRef.current.y;

      for (let i = 0; i < flakes.length; i++) {
        const f = flakes[i];

        // Update sway & vertical fall
        f.swayAngle += f.swaySpeed * deltaTime;
        f.x += (Math.sin(f.swayAngle) * f.swayAmplitude + f.speedX) * deltaTime;
        f.y += f.speedY * deltaTime;

        // Gentle interactive air-displacement when cursor is nearby
        const dx = f.x - mx;
        const dy = f.y - my;
        const distSq = dx * dx + dy * dy;
        if (distSq < 4900) { // within 70px
          const dist = Math.sqrt(distSq);
          const force = (1 - dist / 70) * 0.8;
          f.x += (dx / (dist || 1)) * force * 2;
          f.y += (dy / (dist || 1)) * force * 1.2;
        }

        // Looping behavior
        if (f.y > height + 8) {
          f.y = -6;
          f.x = Math.random() * width;
        }
        if (f.x > width + 8) {
          f.x = -6;
        } else if (f.x < -8) {
          f.x = width + 6;
        }

        // Draw tiny soft snowflake
        ctx.beginPath();
        ctx.arc(f.x, f.y, f.radius, 0, Math.PI * 2);
        ctx.fillStyle = `${f.color}${f.opacity})`;
        ctx.fill();
      }

      animationFrameId = requestAnimationFrame(render);
    };

    animationFrameId = requestAnimationFrame(render);

    return () => {
      cancelAnimationFrame(animationFrameId);
      window.removeEventListener('resize', handleResize);
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('mouseleave', handleMouseLeave);
      document.removeEventListener('visibilitychange', handleVisibilityChange);
    };
  }, [isEnabled]);

  return (
    <>
      {/* Background Canvas: Fixed, Non-interactive, Low z-index */}
      {isEnabled && (
        <canvas
          ref={canvasRef}
          aria-hidden="true"
          className="fixed inset-0 pointer-events-none z-0"
          style={{
            willChange: 'transform',
            transform: 'translateZ(0)',
          }}
        />
      )}

      {/* Floating Ambient Snowfall Control (Bottom Left, Subtle & Non-intrusive) */}
      <div className="fixed bottom-5 left-5 z-30 hidden sm:flex items-center">
        <button
          onClick={() => setIsEnabled(!isEnabled)}
          title={isEnabled ? 'Pause Ambient Snowfall' : 'Resume Ambient Snowfall'}
          aria-label={isEnabled ? 'Pause Ambient Snowfall' : 'Resume Ambient Snowfall'}
          className={`flex items-center gap-1.5 px-2.5 py-1.5 rounded-full text-[11px] font-medium transition-all backdrop-blur-md border shadow-lg ${
            isEnabled
              ? 'bg-slate-900/80 text-cyan-300 border-cyan-500/30 hover:bg-slate-800/90 shadow-cyan-950/40'
              : 'bg-slate-900/70 text-slate-400 border-slate-700/50 hover:text-slate-200'
          }`}
        >
          <Snowflake className={`w-3 h-3 ${isEnabled ? 'text-cyan-400 animate-spin-slow' : 'text-slate-500'}`} />
          <span className="opacity-90">{isEnabled ? 'Snow On' : 'Snow Off'}</span>
        </button>
      </div>
    </>
  );
};
