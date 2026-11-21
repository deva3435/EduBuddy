import { createDemoData } from './demoData';
import type { TeacherDashboardData } from './types';

export const TEACHER_STORAGE_KEY = 'edubuddy_teacher_dashboard_v1';

function isRecord(value: unknown): value is Record<string, unknown> {
  return Boolean(value) && typeof value === 'object' && !Array.isArray(value);
}

export function validateTeacherData(value: unknown): value is TeacherDashboardData {
  if (!isRecord(value) || value.version !== 1 || !isRecord(value.teacher)) return false;
  const collections = ['classrooms', 'students', 'assignments', 'dpps', 'submissions', 'resources', 'announcements'];
  if (!collections.every(key => Array.isArray(value[key]))) return false;
  const classrooms = value.classrooms as unknown[];
  const students = value.students as unknown[];
  const assignments = value.assignments as unknown[];
  const dpps = value.dpps as unknown[];
  const submissions = value.submissions as unknown[];
  const resources = value.resources as unknown[];
  const announcements = value.announcements as unknown[];
  const isStringArray = (items: unknown) => Array.isArray(items) && items.every(item => typeof item === 'string');
  const isFileMetadata = (file: unknown) => isRecord(file)
    && typeof file.name === 'string'
    && typeof file.type === 'string'
    && typeof file.size === 'number'
    && file.sessionOnly === true;
  return typeof value.teacher.id === 'string'
    && typeof value.teacher.name === 'string'
    && typeof value.teacher.email === 'string'
    && typeof value.teacher.demo === 'boolean'
    && typeof value.demoMode === 'boolean'
    && classrooms.every(item => isRecord(item)
      && typeof item.id === 'string' && typeof item.name === 'string' && typeof item.grade === 'string'
      && typeof item.board === 'string' && typeof item.subject === 'string' && typeof item.section === 'string'
      && typeof item.academicYear === 'string' && typeof item.joinCode === 'string' && isStringArray(item.studentIds))
    && students.every(item => isRecord(item) && typeof item.id === 'string' && typeof item.name === 'string'
      && typeof item.studentId === 'string' && typeof item.email === 'string' && isStringArray(item.classroomIds)
      && typeof item.demo === 'boolean')
    && assignments.every(item => isRecord(item) && typeof item.id === 'string' && typeof item.title === 'string'
      && typeof item.classroomId === 'string' && typeof item.dueAt === 'string' && typeof item.maxMarks === 'number'
      && ['draft', 'published'].includes(String(item.status)) && isStringArray(item.resourceIds)
      && Array.isArray(item.attachments) && item.attachments.every(isFileMetadata))
    && dpps.every(item => isRecord(item) && typeof item.id === 'string' && typeof item.title === 'string'
      && typeof item.classroomId === 'string' && typeof item.dueAt === 'string'
      && ['draft', 'published'].includes(String(item.status)) && Array.isArray(item.questions)
      && item.questions.every(question => isRecord(question) && typeof question.id === 'string'
        && typeof question.text === 'string' && typeof question.marks === 'number'
        && Array.isArray(question.options) && question.options.every(option => typeof option === 'string')))
    && submissions.every(item => isRecord(item) && typeof item.id === 'string'
      && typeof item.studentId === 'string' && typeof item.classroomId === 'string' && typeof item.workId === 'string'
      && ['assignment', 'dpps'].includes(String(item.workKind))
      && ['not-submitted', 'submitted', 'late', 'under-review', 'reviewed'].includes(String(item.status))
      && Array.isArray(item.answers) && item.answers.every(answer => isRecord(answer) && typeof answer.questionId === 'string' && typeof answer.response === 'string'))
    && resources.every(item => isRecord(item) && typeof item.id === 'string' && typeof item.title === 'string'
      && typeof item.classroomId === 'string' && typeof item.subject === 'string'
      && (!item.file || isFileMetadata(item.file)))
    && announcements.every(item => isRecord(item) && typeof item.id === 'string'
      && typeof item.title === 'string' && typeof item.classroomId === 'string' && typeof item.message === 'string');
}

function repairReferences(data: TeacherDashboardData): TeacherDashboardData {
  const classroomIds = new Set(data.classrooms.map(classroom => classroom.id));
  const workIds = new Set([...data.assignments.map(item => item.id), ...data.dpps.map(item => item.id)]);
  const validStudents = data.students.filter(student => student.classroomIds.some(id => classroomIds.has(id)));
  const validStudentIds = new Set(validStudents.map(student => student.id));
  return {
    ...data,
    students: validStudents,
    classrooms: data.classrooms.map(classroom => ({
      ...classroom,
      studentIds: classroom.studentIds.filter(id => validStudentIds.has(id)),
    })),
    submissions: data.submissions.filter(submission =>
      validStudentIds.has(submission.studentId)
      && classroomIds.has(submission.classroomId)
      && workIds.has(submission.workId)),
    assignments: data.assignments.map(assignment => ({
      ...assignment,
      resourceIds: assignment.resourceIds.filter(id => data.resources.some(resource => resource.id === id)),
    })),
  };
}

export function loadTeacherData(): { data: TeacherDashboardData; warning: string | null } {
  try {
    const raw = window.localStorage.getItem(TEACHER_STORAGE_KEY);
    if (!raw) return { data: createDemoData(), warning: null };
    const parsed: unknown = JSON.parse(raw);
    if (!validateTeacherData(parsed)) {
      return { data: createDemoData(), warning: 'Saved teacher dashboard data was invalid. A fresh demo workspace was loaded.' };
    }
    return { data: repairReferences(parsed), warning: null };
  } catch {
    return { data: createDemoData(), warning: 'Teacher dashboard data could not be read. A fresh demo workspace was loaded.' };
  }
}

export function saveTeacherData(data: TeacherDashboardData): string | null {
  try {
    window.localStorage.setItem(TEACHER_STORAGE_KEY, JSON.stringify(data));
    return null;
  } catch {
    return 'Changes could not be saved in this browser. Check available local storage.';
  }
}
