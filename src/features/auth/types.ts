export type AccountRole = 'student' | 'teacher';
export type StudentBoard = 'CBSE' | 'ICSE' | 'State Board' | 'Other / custom';

export interface StudentAccountProfile {
  grade: string;
  board: StudentBoard;
  subjects: string[];
  preference: string;
}

export interface TeacherAccountProfile {
  subjects: string[];
  classes: string[];
}

export interface Account {
  id: string;
  fullName: string;
  email: string;
  role: AccountRole;
  schoolName: string;
  createdAt: string;
  studentProfile?: StudentAccountProfile;
  teacherProfile?: TeacherAccountProfile;
}

export interface StoredAccount extends Account {
  passwordSalt: string;
  passwordHash: string;
}

export interface AuthData {
  version: 1;
  activeAccountId: string | null;
  accounts: StoredAccount[];
}

export interface SignUpInput {
  fullName: string;
  email: string;
  password: string;
  schoolName: string;
  role: AccountRole;
  studentProfile?: StudentAccountProfile;
  teacherProfile?: TeacherAccountProfile;
}

export interface AccountProfileUpdate {
  fullName: string;
  schoolName: string;
  studentProfile?: StudentAccountProfile;
  teacherProfile?: TeacherAccountProfile;
}

export interface AuthSnapshot {
  account: Account | null;
  accountCount: number;
  loadError: string | null;
}

export interface LegacyStudentDefaults {
  fullName: string;
  grade: string;
  board: StudentBoard;
  subjects: string[];
  preference: string;
}
