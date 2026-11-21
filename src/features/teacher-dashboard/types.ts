export type Board = 'CBSE' | 'ICSE' | 'State Board' | 'Other';
export type AssignmentType = 'Homework' | 'Classwork' | 'Project' | 'Worksheet' | 'Test' | 'Other';
export type WorkStatus = 'draft' | 'published';
export type SubmissionStatus = 'not-submitted' | 'submitted' | 'late' | 'under-review' | 'reviewed';
export type QuestionType = 'multiple-choice' | 'short-answer' | 'long-answer';
export type ResourceType = 'PDF/document' | 'Video' | 'Website' | 'Image' | 'Other';
export type WorkKind = 'assignment' | 'dpps';

export interface Teacher {
  id: string;
  name: string;
  email: string;
  demo: boolean;
}

export interface Classroom {
  id: string;
  name: string;
  grade: string;
  board: Board;
  subject: string;
  section: string;
  description: string;
  academicYear: string;
  joinCode: string;
  studentIds: string[];
  createdAt: string;
}

export interface Student {
  id: string;
  name: string;
  studentId: string;
  email: string;
  classroomIds: string[];
  lastActivity?: string;
  demo: boolean;
}

export interface LocalFileMetadata {
  name: string;
  type: string;
  size: number;
  sessionOnly: true;
}

export interface Assignment {
  id: string;
  title: string;
  description: string;
  classroomId: string;
  subject: string;
  grade: string;
  topic: string;
  type: AssignmentType;
  maxMarks: number;
  dueAt: string;
  status: WorkStatus;
  attachments: LocalFileMetadata[];
  resourceIds: string[];
  teacherNotes: string;
  createdAt: string;
}

export interface DppsQuestion {
  id: string;
  type: QuestionType;
  text: string;
  marks: number;
  options: string[];
  correctAnswer: string;
  explanation: string;
}

export interface DPPS {
  id: string;
  title: string;
  classroomId: string;
  grade: string;
  subject: string;
  topic: string;
  instructions: string;
  publicationDate: string;
  dueAt: string;
  questions: DppsQuestion[];
  status: WorkStatus;
  createdAt: string;
}

export interface SubmissionAnswer {
  questionId: string;
  response: string;
}

export interface Review {
  marks: number;
  feedback: string;
  reviewedAt: string;
}

export interface Submission {
  id: string;
  studentId: string;
  classroomId: string;
  workId: string;
  workKind: WorkKind;
  status: SubmissionStatus;
  submittedAt?: string;
  answers: SubmissionAnswer[];
  review?: Review;
  demo: boolean;
}

export interface Resource {
  id: string;
  title: string;
  description: string;
  classroomId: string;
  subject: string;
  topic: string;
  type: ResourceType;
  url: string;
  file?: LocalFileMetadata;
  createdAt: string;
}

export interface Announcement {
  id: string;
  classroomId: string;
  title: string;
  message: string;
  createdAt: string;
}

export interface TeacherDashboardData {
  version: 1;
  teacher: Teacher;
  classrooms: Classroom[];
  students: Student[];
  assignments: Assignment[];
  dpps: DPPS[];
  submissions: Submission[];
  resources: Resource[];
  announcements: Announcement[];
  demoMode: boolean;
}

export type ClassroomDraft = Omit<Classroom, 'id' | 'joinCode' | 'studentIds' | 'createdAt'>;
export type StudentDraft = Omit<Student, 'id' | 'demo'>;
export type AssignmentDraft = Omit<Assignment, 'id' | 'createdAt'>;
export type DPPSDraft = Omit<DPPS, 'id' | 'createdAt'>;
export type ResourceDraft = Omit<Resource, 'id' | 'createdAt'>;
export type AnnouncementDraft = Omit<Announcement, 'id' | 'createdAt'>;
