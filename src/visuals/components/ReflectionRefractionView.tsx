import { useMemo, useState } from 'react';
import { AlertTriangle, Compass, Info, RotateCcw, Sliders } from 'lucide-react';

interface ReflectionRefractionViewProps {
  onSelectComponent: (id: string) => void;
  selectedComponentId?: string;
  highlightComponentId?: string;
}

const MEDIA = [
  { id: 'air', name: 'Air', n: 1.0, color: '#0f172a' },
  { id: 'water', name: 'Water', n: 1.33, color: '#0369a1' },
  { id: 'glass', name: 'Crown Glass', n: 1.52, color: '#0d9488' },
  { id: 'diamond', name: 'Diamond', n: 2.42, color: '#4338ca' }
];

export default function ReflectionRefractionView({
  onSelectComponent,
  selectedComponentId,
  highlightComponentId
}: ReflectionRefractionViewProps) {
  const [incidentAngleDeg, setIncidentAngleDeg] = useState(45); // Degrees (0 to 85)
  const [medium2Id, setMedium2Id] = useState('glass');
  const [denseToRare, setDenseToRare] = useState(false);

  const medium2 = MEDIA.find(m => m.id === medium2Id) || MEDIA[2];
  const n1 = denseToRare ? medium2.n : 1.0;
  const n2 = denseToRare ? 1.0 : medium2.n;

  // Calculations via Snell's Law: n1 * sin(theta1) = n2 * sin(theta2)
  const theta1Rad = (incidentAngleDeg * Math.PI) / 180;
  const sinTheta1 = Math.sin(theta1Rad);
  const sinTheta2 = (n1 * sinTheta1) / n2;

  // Critical angle for TIR when n1 > n2:
  const isTirPossible = n1 > n2;
  const criticalAngleDeg = isTirPossible ? Math.round((Math.asin(n2 / n1) * 180) / Math.PI) : null;
  const isTir = isTirPossible && sinTheta2 > 1.0;

  const theta2Deg = isTir ? null : Math.round((Math.asin(sinTheta2) * 180) / Math.PI);
  const theta2Rad = theta2Deg !== null ? (theta2Deg * Math.PI) / 180 : 0;

  // Coordinates on 640 x 480 canvas
  const originX = 320;
  const originY = 240;
  const rayLength = 200;

  // Incident ray comes from top-left (or bottom-left if denseToRare is visually inverted)
  // Normal line is x = originX
  // Angle theta1 is measured from the normal (vertical)
  const incX = originX - Math.sin(theta1Rad) * rayLength;
  const incY = originY - Math.cos(theta1Rad) * rayLength;

  // Reflected ray bounces into top-right with theta_reflected = theta1
  const refX = originX + Math.sin(theta1Rad) * rayLength;
  const refY = originY - Math.cos(theta1Rad) * rayLength;

  // Refracted ray continues into medium 2 (bottom-right)
  const refrX = originX + Math.sin(theta2Rad) * rayLength;
  const refrY = originY + Math.cos(theta2Rad) * rayLength;

  const activeTarget = highlightComponentId || selectedComponentId;

  return (
    <div className="visual-experience-canvas-wrap">
      <div className="canvas-toolbar">
        <div className="toolbar-left" style={{ flexWrap: 'wrap', gap: 14 }}>
          {/* Angle Slider */}
          <div className="input-control-group">
            <span className="field-label" style={{ margin: 0, display: 'flex', alignItems: 'center', gap: 4 }}>
              <Compass size={13} className="text-red" /> ANGLE OF INCIDENCE (θ₁): <b>{incidentAngleDeg}°</b>
            </span>
            <input
              type="range"
              min="0"
              max="85"
              value={incidentAngleDeg}
              onChange={e => setIncidentAngleDeg(Number(e.target.value))}
              className="range-input"
            />
          </div>

          {/* Medium 2 Picker */}
          <div className="input-control-group">
            <span className="field-label" style={{ margin: 0 }}>
              SECOND MEDIUM:
            </span>
            <select
              className="form-input"
              style={{ width: 'auto', padding: '6px 10px', fontSize: 11 }}
              value={medium2Id}
              onChange={e => setMedium2Id(e.target.value)}
            >
              {MEDIA.filter(m => m.id !== 'air').map(m => (
                <option key={m.id} value={m.id}>
                  {m.name} (n = {m.n})
                </option>
              ))}
            </select>
          </div>

          {/* Reverse Direction (Dense to Rare) */}
          <button
            className={`btn btn-sm ${denseToRare ? 'btn-primary' : 'btn-soft'}`}
            onClick={() => setDenseToRare(d => !d)}
            title="Toggle light going from dense medium into air to test Total Internal Reflection"
          >
            {denseToRare ? 'Medium: Dense ⟶ Rare' : 'Medium: Air ⟶ Dense'}
          </button>
        </div>

        <div className="toolbar-right">
          <div className="circuit-metrics-badge">
            <div>
              <span className="field-label" style={{ margin: 0 }}>INCIDENCE (θ₁)</span>
              <strong>{incidentAngleDeg}°</strong>
            </div>
            <div>
              <span className="field-label" style={{ margin: 0 }}>REFLECTION (θᵣ)</span>
              <strong>{incidentAngleDeg}°</strong>
            </div>
            <div>
              <span className="field-label" style={{ margin: 0 }}>REFRACTION (θ₂)</span>
              <strong>{isTir ? 'TIR (None)' : `${theta2Deg}°`}</strong>
            </div>
          </div>
        </div>
      </div>

      <div className="svg-stage-container">
        <svg
          viewBox="0 0 640 480"
          className="interactive-svg optics-svg"
          role="img"
          aria-label="Interactive Diagram of Light Reflection, Refraction and Snell's Law"
        >
          <defs>
            <linearGradient id="laserGlow" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#ef4444" />
              <stop offset="100%" stopColor="#dc2626" />
            </linearGradient>
            <filter id="laserBlur">
              <feGaussianBlur stdDeviation="3" result="blur" />
              <feComposite in="SourceGraphic" in2="blur" operator="over" />
            </filter>
          </defs>

          {/* TOP MEDIUM REGION */}
          <rect
            x="0"
            y="0"
            width="640"
            height={originY}
            fill={denseToRare ? '#0e231e' : '#0a1014'}
            rx="16"
          />
          <text x="25" y="40" fill="#94a3b8" fontSize="12" fontWeight="700">
            MEDIUM 1: {denseToRare ? `${medium2.name} (n = ${n1})` : `Air (n = ${n1})`}
          </text>

          {/* BOTTOM MEDIUM REGION */}
          <rect
            x="0"
            y={originY}
            width="640"
            height={480 - originY}
            fill={denseToRare ? '#0a1014' : '#102720'}
            opacity="0.9"
          />
          <text x="25" y={originY + 40} fill="#6ee7b7" fontSize="12" fontWeight="700">
            MEDIUM 2: {denseToRare ? `Air (n = ${n2})` : `${medium2.name} (n = ${n2})`}
          </text>

          {/* MEDIUM BOUNDARY INTERFACE (Horizontal line at y=240) */}
          <g
            className={`clickable-component ${activeTarget === 'interface' ? 'component-highlight' : ''}`}
            onClick={() => onSelectComponent('interface')}
            style={{ cursor: 'pointer' }}
          >
            <line x1="0" y1={originY} x2="640" y2={originY} stroke="#34d399" strokeWidth="2.5" />
            <text x="540" y={originY - 8} fill="#34d399" fontSize="9" fontWeight="800">
              BOUNDARY INTERFACE
            </text>
          </g>

          {/* NORMAL LINE (Vertical dashed perpendicular) */}
          <g
            className={`clickable-component ${activeTarget === 'normal' ? 'component-highlight' : ''}`}
            onClick={() => onSelectComponent('normal')}
            style={{ cursor: 'pointer' }}
          >
            <line
              x1={originX}
              y1="30"
              x2={originX}
              y2="450"
              stroke="#94a3b8"
              strokeWidth="2"
              strokeDasharray="6 4"
            />
            <text x={originX + 8} y="55" fill="#94a3b8" fontSize="10" fontWeight="700">
              NORMAL LINE (90°)
            </text>
          </g>

          {/* INCIDENT LIGHT RAY (Red) */}
          <g
            className={`clickable-component ${activeTarget === 'laser' ? 'component-highlight' : ''}`}
            onClick={() => onSelectComponent('laser')}
            style={{ cursor: 'pointer' }}
          >
            {/* Glow line */}
            <line x1={incX} y1={incY} x2={originX} y2={originY} stroke="#ef4444" strokeWidth="4" opacity="0.4" />
            {/* Crisp laser beam */}
            <line x1={incX} y1={incY} x2={originX} y2={originY} stroke="#ef4444" strokeWidth="2.5" />

            {/* Laser Emitter Torch */}
            <circle cx={incX} cy={incY} r="7" fill="#dc2626" stroke="#fff" strokeWidth="1.5" />
            <text x={incX - 10} y={incY - 12} fill="#fca5a5" fontSize="11" fontWeight="700" textAnchor="end">
              INCIDENT RAY (θ₁ = {incidentAngleDeg}°)
            </text>
          </g>

          {/* REFLECTED RAY (Orange) */}
          <g
            className={`clickable-component ${activeTarget === 'reflected-ray' ? 'component-highlight' : ''}`}
            onClick={() => onSelectComponent('reflected-ray')}
            style={{ cursor: 'pointer' }}
          >
            <line
              x1={originX}
              y1={originY}
              x2={refX}
              y2={refY}
              stroke="#f59e0b"
              strokeWidth={isTir ? 3.5 : 2}
            />
            <text x={refX + 10} y={refY - 12} fill="#fde047" fontSize="11" fontWeight="700">
              REFLECTED RAY (θᵣ = {incidentAngleDeg}°)
            </text>
          </g>

          {/* REFRACTED RAY (Cyan/Green) — only if not Total Internal Reflection */}
          {!isTir ? (
            <g
              className={`clickable-component ${activeTarget === 'refracted-ray' ? 'component-highlight' : ''}`}
              onClick={() => onSelectComponent('refracted-ray')}
              style={{ cursor: 'pointer' }}
            >
              <line
                x1={originX}
                y1={originY}
                x2={refrX}
                y2={refrY}
                stroke="#10b981"
                strokeWidth="2.5"
              />
              <text x={refrX + 12} y={refrY + 5} fill="#6ee7b7" fontSize="11" fontWeight="700">
                REFRACTED RAY (θ₂ = {theta2Deg}°)
              </text>
            </g>
          ) : (
            /* Total Internal Reflection Alert Banner on Canvas */
            <g transform="translate(180, 290)">
              <rect width="280" height="60" rx="10" fill="#451a03" stroke="#f59e0b" strokeWidth="2" />
              <text x="140" y="24" textAnchor="middle" fill="#fde047" fontSize="11" fontWeight="800">
                TOTAL INTERNAL REFLECTION (TIR)
              </text>
              <text x="140" y="44" textAnchor="middle" fill="#fef08a" fontSize="10">
                Angle {incidentAngleDeg}° exceeds critical angle {criticalAngleDeg}°!
              </text>
            </g>
          )}

          {/* POINT OF INCIDENCE GLOW */}
          <circle cx={originX} cy={originY} r="5" fill="#f59e0b" filter="url(#laserBlur)" />

          {/* ANGLE ARCS */}
          {/* Incident Angle Arc */}
          <path
            d={`M ${originX} ${originY - 45} A 45 45 0 0 0 ${originX - 45 * Math.sin(theta1Rad)} ${originY - 45 * Math.cos(theta1Rad)}`}
            fill="none"
            stroke="#ef4444"
            strokeWidth="1.5"
          />

          {/* Reflected Angle Arc */}
          <path
            d={`M ${originX} ${originY - 45} A 45 45 0 0 1 ${originX + 45 * Math.sin(theta1Rad)} ${originY - 45 * Math.cos(theta1Rad)}`}
            fill="none"
            stroke="#f59e0b"
            strokeWidth="1.5"
          />

          {/* Refracted Angle Arc */}
          {!isTir && theta2Deg !== null && (
            <path
              d={`M ${originX} ${originY + 45} A 45 45 0 0 0 ${originX + 45 * Math.sin(theta2Rad)} ${originY + 45 * Math.cos(theta2Rad)}`}
              fill="none"
              stroke="#10b981"
              strokeWidth="1.5"
            />
          )}
        </svg>
      </div>

      <div className="canvas-disclaimer">
        <Info size={13} />
        <span>
          Snell’s Law: n₁·sin(θ₁) = n₂·sin(θ₂). When light travels into an optically denser medium (higher n), it bends toward the normal line; when entering an optically rarer medium beyond the critical angle, all light undergoes Total Internal Reflection.
        </span>
      </div>
    </div>
  );
}
