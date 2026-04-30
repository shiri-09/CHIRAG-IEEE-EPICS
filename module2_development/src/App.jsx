import React, { useState } from 'react'
import { Check, BrainCircuit, Activity, FileText, CheckSquare, TriangleAlert, Video, MessageCircleWarning, MapPin } from 'lucide-react'
import { motion, AnimatePresence } from 'framer-motion'
import { translations } from './translations'
import { countriesData } from './countriesData'
import './index.css'

const initialChecks = {
  1: false,
  2: true,
  3: true,
  4: true,
  5: false
};

const getTranslationKey = (langName) => {
  if (langName === 'English') return 'en';
  if (langName === 'Hindi') return 'hi';
  if (langName === 'Kannada') return 'kn';
  return 'en'; // fallback for all other languages
};

export default function App() {
  const [selectedCountry, setSelectedCountry] = useState('');
  const [selectedLanguage, setSelectedLanguage] = useState('');
  const [appReady, setAppReady] = useState(false);
  const [checks, setChecks] = useState(initialChecks);

  const tKey = selectedLanguage ? getTranslationKey(selectedLanguage) : 'en';
  const t = translations[tKey];

  const toggleCheck = (id) => {
    setChecks(prev => ({ ...prev, [id]: !prev[id] }));
  }

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
            <BrainCircuit size={48} color="#14b8a6" style={{ margin: '0 auto', marginBottom: 16 }} />
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

  const milestones = t.checklist.milestones;
  const uncheckedCount = milestones.filter(m => !checks[m.id]).length;
  const isHighRisk = uncheckedCount >= 2;

  return (
    <div className="dashboard-layout">
      {/* Sidebar */}
      <aside className="sidebar">
        <div className="logo">
          <BrainCircuit size={32} color="#14b8a6" />
          CHIRAG
        </div>
        <div className="nav-links">
          <div className="nav-link"><Activity size={20} /> {t.sidebar.growth}</div>
          <div className="nav-link active"><CheckSquare size={20} /> {t.sidebar.development}</div>
          <div className="nav-link"><MessageCircleWarning size={20} /> {t.sidebar.mentalHealth}</div>
          <div className="nav-link"><FileText size={20} /> {t.sidebar.safety}</div>
        </div>
      </aside>

      {/* Main Content */}
      <main className="main-content">
        <header className="header">
          <div>
            <h1>{t.header.title}</h1>
            <p>{t.header.subtitle}</p>
          </div>
          <div className="user-profile">
            <div style={{ textAlign: 'right' }}>
              <div style={{ fontWeight: 600 }}>Priya Devi</div>
              <div style={{ fontSize: 13, color: 'var(--text-muted)' }}>{t.header.ashaWorker}</div>
            </div>
            <div className="avatar" style={{ background: 'linear-gradient(135deg, #14b8a6, #6366f1)' }}>P</div>
          </div>
        </header>

        <div className="grid-bento">
          
          {/* Main Checklist */}
          <div className="glass-panel col-span-8">
            <div className="card-header">
              <div className="card-title">{t.checklist.title}</div>
              <span className="status-badge status-warning">{t.checklist.status}</span>
            </div>
            
            <div className="milestone-list">
              {milestones.map((item, index) => (
                <motion.div 
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.1 }}
                  key={item.id} 
                  className="milestone-item"
                >
                  <div 
                    className={`checkbox ${checks[item.id] ? 'checked' : ''}`}
                    onClick={() => toggleCheck(item.id)}
                  >
                    {checks[item.id] && <Check size={16} color="#fff" strokeWidth={3} />}
                  </div>
                  <div className="milestone-content">
                    <h4>{item.title}</h4>
                  </div>
                  <div className={`milestone-domain domain-${item.domain}`}>
                    {item.domain}
                  </div>
                </motion.div>
              ))}
            </div>

            {isHighRisk && (
              <motion.div 
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                className="red-flag-alert"
              >
                <TriangleAlert size={32} color="#ef4444" />
                <div>
                  <h3 style={{ color: '#fca5a5', marginBottom: 8, fontSize: 18 }}>{t.alerts.redFlagTitle}</h3>
                  <p style={{ color: '#f8fafc', opacity: 0.9, marginBottom: 16 }}>
                    {t.alerts.redFlagDesc}
                  </p>
                  <div style={{ display: 'flex', gap: 12 }}>
                    <button className="action-btn" style={{ background: '#ef4444' }}>
                      <MapPin size={18} /> {t.alerts.mapBtn}
                    </button>
                    <button className="action-btn" style={{ background: 'transparent', border: '1px solid #ef4444', color: '#fca5a5' }}>
                      {t.alerts.flagBtn}
                    </button>
                  </div>
                </div>
              </motion.div>
            )}
          </div>

          <div className="col-span-4" style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
            
            {/* Parenting Stats */}
            <div className="glass-panel">
              <div className="card-header">
                <div className="card-title">{t.stats.screenTimeTitle}</div>
              </div>
              <div style={{ textAlign: 'center', padding: '20px 0' }}>
                <div style={{ fontSize: 48, fontWeight: 700, color: '#fca5a5' }}>4.5h</div>
                <p style={{ color: 'var(--text-muted)', fontSize: 14 }}>{t.stats.dailyAverage}</p>
                <div className="progress-bar-bg" style={{ marginTop: 20 }}>
                  <div className="progress-bar-fill" style={{ width: '85%', background: '#ef4444' }}></div>
                </div>
                <p style={{ color: '#fca5a5', fontSize: 12, marginTop: 8, fontWeight: 600 }}>{t.stats.riskLevel}</p>
              </div>
            </div>

            {/* Parent Guidance Video */}
            <div className="glass-panel">
              <div className="card-header">
                <div className="card-title">{t.video.title}</div>
              </div>
              
              <div className="video-card">
                <div className="video-thumb">
                  <div className="play-btn"><Video size={24} /></div>
                </div>
                <div className="video-info">
                  <h4>{t.video.videoTitle}</h4>
                  <p>{t.video.videoDesc}</p>
                </div>
              </div>
              
              <button className="action-btn" style={{ width: '100%', marginTop: 16, justifyContent: 'center' }}>
                {t.video.sendBtn}
              </button>
            </div>

          </div>
        </div>
      </main>
    </div>
  )
}
