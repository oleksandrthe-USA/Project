import { films } from '../data/films';
import { useTranslation } from 'react-i18next';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Link } from 'react-router-dom';
import { useMemo, useState } from 'react';
import type { Film } from '../types/film';

export default function HomePage() {
  const { i18n, t } = useTranslation();
  const lang = i18n.language === 'ua' ? 'ua' : 'en';

  const { newReleases, currentFilms } = useMemo(() => {
    return {
      newReleases: films.filter(f => f.isNew),
      currentFilms: films.filter(f => !f.isNew)
    };
  }, []);

  const FilmCard = ({ film }: { film: Film }) => {
    const [imgError, setImgError] = useState(false);

    return (
      <Card key={film.id} className="relative group p-0 overflow-hidden shadow transition-all hover:scale-[1.025]">
        <img
          src={film.poster}
          alt={film.title[lang]}
          className={`w-full h-64 ${imgError ? 'opacity-50' : 'object-cover'}`}
          loading="lazy"
          onError={() => setImgError(true)}
        />
        {film.isNew && (
          <span className="absolute top-3 left-3 bg-blue-500 text-white px-2 py-1 rounded shadow">
            {t('new_release', 'New!')}
          </span>
        )}
        <div className="p-4 flex flex-col gap-2">
          <div className="flex justify-between items-center">
            <h2 className="font-bold text-lg line-clamp-2">{film.title[lang]}</h2>
            <span className="ml-2 text-yellow-500 font-bold text-sm">★ {film.rating}</span>
          </div>
          <div className="text-xs text-muted-foreground mb-1">{film.genres.join(', ')}</div>
          <div className="line-clamp-3 text-sm text-gray-800 mb-2 min-h-[42px]">
            {film.description[lang]}
          </div>
          <Link to={`/film/${film.id}`} className="self-end">
            <Button size="sm" className="mt-1">{t('details', 'Details')}</Button>
          </Link>
        </div>
      </Card>
    );
  };

  return (
    <div className="space-y-8">
      {newReleases.length > 0 && (
        <section>
          <h2 className="text-2xl font-bold mb-6">{t('new_releases', 'New Releases')}</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-7">
            {newReleases.map(film => (
              <FilmCard key={film.id} film={film} />
            ))}
          </div>
        </section>
      )}

      <section>
        <h2 className="text-2xl font-bold mb-6">{t('current_films', 'Current Films')}</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-7">
          {currentFilms.map(film => (
            <FilmCard key={film.id} film={film} />
          ))}
        </div>
      </section>
    </div>
  );
}
