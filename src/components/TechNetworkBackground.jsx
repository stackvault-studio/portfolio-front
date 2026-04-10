import React from 'react';
import Particles from 'react-tsparticles';
import { loadFull } from 'tsparticles';

// Example technology and methodology labels
const techLabels = [
  'React', 'Jenkins', 'AWS', 'Kafka', 'Kubernetes', 'Camunda',
  'SOLID', 'TDD', 'BDD', 'DDD', 'Agile', 'DevOps', 'CI/CD', 'Clean Code', 'Microservices'
];

export default function TechNetworkBackground() {
  const particlesInit = async (main) => {
    await loadFull(main);
  };

  // Render floating labels for each technology/methodology
  const labelNodes = techLabels.map((label, idx) => {
    // Random positions and animation delays for demo
    const top = Math.random() * 80 + 10; // 10% to 90%
    const left = Math.random() * 80 + 10;
    const delay = Math.random() * 2;
    return (
      <span
        key={label}
        style={{
          position: 'absolute',
          top: `${top}%`,
          left: `${left}%`,
          transform: 'translate(-50%, -50%)',
          fontWeight: 'bold',
          color: '#fff',
          background: 'rgba(0,0,0,0.5)',
          borderRadius: '8px',
          padding: '4px 10px',
          fontSize: '0.95rem',
          pointerEvents: 'none',
          animation: `floatLabel 4s ease-in-out ${delay}s infinite alternate`,
          zIndex: 1
        }}
      >
        {label}
      </span>
    );
  });

  return (
    <div style={{position: 'absolute', inset: 0, zIndex: 0, pointerEvents: 'none'}}>
      <Particles
        id="tech-network-bg"
        init={particlesInit}
        options={{
          background: { color: { value: 'transparent' } },
          fpsLimit: 60,
          particles: {
            number: { value: 40, density: { enable: true, area: 800 } },
            color: { value: ['#6DB33F', '#D24939', '#FF9900', '#326CE5', '#F80000', '#47A248', '#0078D4', '#FF9800', '#231F20', '#888'] },
            shape: {
              type: 'circle',
            },
            opacity: { value: 0.8 },
            size: { value: 18, random: true },
            move: {
              enable: true,
              speed: 2.5,
              direction: 'none',
              outModes: { default: 'bounce' },
            },
            links: {
              enable: true,
              color: '#aaa',
              distance: 120,
              opacity: 0.4,
              width: 1,
            },
          },
          detectRetina: true,
        }}
      />
      {labelNodes}
      <style>{`
        @keyframes floatLabel {
          0% { transform: translate(-50%, -50%) scale(1); }
          100% { transform: translate(-50%, -60%) scale(1.08); }
        }
      `}</style>
    </div>
  );
}
