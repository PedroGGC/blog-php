import { useEffect, useRef } from 'react';

const Particles = ({
  particleCount = 200,
  particleSpread = 10,
  speed = 0.1,
  particleColors = ['#ffffff'],
  moveParticlesOnHover = false,
  particleHoverFactor = 1,
  alphaParticles = false,
  particleBaseSize = 100,
  sizeRandomness = 1,
  cameraDistance = 20,
  disableRotation = false,
  className = ""
}) => {
  const canvasRef = useRef(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    let animationFrameId;

    let particles = [];
    const colorOptions = particleColors.map(color => color);

    const resize = () => {
      canvas.width = canvas.offsetWidth;
      canvas.height = canvas.offsetHeight;
      initParticles();
    };

    class Particle {
      constructor() {
        this.reset();
      }

      reset() {
        this.x = (Math.random() - 0.5) * canvas.width * (particleSpread / 10);
        this.y = (Math.random() - 0.5) * canvas.height * (particleSpread / 10);
        this.z = Math.random() * cameraDistance;
        this.size = (Math.random() * sizeRandomness + 0.5) * (particleBaseSize / 10);
        this.color = colorOptions[Math.floor(Math.random() * colorOptions.length)];
        this.vx = (Math.random() - 0.5) * speed;
        this.vy = (Math.random() - 0.5) * speed;
        this.vz = (Math.random() - 0.5) * speed;
        this.alpha = alphaParticles ? Math.random() : 1;
      }

      update() {
        this.x += this.vx;
        this.y += this.vy;
        this.z += this.vz;

        if (!disableRotation) {
          const cos = Math.cos(0.001 * speed);
          const sin = Math.sin(0.001 * speed);
          const x = this.x * cos - this.z * sin;
          const z = this.z * cos + this.x * sin;
          this.x = x;
          this.z = z;
        }

        if (Math.abs(this.x) > canvas.width || Math.abs(this.y) > canvas.height || this.z < 0 || this.z > cameraDistance * 2) {
          this.reset();
        }
      }

      draw() {
        const perspective = cameraDistance / (cameraDistance + this.z);
        const x = this.x * perspective + canvas.width / 2;
        const y = this.y * perspective + canvas.height / 2;
        const size = this.size * perspective;

        ctx.beginPath();
        ctx.arc(x, y, size, 0, Math.PI * 2);
        ctx.fillStyle = this.color;
        ctx.globalAlpha = this.alpha;
        ctx.fill();
      }
    }

    const initParticles = () => {
      particles = [];
      for (let i = 0; i < particleCount; i++) {
        particles.push(new Particle());
      }
    };

    const animate = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      particles.forEach(p => {
        p.update();
        p.draw();
      });
      animationFrameId = requestAnimationFrame(animate);
    };

    window.addEventListener('resize', resize);
    resize();
    animate();

    return () => {
      window.removeEventListener('resize', resize);
      cancelAnimationFrame(animationFrameId);
    };
  }, [particleCount, particleSpread, speed, particleColors, alphaParticles, particleBaseSize, sizeRandomness, cameraDistance, disableRotation]);

  return (
    <canvas
      ref={canvasRef}
      className={className}
      style={{ width: '100%', height: '100%', display: 'block' }}
    />
  );
};

export default Particles;
