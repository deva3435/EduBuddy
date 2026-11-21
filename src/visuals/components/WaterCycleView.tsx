import { useEffect, useState } from 'react';
import { CloudRain, Droplets, Info, Play, Pause, Sun, Wind } from 'lucide-react';

interface WaterCycleViewProps {
  onSelectComponent: (id: string) => void;
  selectedComponentId?: string;
  highlightComponentId?: string;
}

export default function WaterCycleView({
  onSelectComponent,
  selectedComponentId,
  highlightComponentId
}: WaterCycleViewProps) {
  const [playing, setPlaying] = useState(true);
  const [animTick, setAnimTick] = useState(0);

  useEffect(() => {
    if (!playing) return;
    let animId: number;
    let last = performance.now();
    const loop = (now: number) => {
      const dt = (now - last) / 1000;
      last = now;
      setAnimTick(t => (t + dt * 1.5) % 100);
      animId = requestAnimationFrame(loop);
    };
    animId = requestAnimationFrame(loop);
    return () => cancelAnimationFrame(animId);
  }, [playing]);

  const activeTarget = highlightComponentId || selectedComponentId;

  return (
    <div className="visual-experience-canvas-wrap">
      <div className="canvas-toolbar">
        <div className="toolbar-left" style={{ flexWrap: 'wrap', gap: 10 }}>
          <button
            className="btn btn-soft btn-sm"
            onClick={() => setPlaying(p => !p)}
            title={playing ? 'Pause cycle' : 'Play cycle'}
          >
            {playing ? <Pause size={14} /> : <Play size={14} />} {playing ? 'Pause Animation' : 'Play Animation'}
          </button>

          <div className="segmented segmented-sm">
            <button
              className={activeTarget === 'evaporation' ? 'chosen' : ''}
              onClick={() => onSelectComponent('evaporation')}
            >
              1. Evaporation
            </button>
            <button
              className={activeTarget === 'condensation' ? 'chosen' : ''}
              onClick={() => onSelectComponent('condensation')}
            >
              2. Condensation
            </button>
            <button
              className={activeTarget === 'precipitation' ? 'chosen' : ''}
              onClick={() => onSelectComponent('precipitation')}
            >
              3. Precipitation
            </button>
            <button
              className={activeTarget === 'collection' ? 'chosen' : ''}
              onClick={() => onSelectComponent('collection')}
            >
              4. Collection / Runoff
            </button>
          </div>
        </div>

        <div className="toolbar-right">
          <div className="circuit-metrics-badge">
            <div>
              <span className="field-label" style={{ margin: 0 }}>EARTH'S WATER</span>
              <strong>96.5% Ocean</strong>
            </div>
            <div>
              <span className="field-label" style={{ margin: 0 }}>FRESHWATER</span>
              <strong>2.5% Total</strong>
            </div>
          </div>
        </div>
      </div>

      <div className="svg-stage-container">
        <svg
          viewBox="0 0 700 500"
          className="interactive-svg water-cycle-svg"
          role="img"
          aria-label="Interactive Diagram of the Hydrological Water Cycle"
        >
          <defs>
            <linearGradient id="skyGradient" x1="0%" y1="0%" x2="0%" y2="100%">
              <stop offset="0%" stopColor="#0c1b24" />
              <stop offset="60%" stopColor="#1e3a47" />
              <stop offset="100%" stopColor="#2d525f" />
            </linearGradient>
            <linearGradient id="mountainGrad" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#475569" />
              <stop offset="60%" stopColor="#334155" />
              <stop offset="100%" stopColor="#1e293b" />
            </linearGradient>
            <linearGradient id="snowCap" x1="0%" y1="0%" x2="0%" y2="100%">
              <stop offset="0%" stopColor="#ffffff" />
              <stop offset="100%" stopColor="#e2e8f0" />
            </linearGradient>
            <linearGradient id="oceanGrad" x1="0%" y1="0%" x2="0%" y2="100%">
              <stop offset="0%" stopColor="#0284c7" />
              <stop offset="50%" stopColor="#0369a1" />
              <stop offset="100%" stopColor="#075985" />
            </linearGradient>
            <linearGradient id="valleyGrad" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#15803d" />
              <stop offset="100%" stopColor="#166534" />
            </linearGradient>
            <radialGradient id="sunGlowGrad" cx="50%" cy="50%" r="50%">
              <stop offset="0%" stopColor="#fef08a" />
              <stop offset="40%" stopColor="#f59e0b" />
              <stop offset="100%" stopColor="#d97706" stopOpacity="0" />
            </radialGradient>
          </defs>

          {/* Sky background */}
          <rect width="700" height="500" fill="url(#skyGradient)" rx="16" />

          {/* 1. SOLAR HEATING (Sun at top-right) */}
          <g
            className={`clickable-component ${activeTarget === 'sun-heat' ? 'component-highlight' : ''}`}
            onClick={() => onSelectComponent('sun-heat')}
            style={{ cursor: 'pointer' }}
          >
            <circle cx="590" cy="90" r="45" fill="url(#sunGlowGrad)" />
            <circle cx="590" cy="90" r="28" fill="#fbbf24" stroke="#f59e0b" strokeWidth="2" />
            <text x="590" y="94" fill="#78350f" fontSize="10" fontWeight="900" textAnchor="middle">
              SUN
            </text>
            <text x="590" y="150" fill="#fde047" fontSize="11" fontWeight="700" textAnchor="middle">
              Solar Heating
            </text>
          </g>

          {/* MOUNTAINS (Left & Center-Left) */}
          <polygon points="40,430 180,180 300,430" fill="url(#mountainGrad)" />
          {/* Snowcap on high mountain */}
          <polygon points="150,230 180,180 210,230 195,225 180,235 165,225" fill="url(#snowCap)" />

          {/* Secondary mountain */}
          <polygon points="220,430 320,240 430,430" fill="#334155" opacity="0.9" />
          <polygon points="300,275 320,240 345,275 335,270 320,280" fill="url(#snowCap)" />

          {/* GREEN VALLEY & FOREST (Center to Right) */}
          <path
            d="M 280 430 C 350 360, 480 370, 520 400 L 520 480 L 280 480 Z"
            fill="url(#valleyGrad)"
          />
          {/* Tree silhouettes */}
          <g fill="#14532d">
            <polygon points="340,390 350,370 360,390" />
            <polygon points="355,395 365,375 375,395" />
            <polygon points="380,400 390,380 400,400" />
          </g>

          {/* OCEAN & WATER BODY (Right Side) */}
          <g
            className={`clickable-component ${activeTarget === 'collection' ? 'component-highlight' : ''}`}
            onClick={() => onSelectComponent('collection')}
            style={{ cursor: 'pointer' }}
          >
            <path
              d="M 500 400 C 530 395, 600 395, 700 400 L 700 500 L 500 500 Z"
              fill="url(#oceanGrad)"
            />
            {/* Water surface ripples */}
            <line x1="530" y1="415" x2="680" y2="415" stroke="#38bdf8" strokeWidth="2" strokeDasharray="12 8" />
            <line x1="550" y1="435" x2="690" y2="435" stroke="#38bdf8" strokeWidth="2" strokeDasharray="10 6" />
            <text x="610" y="470" fill="#e0f2fe" fontSize="13" fontWeight="800" textAnchor="middle">
              OCEAN RESERVOIR
            </text>
          </g>

          {/* RIVER RUNOFF (Winding from mountain snowmelt down to the ocean) */}
          <path
            d="M 180 235 Q 240 320, 290 370 T 380 410 T 510 420"
            fill="none"
            stroke="#38bdf8"
            strokeWidth="5"
          />
          <text x="330" y="385" fill="#bae6fd" fontSize="10" fontWeight="700">
            Surface Runoff & River Flow ⟶
          </text>

          {/* 2. EVAPORATION & TRANSPIRATION (Rising vapor particles from ocean & forest) */}
          <g
            className={`clickable-component ${activeTarget === 'evaporation' ? 'component-highlight' : ''}`}
            onClick={() => onSelectComponent('evaporation')}
            style={{ cursor: 'pointer' }}
          >
            <text x="600" y="310" fill="#38bdf8" fontSize="12" fontWeight="800" textAnchor="middle">
              ▲ EVAPORATION
            </text>
            <text x="370" y="340" fill="#86efac" fontSize="10" fontWeight="700" textAnchor="middle">
              ▲ Transpiration
            </text>

            {/* Rising animated vapor trails */}
            {Array.from({ length: 6 }).map((_, i) => {
              const vy = 380 - ((animTick * 3 + i * 35) % 160);
              const vx = 560 + (i % 3) * 35;
              return (
                <circle
                  key={`vapor-${i}`}
                  cx={vx}
                  cy={vy}
                  r={4 + (i % 3)}
                  fill="#7dd3fc"
                  opacity={playing ? 0.8 - (380 - vy) / 200 : 0.6}
                />
              );
            })}
          </g>

          {/* 3. CONDENSATION & CLOUDS (Top Center) */}
          <g
            className={`clickable-component ${activeTarget === 'condensation' ? 'component-highlight' : ''}`}
            onClick={() => onSelectComponent('condensation')}
            style={{ cursor: 'pointer' }}
          >
            {/* Fluffy Cloud Formation */}
            <g transform="translate(140, 60)">
              <ellipse cx="140" cy="65" rx="50" ry="26" fill="#cbd5e1" opacity="0.9" />
              <ellipse cx="180" cy="55" rx="40" ry="30" fill="#e2e8f0" />
              <ellipse cx="220" cy="65" rx="45" ry="24" fill="#cbd5e1" opacity="0.9" />
              <ellipse cx="160" cy="45" rx="35" ry="28" fill="#ffffff" />
              <text x="180" y="65" fill="#1e293b" fontSize="11" fontWeight="800" textAnchor="middle">
                CONDENSATION
              </text>
            </g>

            {/* Darker Rain Cloud over Mountains */}
            <g transform="translate(10, 80)">
              <ellipse cx="110" cy="55" rx="45" ry="24" fill="#64748b" opacity="0.95" />
              <ellipse cx="150" cy="45" rx="40" ry="28" fill="#475569" />
              <ellipse cx="180" cy="55" rx="35" ry="22" fill="#64748b" />
            </g>
          </g>

          {/* 4. PRECIPITATION (Falling Raindrops over Mountains) */}
          <g
            className={`clickable-component ${activeTarget === 'precipitation' ? 'component-highlight' : ''}`}
            onClick={() => onSelectComponent('precipitation')}
            style={{ cursor: 'pointer' }}
          >
            <text x="130" y="160" fill="#93c5fd" fontSize="12" fontWeight="800">
              ▼ PRECIPITATION (RAIN / SNOW)
            </text>

            {/* Animated raindrops */}
            {Array.from({ length: 14 }).map((_, i) => {
              const ry = 160 + ((animTick * 4 + i * 25) % 180);
              const rx = 60 + i * 15;
              return (
                <line
                  key={`rain-${i}`}
                  x1={rx}
                  y1={ry}
                  x2={rx - 4}
                  y2={ry + 10}
                  stroke="#38bdf8"
                  strokeWidth="2.5"
                  strokeLinecap="round"
                  opacity={playing ? 0.85 : 0.6}
                />
              );
            })}
          </g>

          {/* Ground infiltration & water table */}
          <line x1="320" y1="460" x2="480" y2="475" stroke="#0284c7" strokeWidth="3" strokeDasharray="4 4" />
          <text x="400" y="490" fill="#7dd3fc" fontSize="9" fontWeight="600" textAnchor="middle">
            Groundwater Infiltration & Aquifer Flow
          </text>
        </svg>
      </div>

      <div className="canvas-disclaimer">
        <Info size={13} />
        <span>
          Perpetual Hydrological Cycle: Water moves continuously in a closed global loop. Heat from the sun drives evaporation; cooling vapor condenses into clouds; precipitation returns freshwater to mountain watersheds, lakes, and oceans.
        </span>
      </div>
    </div>
  );
}
