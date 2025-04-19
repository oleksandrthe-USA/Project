import {
  BrowserRouter as Router,
  Routes,
  Route,
} from 'react-router-dom';
import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import HomePage from './pages/Home';
import FilmDetailsPage from './pages/FilmDetails';
import FavoritesPage from './pages/Favorites';
import SearchPage from './pages/Search';
import SessionsPage from './pages/Sessions';
import { ThemeProvider } from 'next-themes';
import ThemeToggle from './components/ThemeToggle';
import AdminPanel from './pages/Admin';
import { AuthModal } from './components/auth/AuthModal';
import { useAuth } from './contexts/AuthContext';
import { Button } from './components/ui/button';
import { Toaster } from './components/ui/toaster';
import { AnimatedLink } from './components/ui/animated-link';
import BookingsPage from './pages/Bookings';

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
  const { user, logout } = useAuth();
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
              <AnimatedLink to="/">{t('home')}</AnimatedLink>
              <AnimatedLink to="/search">{t('search')}</AnimatedLink>
              <AnimatedLink to="/sessions">{t('sessions')}</AnimatedLink>
              <AnimatedLink to="/bookings">{t('bookings', 'My Bookings')}</AnimatedLink>
              <AnimatedLink to="/favorites">{t('obrane')}</AnimatedLink>
              <AnimatedLink to="/admin">{t('admin')}</AnimatedLink>
            </nav>
            <div className="flex items-center gap-4">
              <div className="flex items-center gap-2">
                <span className="text-muted-foreground">{t('language')}:</span>
                <button type="button" className={lang === 'en' ? 'font-bold underline' : ''} onClick={() => setLang('en')}>EN</button>
                <span className="mx-1">|</span>
                <button type="button" className={lang === 'ua' ? 'font-bold underline' : ''} onClick={() => setLang('ua')}>UA</button>
                <ThemeToggle />
              </div>
              <div className="flex items-center gap-2 border-l pl-4">
                {user ? (
                  <>
                    <span className="text-sm">{user.name}</span>
                    <Button variant="outline" onClick={logout}>
                      {t('logout')}
                    </Button>
                  </>
                ) : (
                  <>
                    <AuthModal mode="login" />
                    <AuthModal mode="register" />
                  </>
                )}
              </div>
            </div>
          </header>
          <main className="p-5">
            <Routes>
              <Route path="/" element={<HomePage />} />
              <Route path="/film/:id" element={<FilmDetailsPage />} />
              <Route path="/search" element={<SearchPage />} />
              <Route path="/sessions" element={<SessionsPage />} />
              <Route path="/bookings" element={<BookingsPage />} />
              <Route path="/favorites" element={<FavoritesPage />} />
              <Route path="/admin" element={<AdminPanel />} />
            </Routes>
          </main>
        </div>
      </Router>
      <Toaster />
    </ThemeProvider>
  );
}
