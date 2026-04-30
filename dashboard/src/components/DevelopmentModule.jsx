import React, { useState } from 'react';
import { Check, TriangleAlert, Video, MapPin } from 'lucide-react';
import { motion } from 'framer-motion';

const initialChecks = {
  1: false,
  2: true,
  3: true,
  4: true,
  5: false
};

export default function DevelopmentModule({ t }) {
  const [checks, setChecks] = useState(initialChecks);

  const toggleCheck = (id) => {
    setChecks(prev => ({ ...prev, [id]: !prev[id] }));
  };

  const milestones = t.checklist.milestones;
  const uncheckedCount = milestones.filter(m => !checks[m.id]).length;
  const isHighRisk = uncheckedCount >= 2;

  return (
    <>
      <header className="header">
        <div>
          <h1>{t.header.title}</h1>
          <p>
            <span className="patient-badge" style={{ background: '#ede9fe', color: '#6366f1' }}>Field View</span>
            {t.header.subtitle}
          </p>
        </div>
        <div className="user-profile">
          <div style={{ textAlign: 'right' }}>
            <div style={{ fontWeight: 700, fontSize: 15, color: '#0f172a' }}>Priya Devi</div>
            <div style={{ fontSize: 13, color: '#64748b' }}>{t.header.ashaWorker}</div>
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
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: index * 0.08 }}
                key={item.id} 
                className="milestone-item"
              >
                <div 
                  className={`checkbox ${checks[item.id] ? 'checked' : ''}`}
                  onClick={() => toggleCheck(item.id)}
                >
                  {checks[item.id] && <Check size={18} color="#fff" strokeWidth={3.5} />}
                </div>
                <div className="milestone-content">
                  <h4 className={checks[item.id] ? 'completed' : ''}>{item.title}</h4>
                </div>
                <div className={`milestone-domain domain-${item.domain}`}>
                  {item.domain}
                </div>
              </motion.div>
            ))}
          </div>

          {isHighRisk && (
            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="red-flag-alert"
            >
              <TriangleAlert size={36} color="#e11d48" style={{ marginTop: 4 }} />
              <div>
                <h3 style={{ color: '#e11d48', marginBottom: 8, fontSize: 19, fontWeight: 800 }}>{t.alerts.redFlagTitle}</h3>
                <p style={{ color: '#9f1239', opacity: 0.9, marginBottom: 18, fontSize: 15, lineHeight: 1.5 }}>
                  {t.alerts.redFlagDesc}
                </p>
                <div style={{ display: 'flex', gap: 14 }}>
                  <button className="action-btn">
                    <MapPin size={18} /> {t.alerts.mapBtn}
                  </button>
                  <button className="action-btn-outline">
                    {t.alerts.flagBtn}
                  </button>
                </div>
              </div>
            </motion.div>
          )}
        </div>

        <div className="col-span-4" style={{ display: 'flex', flexDirection: 'column', gap: '28px' }}>
          
          {/* Screen Time */}
          <div className="glass-panel">
            <div className="card-header">
              <div className="card-title">{t.stats.screenTimeTitle}</div>
            </div>
            <div style={{ textAlign: 'center', padding: '10px 0' }}>
              <div style={{ fontSize: 56, fontWeight: 800, color: '#e11d48', letterSpacing: '-2px', lineHeight: 1 }}>4.5<span style={{ fontSize: 24 }}>h</span></div>
              <p style={{ color: 'var(--text-muted)', fontSize: 15, marginTop: 4, fontWeight: 500 }}>{t.stats.dailyAverage}</p>
              <div className="progress-bar-bg" style={{ marginTop: 24, height: 12 }}>
                <div className="progress-bar-fill" style={{ width: '85%', background: 'linear-gradient(90deg, #f43f5e, #e11d48)' }}></div>
              </div>
              <p style={{ color: '#e11d48', fontSize: 13, marginTop: 12, fontWeight: 700 }}>{t.stats.riskLevel}</p>
            </div>
          </div>

          {/* Video */}
          <div className="glass-panel">
            <div className="card-header">
              <div className="card-title">{t.video.title}</div>
            </div>
            
            <div className="video-card">
              <div className="video-thumb">
                <div className="play-btn"><Video size={24} fill="currentColor" /></div>
              </div>
              <div className="video-info">
                <h4>{t.video.videoTitle}</h4>
                <p>{t.video.videoDesc}</p>
              </div>
            </div>
            
            <button className="action-btn" style={{ width: '100%', marginTop: 20, justifyContent: 'center' }}>
              {t.video.sendBtn}
            </button>
          </div>

        </div>
      </div>
    </>
  );
}
