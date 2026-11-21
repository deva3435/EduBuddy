import { useMemo, useState } from 'react';
import { Droplet, Info, Leaf, Sparkles, Sun, Wind } from 'lucide-react';

interface PhotosynthesisViewProps {
  onSelectComponent: (id: string) => void;
  selectedComponentId?: string;
  highlightComponentId?: string;
}

export default function PhotosynthesisView({
  onSelectComponent,
  selectedComponentId,
  highlightComponentId
}: PhotosynthesisViewProps) {
  const [sunlight, setSunlight] = useState(80);
  const [water, setWater] = useState(75);
  const [co2, setCo2] = useState(70);

  // Rate governed by Blackman's Law of Limiting Factors:
  const rate = useMemo(() => {
    return Math.round(Math.min(sunlight, water, co2));
  }, [sunlight, water, co2]);

  const activeTarget = highlightComponentId || selectedComponentId;

  return (
    <div className="visual-experience-canvas-wrap">
      <div className="canvas-toolbar">
        <div className="toolbar-left" style={{ flexWrap: 'wrap', gap: 14 }}>
          <div className="input-control-group">
            <span className="field-label" style={{ margin: 0, display: 'flex', alignItems: 'center', gap: 4 }}>
              <Sun size={13} className="text-yellow" /> SUNLIGHT: <b>{sunlight}%</b>
            </span>
            <input
              type="range"
              min="0"
              max="100"
              value={sunlight}
              onChange={e => setSunlight(Number(e.target.value))}
              className="range-input"
            />
          </div>

          <div className="input-control-group">
            <span className="field-label" style={{ margin: 0, display: 'flex', alignItems: 'center', gap: 4 }}>
              <Droplet size={13} className="text-blue" /> WATER (H₂O): <b>{water}%</b>
            </span>
            <input
              type="range"
              min="0"
              max="100"
              value={water}
              onChange={e => setWater(Number(e.target.value))}
              className="range-input"
            />
          </div>

          <div className="input-control-group">
            <span className="field-label" style={{ margin: 0, display: 'flex', alignItems: 'center', gap: 4 }}>
              <Wind size={13} className="text-gray" /> CO₂ LEVEL: <b>{co2}%</b>
            </span>
            <input
              type="range"
              min="0"
              max="100"
              value={co2}
              onChange={e => setCo2(Number(e.target.value))}
              className="range-input"
            />
          </div>
        </div>

        <div className="toolbar-right">
          <div className="rate-meter-card">
            <span className="field-label" style={{ margin: 0 }}>PHOTOSYNTHESIS RATE</span>
            <div className="rate-bar-track">
              <span
                className="rate-bar-fill"
                style={{
                  width: `${rate}%`,
                  background: rate > 65 ? '#10b981' : rate > 30 ? '#f59e0b' : '#ef4444'
                }}
              />
            </div>
            <strong>{rate}% efficiency</strong>
          </div>
        </div>
      </div>

      <div className="svg-stage-container">
        <svg
          viewBox="0 0 700 500"
          className="interactive-svg photosynthesis-svg"
          role="img"
          aria-label="Interactive Diagram of Plant Photosynthesis and Chloroplast Reactions"
        >
          <defs>
            <linearGradient id="skyGrad" x1="0%" y1="0%" x2="0%" y2="100%">
              <stop offset="0%" stopColor="#0c1f19" />
              <stop offset="100%" stopColor="#132a22" />
            </linearGradient>
            <linearGradient id="leafGrad" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#15803d" />
              <stop offset="60%" stopColor="#16a34a" />
              <stop offset="100%" stopColor="#14532d" />
            </linearGradient>
            <radialGradient id="chloroplastGrad" cx="50%" cy="50%" r="50%">
              <stop offset="0%" stopColor="#4ade80" />
              <stop offset="70%" stopColor="#22c55e" />
              <stop offset="100%" stopColor="#15803d" />
            </radialGradient>
            <linearGradient id="sunBeam" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#fef08a" stopOpacity="0.8" />
              <stop offset="100%" stopColor="#f59e0b" stopOpacity="0.1" />
            </linearGradient>
          </defs>

          {/* Background */}
          <rect width="700" height="500" fill="url(#skyGrad)" rx="16" />

          {/* Chemical equation banner */}
          <g transform="translate(35, 20)">
            <rect width="630" height="34" rx="8" fill="#1b362c" stroke="#2a5243" />
            <text x="315" y="22" textAnchor="middle" fill="#e6f5ef" fontSize="12" fontWeight="700">
              6CO₂ + 6H₂O + Solar Photons ⟶ C₆H₁₂O₆ (Glucose) + 6O₂ (Oxygen)
            </text>
          </g>

          {/* SUNLIGHT (Top-Left) */}
          <g
            className={`clickable-component ${activeTarget === 'sunlight' ? 'component-highlight' : ''}`}
            onClick={() => onSelectComponent('sunlight')}
            style={{ cursor: 'pointer' }}
          >
            {/* Glowing Sun */}
            <circle cx="90" cy="110" r="38" fill="#fef08a" opacity={sunlight / 100 * 0.4 + 0.3} />
            <circle cx="90" cy="110" r="26" fill="#f59e0b" />
            <text x="90" y="114" fill="#78350f" fontSize="10" fontWeight="800" textAnchor="middle">
              SUN
            </text>

            {/* Sun Rays beaming to Leaf */}
            {sunlight > 10 && (
              <polygon
                points="115,120 125,100 320,240 280,270"
                fill="url(#sunBeam)"
                opacity={sunlight / 100}
              />
            )}
            <text x="170" y="170" fill="#fde047" fontSize="11" fontWeight="700">
              Solar Energy ({sunlight}%)
            </text>
          </g>

          {/* MAIN LEAF CROSS SECTION (Center) */}
          <g
            className={`clickable-component ${activeTarget === 'chloroplast' ? 'component-highlight' : ''}`}
            onClick={() => onSelectComponent('chloroplast')}
            style={{ cursor: 'pointer' }}
          >
            {/* Leaf Body */}
            <path
              d="M 210 280 C 220 180, 480 180, 560 260 C 580 340, 420 400, 260 380 C 210 370, 200 330, 210 280 Z"
              fill="url(#leafGrad)"
              stroke={activeTarget === 'chloroplast' ? '#fff' : '#22c55e'}
              strokeWidth={activeTarget === 'chloroplast' ? 3 : 1.5}
            />

            {/* Leaf Veins */}
            <path
              d="M 210 280 C 320 280, 450 270, 560 260"
              stroke="#86efac"
              strokeWidth="3"
              fill="none"
              opacity="0.8"
            />
            <path d="M 300 280 C 330 240, 380 230, 420 230" stroke="#86efac" strokeWidth="1.5" fill="none" opacity="0.6" />
            <path d="M 360 278 C 390 320, 440 330, 480 320" stroke="#86efac" strokeWidth="1.5" fill="none" opacity="0.6" />

            {/* Chloroplast Zoom Area */}
            <ellipse cx="370" cy="285" rx="75" ry="48" fill="url(#chloroplastGrad)" stroke="#16a34a" strokeWidth="2" />
            <text x="370" y="270" fill="#052e16" fontSize="11" fontWeight="800" textAnchor="middle">
              CHLOROPLAST
            </text>

            {/* Thylakoid Grana (Stacked Discs) */}
            <g transform="translate(330, 275)">
              <rect x="0" y="0" width="28" height="6" rx="3" fill="#14532d" />
              <rect x="0" y="7" width="28" height="6" rx="3" fill="#14532d" />
              <rect x="0" y="14" width="28" height="6" rx="3" fill="#14532d" />
              <rect x="0" y="21" width="28" height="6" rx="3" fill="#14532d" />
              <text x="14" y="38" fill="#dcfce7" fontSize="8" fontWeight="700" textAnchor="middle">Thylakoids</text>
            </g>

            {/* Calvin Cycle Stroma */}
            <g transform="translate(380, 275)">
              <circle cx="18" cy="14" r="14" fill="none" stroke="#ca8a04" strokeWidth="2" strokeDasharray="3 2" />
              <text x="18" y="18" fill="#fef08a" fontSize="8" fontWeight="700" textAnchor="middle">Calvin</text>
              <text x="18" y="38" fill="#dcfce7" fontSize="8" fontWeight="700" textAnchor="middle">Stroma</text>
            </g>
          </g>

          {/* WATER INPUT VIA XYLEM (Bottom-Left) */}
          <g
            className={`clickable-component ${activeTarget === 'water-input' ? 'component-highlight' : ''}`}
            onClick={() => onSelectComponent('water-input')}
            style={{ cursor: 'pointer' }}
          >
            {/* Water pipe / stem */}
            <path
              d="M 120 480 L 120 380 C 120 330, 180 310, 220 295"
              stroke="#0284c7"
              strokeWidth="6"
              fill="none"
              strokeDasharray={water > 0 ? '6 4' : 'none'}
            />
            {/* Water Droplets */}
            <circle cx="120" cy="440" r="6" fill="#38bdf8" />
            <circle cx="130" cy="380" r="5" fill="#38bdf8" />
            <circle cx="180" cy="330" r="5" fill="#38bdf8" />

            <text x="80" y="475" fill="#38bdf8" fontSize="11" fontWeight="700">
              Water (H₂O)
            </text>
            <text x="80" y="490" fill="#94a3b8" fontSize="9">
              From Roots via Xylem
            </text>
          </g>

          {/* CARBON DIOXIDE INPUT (Top-Right Stomata) */}
          <g
            className={`clickable-component ${activeTarget === 'co2-input' ? 'component-highlight' : ''}`}
            onClick={() => onSelectComponent('co2-input')}
            style={{ cursor: 'pointer' }}
          >
            {/* Drifting CO2 molecules */}
            <circle cx="590" cy="160" r="8" fill="#475569" />
            <circle cx="530" cy="200" r="8" fill="#475569" />
            <circle cx="480" cy="225" r="7" fill="#475569" />

            <path
              d="M 610 150 C 560 170, 520 200, 480 230"
              stroke="#94a3b8"
              strokeWidth="2"
              strokeDasharray="4 3"
              fill="none"
            />
            <text x="615" y="155" fill="#cbd5e1" fontSize="11" fontWeight="700">
              CO₂ Influx
            </text>
            <text x="615" y="170" fill="#94a3b8" fontSize="9">
              Through Stomata Pores
            </text>
          </g>

          {/* GLUCOSE OUTPUT (Bottom-Center) */}
          <g
            className={`clickable-component ${activeTarget === 'glucose-output' ? 'component-highlight' : ''}`}
            onClick={() => onSelectComponent('glucose-output')}
            style={{ cursor: 'pointer', opacity: rate > 10 ? 1 : 0.3 }}
          >
            <path
              d="M 370 330 L 370 410"
              stroke="#ea580c"
              strokeWidth="4"
              strokeDasharray="4 3"
              fill="none"
            />
            {/* Sugar hexagram / cube */}
            <rect x="345" y="415" width="50" height="26" rx="6" fill="#f97316" stroke="#fdba74" />
            <text x="370" y="432" fill="#fff" fontSize="10" fontWeight="800" textAnchor="middle">
              GLUCOSE
            </text>
            <text x="370" y="455" fill="#fed7aa" fontSize="9" fontWeight="600" textAnchor="middle">
              Stored Food (C₆H₁₂O₆)
            </text>
          </g>

          {/* OXYGEN RELEASE (Right) */}
          <g
            className={`clickable-component ${activeTarget === 'oxygen-output' ? 'component-highlight' : ''}`}
            onClick={() => onSelectComponent('oxygen-output')}
            style={{ cursor: 'pointer', opacity: rate > 10 ? 1 : 0.3 }}
          >
            {/* Rising O2 bubbles */}
            <circle cx="520" cy="330" r="10" fill="#06b6d4" opacity="0.8" />
            <text x="520" y="334" fill="#fff" fontSize="9" fontWeight="800" textAnchor="middle">O₂</text>

            <circle cx="560" cy="360" r="12" fill="#06b6d4" opacity="0.9" />
            <text x="560" y="364" fill="#fff" fontSize="10" fontWeight="800" textAnchor="middle">O₂</text>

            <circle cx="610" cy="390" r="14" fill="#06b6d4" />
            <text x="610" y="394" fill="#fff" fontSize="11" fontWeight="800" textAnchor="middle">O₂</text>

            <text x="635" y="395" fill="#67e8f9" fontSize="11" fontWeight="700">
              Oxygen (O₂) Gas
            </text>
            <text x="635" y="410" fill="#94a3b8" fontSize="9">
              Released to Atmosphere
            </text>
          </g>
        </svg>
      </div>

      <div className="canvas-disclaimer">
        <Info size={13} />
        <span>
          Liebig's Law of Limiting Factors: Photosynthesis efficiency is constrained by whichever vital input (light, water, or CO₂) is in shortest supply.
        </span>
      </div>
    </div>
  );
}
