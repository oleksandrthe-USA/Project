import { useCallback, useEffect, useState } from 'react';
import { films as defaultFilms } from '../data/films';
import type { Film } from '../types/film';

const LS_KEY = 'filmsData';

function loadFilms(): Film[] {
  try {
    const fromLS = localStorage.getItem(LS_KEY);
    if (fromLS) return JSON.parse(fromLS);
  } catch {}
  return defaultFilms;
}

export function useFilms() {
  const [films, setFilms] = useState<Film[]>(loadFilms());

  // Sync across tabs
  useEffect(() => {
    const handler = () => setFilms(loadFilms());
    window.addEventListener('storage', handler);
    return () => window.removeEventListener('storage', handler);
  }, []);

  // Save to localStorage on change
  useEffect(() => {
    localStorage.setItem(LS_KEY, JSON.stringify(films));
  }, [films]);

  const addFilm = useCallback((film: Film) => {
    setFilms((prev) => [...prev, { ...film, id: Math.random().toString(36).slice(2) }]);
  }, []);

  const updateFilm = useCallback((id: string, update: Partial<Film>) => {
    setFilms((prev) => prev.map(f => f.id === id ? { ...f, ...update } : f));
  }, []);

  const deleteFilm = useCallback((id: string) => {
    setFilms((prev) => prev.filter(f => f.id !== id));
  }, []);

  return { films, setFilms, addFilm, updateFilm, deleteFilm };
}
