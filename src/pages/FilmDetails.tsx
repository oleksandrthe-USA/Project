import { useParams } from 'react-router-dom';
import { films } from '../data/films';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { useTranslation } from 'react-i18next';
import { useEffect, useMemo, useState } from 'react';

function getFavoriteFilms(): string[] {
  try {
    const stored = localStorage.getItem('favorites');
    if (!stored) return [];
    const parsed = JSON.parse(stored);
    return Array.isArray(parsed) ? parsed : [];
  } catch (error) {
    console.error('Error reading favorites:', error);
    return [];
  }
}

function saveFavoriteFilms(fav: string[]) {
  try {
    localStorage.setItem('favorites', JSON.stringify(fav));
  } catch (error) {
    console.error('Error saving favorites:', error);
  }
}

function isValidUrl(url: string): boolean {
  try {
    new URL(url);
    return true;
  } catch {
    return false;
  }
}

export default function FilmDetailsPage() {
  const { id } = useParams<{ id: string }>();
  const { i18n, t } = useTranslation();
  const lang = i18n.language === 'ua' ? 'ua' : 'en';

  const film = useMemo(() => films.find((f) => f.id === id), [id]);
  const [favorites, setFavorites] = useState<string[]>(getFavoriteFilms());
  const [imgError, setImgError] = useState(false);

  // Update local state if another tab changes favorites
  useEffect(() => {
    const handler = () => setFavorites(getFavoriteFilms());
    window.addEventListener('storage', handler);
    return () => window.removeEventListener('storage', handler);
  }, []);

  if (!film) {
    return <div className="text-center text-lg mt-12">{t('notFound', 'Film not found')}</div>;
  }

  const isFavorite = favorites.includes(film.id);

  const handleToggleFavorite = () => {
    let fav: string[];
    if (isFavorite) {
      fav = favorites.filter((fid) => fid !== film.id);
    } else {
      fav = [...favorites, film.id];
    }
    setFavorites(fav);
    saveFavoriteFilms(fav);
  };

  return (
    <div className="flex flex-col lg:flex-row gap-10 max-w-4xl mx-auto">
      <img
        src={film.poster}
        alt={film.title[lang]}
        className={`w-full max-w-xs h-auto rounded shadow-lg ${imgError ? 'opacity-50' : 'object-cover'}`}
        onError={() => setImgError(true)}
        loading="lazy"
      />
      <div className="flex-1 flex flex-col gap-6">
        <div>
          <h1 className="font-bold text-2xl mb-1">{film.title[lang]}</h1>
          <div className="text-sm text-muted-foreground mb-2">{film.genres.join(', ')} • {film.releaseDate}</div>
        </div>
        <div className="text-lg leading-relaxed mb-2">{film.description[lang]}</div>
        <div>
          <span className="font-semibold text-yellow-500">★ {film.rating}</span>
        </div>
        <div>
          <span className="font-semibold mr-2">{t('actors', 'Actors')}:</span>{' '}
          <span>{film.actors.join(', ')}</span>
        </div>
        {isValidUrl(film.trailer) && (
          <div>
            <a href={film.trailer} 
               className="text-blue-600 underline font-medium" 
               target="_blank" 
               rel="noopener noreferrer"
            >
              {t('watch_trailer', 'Watch Trailer')}
            </a>
          </div>
        )}
        <Button
          variant={isFavorite ? 'secondary' : 'default'}
          onClick={handleToggleFavorite}
          aria-pressed={isFavorite}
          className="w-fit"
        >
          {isFavorite ? t('in_favorites', 'In Favorites') : t('add_to_favorites', 'Add to Favorites')}
        </Button>
      </div>
    </div>
  );
}
