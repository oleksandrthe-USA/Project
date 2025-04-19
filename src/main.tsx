import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';
import './index.css';

import i18n from 'i18next';
import { I18nextProvider } from 'react-i18next';
import { initReactI18next } from 'react-i18next';
import { AuthProvider } from './contexts/AuthContext';

const resources = {
  en: {
    translation: {
      home: 'Home',
      search: 'Search',
      sessions: 'Sessions',
      favorites: 'Favorites',
      admin: 'Admin Panel',
      language: 'Language',
      obrane: 'Favorites',
      actors: 'Actors',
      watch_trailer: 'Watch Trailer',
      add_to_favorites: 'Add to Favorites',
      in_favorites: 'In Favorites',
      notFound: 'Film not found',
      new_release: 'New!',
      details: 'Details',
      no_favorites: 'No movies in Favorites yet.',
      remove: 'Remove',
      page: {
        home: 'Home Page',
        film: 'Film Details Page',
        search: 'Search Page',
        sessions: 'Sessions Page',
        favorites: 'Favorites (Obrane) Page',
        admin: 'Admin Panel Page'
      },
      search_input: 'Search by name',
      search_placeholder: 'Enter film name... ',
      any: 'Any',
      genre: 'Genre',
      min_rating: 'Min rating',
      search_btn: 'Search',
      no_movies: 'No films found.',
      date: 'Date',
      time: 'Time',
      price: 'Price',
      no_sessions: 'No sessions found.',
      films: 'Films',
      add_film: 'Add Film',
      edit_film: 'Edit Film',
      poster_url: 'Poster URL',
      title_en: 'Title (EN)',
      title_ua: 'Title (UA)',
      desc_en: 'Description (EN)',
      desc_ua: 'Description (UA)',
      genres: 'Genres (comma separated)',
      release: 'Release date',
      trailer: 'Trailer link',
      actor_list: 'Actors (comma separated)',
      save: 'Save',
      cancel: 'Cancel',
      edit: 'Edit',
      delete: 'Delete',
      sessions_manage: 'Session management coming next!',
      add_session: 'Add Session',
      edit_session: 'Edit Session',
      film: 'Film',
      choose_film: 'Choose film',
      currency: '$',
      currency_rate: 0.027,
      // Auth translations
      login: 'Login',
      register: 'Register',
      logout: 'Logout',
      email: 'Email',
      password: 'Password',
      name: 'Name',
      login_success: 'Login successful',
      welcome_back: 'Welcome back!',
      register_success: 'Registration successful',
      account_created: 'Your account has been created',
      auth_error: 'Authentication Error',
      auth_error_desc: 'Please check your credentials and try again',
      need_account: 'Need an account?',
      have_account: 'Already have an account?',
      login_desc: 'Enter your credentials to access your account',
      register_desc: 'Create a new account to start booking tickets',
      // Booking translations
      book_tickets: 'Book Tickets',
      book_tickets_for: 'Book Tickets for',
      screen: 'Screen',
      selected_seats: 'Selected Seats',
      total_price: 'Total Price',
      confirm_booking: 'Confirm Booking',
      booking_success: 'Booking Successful',
      booking_confirmed: 'Your booking has been confirmed',
      booking_error: 'Booking Error',
      booking_failed: 'Failed to book tickets. Please try again.',
      select_seats: 'Please select at least one seat'
    },
  },
  ua: {
    translation: {
      home: 'Головна',
      search: 'Пошук',
      sessions: 'Сеанси',
      favorites: 'Улюблені',
      admin: 'Адмін панель',
      language: 'Мова',
      obrane: 'Обране',
      actors: 'Актори',
      watch_trailer: 'Дивитись трейлер',
      add_to_favorites: 'Додати в обране',
      in_favorites: 'В обраному',
      notFound: 'Фільм не знайдено',
      new_release: 'Новинка!',
      details: 'Детальніше',
      no_favorites: 'Поки немає фільмів в Обраному.',
      remove: 'Видалити',
      page: {
        home: 'Головна сторінка',
        film: 'Сторінка фільму',
        search: 'Сторінка пошуку',
        sessions: 'Сторінка сеансів',
        favorites: 'Сторінка обраного',
        admin: 'Адмін панель'
      },
      search_input: 'Пошук за назвою',
      search_placeholder: 'Введіть назву фільму... ',
      any: 'Будь-який',
      genre: 'Жанр',
      min_rating: 'Мінімальний рейтинг',
      search_btn: 'Пошук',
      no_movies: 'Фільми не знайдені.',
      date: 'Дата',
      time: 'Час',
      price: 'Ціна',
      no_sessions: 'Сеансів не знайдено.',
      films: 'Фільми',
      add_film: 'Додати фільм',
      edit_film: 'Редагувати фільм',
      poster_url: 'URL постера',
      title_en: 'Назва (EN)',
      title_ua: 'Назва (UA)',
      desc_en: 'Опис (EN)',
      desc_ua: 'Опис (UA)',
      genres: 'Жанри (через кому)',
      release: 'Дата виходу',
      trailer: 'Посилання на трейлер',
      actor_list: 'Актори (через кому)',
      save: 'Зберегти',
      cancel: 'Скасувати',
      edit: 'Редагувати',
      delete: 'Видалити',
      sessions_manage: 'Менеджмент сеансів — найближчим часом!',
      add_session: 'Додати сеанс',
      edit_session: 'Редагувати сеанс',
      film: 'Фільм',
      choose_film: 'Оберіть фільм',
      currency: 'грн',
      currency_rate: 1,
      // Auth translations
      login: 'Увійти',
      register: 'Зареєструватися',
      logout: 'Вийти',
      email: 'Електронна пошта',
      password: 'Пароль',
      name: 'Ім\'я',
      login_success: 'Вхід успішний',
      welcome_back: 'З поверненням!',
      register_success: 'Реєстрація успішна',
      account_created: 'Ваш аккаунт створено',
      auth_error: 'Помилка аутентифікації',
      auth_error_desc: 'Перевірте ваші дані та спробуйте знову',
      need_account: 'Потрібен аккаунт?',
      have_account: 'Вже маєте аккаунт?',
      login_desc: 'Введіть ваші дані для входу',
      register_desc: 'Створіть новий аккаунт для бронювання квитків',
      // Booking translations
      book_tickets: 'Забронювати квитки',
      book_tickets_for: 'Бронювання квитків на',
      screen: 'Екран',
      selected_seats: 'Вибрані місця',
      total_price: 'Загальна вартість',
      confirm_booking: 'Підтвердити бронювання',
      booking_success: 'Бронювання успішне',
      booking_confirmed: 'Ваше бронювання підтверджено',
      booking_error: 'Помилка бронювання',
      booking_failed: 'Не вдалося забронювати квитки. Спробуйте ще раз.',
      select_seats: 'Будь ласка, виберіть хоча б одне місце'
    },
  },
};

i18n
  .use(initReactI18next)
  .init({
    resources,
    lng: 'en',
    fallbackLng: 'en',
    interpolation: { escapeValue: false },
  });

const rootElement = document.getElementById("root");
if (!rootElement) {
  throw new Error("Failed to find root element");
}

ReactDOM.createRoot(rootElement).render(
  <React.StrictMode>
    <I18nextProvider i18n={i18n}>
      <AuthProvider>
        <App />
      </AuthProvider>
    </I18nextProvider>
  </React.StrictMode>
);
