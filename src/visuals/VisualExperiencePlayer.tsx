import { useState } from 'react';
import {
  ArrowLeft,
  ArrowRight,
  Bookmark,
  BookmarkCheck,
  CheckCircle2,
  Compass,
  Lightbulb,
  Maximize2,
  Minimize2,
  RefreshCw,
  Sparkles,
  Trophy,
  X,
  Zap
} from 'lucide-react';
import type { VisualizationExperience, AIVisualizationData } from './types';
import SolarSystemView from './components/SolarSystemView';
import HumanHeartView from './components/HumanHeartView';
import PhotosynthesisView from './components/PhotosynthesisView';
import ElectricCircuitView from './components/ElectricCircuitView';
import ReflectionRefractionView from './components/ReflectionRefractionView';
import AtomicStructureView from './components/AtomicStructureView';
import GeometryExplorerView from './components/GeometryExplorerView';
import WaterCycleView from './components/WaterCycleView';
import AIVisualizationRenderer from './components/AIVisualizationRenderer';

interface VisualExperiencePlayerProps {
  experience: VisualizationExperience;
  aiData?: AIVisualizationData;
  isBookmarked: boolean;
  isCompleted: boolean;
  onToggleBookmark: (id: string) => void;
  onCompleteExperience: (id: string, title: string) => void;
  onBack: () => void;
  onNavigateTopic?: (topic: string, subject?: string) => void;
}

export default function VisualExperiencePlayer({
  experience,
  aiData,
  isBookmarked,
  isCompleted,
  onToggleBookmark,
  onCompleteExperience,
  onBack,
  onNavigateTopic
}: VisualExperiencePlayerProps) {
  const [mode, setMode] = useState<'guided' | 'explore'>(experience.defaultMode || 'guided');
  const [currentStepIdx, setCurrentStepIdx] = useState(0);
  const [selectedComponentId, setSelectedComponentId] = useState<string | undefined>(
    experience.components[0]?.id
  );
  const [claimedReward, setClaimedReward] = useState(isCompleted);

  const steps = aiData?.steps || experience.steps || [];
  const components = aiData?.components || experience.components || [];
  const currentStep = steps[currentStepIdx];
  const highlightId = mode === 'guided' ? currentStep?.highlightComponentId : undefined;

  // Selected component info
  const selectedComp = components.find(c => c.id === (selectedComponentId || highlightId)) || components[0];

  const handleFinishGuided = () => {
    onCompleteExperience(experience.id, experience.title);
    setClaimedReward(true);
  };

  const handleReset = () => {
    setCurrentStepIdx(0);
    if (components.length > 0) setSelectedComponentId(components[0].id);
  };

  // Render the specific interactive canvas
  const renderCanvas = () => {
    if (aiData) {
      return (
        <AIVisualizationRenderer
          data={aiData}
          onSelectComponent={id => { setSelectedComponentId(id); setMode('explore'); }}
          selectedComponentId={selectedComponentId}
          highlightComponentId={highlightId}
        />
      );
    }

    switch (experience.id) {
      case 'solar-system':
        return (
          <SolarSystemView
            onSelectComponent={id => { setSelectedComponentId(id); setMode('explore'); }}
            selectedComponentId={selectedComponentId || highlightId}
          />
        );
      case 'human-heart':
        return (
          <HumanHeartView
            onSelectComponent={id => { setSelectedComponentId(id); setMode('explore'); }}
            selectedComponentId={selectedComponentId}
            highlightComponentId={highlightId}
          />
        );
      case 'photosynthesis':
        return (
          <PhotosynthesisView
            onSelectComponent={id => { setSelectedComponentId(id); setMode('explore'); }}
            selectedComponentId={selectedComponentId}
            highlightComponentId={highlightId}
          />
        );
      case 'electric-circuit':
        return (
          <ElectricCircuitView
            onSelectComponent={id => { setSelectedComponentId(id); setMode('explore'); }}
            selectedComponentId={selectedComponentId}
            highlightComponentId={highlightId}
          />
        );
      case 'reflection-refraction':
        return (
          <ReflectionRefractionView
            onSelectComponent={id => { setSelectedComponentId(id); setMode('explore'); }}
            selectedComponentId={selectedComponentId}
            highlightComponentId={highlightId}
          />
        );
      case 'atomic-structure':
        return (
          <AtomicStructureView
            onSelectComponent={id => { setSelectedComponentId(id); setMode('explore'); }}
            selectedComponentId={selectedComponentId}
            highlightComponentId={highlightId}
          />
        );
      case 'geometry-explorer':
        return (
          <GeometryExplorerView
            onSelectComponent={id => { setSelectedComponentId(id); setMode('explore'); }}
            selectedComponentId={selectedComponentId}
            highlightComponentId={highlightId}
          />
        );
      case 'water-cycle':
        return (
          <WaterCycleView
            onSelectComponent={id => { setSelectedComponentId(id); setMode('explore'); }}
            selectedComponentId={selectedComponentId}
            highlightComponentId={highlightId}
          />
        );
      default:
        return (
          <div className="empty-state compact">
            <p>Visual experience loading...</p>
          </div>
        );
    }
  };

  return (
    <div className="visual-player-container">
      {/* Top Navigation Bar */}
      <div className="visual-player-topbar">
        <div className="player-title-wrap">
          <button className="btn btn-quiet" onClick={onBack} title="Back to Visual Learning Studio">
            <ArrowLeft size={16} /> Back to Studio
          </button>
          <div className="player-title-group">
            <span className="eyebrow">
              {experience.subject.toUpperCase()} · {experience.category.toUpperCase()} · {experience.gradeRange}
            </span>
            <h2>{experience.title}</h2>
          </div>
        </div>

        <div className="player-topbar-actions">
          {claimedReward && (
            <span className="priority-badge priority-strong" style={{ display: 'flex', alignItems: 'center', gap: 5 }}>
              <CheckCircle2 size={13} /> Completed (+15 XP)
            </span>
          )}

          <button
            className={`btn ${isBookmarked ? 'btn-soft' : 'btn-quiet'}`}
            onClick={() => onToggleBookmark(experience.id)}
            title={isBookmarked ? 'Remove from saved' : 'Save to bookmarks'}
          >
            {isBookmarked ? <BookmarkCheck size={16} className="text-green" /> : <Bookmark size={16} />}
            {isBookmarked ? 'Saved' : 'Save'}
          </button>

          <button className="btn btn-quiet" onClick={handleReset} title="Reset Model">
            <RefreshCw size={15} /> Reset
          </button>
        </div>
      </div>

      {/* Main Experience Layout (Side-by-side on desktop, stacked on mobile) */}
      <div className="visual-player-body">
        {/* Visual Stage Column */}
        <div className="player-canvas-area panel">
          {renderCanvas()}
        </div>

        {/* Interactive Controls & Explanations Column */}
        <aside className="player-sidebar">
          {/* Mode Switcher */}
          <div className="panel player-mode-panel">
            <div className="segmented">
              <button
                className={mode === 'guided' ? 'chosen' : ''}
                onClick={() => setMode('guided')}
              >
                Guided Tour ({steps.length} Steps)
              </button>
              <button
                className={mode === 'explore' ? 'chosen' : ''}
                onClick={() => setMode('explore')}
              >
                Free Exploration
              </button>
            </div>
          </div>

          {/* GUIDED MODE PANEL */}
          {mode === 'guided' && currentStep && (
            <div className="panel player-guide-panel">
              <div className="guide-header">
                <span className="eyebrow">STEP {currentStep.stepNumber} OF {steps.length}</span>
                <h3>{currentStep.title}</h3>
              </div>

              <div className="progress-track slim">
                <span style={{ width: `${((currentStepIdx + 1) / steps.length) * 100}%` }} />
              </div>

              <p className="guide-description">{currentStep.description}</p>
              <div className="guide-explanation-box">
                <p>{currentStep.explanation}</p>
                {currentStep.visualCue && (
                  <small className="guide-visual-cue">✦ {currentStep.visualCue}</small>
                )}
              </div>

              {/* Stepper Buttons */}
              <div className="guide-nav-buttons">
                <button
                  className="btn btn-soft"
                  disabled={currentStepIdx === 0}
                  onClick={() => setCurrentStepIdx(i => Math.max(0, i - 1))}
                >
                  <ArrowLeft size={15} /> Previous
                </button>

                {currentStepIdx < steps.length - 1 ? (
                  <button
                    className="btn btn-primary"
                    onClick={() => setCurrentStepIdx(i => Math.min(steps.length - 1, i + 1))}
                  >
                    Next Step <ArrowRight size={15} />
                  </button>
                ) : (
                  <button
                    className={`btn ${claimedReward ? 'btn-soft' : 'btn-primary'}`}
                    onClick={handleFinishGuided}
                  >
                    <Trophy size={15} /> {claimedReward ? 'Experience Completed!' : 'Complete (+15 XP)'}
                  </button>
                )}
              </div>
            </div>
          )}

          {/* EXPLORE MODE / COMPONENT INSPECTOR */}
          {mode === 'explore' && selectedComp && (
            <div className="panel player-inspector-panel">
              <div className="inspector-head">
                <span className="eyebrow">COMPONENT INSPECTOR</span>
                <h3>{selectedComp.name}</h3>
                <span className="component-role-tag">{selectedComp.role}</span>
              </div>

              <p className="inspector-desc">{selectedComp.description}</p>

              {selectedComp.fact && (
                <div className="inspector-fact-box">
                  <Lightbulb size={16} className="text-yellow" />
                  <div>
                    <strong>Key Fact:</strong>
                    <p>{selectedComp.fact}</p>
                  </div>
                </div>
              )}

              {selectedComp.scientificDetail && (
                <div className="inspector-science-box">
                  <strong>Scientific Detail:</strong>
                  <p>{selectedComp.scientificDetail}</p>
                </div>
              )}

              {/* Quick Component Selector list */}
              <div className="component-quick-list">
                <span className="field-label">CLICK ANY PART TO INSPECT:</span>
                <div className="component-chips-wrap">
                  {components.map(c => (
                    <button
                      key={c.id}
                      className={`component-chip ${selectedComp.id === c.id ? 'active' : ''}`}
                      onClick={() => setSelectedComponentId(c.id)}
                    >
                      {c.name}
                    </button>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* Key Principle / Formula Card */}
          {(experience.formulaOrRule || aiData?.formulaOrRule) && (
            <div className="panel player-formula-card">
              <div className="formula-icon"><Sparkles size={16} /></div>
              <div>
                <strong>Principle & Formula</strong>
                <p>{experience.formulaOrRule || aiData?.formulaOrRule}</p>
              </div>
            </div>
          )}

          {/* Fun Fact Card */}
          {(experience.funFact || aiData?.funFact) && (
            <div className="panel player-fact-card">
              <div className="fact-icon"><Lightbulb size={16} /></div>
              <div>
                <strong>Did you know?</strong>
                <p>{experience.funFact || aiData?.funFact}</p>
              </div>
            </div>
          )}

          {/* Related Concepts */}
          {experience.relatedConcepts && experience.relatedConcepts.length > 0 && onNavigateTopic && (
            <div className="panel player-related-card">
              <span className="field-label">CONTINUE EXPLORING</span>
              <div className="related-links-list">
                {experience.relatedConcepts.map(rc => (
                  <button
                    key={rc.topic}
                    className="related-concept-item"
                    onClick={() => onNavigateTopic(rc.topic, rc.subject)}
                  >
                    <span>{rc.title}</span>
                    <ArrowRight size={13} />
                  </button>
                ))}
              </div>
            </div>
          )}
        </aside>
      </div>
    </div>
  );
}
