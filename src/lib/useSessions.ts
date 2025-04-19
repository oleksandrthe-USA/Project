import { useCallback, useEffect, useState } from 'react';
import { sessions as defaultSessions } from '../data/sessions';
import type { Session } from '../types/session';

const LS_KEY = 'sessionsData';

function loadSessions(): Session[] {
  try {
    const fromLS = localStorage.getItem(LS_KEY);
    if (fromLS) return JSON.parse(fromLS);
  } catch {}
  return defaultSessions;
}

export function useSessions() {
  const [sessions, setSessions] = useState<Session[]>(loadSessions());

  useEffect(() => {
    const handler = () => setSessions(loadSessions());
    window.addEventListener('storage', handler);
    return () => window.removeEventListener('storage', handler);
  }, []);

  useEffect(() => {
    localStorage.setItem(LS_KEY, JSON.stringify(sessions));
  }, [sessions]);

  const addSession = useCallback((session: Session) => {
    setSessions((prev) => [...prev, { ...session, id: Math.random().toString(36).slice(2) }]);
  }, []);

  const updateSession = useCallback((id: string, update: Partial<Session>) => {
    setSessions((prev) => prev.map(s => s.id === id ? { ...s, ...update } : s));
  }, []);

  const deleteSession = useCallback((id: string) => {
    setSessions((prev) => prev.filter(s => s.id !== id));
  }, []);

  return { sessions, setSessions, addSession, updateSession, deleteSession };
}
