import { useTranslation } from 'react-i18next';
import { useState, useMemo } from 'react';
import { films } from '../data/films';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Link, useSearchParams } from 'react-router-dom';

const allGenres = Array.from(new Set(films.flatMap(f => f.genres)));

export default function SearchPage() {
  const { i18n, t } = useTranslation();
  const lang = i18n.language === 'ua' ? 'ua' : 'en';

  const [params, setParams] = useSearchParams();
  const search = params.get('q') ?? '';
  const genre = params.get('genre') ?? '';
  const rating = params.get('minrating') ?? '';

  // Controlled form state
  const [query, setQuery] = useState(search);
  const [genreVal, setGenreVal] = useState(genre);
  const [minRating, setMinRating] = useState(rating);

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setParams({ q: query, genre: genreVal, minrating: minRating });
  }

  const filtered = useMemo(() => {
    return films.filter(film =>
      (!query || film.title[lang].toLowerCase().includes(query.toLowerCase())) &&
      (!genreVal || film.genres.includes(genreVal)) &&
      (!minRating || film.rating >= Number(minRating))
    );
  }, [query, genreVal, minRating, lang]);

  return (
    <div>
      <form className="flex flex-col md:flex-row gap-3 items-end mb-6" onSubmit={handleSubmit}>
        <div className="flex-1 flex flex-col gap-1">
          <label htmlFor="search-film">{t('search_input', 'Search by name')}</label>
          <input
            id="search-film"
            className="border rounded px-2 py-1 w-full"
            placeholder={t('search_placeholder', 'Enter film name...')}
            value={query}
            onChange={e => setQuery(e.target.value)}
          />
        </div>
        <div className="min-w-[160px] flex flex-col gap-1">
          <label htmlFor="genre-select">{t('genre', 'Genre')}</label>
          <select
            id="genre-select"
            className="border rounded px-2 py-1"
            value={genreVal}
            onChange={e => setGenreVal(e.target.value)}
          >
            <option value="">{t('any', 'Any')}</option>
            {allGenres.map(genre => (
              <option value={genre} key={genre}>{genre}</option>
            ))}
          </select>
        </div>
        <div className="min-w-[120px] flex flex-col gap-1">
          <label htmlFor="rating-select">{t('min_rating', 'Min rating')}</label>
          <select
            id="rating-select"
            className="border rounded px-2 py-1"
            value={minRating}
            onChange={e => setMinRating(e.target.value)}
          >
            <option value="">{t('any', 'Any')}</option>
            {[6,7,8,9].map(r => (
              <option value={String(r)} key={r}>{r}+</option>
            ))}
          </select>
        </div>
        <Button type="submit" className="w-fit md:ml-5">{t('search_btn', 'Search')}</Button>
      </form>
      {filtered.length === 0 ? (
        <div className="mt-10 text-muted-foreground text-center">{t('no_movies', 'No films found.')}</div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-7">
          {filtered.map(film => (
            <Card key={film.id} className="p-0 overflow-hidden shadow group">
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
                <Link to={`/film/${film.id}`} className="self-end">
                  <Button size="sm" className="mt-1">{t('details', 'Details')}</Button>
                </Link>
              </div>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}
