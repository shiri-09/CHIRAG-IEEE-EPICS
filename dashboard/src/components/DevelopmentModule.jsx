import React, { useState, useEffect } from 'react';
import { Check, TriangleAlert, Video, MapPin, Activity } from 'lucide-react';
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
  const [riskProbability, setRiskProbability] = useState(null);
  const [actionableAlert, setActionableAlert] = useState(null);
  const [parentGuidance, setParentGuidance] = useState("");
  const [mlData, setMlData] = useState({
    asd_risk_probability: 0,
    is_high_risk: false,
    actionable_alert: 'Monitor',
    loading: false
  });

  const toggleCheck = (id) => {
    setChecks(prev => ({ ...prev, [id]: !prev[id] }));
  };

  const milestones = t.checklist.milestones;
  
  // Calculate ML Risk dynamically when checks change
  useEffect(() => {
    // Backend expects exactly 10 Q-CHAT scores (0=Pass/Checked, 1=Fail/Unchecked)
    // Note: If checked=true, it means milestone achieved (Pass=0). If unchecked=false, it means missed (Fail=1).
    const q_scores = Array.from({ length: 10 }, (_, i) => checks[i + 1] ? 0 : 1);
    
    setMlData(prev => ({ ...prev, loading: true }));
    fetch('http://localhost:8000/api/predict/asd', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ q_scores })
    })
    .then(res => res.json())
    .then(data => {
      setMlData({
        ...data,
        loading: false
      });
      setRiskProbability(data.asd_risk_probability);
      setActionableAlert(data.actionable_alert);

      // Fetch AI Guidance
      fetch('http://localhost:8000/api/generate_guidance', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
            risk_level: data.actionable_alert === 'Red Flag' ? 'High' : 'Low',
            module_type: 'asd',
            probability: data.asd_risk_probability
        })
      })
      .then(res => res.json())
      .then(gData => setParentGuidance(gData.guidance))
      .catch(err => console.error('Error fetching guidance:', err));
    })
    .catch(err => {
      console.error('Error fetching ASD prediction:', err);
      setMlData(prev => ({ ...prev, loading: false }));
    });
  }, [checks]);

  const isHighRisk = mlData.is_high_risk;

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

          {riskProbability !== null && (
              <div className="mt-8 p-6 bg-white border border-slate-200 rounded-xl shadow-sm">
                  <h3 className="text-lg font-bold text-slate-800 mb-4 flex items-center gap-2">
                      <Activity className="h-5 w-5 text-indigo-600" />
                      Clinical ASD Risk Assessment
                  </h3>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
                      <div className="p-4 bg-slate-50 rounded-lg border border-slate-100">
                          <p className="text-sm text-slate-500 mb-1">ASD Risk Probability</p>
                          <p className="text-3xl font-bold text-slate-800">
                              {(riskProbability * 100).toFixed(1)}%
                          </p>
                      </div>
                      <div className="p-4 bg-slate-50 rounded-lg border border-slate-100">
                          <p className="text-sm text-slate-500 mb-1">Actionable Alert Level</p>
                          <div className="flex items-center gap-2">
                              {actionableAlert === 'Red Flag' ? <AlertTriangle className="h-6 w-6 text-rose-500" /> : 
                               <CheckCircle2 className="h-6 w-6 text-emerald-500" />}
                              <p className={`text-2xl font-bold ${
                                  actionableAlert === 'Red Flag' ? 'text-rose-600' : 'text-emerald-600'
                              }`}>
                                  {actionableAlert}
                              </p>
                          </div>
                      </div>
                  </div>

                  {/* Gemini AI Generated Parent Guidance */}
                  {parentGuidance && (
                      <div className="mt-4 p-5 bg-indigo-50 border border-indigo-100 rounded-lg">
                          <h4 className="text-sm font-semibold text-indigo-800 mb-2 flex items-center gap-2">
                              <Sparkles className="h-4 w-4" />
                              AI Parent Guidance (English & ಕನ್ನಡ)
                          </h4>
                          <p className="text-slate-700 whitespace-pre-line leading-relaxed">
                              {parentGuidance}
                          </p>
                      </div>
                  )}

                  {/* Medical Disclaimer */}
                  <div className="mt-4 p-3 bg-amber-50 border border-amber-200 rounded-lg">
                      <p className="text-xs text-amber-800 text-center flex items-center justify-center gap-2">
                          <AlertTriangle className="h-3 w-3" />
                          <strong>Disclaimer:</strong> CHIRAG is an early screening tool powered by ML, not a diagnostic system. Always consult a pediatric specialist for formal ASD diagnosis.
                      </p>
                  </div>
              </div>
          )}

          {isHighRisk && (
            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="red-flag-alert"
            >
              <TriangleAlert size={36} color="#e11d48" style={{ marginTop: 4 }} />
              <div>
                <h3 style={{ color: '#e11d48', marginBottom: 8, fontSize: 19, fontWeight: 800 }}>
                  {t.alerts.redFlagTitle} (ML Risk: {(mlData.asd_risk_probability * 100).toFixed(1)}%)
                </h3>
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
