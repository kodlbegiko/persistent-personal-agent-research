import React from 'react';
import ReactDOM from 'react-dom/client';
import './data/recoveryOverlay.js';
import './data/hourlyEvidenceOverlay.js';
import './navigation-state.js';
import App from './App.jsx';
import PolishedAchievementSystem from './components/PolishedAchievementSystem.jsx';
import { LanguageProvider } from './i18n.jsx';
import './styles.css';
import './achievements.css';
import './research-lines.css';
import './roadmap-interactions.css';
import './macbook.css';
import './i18n.css';
import './polish.css';
import './detail-fixes.css';

// Resolve language before the first React paint so labels never flash in the wrong locale.
const params = new URLSearchParams(window.location.search);
const queryLanguage = params.get('lang');
const savedLanguage = window.localStorage.getItem('jarvis-dashboard-language');
const initialLanguage = queryLanguage === 'en' || queryLanguage === 'en-US'
  ? 'en'
  : queryLanguage === 'zh-Hant' || queryLanguage === 'zh-TW' || queryLanguage === 'zh'
    ? 'zh-Hant'
    : savedLanguage === 'en' ? 'en' : 'zh-Hant';
document.documentElement.lang = initialLanguage;

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <LanguageProvider>
      <App />
      <PolishedAchievementSystem />
    </LanguageProvider>
  </React.StrictMode>,
);
