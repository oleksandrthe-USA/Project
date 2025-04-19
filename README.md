# React + TypeScript + Vite

This template provides a minimal setup to get React working in Vite with HMR and some ESLint rules.

Currently, two official plugins are available:

- [@vitejs/plugin-react](https://github.com/vitejs/vite-plugin-react/blob/main/packages/plugin-react/README.md) uses [Babel](https://babeljs.io/) for Fast Refresh
- [@vitejs/plugin-react-swc](https://github.com/vitejs/vite-plugin-react-swc) uses [SWC](https://swc.rs/) for Fast Refresh

## Expanding the ESLint configuration

If you are developing a production application, we recommend updating the configuration to enable type aware lint rules:

- Configure the top-level `parserOptions` property like this:

```js
export default tseslint.config({
  languageOptions: {
    // other options...
    parserOptions: {
      project: ['./tsconfig.node.json', './tsconfig.app.json'],
      tsconfigRootDir: import.meta.dirname,
    },
  },
})
```

- Replace `tseslint.configs.recommended` to `tseslint.configs.recommendedTypeChecked` or `tseslint.configs.strictTypeChecked`
- Optionally add `...tseslint.configs.stylisticTypeChecked`
- Install [eslint-plugin-react](https://github.com/jsx-eslint/eslint-plugin-react) and update the config:

```js
// eslint.config.js
import react from 'eslint-plugin-react'

export default tseslint.config({
  // Set the react version
  settings: { react: { version: '18.3' } },
  plugins: {
    // Add the react plugin
    react,
  },
  rules: {
    // other rules...
    // Enable its recommended rules
    ...react.configs.recommended.rules,
    ...react.configs['jsx-runtime'].rules,
  },
})

# Cinema Movie — Web App

## Опис
Сучасний сайт для кінотеатру із мультимовною підтримкою, пошуком, обраними, адміністратором та сучасним дизайном. Працює у локальній мережі, без серверної частини (всі зміни зберігаються у браузері).

---

## Інструкція для запуску на Windows

### Вимоги
- **Node.js** (LTS): https://nodejs.org/
- **Bun** (пакетний менеджер):
  Встановити можна через PowerShell:
  ```powershell
  iwr https://bun.sh/install.ps1 -useb | iex
  ```
- **Git** (опційно, якщо ви клонували репозитарій з GitHub)

### Кроки запуску
1. Клонуйте проєкт або скопіюйте папку у потрібне місце на диску.
2. Відкрийте цю папку через Провідник, натисніть «Відкрити у терміналі» або відкрийте PowerShell/CMD та перейдіть через `cd` у цю папку:
   ```powershell
   cd шлях\до\вашої\папки\cinema-movie-app
   ```
3. Встановіть залежності:
   ```powershell
   bun install
   ```
4. Запустіть сайт у тестовому режимі:
   ```powershell
   bun run dev
   ```
   У терміналі з’явиться адреса виду `http://localhost:5173/` або `http://ваш-IP:5173/`. Відкрийте цю адресу у браузері — сайт працює!
5. (Опційно) Для production-збірки:
   ```powershell
   bun run build
   ```
   Готові файли з’являться у папці `dist/`

### Типові проблеми та рішення
- Якщо щось не запускається — оновіть Node.js або перезавантажте термінал.
- Якщо хочете подивитися сайт з інших пристроїв у мережі — використовуйте адресу `http://IP-пк:5173/` (див. у налаштуваннях свого ПК/IPConfig).
- Якщо порт зайнятий, змініть його у файлі `vite.config.ts` (за замовчуванням — 5173).

---

## Короткі можливості
- Сучасний дизайн, адаптивність, підтримка темної теми
- Мультимова (українська і англійська)
- Пошук, фільтрація, обране — все працює без серверу
- Адміністратор: додавання/редагування/видалення фільмів і сеансів через локальний UI

---

Запитання — звертайтесь до автора або залишайте issues у репозиторії!
