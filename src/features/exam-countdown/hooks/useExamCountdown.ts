import { useEffect, useState } from 'react';
import type { Exam, ExamDraft } from '../types';

export const EXAM_STORAGE_KEY = 'edubuddy_exam_countdown_v1';

const createId = () => `${Date.now().toString(36)}-${Math.random().toString(36).slice(2, 9)}`;

function isExam(value: unknown): value is Exam {
  if (!value || typeof value !== 'object') return false;
  const exam = value as Partial<Exam>;
  return typeof exam.id === 'string'
    && typeof exam.name === 'string'
    && typeof exam.subject === 'string'
    && typeof exam.date === 'string'
    && typeof exam.completed === 'boolean'
    && typeof exam.createdAt === 'string'
    && Array.isArray(exam.topics)
    && exam.topics.every(topic => Boolean(topic)
      && typeof topic.id === 'string'
      && typeof topic.title === 'string'
      && typeof topic.completed === 'boolean');
}

export function useExamCountdown() {
  const [exams, setExams] = useState<Exam[]>([]);
  const [storageError, setStorageError] = useState<string | null>(null);
  const [loaded, setLoaded] = useState(false);

  useEffect(() => {
    try {
      const raw = window.localStorage.getItem(EXAM_STORAGE_KEY);
      if (!raw) {
        setLoaded(true);
        return;
      }
      const parsed: unknown = JSON.parse(raw);
      if (Array.isArray(parsed)) {
        setExams(parsed.filter(isExam));
      } else if (parsed && typeof parsed === 'object' && Array.isArray((parsed as { exams?: unknown }).exams)) {
        setExams(((parsed as { exams: unknown[] }).exams).filter(isExam));
      } else {
        setStorageError('Saved exam data could not be read. You can add new exams normally.');
      }
    } catch {
      setStorageError('Saved exam data is unavailable or malformed. You can continue for this visit.');
    } finally {
      setLoaded(true);
    }
  }, []);

  useEffect(() => {
    if (!loaded) return;
    try {
      window.localStorage.setItem(EXAM_STORAGE_KEY, JSON.stringify({ exams }));
    } catch {
      setStorageError('Changes could not be saved in this browser.');
    }
  }, [exams, loaded]);

  const addExam = (draft: ExamDraft) => {
    const exam: Exam = {
      id: createId(),
      name: draft.name.trim(),
      subject: draft.subject.trim(),
      date: draft.date,
      time: draft.time?.trim() || undefined,
      venue: draft.venue?.trim() || undefined,
      description: draft.description?.trim() || undefined,
      topics: draft.topics.map(title => ({ id: createId(), title: title.trim(), completed: false })).filter(topic => topic.title),
      completed: false,
      createdAt: new Date().toISOString(),
    };
    setExams(current => [exam, ...current]);
  };

  const updateExam = (examId: string, draft: ExamDraft) => {
    setExams(current => current.map(exam => {
      if (exam.id !== examId) return exam;
      const existingTopics = new Map(exam.topics.map(topic => [topic.title.toLowerCase(), topic]));
      return {
        ...exam,
        name: draft.name.trim(),
        subject: draft.subject.trim(),
        date: draft.date,
        time: draft.time?.trim() || undefined,
        venue: draft.venue?.trim() || undefined,
        description: draft.description?.trim() || undefined,
        topics: draft.topics.map(title => {
          const cleanTitle = title.trim();
          const existing = existingTopics.get(cleanTitle.toLowerCase());
          return existing ? { ...existing, title: cleanTitle } : { id: createId(), title: cleanTitle, completed: false };
        }).filter(topic => topic.title),
      };
    }));
  };

  const deleteExam = (examId: string) => setExams(current => current.filter(exam => exam.id !== examId));
  const setExamCompleted = (examId: string, completed: boolean) => setExams(current =>
    current.map(exam => exam.id === examId ? { ...exam, completed } : exam));
  const toggleTopic = (examId: string, topicId: string) => setExams(current =>
    current.map(exam => exam.id === examId
      ? { ...exam, topics: exam.topics.map(topic => topic.id === topicId ? { ...topic, completed: !topic.completed } : topic) }
      : exam));
  const addTopic = (examId: string, title: string) => {
    const cleanTitle = title.trim();
    if (!cleanTitle) return;
    setExams(current => current.map(exam => exam.id === examId
      ? { ...exam, topics: [...exam.topics, { id: createId(), title: cleanTitle, completed: false }] }
      : exam));
  };
  const removeTopic = (examId: string, topicId: string) => setExams(current =>
    current.map(exam => exam.id === examId
      ? { ...exam, topics: exam.topics.filter(topic => topic.id !== topicId) }
      : exam));

  return {
    exams,
    loaded,
    storageError,
    clearStorageError: () => setStorageError(null),
    addExam,
    updateExam,
    deleteExam,
    setExamCompleted,
    toggleTopic,
    addTopic,
    removeTopic,
  };
}
