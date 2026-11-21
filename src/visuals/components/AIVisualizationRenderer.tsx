import { useState } from 'react';
import { ArrowRight, CheckCircle2, ChevronRight, Info, Lightbulb, Play, RotateCcw, Sliders, Sparkles } from 'lucide-react';
import type { AIVisualizationData } from '../types';

interface AIVisualizationRendererProps {
  data: AIVisualizationData;
  onSelectComponent: (id: string) => void;
  selectedComponentId?: string;
  highlightComponentId?: string;
}

export default function AIVisualizationRenderer({
  data,
  onSelectComponent,
  selectedComponentId,
  highlightComponentId
}: AIVisualizationRendererProps) {
  // Interactive parameters state initialized to default values
  const [params, setParams] = useState<Record<string, number>>(() => {
    const init: Record<string, number> = {};
    (data.interactiveParameters || []).forEach(p => {
      init[p.id] = p.defaultValue;
    });
    return init;
  });

  const [activeStepIdx, setActiveStepIdx] = useState(0);

  const steps = data.steps || [];
  const components = data.components || [];
  const currentStep = steps[activeStepIdx];
  const activeComponentId = highlightComponentId || currentStep?.activeComponentId || selectedComponentId;

  return (
    <div className="visual-experience-canvas-wrap">
      {/* Parameter controls toolbar */}
      {(data.interactiveParameters && data.interactiveParameters.length > 0) && (
        <div className="canvas-toolbar">
          <div className="toolbar-left" style={{ flexWrap: 'wrap', gap: 14 }}>
            {data.interactiveParameters.map(p => (
              <div key={p.id} className="input-control-group">
                <span className="field-label" style={{ margin: 0, display: 'flex', alignItems: 'center', gap: 4 }}>
                  <Sliders size={13} className="text-green" /> {p.label.toUpperCase()}: <b>{params[p.id] ?? p.defaultValue} {p.unit}</b>
                </span>
                <input
                  type="range"
                  min={p.min}
                  max={p.max}
                  value={params[p.id] ?? p.defaultValue}
                  onChange={e => setParams(prev => ({ ...prev, [p.id]: Number(e.target.value) }))}
                  className="range-input"
                />
              </div>
            ))}
          </div>

          <div className="toolbar-right">
            {currentStep && (
              <span className="class-pill">
                Step {activeStepIdx + 1} of {steps.length}
              </span>
            )}
          </div>
        </div>
      )}

      {/* Structured SVG Visual Stage */}
      <div className="svg-stage-container">
        <svg
          viewBox="0 0 720 460"
          className="interactive-svg ai-visual-svg"
          role="img"
          aria-label={data.title}
        >
          <defs>
            <linearGradient id="aiCardGrad" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#12251e" />
              <stop offset="100%" stopColor="#1a352b" />
            </linearGradient>
            <filter id="aiGlow">
              <feGaussianBlur stdDeviation="3" result="blur" />
              <feComposite in="SourceGraphic" in2="blur" operator="over" />
            </filter>
          </defs>

          {/* Background */}
          <rect width="720" height="460" fill="#091410" rx="16" />

          {/* Title Header inside SVG */}
          <g transform="translate(35, 25)">
            <rect width="650" height="36" rx="8" fill="#143026" stroke="#235342" />
            <text x="20" y="23" fill="#6ee7b7" fontSize="12" fontWeight="800">
              {data.topic.toUpperCase()} — {data.visualizationType.replace('-', ' ').toUpperCase()}
            </text>
            <text x="630" y="23" fill="#94a3b8" fontSize="11" textAnchor="end">
              {data.subject} · {data.category}
            </text>
          </g>

          {/* PROCESS PIPELINE / SYSTEM MODEL RENDERING */}
          {components.length > 0 && (() => {
            const count = components.length;
            const startX = 60;
            const cardWidth = Math.min(160, Math.floor((600 - (count - 1) * 20) / count));
            const cardHeight = 150;
            const posY = 120;

            return (
              <g>
                {components.map((comp, idx) => {
                  const posX = startX + idx * (cardWidth + 24);
                  const isHighlighted = activeComponentId === comp.id;
                  const isStepActive = currentStep?.activeComponentId === comp.id;

                  return (
                    <g
                      key={comp.id}
                      className={`clickable-component ${isHighlighted ? 'component-highlight' : ''}`}
                      onClick={() => onSelectComponent(comp.id)}
                      style={{ cursor: 'pointer' }}
                    >
                      {/* Connection arrow to next component */}
                      {idx < count - 1 && (
                        <g transform={`translate(${posX + cardWidth}, ${posY + cardHeight / 2})`}>
                          <line x1="2" y1="0" x2="20" y2="0" stroke="#34d399" strokeWidth="2.5" strokeDasharray="3 2" />
                          <polygon points="20,-4 26,0 20,4" fill="#34d399" />
                        </g>
                      )}

                      {/* Component Box */}
                      <rect
                        x={posX}
                        y={posY}
                        width={cardWidth}
                        height={cardHeight}
                        rx="12"
                        fill="url(#aiCardGrad)"
                        stroke={isHighlighted || isStepActive ? (comp.color || '#34d399') : '#234a3b'}
                        strokeWidth={isHighlighted || isStepActive ? 3 : 1.5}
                      />

                      {/* Badge Number */}
                      <circle
                        cx={posX + 20}
                        cy={posY + 20}
                        r="11"
                        fill={comp.color || '#10b981'}
                      />
                      <text
                        x={posX + 20}
                        y={posY + 24}
                        fill="#fff"
                        fontSize="10"
                        fontWeight="800"
                        textAnchor="middle"
                      >
                        {idx + 1}
                      </text>

                      {/* Component Role tag */}
                      <text
                        x={posX + 36}
                        y={posY + 23}
                        fill="#a7f3d0"
                        fontSize="9"
                        fontWeight="700"
                      >
                        {comp.role.slice(0, 16)}
                      </text>

                      {/* Component Name */}
                      <text
                        x={posX + 12}
                        y={posY + 52}
                        fill="#ffffff"
                        fontSize="11"
                        fontWeight="800"
                      >
                        {comp.name.slice(0, 18)}
                      </text>

                      {/* Description excerpt */}
                      <foreignObject x={posX + 12} y={posY + 60} width={cardWidth - 24} height={75}>
                        <div style={{ color: '#94a3b8', fontSize: '9px', lineHeight: '1.4', overflow: 'hidden' }}>
                          {comp.description}
                        </div>
                      </foreignObject>
                    </g>
                  );
                })}
              </g>
            );
          })()}

          {/* Current Step Explanation Box inside SVG */}
          {currentStep && (
            <g transform="translate(45, 305)">
              <rect width="630" height="75" rx="10" fill="#132a22" stroke="#245844" />
              <text x="20" y="24" fill="#34d399" fontSize="12" fontWeight="800">
                STAGE {currentStep.stepNumber}: {currentStep.title}
              </text>
              <text x="20" y="44" fill="#e2e8f0" fontSize="11">
                {currentStep.description}
              </text>
              {currentStep.visualCue && (
                <text x="20" y="62" fill="#a7f3d0" fontSize="10" fontStyle="italic">
                  ✦ {currentStep.visualCue}
                </text>
              )}
            </g>
          )}

          {/* Bottom key rule / takeaway */}
          <g transform="translate(45, 395)">
            <rect width="630" height="45" rx="8" fill="#1c2c25" stroke="#2e4d3f" />
            <text x="20" y="20" fill="#fde047" fontSize="10" fontWeight="800">
              KEY PRINCIPLE: {data.formulaOrRule || 'Cause ⟶ Mechanism ⟶ Observable Effect'}
            </text>
            <text x="20" y="35" fill="#94a3b8" fontSize="10">
              {data.keyTakeaway}
            </text>
          </g>
        </svg>
      </div>

      {/* Guided Steps Stepper controls if steps are provided */}
      {steps.length > 1 && (
        <div className="ai-steps-stepper">
          <button
            className="btn btn-soft btn-sm"
            disabled={activeStepIdx === 0}
            onClick={() => setActiveStepIdx(i => Math.max(0, i - 1))}
          >
            Previous Stage
          </button>
          <div className="stepper-dots">
            {steps.map((s, idx) => (
              <button
                key={s.stepNumber}
                className={`stepper-dot ${activeStepIdx === idx ? 'active' : ''}`}
                onClick={() => setActiveStepIdx(idx)}
                title={`Jump to stage ${s.stepNumber}`}
              />
            ))}
          </div>
          <button
            className="btn btn-primary btn-sm"
            disabled={activeStepIdx === steps.length - 1}
            onClick={() => setActiveStepIdx(i => Math.min(steps.length - 1, i + 1))}
          >
            Next Stage <ChevronRight size={14} />
          </button>
        </div>
      )}

      {data.funFact && (
        <div className="canvas-disclaimer">
          <Lightbulb size={13} className="text-yellow" />
          <span><b>Did you know?</b> {data.funFact}</span>
        </div>
      )}
    </div>
  );
}
