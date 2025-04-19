import { useEffect, useState } from 'react';
import { films } from '../data/films';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';

function getFavoriteFilms(): string[] {
  try {
    return JSON.parse(localStorage.getItem('favorites') ?? '[]');
  } catch {
    return [];
  }
}

function saveFavoriteFilms(fav: string[]) {
  localStorage.setItem('favorites', JSON.stringify(fav));
}

export default function FavoritesPage() {
  const { i18n, t } = useTranslation();
  const lang = i18n.language === 'ua' ? 'ua' : 'en';
  const [favorites, setFavorites] = useState<string[]>(getFavoriteFilms());

  useEffect(() => {
    const handler = () => setFavorites(getFavoriteFilms());
    window.addEventListener('storage', handler);
    return () => window.removeEventListener('storage', handler);
  }, []);

  const favFilms = films.filter(f => favorites.includes(f.id));

  const handleRemove = (id: string) => {
    const updated = favorites.filter(fid => fid !== id);
    setFavorites(updated);
    saveFavoriteFilms(updated);
  };

  if (!favFilms.length) {
    return <div className="mt-16 text-center text-xl text-muted-foreground">{t('no_favorites', 'No movies in Favorites yet.')}</div>;
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-7">
      {favFilms.map(film => (
        <Card key={film.id} className="p-0 overflow-hidden shadow relative group">
          <img
            src={film.poster}
            alt={film.title[lang]}
            className="w-full h-64 object-cover"
            loading="lazy"
          />
          <div className="p-4 flex flex-col gap-2">
            <div className="flex justify-between items-center">
              <h2 className="font-bold text-lg line-clamp-2">{film.title[lang]}</h2>
              <span className="ml-2 text-yellow-500 font-bold text-sm">★ {film.rating}</span>
            </div>
            <div className="text-xs text-muted-foreground mb-1">{film.genres.join(', ')}</div>
            <div className="line-clamp-3 text-sm text-gray-800 dark:text-gray-200 mb-2 min-h-[42px]">{film.description[lang]}</div>
            <div className="flex gap-1 items-center self-end mt-1">
              <Link to={`/film/${film.id}`}><Button size="sm">{t('details', 'Details')}</Button></Link>
              <Button size="sm" variant="destructive" onClick={() => handleRemove(film.id)}>{t('remove', 'Remove')}</Button>
            </div>
          </div>
        </Card>
      ))}
    </div>
  );
}
