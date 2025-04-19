import { useState } from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { useTranslation } from 'react-i18next';
import type { Film } from '../types/film';
import type { Session } from '../types/session';
import { useFilms } from '../lib/useFilms';
import { useSessions } from '../lib/useSessions';

interface FormState {
  filmId: string;
  date: string;
  time: string;
  price: string;
}

function getEmptyFilm(lang: 'en' | 'ua'): Film {
  return {
    id: '',
    poster: '',
    title: {
      en: '',
      ua: '',
    },
    genres: [],
    description: {
      en: '',
      ua: '',
    },
    rating: 0,
    releaseDate: '',
    trailer: '',
    actors: [],
    isNew: false,
  };
}

function FilmsAdmin({ lang }: { lang: 'en' | 'ua'; }) {
  const { t } = useTranslation();
  const { films, addFilm, updateFilm, deleteFilm } = useFilms();
  const [mode, setMode] = useState<'list' | 'edit' | 'add'>('list');
  const [editFilm, setEditFilm] = useState<Film | null>(null);

  const onDelete = (id: string) => {
    deleteFilm(id);
    setMode('list');
  };

  const onEdit = (film: Film) => {
    setEditFilm(film);
    setMode('edit');
  };

  const onSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const form = e.currentTarget;
    const data = Object.fromEntries(new FormData(form));
    
    // Validate rating
    const rating = Number.parseFloat(data.rating as string);
    if (isNaN(rating) || rating < 0 || rating > 10) {
      alert(t('invalid_rating', 'Rating must be between 0 and 10'));
      return;
    }

    const filmData: Film = {
      id: editFilm?.id || '',
      poster: data.poster as string,
      title: {
        en: data.title_en as string,
        ua: data.title_ua as string,
      },
      genres: (data.genres as string).split(',').map(g => g.trim()).filter(Boolean),
      description: {
        en: data.desc_en as string,
        ua: data.desc_ua as string,
      },
      rating,
      releaseDate: data.releaseDate as string,
      trailer: data.trailer as string,
      actors: (data.actors as string).split(',').map(a => a.trim()).filter(Boolean),
      isNew: Boolean(data.isNew),
    };

    try {
      if (editFilm) {
        updateFilm(editFilm.id, filmData);
      } else {
        addFilm(filmData);
      }
      setMode('list');
      setEditFilm(null);
    } catch (error) {
      console.error('Error saving film:', error);
      alert(t('save_error', 'Error saving film. Please try again.'));
    }
  };

  return (
    <div className="space-y-6">
      {mode !== 'list' ? (
        <Card>
          <form className="p-6 space-y-4" onSubmit={onSubmit}>
            <h2 className="text-2xl font-bold mb-6">{mode === 'add' ? t('add_film','Add Film') : t('edit_film','Edit Film')}</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-4">
                <div className="mb-4">
                  <label className="block mb-1">{t('poster','Poster URL')}</label>
                  <input
                    type="text"
                    className="w-full border rounded px-2 py-1"
                    name="poster"
                    defaultValue={editFilm?.poster || ''}
                    required
                    placeholder="/posters/your-image.jpg or https://example.com/image.jpg"
                  />
                  <p className="text-sm text-muted-foreground mt-1">
                    {t('poster_help','You can use local images from /public/posters/ folder or external URLs')}
                  </p>
                </div>
                <label className="block">
                  <span className="block text-sm font-medium mb-1">{t('title_en','Title (EN)')}</span>
                  <input name="title_en" defaultValue={editFilm?.title?.en || ''} className="input w-full" required />
                </label>
                <label className="block">
                  <span className="block text-sm font-medium mb-1">{t('title_ua','Title (UA)')}</span>
                  <input name="title_ua" defaultValue={editFilm?.title?.ua || ''} className="input w-full" required />
                </label>
                <label className="block">
                  <span className="block text-sm font-medium mb-1">{t('genres','Genres (comma separated)')}</span>
                  <input name="genres" defaultValue={editFilm?.genres?.join(', ') || ''} className="input w-full" required />
                </label>
              </div>
              <div className="space-y-4">
                <label className="block">
                  <span className="block text-sm font-medium mb-1">{t('desc_en','Description (EN)')}</span>
                  <textarea name="desc_en" defaultValue={editFilm?.description?.en || ''} className="input w-full" rows={3} required />
                </label>
                <label className="block">
                  <span className="block text-sm font-medium mb-1">{t('desc_ua','Description (UA)')}</span>
                  <textarea name="desc_ua" defaultValue={editFilm?.description?.ua || ''} className="input w-full" rows={3} required />
                </label>
                <div className="grid grid-cols-2 gap-4">
                  <label className="block">
                    <span className="block text-sm font-medium mb-1">{t('rating','Rating')}</span>
                    <input type="number" name="rating" min="0" max="10" step="0.1" defaultValue={editFilm?.rating || 0} className="input w-full" required />
                  </label>
                  <label className="block">
                    <span className="block text-sm font-medium mb-1">{t('release','Release date')}</span>
                    <input type="date" name="releaseDate" defaultValue={editFilm?.releaseDate || ''} className="input w-full" required />
                  </label>
                </div>
                <div className="mb-4">
                  <label className="block mb-1">{t('trailer','Trailer URL')}</label>
                  <input
                    type="text"
                    className="w-full border rounded px-2 py-1"
                    name="trailer"
                    defaultValue={editFilm?.trailer || ''}
                    required
                    placeholder="https://youtube.com/watch?v=..."
                  />
                </div>
                <div className="mb-4">
                  <label className="block mb-1">{t('actors','Actors')}</label>
                  <input
                    type="text"
                    className="w-full border rounded px-2 py-1"
                    name="actors"
                    defaultValue={editFilm?.actors?.join(', ') || ''}
                    required
                    placeholder="Actor 1, Actor 2, Actor 3"
                  />
                  <p className="text-sm text-muted-foreground mt-1">
                    {t('actors_help','Separate actor names with commas')}
                  </p>
                </div>
                <label className="flex items-center space-x-2 mt-2">
                  <input name="isNew" type="checkbox" className="checkbox" defaultChecked={editFilm?.isNew} />
                  <span className="text-sm font-medium">{t('new_release','New!')}</span>
                </label>
              </div>
            </div>
            <div className="flex gap-4 mt-6 justify-end">
              <Button type="submit" size="lg">{t('save','Save')}</Button>
              <Button type="button" variant="outline" size="lg" onClick={() => { setMode('list'); setEditFilm(null); }}>{t('cancel','Cancel')}</Button>
            </div>
          </form>
        </Card>
      ) : (
        <>
          <div className="flex justify-between items-center">
            <h2 className="text-2xl font-bold">{t('films','Films')}</h2>
            <Button onClick={() => setMode('add')} size="lg">{t('add_film','Add Film')}</Button>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {films.map(film => (
              <Card key={film.id} className="overflow-hidden">
                <img src={film.poster} alt={film.title[lang]} className="w-full h-48 object-cover" />
                <div className="p-4 space-y-2">
                  <h3 className="font-bold text-lg">{film.title[lang]}</h3>
                  <p className="text-sm text-gray-600 dark:text-gray-400">{film.genres.join(', ')}</p>
                  <div className="flex justify-between items-center mt-4">
                    <div className="space-x-2">
                      <Button size="sm" variant="outline" onClick={() => onEdit(film)}>{t('edit','Edit')}</Button>
                      <Button size="sm" variant="destructive" onClick={() => onDelete(film.id)}>{t('delete','Delete')}</Button>
                    </div>
                    {film.isNew && (
                      <span className="bg-green-100 text-green-800 text-xs px-2 py-1 rounded-full dark:bg-green-900 dark:text-green-100">
                        {t('new_release','New!')}
                      </span>
                    )}
                  </div>
                </div>
              </Card>
            ))}
          </div>
        </>
      )}
    </div>
  );
}

function SessionsAdmin({ lang }: { lang: 'en' | 'ua' }) {
  const { t } = useTranslation();
  const { sessions, addSession, updateSession, deleteSession } = useSessions();
  const { films } = useFilms();
  const [editId, setEditId] = useState<string | null>(null);
  const [form, setForm] = useState<FormState>({ filmId: '', date: '', time: '', price: '' });

  const resetForm = () => setForm({ filmId: '', date: '', time: '', price: '' });
  
  const onEdit = (session: Session) => {
    setEditId(session.id);
    setForm({
      filmId: session.filmId,
      date: session.date,
      time: session.time,
      price: session.price.toString()
    });
  };

  const onDelete = (id: string) => {
    deleteSession(id);
    setEditId(null);
    resetForm();
  };

  const onSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    const price = Number(form.price);

    // Validate price
    if (isNaN(price) || price < 0) {
      alert(t('invalid_price', 'Price must be a positive number'));
      return;
    }

    try {
      const sessionData: Session = {
        id: editId || Math.random().toString(36).slice(2),
        filmId: form.filmId,
        date: form.date,
        time: form.time,
        price
      };

      if (editId) {
        updateSession(editId, sessionData);
      } else {
        addSession(sessionData);
      }
      resetForm();
    } catch (error) {
      console.error('Error saving session:', error);
      alert(t('save_error', 'Error saving session. Please try again.'));
    }
  };

  return (
    <div className="space-y-6">
      <Card>
        <form className="p-6 space-y-4" onSubmit={onSubmit}>
          <h2 className="text-2xl font-bold mb-6">
            {editId ? t('edit_session', 'Edit Session') : t('add_session', 'Add Session')}
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <label className="block">
              <span className="block text-sm font-medium mb-1">{t('film','Film')}</span>
              <select 
                required 
                name="filmId" 
                className="input w-full" 
                value={form.filmId} 
                onChange={e=>setForm(f => ({...f, filmId:e.target.value}))}
              >
                <option value="">{t('choose_film','Choose film')}</option>
                {films.map(f => (
                  <option value={f.id} key={f.id}>{f.title[lang]}</option>
                ))}
              </select>
            </label>
            <label className="block">
              <span className="block text-sm font-medium mb-1">{t('date','Date')}</span>
              <input 
                required 
                name="date" 
                type="date" 
                className="input w-full" 
                value={form.date} 
                onChange={e=>setForm(f => ({...f, date:e.target.value}))} 
              />
            </label>
            <label className="block">
              <span className="block text-sm font-medium mb-1">{t('time','Time')}</span>
              <input 
                required 
                name="time" 
                type="time" 
                className="input w-full" 
                value={form.time} 
                onChange={e=>setForm(f => ({...f, time:e.target.value}))} 
              />
            </label>
            <div className="mb-4">
              <label className="block mb-1">{t('price','Price (₴)')}</label>
              <input
                type="number"
                min="0"
                step="5"
                className="w-full border rounded px-2 py-1"
                name="price"
                value={form.price}
                onChange={e=>setForm(f => ({...f, price:e.target.value}))}
              />
            </div>
          </div>
          <div className="flex gap-4 mt-6 justify-end">
            <Button type="submit" size="lg">{t('save','Save')}</Button>
            <Button type="button" variant="outline" size="lg" onClick={resetForm}>{t('cancel','Cancel')}</Button>
          </div>
        </form>
      </Card>

      <Card>
        <div className="p-6">
          <h2 className="text-2xl font-bold mb-6">{t('sessions','Sessions')}</h2>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b">
                  <th className="text-left py-3 px-4 font-medium">{t('film','Film')}</th>
                  <th className="text-left py-3 px-4 font-medium">{t('date','Date')}</th>
                  <th className="text-left py-3 px-4 font-medium">{t('time','Time')}</th>
                  <th className="text-left py-3 px-4 font-medium">{t('price','Price')}</th>
                  <th className="py-3 px-4"></th>
                </tr>
              </thead>
              <tbody>
                {sessions.map(sess => {
                  const film = films.find(f => f.id === sess.filmId);
                  return (
                    <tr key={sess.id} className="border-b last:border-b-0">
                      <td className="py-3 px-4">{film ? film.title[lang] : '-'}</td>
                      <td className="py-3 px-4">{sess.date}</td>
                      <td className="py-3 px-4">{sess.time}</td>
                      <td className="py-3 px-4">{sess.price} ₴</td>
                      <td className="py-3 px-4">
                        <div className="flex gap-2 justify-end">
                          <Button size="sm" variant="outline" onClick={() => onEdit(sess)}>
                            {t('edit','Edit')}
                          </Button>
                          <Button size="sm" variant="destructive" onClick={() => onDelete(sess.id)}>
                            {t('delete','Delete')}
                          </Button>
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      </Card>
    </div>
  );
}

export default function AdminPanel() {
  const { i18n, t } = useTranslation();
  const lang = i18n.language === 'ua' ? 'ua' : 'en';
  const [tab, setTab] = useState<'films' | 'sessions'>('films');

  return (
    <div className="max-w-7xl mx-auto px-4 py-8">
      <Card className="mb-8">
        <div className="p-4 flex gap-4 border-b">
          <Button 
            variant={tab==='films'?'default':'outline'} 
            onClick={()=>setTab('films')}
            size="lg"
          >
            {t('films','Films')}
          </Button>
          <Button 
            variant={tab==='sessions'?'default':'outline'} 
            onClick={()=>setTab('sessions')}
            size="lg"
          >
            {t('sessions','Sessions')}
          </Button>
        </div>
      </Card>
      
      {tab==='films' && <FilmsAdmin lang={lang} />}
      {tab==='sessions' && <SessionsAdmin lang={lang} />}
    </div>
  );
}
