import React, { useRef, useEffect } from 'react';

export default function HeroCanvas({ scrollProgress, handPosition }) {
  const canvasRef = useRef(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    let animationFrameId;
    let width = (canvas.width = canvas.parentElement.clientWidth);
    let height = (canvas.height = canvas.parentElement.clientHeight);

    const handleResize = () => {
      if (!canvas) return;
      width = canvas.width = canvas.parentElement.clientWidth;
      height = canvas.height = canvas.parentElement.clientHeight;
    };
    window.addEventListener('resize', handleResize);

    // Particle pool for energy wave
    const particleCount = window.innerWidth < 768 ? 60 : 160;
    const particles = [];
    const neuralNodes = [];

    // Initialize neural network nodes on the left
    for (let i = 0; i < 24; i++) {
      neuralNodes.push({
        x: Math.random() * (width * 0.45) + 30,
        y: Math.random() * (height * 0.7) + height * 0.15,
        radius: Math.random() * 3 + 2,
        baseX: 0,
        baseY: 0,
        pulseSpeed: Math.random() * 0.03 + 0.01,
        color: Math.random() > 0.4 ? '#00f2fe' : '#9d4edd',
        connections: [],
      });
    }

    // Connect neural nodes
    neuralNodes.forEach((node, idx) => {
      node.baseX = node.x;
      node.baseY = node.y;
      for (let j = idx + 1; j < neuralNodes.length; j++) {
        const dist = Math.hypot(node.x - neuralNodes[j].x, node.y - neuralNodes[j].y);
        if (dist < 180 && Math.random() > 0.4) {
          node.connections.push(neuralNodes[j]);
        }
      }
    });

    // Initialize flowing stream particles
    for (let i = 0; i < particleCount; i++) {
      particles.push({
        progress: Math.random(),
        speed: Math.random() * 0.007 + 0.004,
        offsetY: (Math.random() - 0.5) * 140,
        size: Math.random() * 2.8 + 1,
        color: Math.random() > 0.35 ? '#00f2fe' : '#a855f7',
        brightness: Math.random(),
        trail: [],
      });
    }

    let time = 0;

    const render = () => {
      time += 0.02;
      ctx.clearRect(0, 0, width, height);

      const progress = scrollProgress; // 0.0 to 1.0

      // Calculate hand source coordinates
      const defaultHandX = width * 0.72;
      const defaultHandY = height * 0.46;
      const originX = handPosition?.x ? handPosition.x : defaultHandX;
      const originY = handPosition?.y ? handPosition.y : defaultHandY;

      // Target area: Left side hero text area
      const targetX = width * 0.18;
      const targetY = height * 0.48;

      // PHASE 0 & 1: Calmer neural ambient glow
      // PHASE 2+: Synapse pulse intensifies
      // PHASE 3 & 4: Energy stream surges from hand -> left
      const energyIntensity = Math.max(0.15, Math.min(1.0, (progress - 0.25) * 1.6));

      // 1. Draw Neural Synapse Network on the left
      ctx.lineWidth = 1;
      neuralNodes.forEach((node) => {
        // Floating motion
        node.x = node.baseX + Math.sin(time + node.baseY) * 6;
        node.y = node.baseY + Math.cos(time + node.baseX) * 6;

        node.connections.forEach((target) => {
          ctx.beginPath();
          ctx.moveTo(node.x, node.y);
          ctx.lineTo(target.x, target.y);
          const alpha = (0.15 + 0.35 * Math.sin(time * 2 + node.x)) * (0.4 + energyIntensity * 0.6);
          ctx.strokeStyle = node.color === '#00f2fe'
            ? `rgba(0, 242, 254, ${alpha})`
            : `rgba(157, 78, 221, ${alpha})`;
          ctx.stroke();
        });

        // Glowing node dot
        ctx.beginPath();
        const pulse = Math.sin(time * 3 + node.x) * 1.5;
        ctx.arc(node.x, node.y, Math.max(1.5, node.radius + pulse), 0, Math.PI * 2);
        ctx.fillStyle = node.color;
        ctx.shadowColor = node.color;
        ctx.shadowBlur = 12 * energyIntensity;
        ctx.fill();
        ctx.shadowBlur = 0;
      });

      // 2. Draw Energy Wave Arc from Hand toward the Left (Progress > 0.35)
      if (progress > 0.35) {
        const waveReach = Math.min(1.0, (progress - 0.35) / 0.5); // 0 to 1 reach
        const currentTargetX = originX - (originX - targetX) * waveReach;

        // Flowing bezier energy curves
        const streams = 5;
        for (let s = 0; s < streams; s++) {
          ctx.beginPath();
          ctx.moveTo(originX, originY);
          const cp1X = originX - (originX - currentTargetX) * 0.35;
          const cp1Y = originY + Math.sin(time * 3 + s) * 80;
          const cp2X = originX - (originX - currentTargetX) * 0.75;
          const cp2Y = targetY + Math.cos(time * 3 + s) * 70;

          ctx.bezierCurveTo(cp1X, cp1Y, cp2X, cp2Y, currentTargetX, targetY + (s - 2) * 15);
          ctx.lineWidth = (1.5 + Math.sin(time * 4 + s) * 1) * energyIntensity;
          ctx.strokeStyle = s % 2 === 0
            ? `rgba(0, 242, 254, ${0.4 * energyIntensity})`
            : `rgba(168, 85, 247, ${0.4 * energyIntensity})`;
          ctx.shadowColor = '#00f2fe';
          ctx.shadowBlur = 18;
          ctx.stroke();
          ctx.shadowBlur = 0;
        }

        // Flowing particles along the stream (Right to Left)
        particles.forEach((p) => {
          p.progress += p.speed * (0.8 + energyIntensity * 1.2);
          if (p.progress > 1) p.progress = 0;

          // Only render particles up to wave reach
          if (p.progress <= waveReach) {
            const t = p.progress;
            // Bezier interpolation
            const bx = (1 - t) * originX + t * targetX;
            const by = (1 - t) * originY + t * targetY + Math.sin(time * 4 + t * 10) * (30 + p.offsetY * 0.2);

            ctx.beginPath();
            ctx.arc(bx, by, p.size * (0.8 + energyIntensity * 0.5), 0, Math.PI * 2);
            ctx.fillStyle = p.color;
            ctx.shadowColor = p.color;
            ctx.shadowBlur = 15;
            ctx.fill();
            ctx.shadowBlur = 0;

            // Little digital sparks / square fragments
            if (Math.random() > 0.88) {
              ctx.fillStyle = '#ffffff';
              ctx.fillRect(bx + (Math.random() - 0.5) * 15, by + (Math.random() - 0.5) * 15, 2, 2);
            }
          }
        });
      }

      // 3. Hand Energy Core (Progress >= 0.4)
      if (progress > 0.4) {
        const handGlow = Math.min(1.0, (progress - 0.4) * 2.5);
        const radius = (18 + Math.sin(time * 6) * 6) * handGlow;

        // Outer corona
        const grad = ctx.createRadialGradient(originX, originY, 2, originX, originY, radius * 2.5);
        grad.addColorStop(0, 'rgba(255, 255, 255, 0.95)');
        grad.addColorStop(0.3, 'rgba(0, 242, 254, 0.8)');
        grad.addColorStop(0.7, 'rgba(157, 78, 221, 0.4)');
        grad.addColorStop(1, 'rgba(0, 0, 0, 0)');

        ctx.beginPath();
        ctx.arc(originX, originY, radius * 2.5, 0, Math.PI * 2);
        ctx.fillStyle = grad;
        ctx.fill();

        // High frequency lightning arcs around hand
        ctx.lineWidth = 1.5;
        for (let a = 0; a < 4; a++) {
          const angle = time * 4 + (a * Math.PI) / 2;
          const arcLength = radius * 1.6;
          ctx.beginPath();
          ctx.moveTo(originX, originY);
          const midX = originX + Math.cos(angle) * (arcLength * 0.5) + (Math.random() - 0.5) * 10;
          const midY = originY + Math.sin(angle) * (arcLength * 0.5) + (Math.random() - 0.5) * 10;
          const endX = originX + Math.cos(angle) * arcLength;
          const endY = originY + Math.sin(angle) * arcLength;
          ctx.lineTo(midX, midY);
          ctx.lineTo(endX, endY);
          ctx.strokeStyle = 'rgba(255, 255, 255, 0.85)';
          ctx.stroke();
        }
      }

      animationFrameId = requestAnimationFrame(render);
    };

    render();

    return () => {
      window.removeEventListener('resize', handleResize);
      cancelAnimationFrame(animationFrameId);
    };
  }, [scrollProgress, handPosition]);

  return (
    <canvas
      ref={canvasRef}
      style={{
        position: 'absolute',
        top: 0,
        left: 0,
        width: '100%',
        height: '100%',
        pointerEvents: 'none',
        zIndex: 5,
      }}
    />
  );
}
