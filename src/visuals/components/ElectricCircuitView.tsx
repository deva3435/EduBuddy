import { useEffect, useState } from 'react';
import { AlertCircle, CheckCircle2, Info, Lightbulb, Power, Zap } from 'lucide-react';

interface ElectricCircuitViewProps {
  onSelectComponent: (id: string) => void;
  selectedComponentId?: string;
  highlightComponentId?: string;
}

export default function ElectricCircuitView({
  onSelectComponent,
  selectedComponentId,
  highlightComponentId
}: ElectricCircuitViewProps) {
  const [isOpen, setIsOpen] = useState(false); // false = closed circuit (ON), true = open circuit (OFF)
  const [voltage, setVoltage] = useState(6); // Volts
  const [resistance, setResistance] = useState(3); // Ohms
  const [electronOffset, setElectronOffset] = useState(0);

  // Ohm's law calculations
  const current = isOpen ? 0 : Number((voltage / resistance).toFixed(2)); // Amperes
  const power = isOpen ? 0 : Number((current * voltage).toFixed(2)); // Watts
  const brightness = isOpen ? 0 : Math.min(1, power / 30); // 0 to 1

  // Animate moving electrons when circuit is closed
  useEffect(() => {
    if (isOpen) return;
    let animId: number;
    let last = performance.now();
    const loop = (now: number) => {
      const delta = (now - last) / 1000;
      last = now;
      setElectronOffset(off => (off + delta * current * 30) % 80);
      animId = requestAnimationFrame(loop);
    };
    animId = requestAnimationFrame(loop);
    return () => cancelAnimationFrame(animId);
  }, [isOpen, current]);

  const activeTarget = highlightComponentId || selectedComponentId;

  return (
    <div className="visual-experience-canvas-wrap">
      <div className="canvas-toolbar">
        <div className="toolbar-left" style={{ flexWrap: 'wrap', gap: 14 }}>
          {/* Interactive Switch Button */}
          <button
            className={`btn ${!isOpen ? 'btn-primary' : 'btn-soft'}`}
            onClick={() => setIsOpen(v => !v)}
            title="Click to toggle knife switch open or closed"
          >
            <Power size={15} />
            {!isOpen ? 'Switch: CLOSED (ON)' : 'Switch: OPEN (OFF)'}
          </button>

          {/* Voltage slider */}
          <div className="input-control-group">
            <span className="field-label" style={{ margin: 0, display: 'flex', alignItems: 'center', gap: 4 }}>
              <Zap size={13} className="text-yellow" /> BATTERY: <b>{voltage}V</b>
            </span>
            <input
              type="range"
              min="1.5"
              max="12"
              step="0.5"
              value={voltage}
              onChange={e => setVoltage(Number(e.target.value))}
              className="range-input"
            />
          </div>

          {/* Resistance slider */}
          <div className="input-control-group">
            <span className="field-label" style={{ margin: 0 }}>
              LOAD RESISTANCE: <b>{resistance}Ω</b>
            </span>
            <input
              type="range"
              min="1"
              max="15"
              step="1"
              value={resistance}
              onChange={e => setResistance(Number(e.target.value))}
              className="range-input"
            />
          </div>
        </div>

        <div className="toolbar-right">
          <div className="circuit-metrics-badge">
            <div>
              <span className="field-label" style={{ margin: 0 }}>CURRENT (I = V/R)</span>
              <strong>{current} A</strong>
            </div>
            <div>
              <span className="field-label" style={{ margin: 0 }}>POWER (P = V×I)</span>
              <strong>{power} W</strong>
            </div>
          </div>
        </div>
      </div>

      <div className="svg-stage-container">
        <svg
          viewBox="0 0 680 480"
          className="interactive-svg circuit-svg"
          role="img"
          aria-label="Interactive Electric Circuit Simulation with Battery, Switch, Resistor, and Bulb"
        >
          <defs>
            <linearGradient id="bulbGlowGrad" cx="50%" cy="50%" r="50%">
              <stop offset="0%" stopColor="#fef08a" stopOpacity={brightness * 0.9} />
              <stop offset="40%" stopColor="#facc15" stopOpacity={brightness * 0.6} />
              <stop offset="80%" stopColor="#eab308" stopOpacity={brightness * 0.2} />
              <stop offset="100%" stopColor="#ca8a04" stopOpacity="0" />
            </linearGradient>
            <linearGradient id="batteryGrad" x1="0%" y1="0%" x2="0%" y2="100%">
              <stop offset="0%" stopColor="#334155" />
              <stop offset="100%" stopColor="#1e293b" />
            </linearGradient>
            <filter id="bulbBloom">
              <feGaussianBlur stdDeviation="6" result="blur" />
              <feComposite in="SourceGraphic" in2="blur" operator="over" />
            </filter>
          </defs>

          {/* Canvas Background */}
          <rect width="680" height="480" fill="#0c1713" rx="16" />

          {/* Circuit Loop Status Banner */}
          <g transform="translate(30, 20)">
            <rect
              width="620"
              height="36"
              rx="8"
              fill={!isOpen ? '#133527' : '#33241b'}
              stroke={!isOpen ? '#10b981' : '#f59e0b'}
            />
            {!isOpen ? (
              <g transform="translate(18, 11)">
                <circle cx="8" cy="8" r="6" fill="#10b981" />
                <text x="24" y="12" fill="#d1fae5" fontSize="12" fontWeight="700">
                  CIRCUIT COMPLETE (CLOSED LOOP) — Electric charges circulate continuously through the conductor.
                </text>
              </g>
            ) : (
              <g transform="translate(18, 11)">
                <circle cx="8" cy="8" r="6" fill="#f59e0b" />
                <text x="24" y="12" fill="#fef3c7" fontSize="12" fontWeight="700">
                  CIRCUIT INCOMPLETE (OPEN LOOP) — Air gap breaks the path; resistance is infinite and current stops.
                </text>
              </g>
            )}
          </g>

          {/* COPPER WIRE PATH (Rectangle perimeter with rounded corners) */}
          {/* Top Wire: from Battery (+) to Switch */}
          <path
            d="M 120 170 L 120 120 Q 120 110, 130 110 L 260 110"
            stroke="#10b981"
            strokeWidth="5"
            fill="none"
          />
          {/* Wire between Switch and Bulb */}
          <path
            d="M 360 110 L 530 110 Q 540 110, 540 120 L 540 210"
            stroke="#10b981"
            strokeWidth="5"
            fill="none"
          />
          {/* Bottom Wire: from Bulb to Battery (-) */}
          <path
            d="M 540 290 L 540 370 Q 540 380, 530 380 L 130 380 Q 120 380, 120 370 L 120 270"
            stroke="#10b981"
            strokeWidth="5"
            fill="none"
          />

          {/* ANIMATED DRIFTING ELECTRONS (Only when closed) */}
          {!isOpen && (
            <g
              stroke="#38bdf8"
              strokeWidth="4"
              strokeDasharray="4 36"
              strokeDashoffset={-electronOffset}
              fill="none"
            >
              {/* Full loop dashed overlay representing electron drift */}
              <rect x="120" y="110" width="420" height="270" rx="10" />
            </g>
          )}

          {/* BATTERY COMPONENT (Left Side) */}
          <g
            className={`clickable-component ${activeTarget === 'battery' ? 'component-highlight' : ''}`}
            onClick={() => onSelectComponent('battery')}
            style={{ cursor: 'pointer' }}
          >
            {/* Battery Body */}
            <rect x="95" y="170" width="50" height="100" rx="8" fill="url(#batteryGrad)" stroke="#64748b" strokeWidth="2" />

            {/* Positive Terminal (+) Top */}
            <rect x="110" y="158" width="20" height="12" rx="3" fill="#f59e0b" stroke="#d97706" />
            <text x="120" y="195" fill="#ef4444" fontSize="16" fontWeight="900" textAnchor="middle">+</text>

            {/* Negative Terminal (-) Bottom */}
            <text x="120" y="255" fill="#38bdf8" fontSize="20" fontWeight="900" textAnchor="middle">-</text>

            <text x="120" y="222" fill="#fff" fontSize="10" fontWeight="800" textAnchor="middle">
              {voltage}V
            </text>

            <text x="50" y="225" fill="#f59e0b" fontSize="11" fontWeight="700">
              DC BATTERY
            </text>
          </g>

          {/* INTERACTIVE KNIFE SWITCH (Top Center) */}
          <g
            className={`clickable-component ${activeTarget === 'switch' ? 'component-highlight' : ''}`}
            onClick={() => { setIsOpen(v => !v); onSelectComponent('switch'); }}
            style={{ cursor: 'pointer' }}
          >
            {/* Switch Contacts */}
            <circle cx="260" cy="110" r="8" fill="#d97706" stroke="#fbbf24" strokeWidth="2" />
            <circle cx="360" cy="110" r="8" fill="#d97706" stroke="#fbbf24" strokeWidth="2" />

            {/* Switch Lever Arm: Closes when isOpen is false */}
            <line
              x1="260"
              y1="110"
              x2={isOpen ? '340' : '360'}
              y2={isOpen ? '70' : '110'}
              stroke={isOpen ? '#ef4444' : '#10b981'}
              strokeWidth="6"
              strokeLinecap="round"
            />

            {/* Insulated handle on switch arm */}
            <circle
              cx={isOpen ? 340 : 360}
              cy={isOpen ? 70 : 110}
              r="7"
              fill={isOpen ? '#ef4444' : '#10b981'}
            />

            <text x="310" y="55" fill={isOpen ? '#fca5a5' : '#86efac'} fontSize="11" fontWeight="800" textAnchor="middle">
              {isOpen ? 'SWITCH OPEN (CLICK TO CLOSE)' : 'SWITCH CLOSED (CLICK TO OPEN)'}
            </text>
          </g>

          {/* LIGHT BULB COMPONENT (Right Side) */}
          <g
            className={`clickable-component ${activeTarget === 'bulb' ? 'component-highlight' : ''}`}
            onClick={() => onSelectComponent('bulb')}
            style={{ cursor: 'pointer' }}
          >
            {/* Glowing Halo when Lit */}
            {!isOpen && (
              <circle
                cx="540"
                cy="250"
                r={60 + brightness * 35}
                fill="url(#bulbGlowGrad)"
                filter="url(#bulbBloom)"
              />
            )}

            {/* Glass Globe */}
            <circle
              cx="540"
              cy="250"
              r="34"
              fill={!isOpen ? '#fef08a' : '#1e293b'}
              fillOpacity={!isOpen ? 0.7 + brightness * 0.3 : 0.3}
              stroke="#fbbf24"
              strokeWidth="2.5"
            />

            {/* Bulb Filament */}
            <path
              d="M 530 262 L 535 240 L 540 245 L 545 240 L 550 262"
              stroke={!isOpen ? '#ffffff' : '#64748b'}
              strokeWidth="2"
              fill="none"
            />

            {/* Metallic Base */}
            <rect x="528" y="278" width="24" height="14" rx="2" fill="#94a3b8" stroke="#475569" />
            <rect x="532" y="292" width="16" height="5" rx="1" fill="#475569" />

            <text x="600" y="250" fill={!isOpen ? '#fde047' : '#94a3b8'} fontSize="11" fontWeight="700">
              LIGHT BULB
            </text>
            <text x="600" y="266" fill="#94a3b8" fontSize="9">
              {!isOpen ? `${power} W Light & Heat` : 'No Current Flow'}
            </text>
          </g>

          {/* CURRENT & ELECTRON DIRECTION LABELS */}
          <g transform="translate(250, 410)">
            <rect width="200" height="26" rx="6" fill="#1b2823" stroke="#284237" />
            <text x="100" y="17" fill="#6ee7b7" fontSize="10" fontWeight="700" textAnchor="middle">
              Conventional Current Flow: (+) ⟶ (-)
            </text>
          </g>
        </svg>
      </div>

      <div className="canvas-disclaimer">
        <Info size={13} />
        <span>
          Ohm’s Law in Action: Increasing voltage pushes more current through the wire (I = V/R), causing the tungsten filament to dissipate more electrical power as visible light and thermal radiation.
        </span>
      </div>
    </div>
  );
}
