import React, { useState } from 'react';
import { Check, TriangleAlert, Video, MapPin } from 'lucide-react';
import { motion } from 'framer-motion';

const initialMilestones = [
  { id: 1, title: 'Uses basic gestures (pointing, waving)', domain: 'social', checked: false, age: '12m' },
  { id: 2, title: 'Says single words (mama, dada)', domain: 'language', checked: true, age: '12m' },
  { id: 3, title: 'Plays peek-a-boo or pat-a-cake', domain: 'cognitive', checked: true, age: '12m' },
  { id: 4, title: 'Pulls up to stand and walks holding on', domain: 'motor', checked: true, age: '12m' },
  { id: 5, title: 'Babbles with inflection', domain: 'language', checked: false, age: '12m' },
];

export default function DevelopmentModule() {
  const [items, setItems] = useState(initialMilestones);

  const toggleCheck = (id) => {
    setItems(items.map(item => item.id === id ? { ...item, checked: !item.checked } : item));
  };

  const uncheckedCount = items.filter(i => !i.checked).length;
  const isHighRisk = uncheckedCount >= 2;

  return (
    <>
      <header className="header">
        <div>
          <h1>Development & Milestone Tracking</h1>
          <p>
            <span className="patient-badge" style={{ background: '#ede9fe', color: '#6366f1' }}>Field View</span>
            12-Month Digital Checklist • Parivarthan ASHA Interface
          </p>
        </div>
        <div className="user-profile">
          <div style={{ textAlign: 'right' }}>
            <div style={{ fontWeight: 700, fontSize: 15, color: '#0f172a' }}>Priya Devi</div>
            <div style={{ fontSize: 13, color: '#64748b' }}>ASHA Worker</div>
          </div>
          <div className="avatar" style={{ background: 'linear-gradient(135deg, #14b8a6, #6366f1)' }}>P</div>
        </div>
      </header>

      <div className="grid-bento">
        {/* Main Checklist */}
        <div className="glass-panel col-span-8">
          <div className="card-header">
            <div className="card-title">12-Month Milestone Checklist</div>
            <span className="status-badge status-warning">In Progress</span>
          </div>
          
          <div className="milestone-list">
            {items.map((item, index) => (
              <motion.div 
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: index * 0.08 }}
                key={item.id} 
                className="milestone-item"
              >
                <div 
                  className={`checkbox ${item.checked ? 'checked' : ''}`}
                  onClick={() => toggleCheck(item.id)}
                >
                  {item.checked && <Check size={18} color="#fff" strokeWidth={3.5} />}
                </div>
                <div className="milestone-content">
                  <h4 className={item.checked ? 'completed' : ''}>{item.title}</h4>
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
                <h3 style={{ color: '#e11d48', marginBottom: 8, fontSize: 19, fontWeight: 800 }}>Autism (ASD) Red Flag Detected</h3>
                <p style={{ color: '#9f1239', opacity: 0.9, marginBottom: 18, fontSize: 15, lineHeight: 1.5 }}>
                  Child is missing key social and language milestones for 12 months (No babbling, No gesturing). 
                  According to Parivarthan protocols, early intervention is highly recommended.
                </p>
                <div style={{ display: 'flex', gap: 14 }}>
                  <button className="action-btn">
                    <MapPin size={18} /> Map Nearest Parivarthan Center
                  </button>
                  <button className="action-btn-outline">
                    Flag for Pediatrician Review
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
              <div className="card-title">Screen Time Tracker</div>
            </div>
            <div style={{ textAlign: 'center', padding: '10px 0' }}>
              <div style={{ fontSize: 56, fontWeight: 800, color: '#e11d48', letterSpacing: '-2px', lineHeight: 1 }}>4.5<span style={{ fontSize: 24 }}>h</span></div>
              <p style={{ color: 'var(--text-muted)', fontSize: 15, marginTop: 4, fontWeight: 500 }}>Daily Average</p>
              <div className="progress-bar-bg" style={{ marginTop: 24, height: 12 }}>
                <div className="progress-bar-fill" style={{ width: '85%', background: 'linear-gradient(90deg, #f43f5e, #e11d48)' }}></div>
              </div>
              <p style={{ color: '#e11d48', fontSize: 13, marginTop: 12, fontWeight: 700 }}>High Risk for Attention Deficit</p>
            </div>
          </div>

          {/* Video */}
          <div className="glass-panel">
            <div className="card-header">
              <div className="card-title">Parent Guidance Gen.</div>
            </div>
            
            <div className="video-card">
              <div className="video-thumb">
                <div className="play-btn"><Video size={24} fill="currentColor" /></div>
              </div>
              <div className="video-info">
                <h4>10 Minutes Floor Time Play</h4>
                <p>Vernacular: Kannada • Early Intervention</p>
              </div>
            </div>
            
            <button className="action-btn" style={{ width: '100%', marginTop: 20, justifyContent: 'center' }}>
              Send to Parent App
            </button>
          </div>

        </div>
      </div>
    </>
  );
}
