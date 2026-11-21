import type { TeacherDashboardData } from './types';

const now = new Date();
const atDay = (offset: number, hour = 15) => {
  const date = new Date(now.getFullYear(), now.getMonth(), now.getDate() + offset, hour, 0, 0);
  return date.toISOString();
};
const day = (offset: number) => atDay(offset).slice(0, 10);
const stamp = (offset: number, hour = 15) => atDay(offset, hour);

export function createDemoData(): TeacherDashboardData {
  const classes = [
    { id: 'class-10-math', name: 'Class 10 Mathematics', grade: 'Class 10', board: 'CBSE' as const, subject: 'Mathematics', section: 'A', description: 'Algebra, geometry and exam preparation.', academicYear: '2026–27', joinCode: 'MATH10A', studentIds: ['stu-asha', 'stu-rohan', 'stu-meera'], createdAt: stamp(-65) },
    { id: 'class-9-science', name: 'Class 9 Science', grade: 'Class 9', board: 'CBSE' as const, subject: 'Science', section: 'B', description: 'Foundations in physics, chemistry and biology.', academicYear: '2026–27', joinCode: 'SCI9B26', studentIds: ['stu-isha', 'stu-arjun'], createdAt: stamp(-48) },
  ];
  return {
    version: 1,
    teacher: { id: 'demo-teacher', name: 'Avery Sharma', email: 'avery.sharma@example.edu', demo: true },
    classrooms: classes,
    students: [
      { id: 'stu-asha', name: 'Asha Mehta', studentId: '10A-014', email: 'asha.demo@example.edu', classroomIds: ['class-10-math'], lastActivity: stamp(-1, 18), demo: true },
      { id: 'stu-rohan', name: 'Rohan Iyer', studentId: '10A-021', email: 'rohan.demo@example.edu', classroomIds: ['class-10-math'], lastActivity: stamp(-2, 16), demo: true },
      { id: 'stu-meera', name: 'Meera Das', studentId: '10A-008', email: 'meera.demo@example.edu', classroomIds: ['class-10-math'], lastActivity: stamp(-3, 11), demo: true },
      { id: 'stu-isha', name: 'Isha Kapoor', studentId: '09B-017', email: 'isha.demo@example.edu', classroomIds: ['class-9-science'], lastActivity: stamp(-1, 14), demo: true },
      { id: 'stu-arjun', name: 'Arjun Nair', studentId: '09B-005', email: 'arjun.demo@example.edu', classroomIds: ['class-9-science'], lastActivity: stamp(-4, 13), demo: true },
    ],
    assignments: [
      { id: 'asgn-quadratics', title: 'Quadratic Equations Practice', description: 'Solve the set and show each step clearly.', classroomId: 'class-10-math', subject: 'Mathematics', grade: 'Class 10', topic: 'Quadratic equations', type: 'Homework', maxMarks: 20, dueAt: stamp(3, 23), status: 'published', attachments: [], resourceIds: ['resource-algebra'], teacherNotes: 'Review factorisation before assigning.', createdAt: stamp(-3) },
      { id: 'asgn-motion', title: 'Motion: Graph Interpretation', description: 'Answer the short and long response questions.', classroomId: 'class-9-science', subject: 'Science', grade: 'Class 9', topic: 'Motion', type: 'Worksheet', maxMarks: 15, dueAt: stamp(-2, 23), status: 'published', attachments: [], resourceIds: [], teacherNotes: '', createdAt: stamp(-8) },
      { id: 'asgn-geometry-draft', title: 'Triangles Revision Project', description: 'Prepare a one-page theorem summary.', classroomId: 'class-10-math', subject: 'Mathematics', grade: 'Class 10', topic: 'Triangles', type: 'Project', maxMarks: 25, dueAt: stamp(10), status: 'draft', attachments: [], resourceIds: [], teacherNotes: '', createdAt: stamp(-1) },
    ],
    dpps: [
      { id: 'dpps-polynomials', title: 'Daily Practice: Polynomials', classroomId: 'class-10-math', grade: 'Class 10', subject: 'Mathematics', topic: 'Polynomials', instructions: 'Attempt every question. Show working for full credit.', publicationDate: day(-1), dueAt: stamp(1, 20), status: 'published', createdAt: stamp(-2), questions: [
        { id: 'q-poly-1', type: 'multiple-choice', text: 'What is the degree of 4x³ + 2x − 1?', marks: 1, options: ['1', '2', '3', '4'], correctAnswer: '3', explanation: 'The highest exponent is 3.' },
        { id: 'q-poly-2', type: 'short-answer', text: 'Find the zero of p(x) = x − 5.', marks: 2, options: [], correctAnswer: '5', explanation: 'Set x − 5 to zero.' },
        { id: 'q-poly-3', type: 'long-answer', text: 'Factorise x² + 7x + 12 and verify your answer.', marks: 4, options: [], correctAnswer: '(x + 3)(x + 4)', explanation: 'Find two factors of 12 with sum 7.' },
      ] },
      { id: 'dpps-science-draft', title: 'Quick Practice: Force and Laws', classroomId: 'class-9-science', grade: 'Class 9', subject: 'Science', topic: 'Force and Laws of Motion', instructions: 'Read each question carefully.', publicationDate: day(2), dueAt: stamp(4), status: 'draft', createdAt: stamp(-1), questions: [
        { id: 'q-force-1', type: 'short-answer', text: 'State Newton’s first law of motion.', marks: 2, options: [], correctAnswer: '', explanation: '' },
      ] },
    ],
    submissions: [
      { id: 'sub-1', studentId: 'stu-asha', classroomId: 'class-10-math', workId: 'asgn-quadratics', workKind: 'assignment', status: 'reviewed', submittedAt: stamp(-1, 16), answers: [{ questionId: 'response', response: 'Completed all 5 problems with working shown.' }], review: { marks: 18, feedback: 'Clear working. Recheck the final sign in question 4.', reviewedAt: stamp(-1, 17) }, demo: true },
      { id: 'sub-2', studentId: 'stu-rohan', classroomId: 'class-10-math', workId: 'asgn-quadratics', workKind: 'assignment', status: 'under-review', submittedAt: stamp(-1, 19), answers: [{ questionId: 'response', response: 'Solutions attached in the answer area.' }], demo: true },
      { id: 'sub-3', studentId: 'stu-meera', classroomId: 'class-10-math', workId: 'asgn-quadratics', workKind: 'assignment', status: 'not-submitted', answers: [], demo: true },
      { id: 'sub-4', studentId: 'stu-isha', classroomId: 'class-9-science', workId: 'asgn-motion', workKind: 'assignment', status: 'late', submittedAt: stamp(-1, 9), answers: [{ questionId: 'response', response: 'The graph has a constant slope after 4 seconds.' }], demo: true },
      { id: 'sub-5', studentId: 'stu-arjun', classroomId: 'class-9-science', workId: 'asgn-motion', workKind: 'assignment', status: 'reviewed', submittedAt: stamp(-4, 15), answers: [{ questionId: 'response', response: 'Distance-time graph is a straight line for constant speed.' }], review: { marks: 12, feedback: 'Good interpretation; include units in the final answer.', reviewedAt: stamp(-3, 12) }, demo: true },
      { id: 'sub-6', studentId: 'stu-asha', classroomId: 'class-10-math', workId: 'dpps-polynomials', workKind: 'dpps', status: 'submitted', submittedAt: stamp(0, 9), answers: [{ questionId: 'q-poly-1', response: '3' }, { questionId: 'q-poly-2', response: '5' }, { questionId: 'q-poly-3', response: '(x+3)(x+4)' }], demo: true },
      { id: 'sub-7', studentId: 'stu-rohan', classroomId: 'class-10-math', workId: 'dpps-polynomials', workKind: 'dpps', status: 'not-submitted', answers: [], demo: true },
    ],
    resources: [
      { id: 'resource-algebra', title: 'Quadratic equation reference', description: 'A reference page for quadratic equations and their roots.', classroomId: 'class-10-math', subject: 'Mathematics', topic: 'Algebra', type: 'Website', url: 'https://en.wikipedia.org/wiki/Quadratic_equation', createdAt: stamp(-5) },
      { id: 'resource-motion-video', title: 'Kinematics overview', description: 'A reference for motion concepts and graph interpretation.', classroomId: 'class-9-science', subject: 'Science', topic: 'Motion', type: 'Website', url: 'https://en.wikipedia.org/wiki/Kinematics', createdAt: stamp(-4) },
    ],
    announcements: [
      { id: 'announce-math', classroomId: 'class-10-math', title: 'Practice session this Friday', message: 'Bring your questions on quadratic equations. We will solve a few together.', createdAt: stamp(-1, 10) },
      { id: 'announce-science', classroomId: 'class-9-science', title: 'Lab notebooks', message: 'Please bring your lab notebooks to the next science class.', createdAt: stamp(-2, 10) },
    ],
    demoMode: true,
  };
}
