import React from 'react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, AreaChart, Area } from 'recharts';
import { Scale, Activity, Apple, Sparkles, AlertTriangle, ShieldCheck } from 'lucide-react';

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
          <div style={{ height: 320, width: '100%', marginTop: 24 }}>
            <ResponsiveContainer>
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
              <div className="mt-8 p-6 bg-white border border-slate-200 rounded-xl shadow-sm">
                  <h3 className="text-lg font-bold text-slate-800 mb-4 flex items-center gap-2">
                      <Activity className="h-5 w-5 text-indigo-600" />
                      Clinical Risk Assessment
                  </h3>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
                      <div className="p-4 bg-slate-50 rounded-lg border border-slate-100">
                          <p className="text-sm text-slate-500 mb-1">Stunting/Malnutrition Probability</p>
                          <p className="text-3xl font-bold text-slate-800">
                              {(riskProbability * 100).toFixed(1)}%
                          </p>
                      </div>
                      <div className="p-4 bg-slate-50 rounded-lg border border-slate-100">
                          <p className="text-sm text-slate-500 mb-1">Actionable Alert Level</p>
                          <div className="flex items-center gap-2">
                              {actionableAlert === 'Red' ? <AlertTriangle className="h-6 w-6 text-rose-500" /> : 
                                actionableAlert === 'Orange' ? <AlertTriangle className="h-6 w-6 text-amber-500" /> : 
                                <CheckCircle2 className="h-6 w-6 text-emerald-500" />}
                              <p className={`text-2xl font-bold ${
                                  actionableAlert === 'Red' ? 'text-rose-600' : 
                                  actionableAlert === 'Orange' ? 'text-amber-600' : 'text-emerald-600'
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
                          <AlertTriangle className="h-4 w-4 flex-shrink-0" />
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
