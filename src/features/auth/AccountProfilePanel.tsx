import { useEffect, useState, type FormEvent } from 'react';
import { Check, GraduationCap, LogOut, School, ShieldCheck, Users } from 'lucide-react';
import type { Account, AccountProfileUpdate } from './types';
import './auth.css';

export function AccountProfilePanel({
  account,
  onSave,
  onLogout,
}: {
  account: Account;
  onSave: (update: AccountProfileUpdate) => Account;
  onLogout?: () => void;
}) {
  const [fullName, setFullName] = useState(account.fullName);
  const [schoolName, setSchoolName] = useState(account.schoolName);
  const [error, setError] = useState('');
  const [saved, setSaved] = useState(false);

  useEffect(() => {
    setFullName(account.fullName);
    setSchoolName(account.schoolName);
  }, [account.fullName, account.schoolName]);

  const submit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setError('');
    setSaved(false);
    try {
      onSave({
        fullName,
        schoolName,
        ...(account.role === 'student' ? { studentProfile: account.studentProfile } : { teacherProfile: account.teacherProfile }),
      });
      setSaved(true);
    } catch (reason) {
      setError(reason instanceof Error ? reason.message : 'Profile could not be saved.');
    }
  };

  return (
    <section className="auth-profile-panel">
      <div className="auth-profile-heading">
        <span className="auth-profile-icon">{account.role === 'student' ? <GraduationCap size={18} /> : <Users size={18} />}</span>
        <div><span className="auth-kicker">ACCOUNT PROFILE</span><h2>{account.role === 'student' ? 'Student account' : 'Teacher account'}</h2></div>
      </div>
      <div className="auth-profile-facts">
        <div><span>Email</span><strong>{account.email}</strong></div>
        <div><span>Role</span><strong>{account.role === 'student' ? 'Student' : 'Teacher'}</strong></div>
        {account.studentProfile && <div><span>Class and board</span><strong>{account.studentProfile.grade} · {account.studentProfile.board}</strong></div>}
        {account.teacherProfile && <div><span>Teaching profile</span><strong>{[...account.teacherProfile.subjects, ...account.teacherProfile.classes].join(' · ') || 'Not specified'}</strong></div>}
      </div>
      <form className="auth-profile-form" onSubmit={submit}>
        <label className="auth-field"><span>Full name *</span><input required value={fullName} onChange={event => setFullName(event.target.value)} autoComplete="name" /></label>
        <label className="auth-field"><span><School size={14} /> School name *</span><input required value={schoolName} onChange={event => setSchoolName(event.target.value)} autoComplete="organization" /></label>
        {error && <p className="auth-error" role="alert">{error}</p>}
        {saved && <p className="auth-success" role="status"><Check size={14} /> Profile saved.</p>}
        <p className="auth-privacy-note"><ShieldCheck size={14} /> Profile details are stored with this browser account.</p>
        <div className="auth-profile-actions"><button className="btn btn-primary" type="submit">Save account profile</button>{onLogout && <button className="btn btn-quiet" type="button" onClick={onLogout}><LogOut size={14} /> Sign out</button>}</div>
      </form>
    </section>
  );
}
