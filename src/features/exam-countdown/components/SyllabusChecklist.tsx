import { useState } from 'react';
import { Plus, Trash2 } from 'lucide-react';
import type { Exam } from '../types';

export function SyllabusChecklist({
  exam,
  onToggleTopic,
  onAddTopic,
  onRemoveTopic,
}: {
  exam: Exam;
  onToggleTopic: (examId: string, topicId: string) => void;
  onAddTopic: (examId: string, title: string) => void;
  onRemoveTopic: (examId: string, topicId: string) => void;
}) {
  const [topicTitle, setTopicTitle] = useState('');
  const completed = exam.topics.filter(topic => topic.completed).length;
  const total = exam.topics.length;
  const percentage = total ? Math.round(completed / total * 100) : 0;

  const submitTopic = (event: React.FormEvent) => {
    event.preventDefault();
    onAddTopic(exam.id, topicTitle);
    setTopicTitle('');
  };

  return (
    <div className="ec-syllabus">
      <div className="ec-syllabus-head">
        <span>Syllabus</span>
        {total > 0 && <strong>{completed}/{total} · {percentage}%</strong>}
      </div>
      {total > 0 && (
        <>
          <div className="ec-progress" role="progressbar" aria-valuemin={0} aria-valuemax={100} aria-valuenow={percentage}>
            <span style={{ width: `${percentage}%` }} />
          </div>
          <div className="ec-topic-list">
            {exam.topics.map(topic => (
              <div className={`ec-topic-row ${topic.completed ? 'completed' : ''}`} key={topic.id}>
                <label>
                  <input type="checkbox" checked={topic.completed} onChange={() => onToggleTopic(exam.id, topic.id)} />
                  <span>{topic.title}</span>
                </label>
                <button type="button" onClick={() => onRemoveTopic(exam.id, topic.id)} aria-label={`Remove ${topic.title}`}><Trash2 size={13} /></button>
              </div>
            ))}
          </div>
        </>
      )}
      {!exam.completed && (
        <form className="ec-topic-inline" onSubmit={submitTopic}>
          <input value={topicTitle} onChange={event => setTopicTitle(event.target.value)} placeholder="Add a chapter" aria-label="New syllabus topic" />
          <button type="submit" aria-label="Add syllabus topic" disabled={!topicTitle.trim()}><Plus size={14} /></button>
        </form>
      )}
    </div>
  );
}
