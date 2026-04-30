import React, { useState } from 'react'
import { Check, BrainCircuit, Activity, FileText, CheckSquare, TriangleAlert, Video, MessageCircleWarning, MapPin } from 'lucide-react'
import { motion } from 'framer-motion'
import './index.css'

const milestones = [
  { id: 1, title: 'Uses basic gestures (pointing, waving)', domain: 'social', checked: false, age: '12m' },
  { id: 2, title: 'Says single words (mama, dada)', domain: 'language', checked: true, age: '12m' },
  { id: 3, title: 'Plays peek-a-boo or pat-a-cake', domain: 'cognitive', checked: true, age: '12m' },
  { id: 4, title: 'Pulls up to stand and walks holding on', domain: 'motor', checked: true, age: '12m' },
  { id: 5, title: 'Babbles with inflection', domain: 'language', checked: false, age: '12m' },
]

export default function App() {
  const [items, setItems] = useState(milestones);

  const toggleCheck = (id) => {
    setItems(items.map(item => item.id === id ? { ...item, checked: !item.checked } : item))
  }

  const uncheckedCount = items.filter(i => !i.checked).length;
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
          <div className="nav-link"><Activity size={20} /> Growth & Nutrition</div>
          <div className="nav-link active"><CheckSquare size={20} /> Development</div>
          <div className="nav-link"><MessageCircleWarning size={20} /> Mental Health</div>
          <div className="nav-link"><FileText size={20} /> Safety & Risks</div>
        </div>
      </aside>

      {/* Main Content */}
      <main className="main-content">
        <header className="header">
          <div>
            <h1>Development & Milestone Tracking</h1>
            <p>12-Month Digital Checklist • Parivarthan ASHA Interface</p>
          </div>
          <div className="user-profile">
            <div style={{ textAlign: 'right' }}>
              <div style={{ fontWeight: 600 }}>Priya Devi</div>
              <div style={{ fontSize: 13, color: 'var(--text-muted)' }}>ASHA Worker</div>
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
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.1 }}
                  key={item.id} 
                  className="milestone-item"
                >
                  <div 
                    className={`checkbox ${item.checked ? 'checked' : ''}`}
                    onClick={() => toggleCheck(item.id)}
                  >
                    {item.checked && <Check size={16} color="#fff" strokeWidth={3} />}
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
                  <h3 style={{ color: '#fca5a5', marginBottom: 8, fontSize: 18 }}>Autism (ASD) Red Flag Detected</h3>
                  <p style={{ color: '#f8fafc', opacity: 0.9, marginBottom: 16 }}>
                    Child is missing key social and language milestones for 12 months (No babbling, No gesturing). 
                    According to Parivarthan protocols, early intervention is highly recommended.
                  </p>
                  <div style={{ display: 'flex', gap: 12 }}>
                    <button className="action-btn" style={{ background: '#ef4444' }}>
                      <MapPin size={18} /> Map Nearest Parivarthan Center
                    </button>
                    <button className="action-btn" style={{ background: 'transparent', border: '1px solid #ef4444', color: '#fca5a5' }}>
                      Flag for Pediatrician Review
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
                <div className="card-title">Screen Time Tracker</div>
              </div>
              <div style={{ textAlign: 'center', padding: '20px 0' }}>
                <div style={{ fontSize: 48, fontWeight: 700, color: '#fca5a5' }}>4.5h</div>
                <p style={{ color: 'var(--text-muted)', fontSize: 14 }}>Daily Average</p>
                <div className="progress-bar-bg" style={{ marginTop: 20 }}>
                  <div className="progress-bar-fill" style={{ width: '85%', background: '#ef4444' }}></div>
                </div>
                <p style={{ color: '#fca5a5', fontSize: 12, marginTop: 8, fontWeight: 600 }}>High Risk for Attention Deficit</p>
              </div>
            </div>

            {/* Parent Guidance Video */}
            <div className="glass-panel">
              <div className="card-header">
                <div className="card-title">Parent Guidance Gen.</div>
              </div>
              
              <div className="video-card">
                <div className="video-thumb">
                  <div className="play-btn"><Video size={24} /></div>
                </div>
                <div className="video-info">
                  <h4>10 Minutes Floor Time Play</h4>
                  <p>Vernacular: Kannada • Early Intervention</p>
                </div>
              </div>
              
              <button className="action-btn" style={{ width: '100%', marginTop: 16, justifyContent: 'center' }}>
                Send to Parent App
              </button>
            </div>

          </div>
        </div>
      </main>
    </div>
  )
}
