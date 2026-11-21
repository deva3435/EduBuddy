export interface ExamTopic {
  id: string;
  title: string;
  completed: boolean;
}

export interface Exam {
  id: string;
  name: string;
  subject: string;
  date: string;
  time?: string;
  venue?: string;
  description?: string;
  topics: ExamTopic[];
  completed: boolean;
  createdAt: string;
}

export type ExamDraft = Omit<Exam, 'id' | 'topics' | 'completed' | 'createdAt'> & {
  topics: string[];
};

export type ExamUrgency = 'upcoming' | 'prepare' | 'high' | 'urgent' | 'today' | 'completed';

export interface ExamCountdownProps {
  theme?: 'light' | 'dark' | 'system';
  className?: string;
}
