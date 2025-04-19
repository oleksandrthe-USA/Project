import { useTranslation } from 'react-i18next';
import { useMemo, useState } from 'react';
import { films } from '../data/films';
import { Card } from '@/components/ui/card';
import { Link } from 'react-router-dom';
import { useSessions } from '../lib/useSessions';

export default function SessionsPage() {
  const { t, i18n } = useTranslation();
  const lang = i18n.language === 'ua' ? 'ua' : 'en';
  const [date, setDate] = useState('');
  const [time, setTime] = useState('');
  const [genre, setGenre] = useState('');
  const { sessions } = useSessions();

  const allDates = useMemo(() => Array.from(new Set(sessions.map(s => s.date))).sort(), [sessions]);
  const allTimes = useMemo(() => Array.from(new Set(sessions.map(s => s.time))).sort(), [sessions]);
  const allGenres = useMemo(() => Array.from(new Set(films.flatMap(f => f.genres))), []);

  const filtered = useMemo(() => {
    return sessions.filter(s => {
      const film = films.find(f => f.id === s.filmId);
      return (
        (!date || s.date === date)
        && (!time || s.time === time)
        && (!genre || (film && film.genres.includes(genre)))
      );
    })
  }, [date, time, genre, sessions]);

  return (
    <div>
      <form className="flex flex-col md:flex-row gap-3 items-end mb-6">
        <div className="min-w-[140px] flex flex-col gap-1">
          <label htmlFor="session-date">{t('date', 'Date')}</label>
          <select id="session-date" className="border rounded px-2 py-1" value={date} onChange={e => setDate(e.target.value)}>
            <option value="">{t('any', 'Any')}</option>
            {allDates.map(d => <option value={d} key={d}>{d}</option>)}
          </select>
        </div>
        <div className="min-w-[120px] flex flex-col gap-1">
          <label htmlFor="session-time">{t('time', 'Time')}</label>
          <select id="session-time" className="border rounded px-2 py-1" value={time} onChange={e => setTime(e.target.value)}>
            <option value="">{t('any', 'Any')}</option>
            {allTimes.map(ti => <option value={ti} key={ti}>{ti}</option>)}
          </select>
        </div>
        <div className="min-w-[150px] flex flex-col gap-1">
          <label htmlFor="session-genre">{t('genre', 'Genre')}</label>
          <select id="session-genre" className="border rounded px-2 py-1" value={genre} onChange={e => setGenre(e.target.value)}>
            <option value="">{t('any', 'Any')}</option>
            {allGenres.map(g => <option value={g} key={g}>{g}</option>)}
          </select>
        </div>
      </form>

      {filtered.length === 0 ? (
        <div className="mt-12 text-center text-muted-foreground">{t('no_sessions', 'No sessions found.')}</div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-7">
          {filtered.map(sess => {
            const film = films.find(f => f.id === sess.filmId);
            if (!film) return null;
            return (
              <Card key={sess.id} className="p-4 flex flex-col md:flex-row gap-5 items-start">
                <img
                  src={film.poster}
                  alt={film.title[lang]}
                  className="w-24 h-36 object-cover rounded"
                />
                <div className="flex-1 flex flex-col gap-2">
                  <h2 className="font-bold text-lg">{film.title[lang]}</h2>
                  <div className="text-muted-foreground text-xs mb-2">{film.genres.join(', ')} — {sess.date} {sess.time}</div>
                  <div className="mb-1">{film.description[lang]}</div>
                  <div className="flex flex-row gap-4 items-center">
                    <span className="font-semibold text-yellow-600">★ {film.rating}</span>
                    <span className="font-semibold">{t('price', 'Price')}: <span className="text-blue-700 dark:text-blue-400">{sess.price} грн</span></span>
                  </div>
                  <Link to={`/film/${film.id}`}
                    className="self-end inline-block font-medium underline text-blue-600 mt-1"
                  >{t('details', 'Details')}</Link>
                </div>
              </Card>
            );
          })}
        </div>
      )}
    </div>
  );
}
