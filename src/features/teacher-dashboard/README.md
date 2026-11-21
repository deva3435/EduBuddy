# EduBuddy Teacher Dashboard (local MVP)

This feature is self-contained and is mounted by EduBuddy for authenticated local teacher accounts. It has its own navigation, data state, styles and persistence namespace.

## Standalone usage

```tsx
import { TeacherDashboard } from './features/teacher-dashboard';

<TeacherDashboard
  theme="light"
  identity={{ fullName: 'Teacher Name', email: 'teacher@example.edu', schoolName: 'Example School' }}
  onLogout={() => signOut()}
/>
```

`theme` accepts `light`, `dark`, or `system` and defaults to `system`. Optional `identity` and `onLogout` props let a host display the authenticated teacher and sign out. The CSS is imported by the feature component and scoped below `.td-root`.

## Data and persistence

`types.ts` defines the teacher, classroom, student, assignment, DPPS, question, submission, review, resource, announcement and local file metadata models.

`useTeacherDashboard` owns CRUD operations and `storage.ts` reads/writes only `edubuddy_teacher_dashboard_v1`. The stored envelope is `{ version: 1, teacher, classrooms, students, assignments, dpps, submissions, resources, announcements, demoMode }`. A first visit initializes a clearly labeled fictional dataset. “Reset demo data” only resets this feature's key. Malformed or incompatible data produces a warning and a fresh demo workspace.

Uploaded file contents are never put in localStorage. The 10 MB limit is enforced in the editor; file metadata persists, while the actual file object URL is available only for the current browser session. URL resources are opened as external links. Teacher identity is supplied by the host and is not written into the dashboard's demo dataset. The feature still has no shared storage or cross-device join functionality; multiple local teacher accounts on one browser use the same local teacher workspace.

## Feature sections

- Overview: counts, submission completion, deadlines, classroom performance, score trend and submission distribution, all derived from stored records.
- Classrooms: create/edit/delete, local join codes, roster search and manual local student enrollment.
- Assignments: create/edit/draft/publish/duplicate/delete, filtering, attachment metadata and resource linking.
- DPPS: editable/reorderable MCQ, short-answer and long-answer questions, mark totals, draft/publish and worksheet preview.
- Submissions: seeded demo work, status filtering and local grading/feedback.
- Students: roster metrics, assignment/DPPS history and feedback.
- Resources: URL/file metadata management and class announcements.

## Future student-side contract

The local records are not an enrollment or delivery system. A future shared backend should expose authenticated interfaces analogous to:

```ts
interface StudentClassroomService {
  joinClassroom(joinCode: string): Promise<ClassroomSummary>;
  listClassrooms(): Promise<ClassroomSummary[]>;
  listAssignments(classroomId: string): Promise<StudentAssignment[]>;
  listDpps(classroomId: string): Promise<StudentDpps[]>;
  listResources(classroomId: string): Promise<SharedResource[]>;
  listAnnouncements(classroomId: string): Promise<ClassAnnouncement[]>;
  submitWork(workId: string, answers: SubmissionAnswer[], files?: File[]): Promise<SubmissionReceipt>;
  listGrades(classroomId: string): Promise<GradeAndFeedback[]>;
}
```

The student UI would use server-issued user/classroom identities, enforce classroom membership and deadlines on the server, and fetch uploaded files from real object storage. The current demo join codes, submissions, grades, announcements and resource metadata are local browser records only and must not be interpreted as connected to student accounts. Do not copy demo IDs into a production database.
