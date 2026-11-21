import type { Account, AccountProfileUpdate, AuthSnapshot, SignUpInput, StoredAccount } from './types';
import { isStudentBoard, readAuthData, toPublicAccount, writeAuthData } from './storage';

const encoder = new TextEncoder();
const passwordIterations = 310_000;

function getCrypto(): Crypto {
  if (!globalThis.crypto?.subtle) {
    throw new Error('Secure password hashing is unavailable in this browser. Use a current browser over HTTPS or localhost.');
  }
  return globalThis.crypto;
}

function toBase64(bytes: Uint8Array): string {
  let binary = '';
  bytes.forEach(byte => { binary += String.fromCharCode(byte); });
  return btoa(binary);
}

function fromBase64(value: string): Uint8Array {
  return Uint8Array.from(atob(value), character => character.charCodeAt(0));
}

async function hashPassword(password: string, salt: Uint8Array): Promise<Uint8Array> {
  const cryptoApi = getCrypto();
  const key = await cryptoApi.subtle.importKey('raw', encoder.encode(password), 'PBKDF2', false, ['deriveBits']);
  const bits = await cryptoApi.subtle.deriveBits({ name: 'PBKDF2', hash: 'SHA-256', salt, iterations: passwordIterations }, key, 256);
  return new Uint8Array(bits);
}

function createId(): string {
  const bytes = getCrypto().getRandomValues(new Uint8Array(16));
  return Array.from(bytes, byte => byte.toString(16).padStart(2, '0')).join('');
}

function validateStudentProfile(profile: SignUpInput['studentProfile']): void {
  if (!profile || !/^Class (?:[1-9]|1[0-2])$/.test(profile.grade) || !isStudentBoard(profile.board)) {
    throw new Error('Choose a valid class and board.');
  }
  if (!profile.subjects.length || profile.subjects.some(subject => !subject.trim())) {
    throw new Error('Select at least one preferred subject.');
  }
  if (!profile.preference.trim()) throw new Error('Choose a learning preference.');
}

export function restoreAuthSnapshot(): AuthSnapshot {
  const data = readAuthData();
  const active = data.activeAccountId
    ? data.accounts.find(account => account.id === data.activeAccountId)
    : undefined;
  return {
    account: active ? toPublicAccount(active) : null,
    accountCount: data.accounts.length,
    loadError: null,
  };
}

export async function registerAccount(input: SignUpInput): Promise<Account> {
  const fullName = input.fullName.trim();
  const email = input.email.trim().toLowerCase();
  const schoolName = input.schoolName.trim();
  if (!fullName || !schoolName) throw new Error('Enter your full name and school name.');
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) throw new Error('Enter a valid email address.');
  if (input.password.length < 8) throw new Error('Password must be at least 8 characters.');
  if (input.role !== 'student' && input.role !== 'teacher') throw new Error('Choose a valid account role.');
  if (input.role === 'student') validateStudentProfile(input.studentProfile);
  if (input.role === 'teacher' && !input.teacherProfile) throw new Error('Teacher profile details are missing.');

  const data = readAuthData();
  if (data.accounts.some(account => account.email.toLowerCase() === email)) {
    throw new Error('An account already exists for this email. Sign in instead.');
  }

  const salt = getCrypto().getRandomValues(new Uint8Array(16));
  const passwordHash = await hashPassword(input.password, salt);
  const account: StoredAccount = {
    id: createId(),
    fullName,
    email,
    role: input.role,
    schoolName,
    createdAt: new Date().toISOString(),
    ...(input.role === 'student' ? {
      studentProfile: {
        ...input.studentProfile!,
        subjects: input.studentProfile!.subjects.map(subject => subject.trim()).filter(Boolean),
      },
    } : {
      teacherProfile: {
        subjects: (input.teacherProfile?.subjects || []).map(subject => subject.trim()).filter(Boolean),
        classes: (input.teacherProfile?.classes || []).map(item => item.trim()).filter(Boolean),
      },
    }),
    passwordSalt: toBase64(salt),
    passwordHash: toBase64(passwordHash),
  };
  writeAuthData({ version: 1, accounts: [...data.accounts, account], activeAccountId: account.id });
  return toPublicAccount(account);
}

function bytesMatch(left: Uint8Array, right: Uint8Array): boolean {
  if (left.length !== right.length) return false;
  let difference = 0;
  for (let index = 0; index < left.length; index += 1) difference |= left[index] ^ right[index];
  return difference === 0;
}

export async function loginAccount(emailInput: string, password: string): Promise<Account> {
  const email = emailInput.trim().toLowerCase();
  if (!email || !password) throw new Error('Enter your email and password.');
  const data = readAuthData();
  const account = data.accounts.find(item => item.email.toLowerCase() === email);
  if (!account) throw new Error('No account was found for this email. Check the address or create an account.');

  let expectedHash: Uint8Array;
  try {
    expectedHash = fromBase64(account.passwordHash);
    const salt = fromBase64(account.passwordSalt);
    if (salt.length !== 16 || expectedHash.length !== 32) throw new Error('Invalid saved credential.');
    const actualHash = await hashPassword(password, salt);
    if (!bytesMatch(actualHash, expectedHash)) throw new Error('Incorrect password.');
  } catch (error) {
    if (error instanceof Error && error.message === 'Incorrect password.') throw error;
    if (error instanceof Error && error.message.startsWith('Secure password hashing')) throw error;
    throw new Error('Saved credentials could not be verified. Account data was left unchanged.');
  }

  writeAuthData({ ...data, activeAccountId: account.id });
  return toPublicAccount(account);
}

export function logoutAccount(): void {
  const data = readAuthData();
  if (data.activeAccountId !== null) writeAuthData({ ...data, activeAccountId: null });
}

export function updateAccountProfile(accountId: string, update: AccountProfileUpdate): Account {
  const data = readAuthData();
  const index = data.accounts.findIndex(account => account.id === accountId);
  if (index < 0) throw new Error('The active account no longer exists. Sign in again.');
  const current = data.accounts[index];
  const fullName = update.fullName.trim();
  const schoolName = update.schoolName.trim();
  if (!fullName || !schoolName) throw new Error('Full name and school name are required.');

  if (current.role === 'student') validateStudentProfile(update.studentProfile);
  if (current.role === 'teacher' && !update.teacherProfile) throw new Error('Teacher profile details are missing.');
  const updated: StoredAccount = {
    ...current,
    fullName,
    schoolName,
    ...(current.role === 'student' ? { studentProfile: update.studentProfile } : { teacherProfile: update.teacherProfile }),
  };
  const accounts = [...data.accounts];
  accounts[index] = updated;
  writeAuthData({ ...data, accounts });
  return toPublicAccount(updated);
}

export type { StoredAccount };
