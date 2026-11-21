import { useMemo, useState } from 'react';
import { Circle, Info, Layers, Maximize2, MoveDiagonal, Square, Triangle } from 'lucide-react';

interface GeometryExplorerViewProps {
  onSelectComponent: (id: string) => void;
  selectedComponentId?: string;
  highlightComponentId?: string;
}

type ShapeType = 'rectangle' | 'square' | 'triangle' | 'circle' | 'parallelogram';

export default function GeometryExplorerView({
  onSelectComponent,
  selectedComponentId,
  highlightComponentId
}: GeometryExplorerViewProps) {
  const [shape, setShape] = useState<ShapeType>('rectangle');
  const [length, setLength] = useState(14); // cm
  const [width, setWidth] = useState(8); // cm
  const [radius, setRadius] = useState(6); // cm
  const [base, setBase] = useState(12); // cm
  const [height, setHeight] = useState(9); // cm

  // Real-time calculations
  const metrics = useMemo(() => {
    if (shape === 'rectangle') {
      const area = length * width;
      const perimeter = 2 * (length + width);
      const diagonal = Number(Math.sqrt(length * length + width * width).toFixed(2));
      return {
        area: `${area} cm²`,
        perimeter: `${perimeter} cm`,
        extraLabel: 'DIAGONAL',
        extraValue: `${diagonal} cm`,
        formulaArea: 'Area = length × width = l · w',
        formulaPerimeter: 'Perimeter = 2 × (length + width) = 2(l + w)',
        derivation: `Rectangle with length ${length} cm and width ${width} cm encloses ${area} unit squares (1 cm² each). Diagonal d = √(l² + w²) = √(${length * length} + ${width * width}) = ${diagonal} cm.`
      };
    }
    if (shape === 'square') {
      const area = length * length;
      const perimeter = 4 * length;
      const diagonal = Number((length * Math.SQRT2).toFixed(2));
      return {
        area: `${area} cm²`,
        perimeter: `${perimeter} cm`,
        extraLabel: 'DIAGONAL',
        extraValue: `${diagonal} cm`,
        formulaArea: 'Area = side² = s²',
        formulaPerimeter: 'Perimeter = 4 × side = 4s',
        derivation: `A regular 4-sided square with side s = ${length} cm. Area = s² = ${length}² = ${area} cm². Perimeter = 4 × ${length} = ${perimeter} cm.`
      };
    }
    if (shape === 'triangle') {
      const area = Number((0.5 * base * height).toFixed(2));
      // Assuming isosceles triangle for perimeter calculation:
      const hypotenuse = Math.sqrt((base / 2) * (base / 2) + height * height);
      const perimeter = Number((base + 2 * hypotenuse).toFixed(2));
      return {
        area: `${area} cm²`,
        perimeter: `${perimeter} cm`,
        extraLabel: 'HYPOTENUSE (SLANT)',
        extraValue: `${hypotenuse.toFixed(2)} cm`,
        formulaArea: 'Area = ½ × base × height = ½ · b · h',
        formulaPerimeter: 'Perimeter = a + b + c',
        derivation: `A triangle encloses exactly half the area of a bounding rectangle of base ${base} cm and height ${height} cm! Area = ½ × ${base} × ${height} = ${area} cm².`
      };
    }
    if (shape === 'circle') {
      const area = Number((Math.PI * radius * radius).toFixed(2));
      const circumference = Number((2 * Math.PI * radius).toFixed(2));
      const diameter = radius * 2;
      return {
        area: `${area} cm²`,
        perimeter: `${circumference} cm`,
        extraLabel: 'DIAMETER',
        extraValue: `${diameter} cm`,
        formulaArea: 'Area = π × radius² = πr²',
        formulaPerimeter: 'Circumference = 2 × π × radius = 2πr',
        derivation: `Circle with radius r = ${radius} cm and diameter d = ${diameter} cm. Circumference C = 2π(${radius}) ≈ ${circumference} cm. Area A = π(${radius})² ≈ ${area} cm².`
      };
    }
    // Parallelogram
    const area = base * height;
    const side = Number(Math.sqrt(height * height + 16).toFixed(2)); // slant side
    const perimeter = Number((2 * (base + side)).toFixed(2));
    return {
      area: `${area} cm²`,
      perimeter: `${perimeter} cm`,
      extraLabel: 'SLANT SIDE',
      extraValue: `${side} cm`,
      formulaArea: 'Area = base × height = b · h',
      formulaPerimeter: 'Perimeter = 2 × (base + slant side)',
      derivation: `By cutting the triangular end off a parallelogram of base ${base} cm and height ${height} cm and moving it to the opposite side, it transforms into an exact rectangle of b × h = ${area} cm²!`
    };
  }, [shape, length, width, radius, base, height]);

  const originX = 320;
  const originY = 240;
  const activeTarget = highlightComponentId || selectedComponentId;

  return (
    <div className="visual-experience-canvas-wrap">
      <div className="canvas-toolbar">
        <div className="toolbar-left" style={{ flexWrap: 'wrap', gap: 10 }}>
          <div className="segmented segmented-sm">
            <button className={shape === 'rectangle' ? 'chosen' : ''} onClick={() => setShape('rectangle')}>Rectangle</button>
            <button className={shape === 'square' ? 'chosen' : ''} onClick={() => setShape('square')}>Square</button>
            <button className={shape === 'triangle' ? 'chosen' : ''} onClick={() => setShape('triangle')}>Triangle</button>
            <button className={shape === 'circle' ? 'chosen' : ''} onClick={() => setShape('circle')}>Circle</button>
            <button className={shape === 'parallelogram' ? 'chosen' : ''} onClick={() => setShape('parallelogram')}>Parallelogram</button>
          </div>

          {/* Dimension Sliders */}
          {(shape === 'rectangle' || shape === 'square') && (
            <div className="input-control-group">
              <span className="field-label" style={{ margin: 0 }}>
                {shape === 'square' ? 'SIDE' : 'LENGTH (l)'}: <b>{length} cm</b>
              </span>
              <input
                type="range"
                min="5"
                max="22"
                value={length}
                onChange={e => setLength(Number(e.target.value))}
                className="range-input"
              />
            </div>
          )}

          {shape === 'rectangle' && (
            <div className="input-control-group">
              <span className="field-label" style={{ margin: 0 }}>
                WIDTH (w): <b>{width} cm</b>
              </span>
              <input
                type="range"
                min="4"
                max="16"
                value={width}
                onChange={e => setWidth(Number(e.target.value))}
                className="range-input"
              />
            </div>
          )}

          {(shape === 'triangle' || shape === 'parallelogram') && (
            <>
              <div className="input-control-group">
                <span className="field-label" style={{ margin: 0 }}>
                  BASE (b): <b>{base} cm</b>
                </span>
                <input
                  type="range"
                  min="6"
                  max="22"
                  value={base}
                  onChange={e => setBase(Number(e.target.value))}
                  className="range-input"
                />
              </div>
              <div className="input-control-group">
                <span className="field-label" style={{ margin: 0 }}>
                  HEIGHT (h): <b>{height} cm</b>
                </span>
                <input
                  type="range"
                  min="4"
                  max="16"
                  value={height}
                  onChange={e => setHeight(Number(e.target.value))}
                  className="range-input"
                />
              </div>
            </>
          )}

          {shape === 'circle' && (
            <div className="input-control-group">
              <span className="field-label" style={{ margin: 0 }}>
                RADIUS (r): <b>{radius} cm</b>
              </span>
              <input
                type="range"
                min="3"
                max="12"
                value={radius}
                onChange={e => setRadius(Number(e.target.value))}
                className="range-input"
              />
            </div>
          )}
        </div>

        <div className="toolbar-right">
          <div className="circuit-metrics-badge">
            <div>
              <span className="field-label" style={{ margin: 0 }}>AREA</span>
              <strong>{metrics.area}</strong>
            </div>
            <div>
              <span className="field-label" style={{ margin: 0 }}>PERIMETER</span>
              <strong>{metrics.perimeter}</strong>
            </div>
            <div>
              <span className="field-label" style={{ margin: 0 }}>{metrics.extraLabel}</span>
              <strong>{metrics.extraValue}</strong>
            </div>
          </div>
        </div>
      </div>

      <div className="svg-stage-container">
        <svg
          viewBox="0 0 640 440"
          className="interactive-svg geometry-svg"
          role="img"
          aria-label="Interactive Geometry Explorer"
        >
          <defs>
            {/* Grid Pattern for Euclidean Coordinate Paper */}
            <pattern id="gridPattern" width="20" height="20" patternUnits="userSpaceOnUse">
              <path d="M 20 0 L 0 0 0 20" fill="none" stroke="#162922" strokeWidth="0.8" />
            </pattern>
            <linearGradient id="shapeGrad" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#10b981" stopOpacity="0.85" />
              <stop offset="100%" stopColor="#047857" stopOpacity="0.85" />
            </linearGradient>
          </defs>

          {/* Canvas Background with Grid */}
          <rect width="640" height="440" fill="#08110e" rx="16" />
          <rect width="640" height="440" fill="url(#gridPattern)" rx="16" />

          {/* Formula derivation banner */}
          <g transform="translate(30, 20)">
            <rect width="580" height="42" rx="8" fill="#132a22" stroke="#255141" />
            <text x="290" y="19" textAnchor="middle" fill="#6ee7b7" fontSize="11" fontWeight="800">
              {metrics.formulaArea} · {metrics.formulaPerimeter}
            </text>
            <text x="290" y="34" textAnchor="middle" fill="#cbd5e1" fontSize="10">
              {metrics.derivation}
            </text>
          </g>

          {/* RENDERING INDIVIDUAL SHAPES */}
          {shape === 'rectangle' && (() => {
            const pxW = length * 15;
            const pxH = width * 15;
            const x = originX - pxW / 2;
            const y = originY - pxH / 2 + 20;

            return (
              <g
                className={`clickable-component ${activeTarget === 'area-fill' ? 'component-highlight' : ''}`}
                onClick={() => onSelectComponent('area-fill')}
                style={{ cursor: 'pointer' }}
              >
                <rect
                  x={x}
                  y={y}
                  width={pxW}
                  height={pxH}
                  rx="4"
                  fill="url(#shapeGrad)"
                  stroke="#34d399"
                  strokeWidth="2.5"
                />

                {/* Length dimension arrow */}
                <line x1={x} y1={y + pxH + 16} x2={x + pxW} y2={y + pxH + 16} stroke="#38bdf8" strokeWidth="1.5" />
                <text x={originX} y={y + pxH + 32} fill="#38bdf8" fontSize="11" fontWeight="700" textAnchor="middle">
                  Length = {length} cm
                </text>

                {/* Width dimension arrow */}
                <line x1={x - 16} y1={y} x2={x - 16} y2={y + pxH} stroke="#f59e0b" strokeWidth="1.5" />
                <text x={x - 22} y={originY + 24} fill="#f59e0b" fontSize="11" fontWeight="700" textAnchor="end">
                  Width = {width} cm
                </text>

                {/* Center Area Label */}
                <text x={originX} y={originY + 24} fill="#ffffff" fontSize="13" fontWeight="900" textAnchor="middle">
                  Area: {length * width} cm²
                </text>
              </g>
            );
          })()}

          {shape === 'square' && (() => {
            const pxS = length * 15;
            const x = originX - pxS / 2;
            const y = originY - pxS / 2 + 20;

            return (
              <g
                className={`clickable-component ${activeTarget === 'area-fill' ? 'component-highlight' : ''}`}
                onClick={() => onSelectComponent('area-fill')}
                style={{ cursor: 'pointer' }}
              >
                <rect
                  x={x}
                  y={y}
                  width={pxS}
                  height={pxS}
                  rx="4"
                  fill="url(#shapeGrad)"
                  stroke="#34d399"
                  strokeWidth="2.5"
                />

                <line x1={x} y1={y + pxS + 16} x2={x + pxS} y2={y + pxS + 16} stroke="#38bdf8" strokeWidth="1.5" />
                <text x={originX} y={y + pxS + 32} fill="#38bdf8" fontSize="11" fontWeight="700" textAnchor="middle">
                  Side (s) = {length} cm
                </text>

                <text x={originX} y={originY + 24} fill="#ffffff" fontSize="13" fontWeight="900" textAnchor="middle">
                  Area: {length * length} cm²
                </text>
              </g>
            );
          })()}

          {shape === 'triangle' && (() => {
            const pxB = base * 15;
            const pxH = height * 15;
            const x1 = originX - pxB / 2;
            const y1 = originY + pxH / 2 + 20;
            const x2 = originX + pxB / 2;
            const y2 = y1;
            const x3 = originX;
            const y3 = originY - pxH / 2 + 20;

            return (
              <g
                className={`clickable-component ${activeTarget === 'area-fill' ? 'component-highlight' : ''}`}
                onClick={() => onSelectComponent('area-fill')}
                style={{ cursor: 'pointer' }}
              >
                {/* Bounding box dotted outline showing 2x triangle */}
                <rect
                  x={x1}
                  y={y3}
                  width={pxB}
                  height={pxH}
                  fill="none"
                  stroke="#475569"
                  strokeWidth="1.5"
                  strokeDasharray="4 4"
                />

                <polygon
                  points={`${x1},${y1} ${x2},${y2} ${x3},${y3}`}
                  fill="url(#shapeGrad)"
                  stroke="#34d399"
                  strokeWidth="2.5"
                />

                {/* Base label */}
                <line x1={x1} y1={y1 + 16} x2={x2} y2={y2 + 16} stroke="#38bdf8" strokeWidth="1.5" />
                <text x={originX} y={y1 + 32} fill="#38bdf8" fontSize="11" fontWeight="700" textAnchor="middle">
                  Base = {base} cm
                </text>

                {/* Altitude / Height line */}
                <line x1={x3} y1={y3} x2={x3} y2={y1} stroke="#f59e0b" strokeWidth="1.5" strokeDasharray="3 3" />
                <text x={x3 + 8} y={originY + 15} fill="#f59e0b" fontSize="11" fontWeight="700">
                  h = {height} cm
                </text>

                <text x={originX} y={y1 - 25} fill="#ffffff" fontSize="12" fontWeight="900" textAnchor="middle">
                  Area: {(0.5 * base * height).toFixed(1)} cm²
                </text>
              </g>
            );
          })()}

          {shape === 'circle' && (() => {
            const pxR = radius * 14;

            return (
              <g
                className={`clickable-component ${activeTarget === 'area-fill' ? 'component-highlight' : ''}`}
                onClick={() => onSelectComponent('area-fill')}
                style={{ cursor: 'pointer' }}
              >
                <circle
                  cx={originX}
                  cy={originY + 20}
                  r={pxR}
                  fill="url(#shapeGrad)"
                  stroke="#34d399"
                  strokeWidth="2.5"
                />

                {/* Radius line */}
                <line
                  x1={originX}
                  y1={originY + 20}
                  x2={originX + pxR}
                  y2={originY + 20}
                  stroke="#f59e0b"
                  strokeWidth="2"
                />
                <circle cx={originX} cy={originY + 20} r="3" fill="#fff" />
                <text x={originX + pxR / 2} y={originY + 14} fill="#f59e0b" fontSize="11" fontWeight="700" textAnchor="middle">
                  r = {radius} cm
                </text>

                {/* Circumference boundary indicator */}
                <text x={originX} y={originY + 24 + pxR / 2} fill="#ffffff" fontSize="12" fontWeight="900" textAnchor="middle">
                  Area: {(Math.PI * radius * radius).toFixed(1)} cm²
                </text>
                <text x={originX} y={originY + 40 + pxR / 2} fill="#e2e8f0" fontSize="10" textAnchor="middle">
                  Circumference: {(2 * Math.PI * radius).toFixed(1)} cm
                </text>
              </g>
            );
          })()}

          {shape === 'parallelogram' && (() => {
            const pxB = base * 14;
            const pxH = height * 14;
            const skew = 45;
            const x1 = originX - pxB / 2 - skew / 2;
            const y1 = originY + pxH / 2 + 20;
            const x2 = x1 + pxB;
            const y2 = y1;
            const x3 = x2 + skew;
            const y3 = originY - pxH / 2 + 20;
            const x4 = x1 + skew;
            const y4 = y3;

            return (
              <g
                className={`clickable-component ${activeTarget === 'area-fill' ? 'component-highlight' : ''}`}
                onClick={() => onSelectComponent('area-fill')}
                style={{ cursor: 'pointer' }}
              >
                <polygon
                  points={`${x1},${y1} ${x2},${y2} ${x3},${y3} ${x4},${y4}`}
                  fill="url(#shapeGrad)"
                  stroke="#34d399"
                  strokeWidth="2.5"
                />

                <line x1={x1} y1={y1 + 16} x2={x2} y2={y2 + 16} stroke="#38bdf8" strokeWidth="1.5" />
                <text x={(x1 + x2) / 2} y={y1 + 32} fill="#38bdf8" fontSize="11" fontWeight="700" textAnchor="middle">
                  Base (b) = {base} cm
                </text>

                <line x1={x4} y1={y4} x2={x4} y2={y1} stroke="#f59e0b" strokeWidth="1.5" strokeDasharray="3 3" />
                <text x={x4 + 8} y={originY + 15} fill="#f59e0b" fontSize="11" fontWeight="700">
                  h = {height} cm
                </text>

                <text x={originX} y={originY + 24} fill="#ffffff" fontSize="13" fontWeight="900" textAnchor="middle">
                  Area: {base * height} cm²
                </text>
              </g>
            );
          })()}
        </svg>
      </div>

      <div className="canvas-disclaimer">
        <Info size={13} />
        <span>
          Dynamic Euclidean Geometry: Adjusting sliders modifies shape coordinates in real time. Notice how doubling a linear dimension (e.g. side or radius) increases boundary perimeter by 2× but squares the enclosed area by 4×!
        </span>
      </div>
    </div>
  );
}
