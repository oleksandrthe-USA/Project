import {
  BrowserRouter as Router,
  Routes,
  Route,
  Link,
} from 'react-router-dom';
import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import HomePage from './pages/Home'; // Added import for HomePage
import FilmDetailsPage from './pages/FilmDetails'; // Added import for FilmDetailsPage
import FavoritesPage from './pages/Favorites'; // Added import for FavoritesPage
import SearchPage from './pages/Search'; // Added import for SearchPage
import SessionsPage from './pages/Sessions'; // Added import for SessionsPage
import { ThemeProvider } from 'next-themes';
import ThemeToggle from './components/ThemeToggle';
import AdminPanel from './pages/Admin'; // Added import for AdminPanel

// Placeholder pages that use translation
function FilmDetails() {
  const { t } = useTranslation();
  return <div>{t('page.film')}</div>;
}
function Search() {
  const { t } = useTranslation();
  return <div>{t('page.search')}</div>;
}
function Sessions() {
  const { t } = useTranslation();
  return <div>{t('page.sessions')}</div>;
}
function Favorites() {
  const { t } = useTranslation();
  return <div>{t('page.favorites')}</div>;
}
function Admin() {
  const { t } = useTranslation();
  return <div>{t('page.admin')}</div>;
}

export default function App() {
  const { t, i18n } = useTranslation();
  const lang = i18n.language;
  const setLang = (l: 'en' | 'ua') => {
    i18n.changeLanguage(l);
  };
  return (
    <ThemeProvider attribute="class" defaultTheme="light" enableSystem>
      <Router>
        <div>
          <header className="flex items-center justify-between p-4 border-b bg-white dark:bg-zinc-900 shadow-sm">
            <nav className="flex gap-4">
              <Link to="/">{t('home')}</Link>
              <Link to="/search">{t('search')}</Link>
              <Link to="/sessions">{t('sessions')}</Link>
              <Link to="/favorites">{t('obrane')}</Link>
              <Link to="/admin">{t('admin')}</Link>
            </nav>
            <div className="flex items-center gap-2">
              <span className="text-muted-foreground">{t('language')}:</span>
              <button type="button" className={lang === 'en' ? 'font-bold underline' : ''} onClick={() => setLang('en')}>EN</button>
              <span className="mx-1">|</span>
              <button type="button" className={lang === 'ua' ? 'font-bold underline' : ''} onClick={() => setLang('ua')}>UA</button>
              <ThemeToggle />
            </div>
          </header>
          <main className="p-5">
            <Routes>
              <Route path="/" element={<HomePage />} />
              <Route path="/film/:id" element={<FilmDetailsPage />} />
              <Route path="/search" element={<SearchPage />} />
              <Route path="/sessions" element={<SessionsPage />} />
              <Route path="/favorites" element={<FavoritesPage />} />
              <Route path="/admin" element={<AdminPanel />} /> {/* Updated to use AdminPanel */}
            </Routes>
          </main>
        </div>
      </Router>
    </ThemeProvider>
  );
}
