import { useEffect, useState } from 'react';
import { AlertCircle, Atom, Info, Play, Pause, Sparkles } from 'lucide-react';

interface AtomicStructureViewProps {
  onSelectComponent: (id: string) => void;
  selectedComponentId?: string;
  highlightComponentId?: string;
}

interface ElementDef {
  symbol: string;
  name: string;
  atomicNumber: number; // Z = protons = electrons
  massNumber: number; // A = protons + neutrons
  shells: [number, number, number]; // [K, L, M] electrons
  category: string;
}

const ELEMENTS: ElementDef[] = [
  { symbol: 'H', name: 'Hydrogen', atomicNumber: 1, massNumber: 1, shells: [1, 0, 0], category: 'Non-metal' },
  { symbol: 'He', name: 'Helium', atomicNumber: 2, massNumber: 4, shells: [2, 0, 0], category: 'Noble Gas' },
  { symbol: 'C', name: 'Carbon', atomicNumber: 6, massNumber: 12, shells: [2, 4, 0], category: 'Non-metal' },
  { symbol: 'N', name: 'Nitrogen', atomicNumber: 7, massNumber: 14, shells: [2, 5, 0], category: 'Non-metal' },
  { symbol: 'O', name: 'Oxygen', atomicNumber: 8, massNumber: 16, shells: [2, 6, 0], category: 'Non-metal' },
  { symbol: 'Ne', name: 'Neon', atomicNumber: 10, massNumber: 20, shells: [2, 8, 0], category: 'Noble Gas' },
  { symbol: 'Na', name: 'Sodium', atomicNumber: 11, massNumber: 23, shells: [2, 8, 1], category: 'Alkali Metal' },
  { symbol: 'Mg', name: 'Magnesium', atomicNumber: 12, massNumber: 24, shells: [2, 8, 2], category: 'Alkaline Earth' },
  { symbol: 'Cl', name: 'Chlorine', atomicNumber: 17, massNumber: 35, shells: [2, 8, 7], category: 'Halogen' }
];

export default function AtomicStructureView({
  onSelectComponent,
  selectedComponentId,
  highlightComponentId
}: AtomicStructureViewProps) {
  const [currentSymbol, setCurrentSymbol] = useState('C');
  const [playing, setPlaying] = useState(true);
  const [angleOffset, setAngleOffset] = useState(0);

  const el = ELEMENTS.find(e => e.symbol === currentSymbol) || ELEMENTS[2];
  const protons = el.atomicNumber;
  const neutrons = el.massNumber - el.atomicNumber;
  const electrons = el.atomicNumber;
  const valenceElectrons = el.shells[2] > 0 ? el.shells[2] : el.shells[1] > 0 ? el.shells[1] : el.shells[0];

  // Shell radius constants
  const SHELL_RADII = [70, 130, 190]; // K, L, M

  useEffect(() => {
    if (!playing) return;
    let animId: number;
    let last = performance.now();
    const loop = (now: number) => {
      const dt = (now - last) / 1000;
      last = now;
      setAngleOffset(a => a + dt * 0.9);
      animId = requestAnimationFrame(loop);
    };
    animId = requestAnimationFrame(loop);
    return () => cancelAnimationFrame(animId);
  }, [playing]);

  const centerX = 320;
  const centerY = 240;
  const activeTarget = highlightComponentId || selectedComponentId;

  return (
    <div className="visual-experience-canvas-wrap">
      <div className="canvas-toolbar">
        <div className="toolbar-left" style={{ flexWrap: 'wrap', gap: 10 }}>
          <span className="field-label" style={{ margin: 0, display: 'flex', alignItems: 'center', gap: 4 }}>
            <Atom size={14} className="text-blue" /> ELEMENT:
          </span>
          <div className="element-chips-row">
            {ELEMENTS.map(item => (
              <button
                key={item.symbol}
                className={`element-chip ${currentSymbol === item.symbol ? 'selected' : ''}`}
                onClick={() => setCurrentSymbol(item.symbol)}
              >
                <b>{item.symbol}</b>
                <small>{item.atomicNumber}</small>
              </button>
            ))}
          </div>
        </div>

        <div className="toolbar-right">
          <div className="circuit-metrics-badge">
            <div>
              <span className="field-label" style={{ margin: 0 }}>ATOMIC # (Z)</span>
              <strong>{protons}</strong>
            </div>
            <div>
              <span className="field-label" style={{ margin: 0 }}>MASS # (A)</span>
              <strong>{el.massNumber}</strong>
            </div>
            <div>
              <span className="field-label" style={{ margin: 0 }}>CONFIG</span>
              <strong>{el.shells.filter(n => n > 0).join(', ')}</strong>
            </div>
          </div>
        </div>
      </div>

      <div className="svg-stage-container">
        <svg
          viewBox="0 0 640 480"
          className="interactive-svg atom-svg"
          role="img"
          aria-label={`Interactive Bohr Model of ${el.name} Atom`}
        >
          <defs>
            <radialGradient id="nucleusGrad" cx="50%" cy="50%" r="50%">
              <stop offset="0%" stopColor="#f87171" />
              <stop offset="60%" stopColor="#dc2626" />
              <stop offset="100%" stopColor="#991b1b" />
            </radialGradient>
            <radialGradient id="electronGlow" cx="50%" cy="50%" r="50%">
              <stop offset="0%" stopColor="#93c5fd" />
              <stop offset="70%" stopColor="#3b82f6" />
              <stop offset="100%" stopColor="#1d4ed8" />
            </radialGradient>
          </defs>

          {/* Canvas Background */}
          <rect width="640" height="480" fill="#080e14" rx="16" />

          {/* Subatomic Particle Legend (Top Left) */}
          <g transform="translate(25, 25)">
            <circle cx="8" cy="8" r="6" fill="#ef4444" />
            <text x="20" y="12" fill="#fca5a5" fontSize="10" fontWeight="700">
              Protons (p⁺): {protons}
            </text>

            <circle cx="120" cy="8" r="6" fill="#64748b" />
            <text x="132" y="12" fill="#cbd5e1" fontSize="10" fontWeight="700">
              Neutrons (n⁰): {neutrons}
            </text>

            <circle cx="230" cy="8" r="6" fill="#3b82f6" />
            <text x="242" y="12" fill="#93c5fd" fontSize="10" fontWeight="700">
              Electrons (e⁻): {electrons}
            </text>
          </g>

          {/* CONCENTRIC ELECTRON SHELLS (K, L, M) */}
          {SHELL_RADII.map((radius, idx) => {
            const shellCount = el.shells[idx];
            if (shellCount === 0) return null;
            const shellName = ['K (n=1)', 'L (n=2)', 'M (n=3)'][idx];
            const isShellHighlight = activeTarget === 'shells';

            return (
              <g
                key={`shell-${idx}`}
                className={`clickable-component ${isShellHighlight ? 'component-highlight' : ''}`}
                onClick={() => onSelectComponent('shells')}
                style={{ cursor: 'pointer' }}
              >
                {/* Orbit track */}
                <circle
                  cx={centerX}
                  cy={centerY}
                  r={radius}
                  fill="none"
                  stroke={isShellHighlight ? '#a855f7' : '#1e3845'}
                  strokeWidth={isShellHighlight ? 2 : 1}
                  strokeDasharray="4 3"
                />
                <text
                  x={centerX}
                  y={centerY - radius - 5}
                  textAnchor="middle"
                  fill="#64748b"
                  fontSize="9"
                  fontWeight="600"
                >
                  Shell {shellName} · {shellCount} e⁻
                </text>
              </g>
            );
          })}

          {/* CENTRAL NUCLEUS */}
          <g
            className={`clickable-component ${activeTarget === 'nucleus' || activeTarget === 'protons' || activeTarget === 'neutrons' ? 'component-highlight' : ''}`}
            onClick={() => onSelectComponent('nucleus')}
            style={{ cursor: 'pointer' }}
          >
            {/* Nucleus Glow & Clustered Particles */}
            <circle cx={centerX} cy={centerY} r="32" fill="url(#nucleusGrad)" stroke="#fca5a5" strokeWidth="2" />
            <text x={centerX} y={centerY - 6} fill="#fff" fontSize="13" fontWeight="900" textAnchor="middle">
              {el.symbol}
            </text>
            <text x={centerX} y={centerY + 10} fill="#fecaca" fontSize="9" fontWeight="700" textAnchor="middle">
              {protons}p⁺, {neutrons}n⁰
            </text>
          </g>

          {/* ELECTRONS DISTRIBUTED IN SHELLS */}
          {el.shells.map((count, shellIdx) => {
            if (count === 0) return null;
            const radius = SHELL_RADII[shellIdx];
            // Shell rotation speed decreases with distance
            const shellSpeed = (3 - shellIdx) * 0.7;

            return Array.from({ length: count }, (_, i) => {
              const baseAngle = (i * 2 * Math.PI) / count;
              const angle = baseAngle + angleOffset * shellSpeed;
              const ex = centerX + Math.cos(angle) * radius;
              const ey = centerY + Math.sin(angle) * radius;
              const isElectronHighlight = activeTarget === 'electrons';

              return (
                <g
                  key={`e-${shellIdx}-${i}`}
                  className={`clickable-component ${isElectronHighlight ? 'component-highlight' : ''}`}
                  onClick={() => onSelectComponent('electrons')}
                  style={{ cursor: 'pointer' }}
                >
                  <circle cx={ex} cy={ey} r="8" fill="url(#electronGlow)" stroke="#fff" strokeWidth="1.5" />
                  <text x={ex} y={ey + 3} textAnchor="middle" fill="#fff" fontSize="9" fontWeight="900">
                    -
                  </text>
                </g>
              );
            });
          })}
        </svg>
      </div>

      <div className="canvas-disclaimer">
        <Info size={13} />
        <span>
          Simplified Educational Model: Bohr’s concentric circular orbits illustrate energy levels (K, L, M) and electron counts. In modern quantum mechanics, electrons exist in 3D wave-particle orbital probability clouds (s, p, d, f) rather than fixed tracks.
        </span>
      </div>
    </div>
  );
}
