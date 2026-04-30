import React, { useState, useEffect } from 'react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, AreaChart, Area } from 'recharts';
import { Scale, Activity, Apple, Sparkles, AlertTriangle, ShieldCheck, CheckCircle2 } from 'lucide-react';

const growthData = [
  { age: '6m', current: 50, projected: 50, ideal: 50 },
  { age: '12m', current: 55, projected: 58, ideal: 50 },
  { age: '18m', current: 62, projected: 65, ideal: 50 },
  { age: '2y', current: 70, projected: 75, ideal: 50 },
  { age: '3y', current: null, projected: 82, ideal: 50 },
  { age: '5y', current: null, projected: 88, ideal: 50 },
  { age: '8y', current: null, projected: 92, ideal: 50 },
  { age: '10y', current: null, projected: 95, ideal: 50 },
];

export default function GrowthModule() {
  const [riskProbability, setRiskProbability] = useState(null);
  const [actionableAlert, setActionableAlert] = useState(null);
  const [parentGuidance, setParentGuidance] = useState("");

  useEffect(() => {
    // Fetch Growth ML Risk on load using dummy patient parameters
    fetch('http://localhost:8000/api/predict/growth', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        age_months: 28,
        weight_kg: 10.5,
        height_cm: 82.0,
        diet_diversity: 4
      })
    })
    .then(res => res.json())
    .then(data => {
      setRiskProbability(data.stunting_risk_probability);
      setActionableAlert(data.actionable_alert);

      // Fetch AI Guidance
      fetch('http://localhost:8000/api/generate_guidance', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
            risk_level: data.actionable_alert === 'Red' ? 'High' : 'Low',
            module_type: 'growth',
            probability: data.stunting_risk_probability
        })
      })
      .then(res => res.json())
      .then(aiData => setParentGuidance(aiData.guidance))
      .catch(err => console.error(err));
    })
    .catch(err => console.error(err));
  }, []);

  return (
    <>
      <header className="header">
        <div>
          <h1>Growth & Nutrition Intelligence</h1>
          <p>
            <span className="patient-badge">CH-8902</span>
            Female, 2 Years 4 Months
          </p>
        </div>
        <div className="user-profile">
          <div style={{ textAlign: 'right' }}>
            <div style={{ fontWeight: 700, fontSize: 15, color: '#0f172a' }}>Dr. Sharma</div>
            <div style={{ fontSize: 13, color: '#64748b' }}>Pediatrician</div>
          </div>
          <div className="avatar">S</div>
        </div>
      </header>

      <div className="grid-bento">
        {/* Quick Stats */}
        <div className="glass-panel col-span-3">
          <div className="card-header">
            <div className="card-title"><Scale size={20} color="#0ea5e9" /> Current HAZ</div>
          </div>
          <div className="metric-value" style={{ color: '#e11d48' }}>-2.1</div>
          <div className="metric-label">High Risk (Stunting)</div>
          <div className="progress-bar-bg">
            <div className="progress-bar-fill" style={{ width: '20%', background: 'linear-gradient(90deg, #f43f5e, #fb7185)' }}></div>
          </div>
        </div>

        <div className="glass-panel col-span-3">
          <div className="card-header">
            <div className="card-title"><Activity size={20} color="#8b5cf6" /> Growth Velocity</div>
          </div>
          <div className="metric-value" style={{ color: '#059669' }}>+0.5</div>
          <div className="metric-label">Δz-score / mo (Improving)</div>
          <div className="progress-bar-bg">
            <div className="progress-bar-fill" style={{ width: '65%', background: 'linear-gradient(90deg, #10b981, #34d399)' }}></div>
          </div>
        </div>

        <div className="glass-panel col-span-3">
          <div className="card-header">
            <div className="card-title"><Apple size={20} color="#f59e0b" /> Diet Diversity</div>
          </div>
          <div className="metric-value" style={{ color: '#d97706' }}>4<span style={{ fontSize: 24, color: '#94a3b8' }}>/7</span></div>
          <div className="metric-label">MDD Score (Suboptimal)</div>
          <div className="progress-bar-bg">
            <div className="progress-bar-fill" style={{ width: '57%', background: 'linear-gradient(90deg, #f59e0b, #fbbf24)' }}></div>
          </div>
        </div>

        <div className="glass-panel col-span-3">
          <div className="card-header">
            <div className="card-title"><Sparkles size={20} color="#db2777" /> NCD Risk (18y)</div>
          </div>
          <div className="metric-value" style={{ color: '#db2777' }}>24%</div>
          <div className="metric-label">LSTM Projected Risk</div>
          <div className="progress-bar-bg">
            <div className="progress-bar-fill" style={{ width: '24%', background: 'linear-gradient(90deg, #db2777, #f472b6)' }}></div>
          </div>
        </div>

        {/* Main Chart */}
        <div className="glass-panel col-span-8">
          <div className="card-header">
            <div className="card-title">Future Obesity & Growth Trajectory (LSTM AI)</div>
            <span className="status-badge status-warning">Orange Alert</span>
          </div>
          <div style={{ height: 320, width: '100%', minWidth: 0, marginTop: 24 }}>
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={growthData}>
                <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" vertical={false} />
                <XAxis dataKey="age" stroke="#64748b" tick={{ fill: '#64748b', fontSize: 13 }} axisLine={false} tickLine={false} />
                <YAxis stroke="#64748b" tick={{ fill: '#64748b', fontSize: 13 }} axisLine={false} tickLine={false} />
                <Tooltip />
                <Line type="monotone" dataKey="ideal" stroke="#10b981" strokeWidth={3} dot={false} name="Ideal (50th %ile)" />
                <Line type="monotone" dataKey="current" stroke="#0ea5e9" strokeWidth={4} name="Current BMI %ile" activeDot={{ r: 8 }} />
                <Line type="monotone" dataKey="projected" stroke="#f59e0b" strokeWidth={3} strokeDasharray="6 6" name="AI Projection" />
              </LineChart>
            </ResponsiveContainer>
          </div>
          
          {riskProbability !== null && (
              <div className="glass-panel" style={{ marginTop: '24px' }}>
                  <div className="card-header">
                    <div className="card-title">
                        <Activity size={20} color="#4f46e5" />
                        Clinical Risk Assessment
                    </div>
                  </div>
                  
                  <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px', marginBottom: '24px' }}>
                      <div style={{ padding: '16px', backgroundColor: '#f8fafc', borderRadius: '12px', border: '1px solid #e2e8f0' }}>
                          <p className="metric-label" style={{ marginTop: 0 }}>Stunting/Malnutrition Probability</p>
                          <p className="metric-value" style={{ marginTop: '8px', fontSize: '32px', color: '#0f172a' }}>
                              {(riskProbability * 100).toFixed(1)}%
                          </p>
                      </div>
                      <div style={{ padding: '16px', backgroundColor: '#f8fafc', borderRadius: '12px', border: '1px solid #e2e8f0' }}>
                          <p className="metric-label" style={{ marginTop: 0 }}>Actionable Alert Level</p>
                          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginTop: '8px' }}>
                              {actionableAlert === 'Red' ? <AlertTriangle size={28} color="#e11d48" /> : 
                                actionableAlert === 'Orange' ? <AlertTriangle size={28} color="#d97706" /> : 
                                <CheckCircle2 size={28} color="#059669" />}
                              <p className="metric-value" style={{ marginTop: 0, fontSize: '28px', color: 
                                  actionableAlert === 'Red' ? '#e11d48' : 
                                  actionableAlert === 'Orange' ? '#d97706' : '#059669'
                              }}>
                                  {actionableAlert}
                              </p>
                          </div>
                      </div>
                  </div>

                  {/* Gemini AI Generated Parent Guidance */}
                  {parentGuidance && (
                      <div style={{ marginTop: '16px', padding: '20px', backgroundColor: '#eef2ff', border: '1px solid #c7d2fe', borderRadius: '12px' }}>
                          <h4 style={{ fontSize: '15px', fontWeight: '600', color: '#3730a3', marginBottom: '8px', display: 'flex', alignItems: 'center', gap: '8px' }}>
                              <Sparkles size={18} />
                              AI Parent Guidance (English & ಕನ್ನಡ)
                          </h4>
                          <p style={{ color: '#334155', whiteSpace: 'pre-line', lineHeight: '1.6', fontSize: '15px' }}>
                              {parentGuidance}
                          </p>
                      </div>
                  )}

                  {/* Medical Disclaimer */}
                  <div style={{ marginTop: '16px', padding: '16px', backgroundColor: '#fffbeb', border: '1px solid #fde68a', borderRadius: '12px' }}>
                      <p style={{ fontSize: '13px', color: '#92400e', display: 'flex', alignItems: 'flex-start', gap: '8px', margin: 0, lineHeight: '1.5' }}>
                          <AlertTriangle size={16} style={{ flexShrink: 0, marginTop: '2px' }} />
                          <span><strong>Disclaimer:</strong> CHIRAG is an early screening tool powered by Machine Learning, not a diagnostic system. Always consult a pediatrician for clinical diagnosis and actual WHO Z-score calculations.</span>
                      </p>
                  </div>
              </div>
          )}
        </div>

        {/* Alerts */}
        <div className="glass-panel col-span-4" style={{ display: 'flex', flexDirection: 'column' }}>
          <div className="card-header">
            <div className="card-title">Clinical Actions</div>
          </div>
          
          <div className="alert-item danger">
            <div className="alert-icon"><AlertTriangle size={24} /></div>
            <div className="alert-content">
              <h4>Stunting Risk High</h4>
              <p>Weight velocity alone indicates 84% probability of stunting at current trajectory.</p>
            </div>
          </div>

          <div className="alert-item warning">
            <div className="alert-icon"><Activity size={24} /></div>
            <div className="alert-content">
              <h4>Suboptimal Diet</h4>
              <p>Missing iron-rich foods in last 3 weeks. Suggest starting supplementation.</p>
            </div>
          </div>

          <div className="alert-item success">
            <div className="alert-icon"><ShieldCheck size={24} /></div>
            <div className="alert-content">
              <h4>Deworming Up to Date</h4>
              <p>Albendazole administered 2 months ago. Next due in 4 months.</p>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
