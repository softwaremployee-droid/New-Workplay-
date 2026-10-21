import React, { useEffect, useRef } from 'react';

interface Particle {
  x: number;
  y: number;
  vx: number;
  vy: number;
  size: number;
  color: string;
  rotation: number;
  rotationSpeed: number;
  opacity: number;
  shape: 'rect' | 'circle';
}

interface ConfettiCanvasProps {
  triggerKey: number;
}

export const ConfettiCanvas: React.FC<ConfettiCanvasProps> = ({ triggerKey }) => {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  useEffect(() => {
    if (triggerKey === 0) return;
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const width = (canvas.width = canvas.offsetWidth);
    const height = (canvas.height = canvas.offsetHeight);

    const colors = [
      '#10B981', // Emerald
      '#111111', // Black
      '#6366F1', // Indigo
      '#F59E0B', // Amber
      '#EC4899', // Pink
      '#3B82F6', // Blue
    ];

    const particles: Particle[] = [];
    const particleCount = 42;

    for (let i = 0; i < particleCount; i++) {
      particles.push({
        x: width / 2 + (Math.random() - 0.5) * 60,
        y: height * 0.35 + (Math.random() - 0.5) * 40,
        vx: (Math.random() - 0.5) * 8,
        vy: -Math.random() * 6 - 2.5,
        size: Math.random() * 6 + 3,
        color: colors[Math.floor(Math.random() * colors.length)],
        rotation: Math.random() * 360,
        rotationSpeed: (Math.random() - 0.5) * 12,
        opacity: 1,
        shape: Math.random() > 0.4 ? 'rect' : 'circle',
      });
    }

    let animationFrameId: number;
    const startTime = performance.now();

    const render = (now: number) => {
      const elapsed = (now - startTime) / 1000;
      ctx.clearRect(0, 0, width, height);

      let activeParticles = 0;

      for (const p of particles) {
        p.x += p.vx;
        p.y += p.vy;
        p.vy += 0.22;
        p.vx *= 0.98;
        p.rotation += p.rotationSpeed;
        p.opacity = Math.max(0, 1 - elapsed / 1.4);

        if (p.opacity > 0 && p.y < height + 20) {
          activeParticles++;
          ctx.save();
          ctx.translate(p.x, p.y);
          ctx.rotate((p.rotation * Math.PI) / 180);
          ctx.globalAlpha = p.opacity;
          ctx.fillStyle = p.color;

          if (p.shape === 'rect') {
            ctx.fillRect(-p.size / 2, -p.size / 4, p.size, p.size / 2);
          } else {
            ctx.beginPath();
            ctx.arc(0, 0, p.size / 2, 0, Math.PI * 2);
            ctx.fill();
          }

          ctx.restore();
        }
      }

      if (activeParticles > 0 && elapsed < 1.5) {
        animationFrameId = requestAnimationFrame(render);
      } else {
        ctx.clearRect(0, 0, width, height);
      }
    };

    animationFrameId = requestAnimationFrame(render);

    return () => {
      cancelAnimationFrame(animationFrameId);
    };
  }, [triggerKey]);

  return (
    <canvas
      ref={canvasRef}
      className="pointer-events-none absolute inset-0 z-50 h-full w-full"
    />
  );
};
