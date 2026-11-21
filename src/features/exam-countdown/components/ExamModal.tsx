import { useEffect, useState } from 'react';
import { CalendarDays, Clock3, MapPin, Plus, X } from 'lucide-react';
import type { Exam, ExamDraft } from '../types';
import { localDateKey } from './ExamStats';

export function ExamModal({
  exam,
  onClose,
  onSave,
}: {
  exam: Exam | null;
  onClose: () => void;
  onSave: (draft: ExamDraft) => void;
}) {
  const [name, setName] = useState(exam?.name || '');
  const [subject, setSubject] = useState(exam?.subject || '');
  const [date, setDate] = useState(exam?.date || '');
  const [time, setTime] = useState(exam?.time || '');
  const [venue, setVenue] = useState(exam?.venue || '');
  const [description, setDescription] = useState(exam?.description || '');
  const [topicsText, setTopicsText] = useState(exam?.topics.map(topic => topic.title).join('\n') || '');
  const [topicInput, setTopicInput] = useState('');
  const [errors, setErrors] = useState<Record<string, string>>({});

  useEffect(() => {
    const handleKey = (event: KeyboardEvent) => event.key === 'Escape' && onClose();
    document.body.style.overflow = 'hidden';
    window.addEventListener('keydown', handleKey);
    return () => {
      document.body.style.overflow = '';
      window.removeEventListener('keydown', handleKey);
    };
  }, [onClose]);

  const topicsFromText = topicsText.split('\n').map(topic => topic.trim()).filter(Boolean);

  const addTopicFromInput = () => {
    const topic = topicInput.trim();
    if (!topic) return;
    setTopicsText(current => current ? `${current}\n${topic}` : topic);
    setTopicInput('');
  };

  const submit = (event: React.FormEvent) => {
    event.preventDefault();
    const nextErrors: Record<string, string> = {};
    if (!name.trim()) nextErrors.name = 'Enter an exam name.';
    if (!subject.trim()) nextErrors.subject = 'Enter a subject.';
    if (!date) nextErrors.date = 'Choose an exam date.';
    else if (!/^\d{4}-\d{2}-\d{2}$/.test(date)) nextErrors.date = 'Enter a valid exam date.';
    else if (!exam?.completed && date < localDateKey()) nextErrors.date = 'The exam date cannot be in the past.';
    if (time && !/^([01]\d|2[0-3]):[0-5]\d$/.test(time)) nextErrors.time = 'Enter a valid exam time.';
    setErrors(nextErrors);
    if (Object.keys(nextErrors).length) return;
    onSave({
      name,
      subject,
      date,
      time,
      venue,
      description,
      topics: topicsFromText,
    });
  };

  return (
    <div className="ec-modal-overlay" role="presentation" onMouseDown={event => event.target === event.currentTarget && onClose()}>
      <div className="ec-modal" role="dialog" aria-modal="true" aria-labelledby="ec-modal-title">
        <div className="ec-modal-header">
          <div><span className="ec-eyebrow">{exam ? 'EDIT EXAM' : 'NEW EXAM'}</span><h2 id="ec-modal-title">{exam ? 'Edit examination' : 'Add an examination'}</h2></div>
          <button type="button" className="ec-icon-btn" onClick={onClose} aria-label="Close modal"><X size={19} /></button>
        </div>
        <form className="ec-form" onSubmit={submit} noValidate>
          <div className="ec-form-grid">
            <label className="ec-field ec-field-wide">
              <span>Exam name <b>*</b></span>
              <input value={name} onChange={event => setName(event.target.value)} placeholder="e.g. Mathematics Final Examination" aria-invalid={Boolean(errors.name)} />
              {errors.name && <small className="ec-error">{errors.name}</small>}
            </label>
            <label className="ec-field">
              <span>Subject <b>*</b></span>
              <input value={subject} onChange={event => setSubject(event.target.value)} placeholder="e.g. Mathematics" aria-invalid={Boolean(errors.subject)} />
              {errors.subject && <small className="ec-error">{errors.subject}</small>}
            </label>
            <label className="ec-field">
              <span><CalendarDays size={14} /> Exam date <b>*</b></span>
              <input type="date" value={date} min={exam?.completed ? undefined : localDateKey()} onChange={event => setDate(event.target.value)} aria-invalid={Boolean(errors.date)} />
              {errors.date && <small className="ec-error">{errors.date}</small>}
            </label>
            <label className="ec-field">
              <span><Clock3 size={14} /> Exam time</span>
              <input type="time" value={time} onChange={event => setTime(event.target.value)} aria-invalid={Boolean(errors.time)} />
              {errors.time && <small className="ec-error">{errors.time}</small>}
            </label>
            <label className="ec-field">
              <span><MapPin size={14} /> Venue</span>
              <input value={venue} onChange={event => setVenue(event.target.value)} placeholder="e.g. Hall 2" />
            </label>
            <label className="ec-field ec-field-wide">
              <span>Notes</span>
              <textarea rows={3} value={description} onChange={event => setDescription(event.target.value)} placeholder="Bring your calculator, revision notes, admit card..." />
            </label>
            <div className="ec-field ec-field-wide">
              <span>Syllabus topics</span>
              <div className="ec-topic-entry">
                <input value={topicInput} onChange={event => setTopicInput(event.target.value)} onKeyDown={event => {
                  if (event.key === 'Enter') {
                    event.preventDefault();
                    addTopicFromInput();
                  }
                }} placeholder="Add a topic or chapter" />
                <button type="button" className="ec-btn ec-btn-soft" onClick={addTopicFromInput}><Plus size={15} /> Add</button>
              </div>
              <textarea className="ec-topic-textarea" rows={4} value={topicsText} onChange={event => setTopicsText(event.target.value)} placeholder={'Matrices\nDeterminants\nProbability'} />
              <small className="ec-field-help">Enter one topic per line. {topicsFromText.length} topic{topicsFromText.length === 1 ? '' : 's'} added.</small>
            </div>
          </div>
          <div className="ec-modal-footer">
            <button type="button" className="ec-btn ec-btn-quiet" onClick={onClose}>Cancel</button>
            <button type="submit" className="ec-btn ec-btn-primary">{exam ? 'Save changes' : 'Add exam'}</button>
          </div>
        </form>
      </div>
    </div>
  );
}
