import React, { useState } from 'react';
import { BrainCircuit, Activity, CheckSquare, HeartPulse, User, ShieldAlert, ShieldCheck, FileText } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import GrowthModule from './components/GrowthModule';
import DevelopmentModule from './components/DevelopmentModule';
import { translations } from './translations';
import { countriesData } from './countriesData';
import './index.css';

const getTranslationKey = (langName) => {
  if (langName === 'English') return 'en';
  if (langName === 'Hindi') return 'hi';
  if (langName === 'Kannada') return 'kn';
  return 'en'; // fallback
};

export default function App() {
  const [activeTab, setActiveTab] = useState('growth');
  
  const [selectedCountry, setSelectedCountry] = useState('');
  const [selectedLanguage, setSelectedLanguage] = useState('');
  const [appReady, setAppReady] = useState(false);

  const tKey = selectedLanguage ? getTranslationKey(selectedLanguage) : 'en';
  const t = translations[tKey];

  const startApp = () => {
    if (selectedCountry && selectedLanguage) {
      setAppReady(true);
    }
  };

  if (!appReady) {
    return (
      <div className="onboarding-layout">
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="onboarding-card glass-panel"
        >
          <div style={{ textAlign: 'center', marginBottom: 30 }}>
            <BrainCircuit size={48} color="#0ea5e9" style={{ margin: '0 auto', marginBottom: 16 }} />
            <h1 style={{ fontSize: 24, marginBottom: 8 }}>{t.onboarding.welcome}</h1>
            <p style={{ color: 'var(--text-muted)' }}>Digital Interface Setup</p>
          </div>

          <div style={{ marginBottom: 24 }}>
            <label style={{ display: 'block', marginBottom: 8, fontSize: 14, fontWeight: 500 }}>{t.onboarding.selectCountry}</label>
            <select 
              value={selectedCountry}
              onChange={(e) => {
                setSelectedCountry(e.target.value);
                setSelectedLanguage('');
              }}
              className="select-input"
            >
              <option value="" disabled>Select Country</option>
              {countriesData.map(c => <option key={c.name} value={c.name}>{c.name}</option>)}
            </select>
          </div>

          <AnimatePresence>
            {selectedCountry && (
              <motion.div 
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: 'auto' }}
                exit={{ opacity: 0, height: 0 }}
                style={{ marginBottom: 24, overflow: 'hidden' }}
              >
                <label style={{ display: 'block', marginBottom: 8, fontSize: 14, fontWeight: 500 }}>{t.onboarding.selectLanguage}</label>
                <select 
                  value={selectedLanguage}
                  onChange={(e) => setSelectedLanguage(e.target.value)}
                  className="select-input"
                >
                  <option value="" disabled>Select Language</option>
                  {countriesData.find(c => c.name === selectedCountry)?.languages.map(l => (
                    <option key={l} value={l}>{l}</option>
                  ))}
                </select>
              </motion.div>
            )}
          </AnimatePresence>

          <button 
            className="action-btn" 
            style={{ width: '100%', justifyContent: 'center', opacity: (selectedCountry && selectedLanguage) ? 1 : 0.5 }}
            disabled={!selectedCountry || !selectedLanguage}
            onClick={startApp}
          >
            {t.onboarding.continueBtn}
          </button>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="dashboard-layout">
      {/* Sidebar */}
      <aside className="sidebar">
        <div>
          <div className="logo" style={{ marginBottom: 48 }}>
            <BrainCircuit size={36} color="#0ea5e9" strokeWidth={2.5} />
            CHIRAG
          </div>
          
          <div className="nav-section-title">Clinical Modules</div>
          <div className="nav-links">
            <div 
              className={`nav-link ${activeTab === 'growth' ? 'active' : ''}`}
              onClick={() => setActiveTab('growth')}
            >
              <Activity size={20} /> 
              {t.sidebar.growth}
            </div>
            
            <div 
              className={`nav-link ${activeTab === 'development' ? 'active' : ''}`}
              onClick={() => setActiveTab('development')}
            >
              <CheckSquare size={20} /> 
              {t.sidebar.development}
            </div>

            <div className="nav-link">
              <ShieldAlert size={20} /> 
              Immunization (Beta)
            </div>
            
            <div className="nav-link">
              <HeartPulse size={20} /> 
              Cardiovascular
            </div>
          </div>
          
          <div className="nav-section-title" style={{ marginTop: 32 }}>Patient & Docs</div>
          <div className="nav-links">
            <div className="nav-link"><User size={20} /> Demographics</div>
            <div className="nav-link"><FileText size={20} /> Generate Reports</div>
          </div>
        </div>
        
        {/* Environment Badge */}
        <div style={{ 
          marginTop: 'auto', 
          background: 'rgba(16, 185, 129, 0.1)', 
          padding: '16px', 
          borderRadius: '16px',
          display: 'flex',
          gap: '12px',
          alignItems: 'center'
        }}>
          <ShieldCheck size={24} color="#059669" />
          <div>
            <div style={{ fontSize: 13, fontWeight: 700, color: '#059669' }}>Offline Ready</div>
            <div style={{ fontSize: 11, color: '#047857' }}>Last synced 2m ago</div>
          </div>
        </div>
      </aside>

      {/* Main Content */}
      <main className="main-content">
        <AnimatePresence mode="wait">
          {activeTab === 'growth' && (
            <motion.div 
              key="growth"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              transition={{ duration: 0.3 }}
            >
              <GrowthModule />
            </motion.div>
          )}
          
          {activeTab === 'development' && (
            <motion.div 
              key="development"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              transition={{ duration: 0.3 }}
            >
              <DevelopmentModule t={t} />
            </motion.div>
          )}
        </AnimatePresence>
      </main>
    </div>
  );
}
