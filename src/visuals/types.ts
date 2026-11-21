export type VisualCategory =
  | 'Biology'
  | 'Physics'
  | 'Chemistry'
  | 'Mathematics'
  | 'Astronomy'
  | 'Geography'
  | 'General Science';

export type VisualBadge =
  | 'Interactive SVG'
  | '3D Simulation'
  | 'Guided Diagram'
  | 'Animated Model';

export interface InteractiveComponent {
  id: string;
  name: string;
  role: string;
  description: string;
  fact?: string;
  scientificDetail?: string;
  color?: string;
}

export interface GuidedStep {
  stepNumber: number;
  title: string;
  description: string;
  explanation: string;
  highlightComponentId?: string;
  activeComponentId?: string;
  visualCue?: string;
  stateOverrides?: Record<string, any>;
}

export interface RelatedConcept {
  title: string;
  topic: string;
  subject?: string;
  type?: 'learn' | 'practice' | 'visual';
}

export interface VisualizationExperience {
  id: string;
  title: string;
  subject: string;
  category: VisualCategory;
  gradeRange: string;
  grades: string[];
  description: string;
  badge: VisualBadge;
  has3D?: boolean;
  icon?: string;
  gradient?: string;
  defaultMode?: 'guided' | 'explore';
  components: InteractiveComponent[];
  steps: GuidedStep[];
  relatedConcepts: RelatedConcept[];
  funFact?: string;
  formulaOrRule?: string;
  disclaimer?: string;
}

export interface InteractiveParameter {
  id: string;
  label: string;
  min: number;
  max: number;
  defaultValue: number;
  unit: string;
  effectDescription: string;
}

export interface AIVisualizationData {
  title: string;
  subject: string;
  topic: string;
  description: string;
  category: VisualCategory;
  visualizationType: 'process-pipeline' | 'system-model' | 'cycle-model' | 'interactive-diagram';
  components: InteractiveComponent[];
  steps: GuidedStep[];
  interactiveParameters?: InteractiveParameter[];
  keyTakeaway: string;
  formulaOrRule?: string;
  funFact?: string;
  demo?: boolean;
}

export interface VisualCompletedRecord {
  id: string;
  completedAt: string;
}
