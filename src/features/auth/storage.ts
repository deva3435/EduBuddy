import type { Account, AuthData, StoredAccount, StudentBoard, StudentAccountProfile, TeacherAccountProfile } from './types';

export const AUTH_STORAGE_KEY = 'edubuddy_auth_v1';

const emptyAuthData = (): AuthData => ({ version: 1, activeAccountId: null, accounts: [] });
const boards: StudentBoard[] = ['CBSE', 'ICSE', 'State Board', 'Other / custom'];

function isString(value: unknown): value is string {
  return typeof value === 'string';
}

function isStringArray(value: unknown): value is string[] {
  return Array.isArray(value) && value.every(isString);
}

function isStudentProfile(value: unknown): value is StudentAccountProfile {
  if (!value || typeof value !== 'object') return false;
  const profile = value as Record<string, unknown>;
  return isString(profile.grade)
    && /^Class (?:[1-9]|1[0-2])$/.test(profile.grade)
    && boards.includes(profile.board as StudentBoard)
    && isStringArray(profile.subjects)
    && isString(profile.preference);
}

function isTeacherProfile(value: unknown): value is TeacherAccountProfile {
  if (!value || typeof value !== 'object') return false;
  const profile = value as Record<string, unknown>;
  return isStringArray(profile.subjects) && isStringArray(profile.classes);
}

function isStoredAccount(value: unknown): value is StoredAccount {
  if (!value || typeof value !== 'object') return false;
  const account = value as Record<string, unknown>;
  const roleValid = account.role === 'student' || account.role === 'teacher';
  return isString(account.id)
    && isString(account.fullName)
    && isString(account.email)
    && roleValid
    && isString(account.schoolName)
    && isString(account.createdAt)
    && isString(account.passwordSalt)
    && isString(account.passwordHash)
    && (account.role !== 'student' || isStudentProfile(account.studentProfile))
    && (account.role !== 'teacher' || isTeacherProfile(account.teacherProfile));
}

export function isStudentBoard(value: string): value is StudentBoard {
  return boards.includes(value as StudentBoard);
}

export function readAuthData(): AuthData {
  let raw: string | null;
  try {
    raw = window.localStorage.getItem(AUTH_STORAGE_KEY);
  } catch {
    throw new Error('EduBuddy could not access local account storage. Check your browser storage settings and try again.');
  }
  if (raw === null) return emptyAuthData();

  let parsed: unknown;
  try {
    parsed = JSON.parse(raw);
  } catch {
    throw new Error('Saved account data is malformed. It was left unchanged; contact support before clearing browser data.');
  }

  if (!parsed || typeof parsed !== 'object') {
    throw new Error('Saved account data is invalid. It was left unchanged; contact support before clearing browser data.');
  }
  const data = parsed as Record<string, unknown>;
  const version = data.version;
  const activeAccountId = data.activeAccountId;
  const accounts = data.accounts;
  if (version !== 1 || !Array.isArray(accounts)
    || !accounts.every(isStoredAccount)
    || !(activeAccountId === null || isString(activeAccountId))) {
    throw new Error('Saved account data uses an unsupported format. It was left unchanged; contact support before clearing browser data.');
  }
  if (activeAccountId !== null && !accounts.some(account => account.id === activeAccountId)) {
    throw new Error('The saved login session does not match an account. Account data was left unchanged; log in again after reviewing your saved data.');
  }
  const normalizedEmails = accounts.map(account => account.email.toLowerCase());
  if (new Set(normalizedEmails).size !== normalizedEmails.length) {
    throw new Error('Saved accounts contain duplicate email addresses. Account data was left unchanged.');
  }
  return { version: 1, activeAccountId, accounts };
}

export function writeAuthData(data: AuthData): void {
  try {
    window.localStorage.setItem(AUTH_STORAGE_KEY, JSON.stringify(data));
  } catch {
    throw new Error('EduBuddy could not save account data. Check available browser storage and try again.');
  }
}

export function toPublicAccount(account: StoredAccount): Account {
  const { passwordHash: _passwordHash, passwordSalt: _passwordSalt, ...publicAccount } = account;
  return {
    ...publicAccount,
    studentProfile: account.studentProfile ? { ...account.studentProfile, subjects: [...account.studentProfile.subjects] } : undefined,
    teacherProfile: account.teacherProfile ? { subjects: [...account.teacherProfile.subjects], classes: [...account.teacherProfile.classes] } : undefined,
  };
}
