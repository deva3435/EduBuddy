import { useState, type FormEvent } from 'react';
import { ArrowLeft, ArrowRight, BookOpen, Eye, EyeOff, GraduationCap, Moon, School, ShieldCheck, Sparkles, Sun, Users } from 'lucide-react';
import type { Account, AccountRole, LegacyStudentDefaults, SignUpInput, StudentBoard } from './types';
import './auth.css';

type AuthView = 'welcome' | 'login' | 'signup';

interface AuthScreenProps {
  theme: 'light' | 'dark';
  accountCount: number;
  loadError: string | null;
  legacyStudentDefaults?: LegacyStudentDefaults;
  onToggleTheme: () => void;
  onLogin: (email: string, password: string) => Promise<Account>;
  onSignUp: (input: SignUpInput) => Promise<Account>;
}

const classOptions = Array.from({ length: 12 }, (_, index) => `Class ${index + 1}`);
const boards: StudentBoard[] = ['CBSE', 'ICSE', 'State Board', 'Other / custom'];

function splitList(value: string): string[] {
  return [...new Set(value.split(',').map(item => item.trim()).filter(Boolean))];
}

export function AuthScreen({
  theme,
  accountCount,
  loadError,
  legacyStudentDefaults,
  onToggleTheme,
  onLogin,
  onSignUp,
}: AuthScreenProps) {
  const [view, setView] = useState<AuthView>('welcome');
  const [role, setRole] = useState<AccountRole>('student');
  const [fullName, setFullName] = useState(legacyStudentDefaults?.fullName || '');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [schoolName, setSchoolName] = useState('');
  const [grade, setGrade] = useState(legacyStudentDefaults?.grade || 'Class 10');
  const [board, setBoard] = useState<StudentBoard>(legacyStudentDefaults?.board || 'CBSE');
  const [subjectsTaught, setSubjectsTaught] = useState('');
  const [classesTaught, setClassesTaught] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmation, setShowConfirmation] = useState(false);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState('');

  const changeView = (next: AuthView) => {
    setView(next);
    setError('');
  };

  const submitLogin = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setError('');
    setBusy(true);
    try {
      await onLogin(email, password);
    } catch (reason) {
      setError(reason instanceof Error ? reason.message : 'Sign in failed. Please try again.');
    } finally {
      setBusy(false);
    }
  };

  const submitSignup = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setError('');
    if (password !== confirmPassword) {
      setError('Passwords do not match.');
      return;
    }
    if (password.length < 8) {
      setError('Password must be at least 8 characters.');
      return;
    }
    if (!fullName.trim() || !schoolName.trim()) {
      setError('Full name and school name are required.');
      return;
    }

    const input: SignUpInput = {
      fullName,
      email,
      password,
      schoolName,
      role,
      ...(role === 'student' ? {
        studentProfile: {
          grade,
          board,
          subjects: legacyStudentDefaults?.subjects.length
            ? legacyStudentDefaults.subjects
            : ['Mathematics', 'Science', 'English'],
          preference: legacyStudentDefaults?.preference || 'Step-by-step explanations',
        },
      } : {
        teacherProfile: {
          subjects: splitList(subjectsTaught),
          classes: splitList(classesTaught),
        },
      }),
    };

    setBusy(true);
    try {
      await onSignUp(input);
    } catch (reason) {
      setError(reason instanceof Error ? reason.message : 'Account creation failed. Please try again.');
    } finally {
      setBusy(false);
    }
  };

  return (
    <main className="auth-page" data-theme={theme}>
      <header className="auth-topbar">
        <a className="auth-brand" href="#" onClick={event => { event.preventDefault(); changeView('welcome'); }}>
          <span className="auth-brand-mark"><Sparkles size={18} /></span>
          <span>EduBuddy</span>
        </a>
        <div className="auth-top-actions">
          <span className="auth-local-label"><ShieldCheck size={14} /> Private to this browser</span>
          <button className="auth-theme-button" type="button" onClick={onToggleTheme} aria-label={`Switch to ${theme === 'light' ? 'dark' : 'light'} theme`}>
            {theme === 'light' ? <Moon size={17} /> : <Sun size={17} />}
          </button>
        </div>
      </header>

      <div className={`auth-layout ${view === 'welcome' ? 'auth-layout-welcome' : ''}`}>
        <section className="auth-intro">
          <div className="auth-intro-content">
            <span className="auth-kicker"><span /> LEARN, GROW, ACHIEVE</span>
            <h1>Make every study session <em>count.</em></h1>
            <p>A welcoming space for curious students and the teachers who guide them.</p>
            <div className="auth-benefits">
              <span><BookOpen size={16} /> Personal learning tools</span>
              <span><Users size={16} /> Student and teacher workspaces</span>
              <span><School size={16} /> Made for your school journey</span>
            </div>
          </div>
          <div className="auth-orbit auth-orbit-one" />
          <div className="auth-orbit auth-orbit-two" />
          <div className="auth-book-illustration"><BookOpen size={38} /></div>
          <span className="auth-spark auth-spark-one">✦</span>
          <span className="auth-spark auth-spark-two">✧</span>
        </section>

        <section className="auth-card" aria-live="polite">
          {view === 'welcome' && <>
            <div className="auth-card-icon"><Sparkles size={21} /></div>
            <span className="auth-kicker">WELCOME TO EDUBUDDY</span>
            <h2>Your next great idea starts here.</h2>
            <p className="auth-card-description">Sign in to continue learning, or create an account to set up your student or teacher space.</p>
            {loadError && <p className="auth-error" role="alert">{loadError}</p>}
            <div className="auth-actions">
              <button className="auth-primary-button" type="button" onClick={() => changeView('login')} disabled={Boolean(loadError)}>
                Sign in <ArrowRight size={16} />
              </button>
              <button className="auth-secondary-button" type="button" onClick={() => changeView('signup')} disabled={Boolean(loadError)}>
                Create an account
              </button>
            </div>
            {accountCount > 0 && <p className="auth-account-note">{accountCount} local account{accountCount === 1 ? '' : 's'} available on this browser.</p>}
            <p className="auth-privacy-note"><ShieldCheck size={14} /> Passwords are locally hashed. This is not a server-authenticated account.</p>
          </>}

          {view === 'login' && <>
            <button className="auth-back-button" type="button" onClick={() => changeView('welcome')}><ArrowLeft size={15} /> Back</button>
            <span className="auth-kicker">WELCOME BACK</span>
            <h2>Sign in to your account</h2>
            <p className="auth-card-description">Use the email and password for your EduBuddy account on this browser.</p>
            {error && <p className="auth-error" role="alert">{error}</p>}
            {loadError && <p className="auth-error" role="alert">{loadError}</p>}
            <form className="auth-form" onSubmit={submitLogin}>
              <label className="auth-field"><span>Email address</span><input type="email" autoComplete="email" required value={email} onChange={event => setEmail(event.target.value)} placeholder="you@school.edu" /></label>
              <div className="auth-field"><span>Password</span><span className="auth-password-wrap"><input aria-label="Password" type={showPassword ? 'text' : 'password'} autoComplete="current-password" required value={password} onChange={event => setPassword(event.target.value)} placeholder="Your password" /><button type="button" aria-label={showPassword ? 'Hide password' : 'Show password'} onClick={() => setShowPassword(value => !value)}>{showPassword ? <EyeOff size={17} /> : <Eye size={17} />}</button></span></div>
              <button className="auth-primary-button" type="submit" disabled={busy || Boolean(loadError)}>{busy ? 'Signing in…' : 'Sign in'} {!busy && <ArrowRight size={16} />}</button>
            </form>
            <p className="auth-switch-note">New to EduBuddy? <button type="button" onClick={() => changeView('signup')}>Create an account</button></p>
          </>}

          {view === 'signup' && <>
            <button className="auth-back-button" type="button" onClick={() => changeView('welcome')}><ArrowLeft size={15} /> Back</button>
            <span className="auth-kicker">GET STARTED</span>
            <h2>Create your EduBuddy account</h2>
            <p className="auth-card-description">Choose your role, then add a few details to personalize your workspace.</p>
            {error && <p className="auth-error" role="alert">{error}</p>}
            {loadError && <p className="auth-error" role="alert">{loadError}</p>}
            <form className="auth-form auth-signup-form" onSubmit={submitSignup}>
              <div className="auth-role-picker" role="group" aria-label="Choose account role">
                <button type="button" className={role === 'student' ? 'selected' : ''} aria-pressed={role === 'student'} onClick={() => setRole('student')}><GraduationCap size={18} /><span><strong>Student</strong><small>Learn and track progress</small></span></button>
                <button type="button" className={role === 'teacher' ? 'selected' : ''} aria-pressed={role === 'teacher'} onClick={() => setRole('teacher')}><Users size={18} /><span><strong>Teacher</strong><small>Manage classroom work</small></span></button>
              </div>
              <label className="auth-field"><span>Full name *</span><input autoComplete="name" required value={fullName} onChange={event => setFullName(event.target.value)} placeholder="Your full name" /></label>
              <label className="auth-field"><span>Email address *</span><input type="email" autoComplete="email" required value={email} onChange={event => setEmail(event.target.value)} placeholder="you@school.edu" /></label>
              <label className="auth-field"><span>School name *</span><input autoComplete="organization" required value={schoolName} onChange={event => setSchoolName(event.target.value)} placeholder="Your school" /></label>

              {role === 'student' ? <div className="auth-field-pair">
                <label className="auth-field"><span>Class *</span><select required value={grade} onChange={event => setGrade(event.target.value)}>{classOptions.map(option => <option key={option}>{option}</option>)}</select></label>
                <label className="auth-field"><span>Board *</span><select required value={board} onChange={event => setBoard(event.target.value as StudentBoard)}>{boards.map(option => <option key={option}>{option}</option>)}</select></label>
              </div> : <div className="auth-field-pair">
                <label className="auth-field"><span>Subjects taught <small>Optional</small></span><input value={subjectsTaught} onChange={event => setSubjectsTaught(event.target.value)} placeholder="Math, Science" /></label>
                <label className="auth-field"><span>Classes taught <small>Optional</small></span><input value={classesTaught} onChange={event => setClassesTaught(event.target.value)} placeholder="Class 8, Class 9" /></label>
              </div>}

              <div className="auth-field"><span>Password *</span><span className="auth-password-wrap"><input aria-label="Password" type={showPassword ? 'text' : 'password'} autoComplete="new-password" minLength={8} required value={password} onChange={event => setPassword(event.target.value)} placeholder="At least 8 characters" /><button type="button" aria-label={showPassword ? 'Hide password' : 'Show password'} onClick={() => setShowPassword(value => !value)}>{showPassword ? <EyeOff size={17} /> : <Eye size={17} />}</button></span></div>
              <div className="auth-field"><span>Confirm password *</span><span className="auth-password-wrap"><input aria-label="Confirm password" type={showConfirmation ? 'text' : 'password'} autoComplete="new-password" required value={confirmPassword} onChange={event => setConfirmPassword(event.target.value)} placeholder="Enter your password again" /><button type="button" aria-label={showConfirmation ? 'Hide confirmation password' : 'Show confirmation password'} onClick={() => setShowConfirmation(value => !value)}>{showConfirmation ? <EyeOff size={17} /> : <Eye size={17} />}</button></span></div>
              <button className="auth-primary-button" type="submit" disabled={busy || Boolean(loadError)}>{busy ? 'Creating account…' : 'Create account'} {!busy && <ArrowRight size={16} />}</button>
            </form>
            <p className="auth-switch-note">Already have an account? <button type="button" onClick={() => changeView('login')}>Sign in</button></p>
            <p className="auth-privacy-note"><ShieldCheck size={14} /> Passwords are salted and hashed in this browser; accounts do not sync across devices.</p>
          </>}
        </section>
      </div>
      <footer className="auth-footer">EduBuddy <span>·</span> A local learning workspace</footer>
    </main>
  );
}
