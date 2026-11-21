import { useState } from 'react';
import { Activity, ArrowRight, Heart, RefreshCw, Zap } from 'lucide-react';

interface HumanHeartViewProps {
  onSelectComponent: (id: string) => void;
  selectedComponentId?: string;
  highlightComponentId?: string;
}

export default function HumanHeartView({
  onSelectComponent,
  selectedComponentId,
  highlightComponentId
}: HumanHeartViewProps) {
  const [bpm, setBpm] = useState(72);
  const [circuitMode, setCircuitMode] = useState<'both' | 'pulmonary' | 'systemic'>('both');
  const [isContracting, setIsContracting] = useState(true);

  const activeTarget = highlightComponentId || selectedComponentId;
  const pulseDuration = (60 / bpm).toFixed(2);

  return (
    <div className="visual-experience-canvas-wrap">
      <div className="canvas-toolbar">
        <div className="toolbar-left">
          <span className="field-label" style={{ margin: 0, display: 'flex', alignItems: 'center', gap: 5 }}>
            <Heart size={14} className="text-red" /> HEART RATE:
          </span>
          <div className="bpm-slider-row">
            <input
              type="range"
              min="50"
              max="150"
              value={bpm}
              onChange={e => setBpm(Number(e.target.value))}
              className="range-input"
            />
            <strong>{bpm} <small>BPM</small></strong>
          </div>
          <div className="segmented segmented-sm">
            <button className={bpm === 72 ? 'chosen' : ''} onClick={() => setBpm(72)}>Rest (72)</button>
            <button className={bpm === 125 ? 'chosen' : ''} onClick={() => setBpm(125)}>Exercise (125)</button>
          </div>
        </div>

        <div className="toolbar-right">
          <div className="segmented segmented-sm">
            <button
              className={circuitMode === 'both' ? 'chosen' : ''}
              onClick={() => setCircuitMode('both')}
            >
              Double Circulation
            </button>
            <button
              className={circuitMode === 'pulmonary' ? 'chosen' : ''}
              onClick={() => setCircuitMode('pulmonary')}
            >
              Pulmonary (Lungs)
            </button>
            <button
              className={circuitMode === 'systemic' ? 'chosen' : ''}
              onClick={() => setCircuitMode('systemic')}
            >
              Systemic (Body)
            </button>
          </div>
        </div>
      </div>

      <div className="svg-stage-container">
        <svg
          viewBox="0 0 680 540"
          className="interactive-svg heart-svg"
          role="img"
          aria-label="Interactive Diagram of the Human Heart and Blood Circulation"
        >
          <defs>
            <linearGradient id="deoxGrad" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#1e40af" />
              <stop offset="100%" stopColor="#2563eb" />
            </linearGradient>
            <linearGradient id="oxGrad" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#b91c1c" />
              <stop offset="100%" stopColor="#ef4444" />
            </linearGradient>
            <linearGradient id="aortaGrad" x1="0%" y1="0%" x2="0%" y2="100%">
              <stop offset="0%" stopColor="#f43f5e" />
              <stop offset="100%" stopColor="#dc2626" />
            </linearGradient>
            <filter id="glowSubtle">
              <feGaussianBlur stdDeviation="2" result="blur" />
              <feComposite in="SourceGraphic" in2="blur" operator="over" />
            </filter>
          </defs>

          {/* Background Card */}
          <rect width="680" height="540" fill="#0f1915" rx="16" />

          {/* Legend / Flow guidance at top */}
          <g transform="translate(30, 25)">
            <rect x="0" y="0" width="16" height="16" rx="4" fill="#2563eb" />
            <text x="24" y="12" fill="#93c5fd" fontSize="11" fontWeight="600">
              Deoxygenated Blood (To Lungs)
            </text>

            <rect x="230" y="0" width="16" height="16" rx="4" fill="#ef4444" />
            <text x="254" y="12" fill="#fca5a5" fontSize="11" fontWeight="600">
              Oxygenated Blood (To Body)
            </text>
          </g>

          {/* VENA CAVA (Superior & Inferior) */}
          <g
            className={`clickable-component ${activeTarget === 'right-atrium' ? 'component-highlight' : ''}`}
            onClick={() => onSelectComponent('right-atrium')}
            style={{ cursor: 'pointer', opacity: circuitMode === 'systemic' ? 0.35 : 1 }}
          >
            {/* Superior Vena Cava */}
            <path
              d="M 180 60 L 180 180 C 180 200, 205 210, 220 220 L 220 120 C 220 90, 210 60, 180 60 Z"
              fill="url(#deoxGrad)"
              stroke="#60a5fa"
              strokeWidth="2"
            />
            {/* Inferior Vena Cava */}
            <path
              d="M 185 380 L 185 490 C 205 490, 220 480, 225 450 L 225 360 Z"
              fill="url(#deoxGrad)"
              stroke="#60a5fa"
              strokeWidth="2"
            />
            <text x="145" y="105" fill="#93c5fd" fontSize="10" fontWeight="700" textAnchor="end">
              SUPERIOR VENA CAVA
            </text>
            <text x="145" y="455" fill="#93c5fd" fontSize="10" fontWeight="700" textAnchor="end">
              INFERIOR VENA CAVA
            </text>
          </g>

          {/* AORTA & ARCH */}
          <g
            className={`clickable-component ${activeTarget === 'aorta' ? 'component-highlight' : ''}`}
            onClick={() => onSelectComponent('aorta')}
            style={{ cursor: 'pointer', opacity: circuitMode === 'pulmonary' ? 0.35 : 1 }}
          >
            {/* Arch branches */}
            <rect x="330" y="45" width="14" height="40" rx="4" fill="#e11d48" stroke="#fda4af" />
            <rect x="355" y="40" width="14" height="45" rx="4" fill="#e11d48" stroke="#fda4af" />
            <rect x="380" y="45" width="14" height="40" rx="4" fill="#e11d48" stroke="#fda4af" />

            {/* Main curved arch */}
            <path
              d="M 310 170 C 310 90, 420 80, 430 160 C 440 220, 445 280, 445 360 L 420 360 C 420 280, 415 220, 405 170 C 395 125, 340 125, 335 170 Z"
              fill="url(#aortaGrad)"
              stroke="#fda4af"
              strokeWidth="2"
            />
            <text x="450" y="105" fill="#fda4af" fontSize="11" fontWeight="700">
              AORTA ARCH
            </text>
          </g>

          {/* PULMONARY ARTERY */}
          <g
            className={`clickable-component ${activeTarget === 'pulmonary-artery' ? 'component-highlight' : ''}`}
            onClick={() => onSelectComponent('pulmonary-artery')}
            style={{ cursor: 'pointer', opacity: circuitMode === 'systemic' ? 0.35 : 1 }}
          >
            <path
              d="M 270 240 C 270 170, 260 130, 250 110 L 290 100 C 300 130, 315 160, 325 210 Z"
              fill="url(#deoxGrad)"
              stroke="#60a5fa"
              strokeWidth="2"
            />
            {/* Left/Right branches */}
            <path d="M 250 110 L 150 95 L 155 120 L 260 130 Z" fill="url(#deoxGrad)" stroke="#60a5fa" />
            <path d="M 290 100 L 490 85 L 490 110 L 310 120 Z" fill="url(#deoxGrad)" stroke="#60a5fa" />
            <text x="140" y="85" fill="#93c5fd" fontSize="10" fontWeight="700" textAnchor="end">
              TO RIGHT LUNG
            </text>
            <text x="500" y="80" fill="#93c5fd" fontSize="10" fontWeight="700">
              TO LEFT LUNG
            </text>
          </g>

          {/* PULMONARY VEINS */}
          <g
            className={`clickable-component ${activeTarget === 'pulmonary-veins' ? 'component-highlight' : ''}`}
            onClick={() => onSelectComponent('pulmonary-veins')}
            style={{ cursor: 'pointer', opacity: circuitMode === 'pulmonary' ? 0.35 : 1 }}
          >
            <rect x="470" y="190" width="60" height="22" rx="6" fill="url(#oxGrad)" stroke="#fca5a5" />
            <rect x="470" y="222" width="60" height="22" rx="6" fill="url(#oxGrad)" stroke="#fca5a5" />
            <text x="540" y="218" fill="#fca5a5" fontSize="10" fontWeight="700">
              FROM LUNGS (OXYGEN-RICH)
            </text>
          </g>

          {/* MAIN HEART MUSCLE BULK (MYOCARDIUM OUTLINE) */}
          <path
            d="M 200 210 C 150 240, 160 380, 210 430 C 260 480, 310 500, 340 505 C 370 500, 450 470, 480 400 C 510 320, 500 230, 460 200 C 430 180, 390 190, 340 210 C 290 190, 240 180, 200 210 Z"
            fill="#1c2c25"
            stroke="#2d4a3e"
            strokeWidth="4"
          />

          {/* RIGHT ATRIUM (Anatomical Right = Viewer Left) */}
          <g
            className={`clickable-component ${activeTarget === 'right-atrium' ? 'component-highlight' : ''}`}
            onClick={() => onSelectComponent('right-atrium')}
            style={{ cursor: 'pointer', opacity: circuitMode === 'systemic' ? 0.35 : 1 }}
          >
            <path
              d="M 215 215 C 185 240, 185 300, 220 330 C 255 330, 275 300, 275 250 C 275 220, 245 200, 215 215 Z"
              fill="url(#deoxGrad)"
              stroke={activeTarget === 'right-atrium' ? '#fff' : '#3b82f6'}
              strokeWidth={activeTarget === 'right-atrium' ? 3 : 1.5}
            />
            <text x="240" y="270" fill="#fff" fontSize="12" fontWeight="800" textAnchor="middle">
              RIGHT
            </text>
            <text x="240" y="286" fill="#93c5fd" fontSize="10" fontWeight="700" textAnchor="middle">
              ATRIUM
            </text>
          </g>

          {/* RIGHT VENTRICLE */}
          <g
            className={`clickable-component ${activeTarget === 'right-ventricle' ? 'component-highlight' : ''}`}
            onClick={() => onSelectComponent('right-ventricle')}
            style={{ cursor: 'pointer', opacity: circuitMode === 'systemic' ? 0.35 : 1 }}
          >
            <path
              d="M 225 345 C 220 375, 250 435, 300 460 C 310 465, 325 450, 325 365 C 300 355, 260 345, 225 345 Z"
              fill="url(#deoxGrad)"
              stroke={activeTarget === 'right-ventricle' ? '#fff' : '#2563eb'}
              strokeWidth={activeTarget === 'right-ventricle' ? 3 : 1.5}
            />
            <text x="275" y="405" fill="#fff" fontSize="12" fontWeight="800" textAnchor="middle">
              RIGHT
            </text>
            <text x="275" y="421" fill="#93c5fd" fontSize="10" fontWeight="700" textAnchor="middle">
              VENTRICLE
            </text>
          </g>

          {/* SEPTUM (Wall between ventricles) */}
          <path
            d="M 325 365 C 325 450, 310 465, 335 480 C 350 465, 350 370, 350 340 Z"
            fill="#273e33"
            stroke="#3a5a4a"
            strokeWidth="1.5"
          />

          {/* LEFT ATRIUM */}
          <g
            className={`clickable-component ${activeTarget === 'left-atrium' ? 'component-highlight' : ''}`}
            onClick={() => onSelectComponent('left-atrium')}
            style={{ cursor: 'pointer', opacity: circuitMode === 'pulmonary' ? 0.35 : 1 }}
          >
            <path
              d="M 390 220 C 365 240, 365 295, 395 320 C 430 320, 465 285, 460 235 C 455 205, 420 200, 390 220 Z"
              fill="url(#oxGrad)"
              stroke={activeTarget === 'left-atrium' ? '#fff' : '#ef4444'}
              strokeWidth={activeTarget === 'left-atrium' ? 3 : 1.5}
            />
            <text x="420" y="265" fill="#fff" fontSize="12" fontWeight="800" textAnchor="middle">
              LEFT
            </text>
            <text x="420" y="281" fill="#fca5a5" fontSize="10" fontWeight="700" textAnchor="middle">
              ATRIUM
            </text>
          </g>

          {/* LEFT VENTRICLE (Notice thicker muscular wall) */}
          <g
            className={`clickable-component ${activeTarget === 'left-ventricle' ? 'component-highlight' : ''}`}
            onClick={() => onSelectComponent('left-ventricle')}
            style={{ cursor: 'pointer', opacity: circuitMode === 'pulmonary' ? 0.35 : 1 }}
          >
            <path
              d="M 355 335 C 355 420, 345 470, 340 485 C 375 485, 435 440, 455 380 C 465 350, 440 335, 400 335 Z"
              fill="url(#oxGrad)"
              stroke={activeTarget === 'left-ventricle' ? '#fff' : '#dc2626'}
              strokeWidth={activeTarget === 'left-ventricle' ? 3 : 1.5}
            />
            <text x="400" y="405" fill="#fff" fontSize="12" fontWeight="800" textAnchor="middle">
              LEFT
            </text>
            <text x="400" y="421" fill="#fca5a5" fontSize="10" fontWeight="700" textAnchor="middle">
              VENTRICLE
            </text>
          </g>

          {/* TRICUSPID & MITRAL VALVES */}
          <g
            className={`clickable-component ${activeTarget === 'valves' ? 'component-highlight' : ''}`}
            onClick={() => onSelectComponent('valves')}
            style={{ cursor: 'pointer' }}
          >
            {/* Tricuspid */}
            <line x1="225" y1="335" x2="270" y2="340" stroke="#fbbf24" strokeWidth="4" strokeLinecap="round" />
            <text x="210" y="342" fill="#fbbf24" fontSize="9" fontWeight="700" textAnchor="end">
              TRICUSPID VALVE
            </text>

            {/* Mitral / Bicuspid */}
            <line x1="395" y1="325" x2="445" y2="330" stroke="#fbbf24" strokeWidth="4" strokeLinecap="round" />
            <text x="460" y="333" fill="#fbbf24" fontSize="9" fontWeight="700">
              MITRAL (BICUSPID) VALVE
            </text>
          </g>

          {/* ANIMATED BLOOD FLOW CHEVRONS */}
          {/* Right side deoxygenated flow (Up to lungs) */}
          <g className="flow-path-right" style={{ animationDuration: `${pulseDuration}s` }}>
            <circle cx="200" cy="140" r="4" fill="#93c5fd" />
            <circle cx="240" cy="245" r="4" fill="#93c5fd" />
            <circle cx="265" cy="370" r="4" fill="#93c5fd" />
            <circle cx="280" cy="180" r="4" fill="#93c5fd" />
            <circle cx="230" cy="115" r="4" fill="#93c5fd" />
            <circle cx="360" cy="105" r="4" fill="#93c5fd" />
          </g>

          {/* Left side oxygenated flow (Out to body) */}
          <g className="flow-path-left" style={{ animationDuration: `${pulseDuration}s` }}>
            <circle cx="485" cy="210" r="4" fill="#fca5a5" />
            <circle cx="420" cy="270" r="4" fill="#fca5a5" />
            <circle cx="400" cy="380" r="4" fill="#fca5a5" />
            <circle cx="370" cy="200" r="4" fill="#fca5a5" />
            <circle cx="370" cy="110" r="4" fill="#fca5a5" />
            <circle cx="435" cy="300" r="4" fill="#fca5a5" />
          </g>
        </svg>
      </div>

      <div className="canvas-disclaimer">
        <Activity size={13} />
        <span>
          Note: In anatomical view, the right side of the heart is shown on the left of the diagram, and the left side is shown on the right.
        </span>
      </div>
    </div>
  );
}
