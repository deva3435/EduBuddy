import { useEffect, useState } from 'react';
import { createDemoData } from '../demoData';
import { loadTeacherData, saveTeacherData } from '../storage';
import type {
  AnnouncementDraft,
  AssignmentDraft,
  ClassroomDraft,
  DPPSDraft,
  ResourceDraft,
  StudentDraft,
  Submission,
  TeacherDashboardData,
} from '../types';

const id = (prefix: string) => `${prefix}-${Date.now().toString(36)}-${Math.random().toString(36).slice(2, 8)}`;
const joinCode = (used: Set<string>) => {
  const alphabet = 'ABCDEFGHJKLMNPQRSTUVWXYZ23456789';
  let code = '';
  do {
    code = Array.from({ length: 7 }, () => alphabet[Math.floor(Math.random() * alphabet.length)]).join('');
  } while (used.has(code));
  return code;
};

function seedMissingSubmissions(data: TeacherDashboardData, workId: string, classroomId: string, workKind: 'assignment' | 'dpps'): Submission[] {
  return data.students
    .filter(student => student.classroomIds.includes(classroomId))
    .filter(student => !data.submissions.some(submission => submission.workId === workId && submission.studentId === student.id))
    .map(student => ({
      id: id('submission'),
      studentId: student.id,
      classroomId,
      workId,
      workKind,
      status: 'not-submitted',
      answers: [],
      demo: student.demo,
    }));
}

export function useTeacherDashboard() {
  const [loaded] = useState(() => loadTeacherData());
  const [data, setData] = useState<TeacherDashboardData>(loaded.data);
  const [warning, setWarning] = useState<string | null>(loaded.warning);
  const [storageError, setStorageError] = useState<string | null>(null);

  useEffect(() => {
    const error = saveTeacherData(data);
    if (error) setStorageError(error);
    else setStorageError(null);
  }, [data]);

  const createClassroom = (draft: ClassroomDraft) => setData(current => {
    const code = joinCode(new Set(current.classrooms.map(classroom => classroom.joinCode)));
    return { ...current, classrooms: [{ ...draft, id: id('class'), joinCode: code, studentIds: [], createdAt: new Date().toISOString() }, ...current.classrooms] };
  });

  const updateClassroom = (classroomId: string, draft: ClassroomDraft) => setData(current => ({
    ...current,
    classrooms: current.classrooms.map(classroom => classroom.id === classroomId ? { ...classroom, ...draft } : classroom),
  }));

  const regenerateJoinCode = (classroomId: string) => setData(current => {
    const used = new Set(current.classrooms.filter(classroom => classroom.id !== classroomId).map(classroom => classroom.joinCode));
    return { ...current, classrooms: current.classrooms.map(classroom => classroom.id === classroomId ? { ...classroom, joinCode: joinCode(used) } : classroom) };
  });

  const deleteClassroom = (classroomId: string) => setData(current => {
    const students = current.students.map(student => ({ ...student, classroomIds: student.classroomIds.filter(idValue => idValue !== classroomId) }));
    const studentIds = new Set(students.filter(student => student.classroomIds.length).map(student => student.id));
    const assignments = current.assignments.filter(item => item.classroomId !== classroomId);
    const dpps = current.dpps.filter(item => item.classroomId !== classroomId);
    const workIds = new Set([...assignments.map(item => item.id), ...dpps.map(item => item.id)]);
    return {
      ...current,
      classrooms: current.classrooms.filter(classroom => classroom.id !== classroomId),
      students: students.filter(student => student.classroomIds.length),
      assignments,
      dpps,
      submissions: current.submissions.filter(submission => submission.classroomId !== classroomId && studentIds.has(submission.studentId) && workIds.has(submission.workId)),
      resources: current.resources.filter(resource => resource.classroomId !== classroomId),
      announcements: current.announcements.filter(item => item.classroomId !== classroomId),
    };
  });

  const addStudent = (classroomId: string, draft: StudentDraft) => setData(current => {
    if (!current.classrooms.some(classroom => classroom.id === classroomId)) return current;
    const student = { ...draft, id: id('student'), classroomIds: [classroomId], demo: false };
    return {
      ...current,
      students: [student, ...current.students],
      classrooms: current.classrooms.map(classroom => classroom.id === classroomId ? { ...classroom, studentIds: [...classroom.studentIds, student.id] } : classroom),
    };
  });

  const removeStudent = (classroomId: string, studentId: string) => setData(current => {
    const students = current.students.map(student => ({ ...student, classroomIds: student.classroomIds.filter(idValue => idValue !== classroomId) })).filter(student => student.classroomIds.length);
    return {
      ...current,
      students,
      classrooms: current.classrooms.map(classroom => classroom.id === classroomId ? { ...classroom, studentIds: classroom.studentIds.filter(idValue => idValue !== studentId) } : classroom),
      submissions: current.submissions.filter(submission => submission.studentId !== studentId || submission.classroomId !== classroomId),
    };
  });

  const addAssignment = (draft: AssignmentDraft) => setData(current => {
    const assignment = { ...draft, id: id('assignment'), createdAt: new Date().toISOString() };
    const next = { ...current, assignments: [assignment, ...current.assignments] };
    return draft.status === 'published'
      ? { ...next, submissions: [...seedMissingSubmissions(next, assignment.id, assignment.classroomId, 'assignment'), ...next.submissions] }
      : next;
  });

  const updateAssignment = (assignmentId: string, draft: AssignmentDraft) => setData(current => {
    const previous = current.assignments.find(item => item.id === assignmentId);
    const assignments = current.assignments.map(item => item.id === assignmentId ? { ...item, ...draft } : item);
    const submissions = previous?.classroomId === draft.classroomId
      ? current.submissions
      : current.submissions.filter(submission => submission.workId !== assignmentId);
    const next = { ...current, assignments, submissions };
    return draft.status === 'published'
      ? { ...next, submissions: [...seedMissingSubmissions(next, assignmentId, draft.classroomId, 'assignment'), ...next.submissions] }
      : next;
  });

  const publishAssignment = (assignmentId: string) => setData(current => {
    const assignment = current.assignments.find(item => item.id === assignmentId);
    if (!assignment) return current;
    const next = { ...current, assignments: current.assignments.map(item => item.id === assignmentId ? { ...item, status: 'published' as const } : item) };
    return { ...next, submissions: [...seedMissingSubmissions(next, assignmentId, assignment.classroomId, 'assignment'), ...next.submissions] };
  });

  const duplicateAssignment = (assignmentId: string) => setData(current => {
    const source = current.assignments.find(item => item.id === assignmentId);
    if (!source) return current;
    return { ...current, assignments: [{ ...source, id: id('assignment'), title: `${source.title} (copy)`, status: 'draft', createdAt: new Date().toISOString() }, ...current.assignments] };
  });

  const deleteAssignment = (assignmentId: string) => setData(current => ({
    ...current,
    assignments: current.assignments.filter(item => item.id !== assignmentId),
    submissions: current.submissions.filter(item => item.workId !== assignmentId),
  }));

  const addDpps = (draft: DPPSDraft) => setData(current => {
    const dpps = { ...draft, id: id('dpps'), createdAt: new Date().toISOString() };
    const next = { ...current, dpps: [dpps, ...current.dpps] };
    return draft.status === 'published'
      ? { ...next, submissions: [...seedMissingSubmissions(next, dpps.id, dpps.classroomId, 'dpps'), ...next.submissions] }
      : next;
  });

  const updateDpps = (dppsId: string, draft: DPPSDraft) => setData(current => {
    const previous = current.dpps.find(item => item.id === dppsId);
    const dpps = current.dpps.map(item => item.id === dppsId ? { ...item, ...draft } : item);
    const submissions = previous?.classroomId === draft.classroomId
      ? current.submissions
      : current.submissions.filter(submission => submission.workId !== dppsId);
    const next = { ...current, dpps, submissions };
    return draft.status === 'published'
      ? { ...next, submissions: [...seedMissingSubmissions(next, dppsId, draft.classroomId, 'dpps'), ...next.submissions] }
      : next;
  });

  const publishDpps = (dppsId: string) => setData(current => {
    const sheet = current.dpps.find(item => item.id === dppsId);
    if (!sheet) return current;
    const next = { ...current, dpps: current.dpps.map(item => item.id === dppsId ? { ...item, status: 'published' as const } : item) };
    return { ...next, submissions: [...seedMissingSubmissions(next, dppsId, sheet.classroomId, 'dpps'), ...next.submissions] };
  });

  const duplicateDpps = (dppsId: string) => setData(current => {
    const source = current.dpps.find(item => item.id === dppsId);
    if (!source) return current;
    const copy = { ...source, id: id('dpps'), title: `${source.title} (copy)`, status: 'draft' as const, createdAt: new Date().toISOString(), questions: source.questions.map(question => ({ ...question, id: id('question') })) };
    return { ...current, dpps: [copy, ...current.dpps] };
  });

  const deleteDpps = (dppsId: string) => setData(current => ({
    ...current,
    dpps: current.dpps.filter(item => item.id !== dppsId),
    submissions: current.submissions.filter(item => item.workId !== dppsId),
  }));

  const reviewSubmission = (submissionId: string, marks: number, feedback: string) => setData(current => ({
    ...current,
    submissions: current.submissions.map(submission => submission.id === submissionId ? {
      ...submission,
      status: 'reviewed',
      review: { marks, feedback: feedback.trim(), reviewedAt: new Date().toISOString() },
    } : submission),
  }));

  const addResource = (draft: ResourceDraft) => setData(current => ({
    ...current,
    resources: [{ ...draft, id: id('resource'), createdAt: new Date().toISOString() }, ...current.resources],
  }));
  const updateResource = (resourceId: string, draft: ResourceDraft) => setData(current => ({
    ...current,
    resources: current.resources.map(item => item.id === resourceId ? { ...item, ...draft } : item),
  }));
  const deleteResource = (resourceId: string) => setData(current => ({
    ...current,
    resources: current.resources.filter(item => item.id !== resourceId),
    assignments: current.assignments.map(item => ({ ...item, resourceIds: item.resourceIds.filter(idValue => idValue !== resourceId) })),
  }));

  const addAnnouncement = (draft: AnnouncementDraft) => setData(current => ({
    ...current,
    announcements: [{ ...draft, id: id('announcement'), createdAt: new Date().toISOString() }, ...current.announcements],
  }));
  const updateAnnouncement = (announcementId: string, draft: AnnouncementDraft) => setData(current => ({
    ...current,
    announcements: current.announcements.map(item => item.id === announcementId ? { ...item, ...draft } : item),
  }));
  const deleteAnnouncement = (announcementId: string) => setData(current => ({
    ...current,
    announcements: current.announcements.filter(item => item.id !== announcementId),
  }));

  const resetDemo = () => {
    setData(createDemoData());
    setWarning(null);
    setStorageError(null);
  };

  return {
    data,
    warning,
    storageError,
    dismissWarning: () => setWarning(null),
    dismissStorageError: () => setStorageError(null),
    setData,
    createClassroom,
    updateClassroom,
    regenerateJoinCode,
    deleteClassroom,
    addStudent,
    removeStudent,
    addAssignment,
    updateAssignment,
    publishAssignment,
    duplicateAssignment,
    deleteAssignment,
    addDpps,
    updateDpps,
    publishDpps,
    duplicateDpps,
    deleteDpps,
    reviewSubmission,
    addResource,
    updateResource,
    deleteResource,
    addAnnouncement,
    updateAnnouncement,
    deleteAnnouncement,
    resetDemo,
  };
}
