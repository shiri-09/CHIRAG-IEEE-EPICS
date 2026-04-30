import React from 'react'
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, AreaChart, Area } from 'recharts'
import { Activity, AlertTriangle, ChevronRight, Apple, HeartPulse, Scale, ShieldAlert, Sparkles, User, BrainCircuit } from 'lucide-react'
import './index.css'

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

const obesityData = [
  { month: 'Jan', risk: 15 },
  { month: 'Feb', risk: 18 },
  { month: 'Mar', risk: 24 },
  { month: 'Apr', risk: 35 },
  { month: 'May', risk: 42 },
  { month: 'Jun', risk: 58 },
];

export default function App() {
  return (
    <div className="dashboard-layout">
      {/* Sidebar */}
      <aside className="sidebar">
        <div className="logo">
          <BrainCircuit size={32} color="#8b5cf6" />
          CHIRAG
        </div>
        <div className="nav-links">
          <div className="nav-link active"><Activity size={20} /> Growth & Nutrition</div>
          <div className="nav-link"><ShieldAlert size={20} /> Immunization</div>
          <div className="nav-link"><HeartPulse size={20} /> Cardiovascular</div>
          <div className="nav-link"><User size={20} /> Patient Profile</div>
        </div>
      </aside>

      {/* Main Content */}
      <main className="main-content">
        <header className="header">
          <div>
            <h1>Growth & Nutrition Intelligence</h1>
            <p>Patient ID: CH-8902 • Female, 2 Years 4 Months</p>
          </div>
          <div className="user-profile">
            <div style={{ textAlign: 'right' }}>
              <div style={{ fontWeight: 600 }}>Dr. Sharma</div>
              <div style={{ fontSize: 13, color: 'var(--text-muted)' }}>Pediatrician</div>
            </div>
            <div className="avatar">S</div>
          </div>
        </header>

        <div className="grid-bento">
          
          {/* Quick Stats */}
          <div className="glass-panel col-span-3">
            <div className="card-header">
              <div className="card-title"><Scale size={18} color="#3b82f6" /> Current HAZ Score</div>
            </div>
            <div className="metric-value" style={{ color: '#fca5a5' }}>-2.1</div>
            <div className="metric-label">High Risk (Stunting)</div>
            <div className="progress-bar-bg">
              <div className="progress-bar-fill" style={{ width: '20%', background: '#ef4444' }}></div>
            </div>
          </div>

          <div className="glass-panel col-span-3">
            <div className="card-header">
              <div className="card-title"><Activity size={18} color="#8b5cf6" /> Growth Velocity</div>
            </div>
            <div className="metric-value" style={{ color: '#6ee7b7' }}>+0.5</div>
            <div className="metric-label">Δz-score / month (Improving)</div>
            <div className="progress-bar-bg">
              <div className="progress-bar-fill" style={{ width: '65%', background: '#10b981' }}></div>
            </div>
          </div>

          <div className="glass-panel col-span-3">
            <div className="card-header">
              <div className="card-title"><Apple size={18} color="#f59e0b" /> Diet Diversity</div>
            </div>
            <div className="metric-value">4 / 7</div>
            <div className="metric-label">MDD Score (Suboptimal)</div>
            <div className="progress-bar-bg">
              <div className="progress-bar-fill" style={{ width: '57%', background: '#f59e0b' }}></div>
            </div>
          </div>

          <div className="glass-panel col-span-3">
            <div className="card-header">
              <div className="card-title"><Sparkles size={18} color="#ec4899" /> NCD Risk (18y)</div>
            </div>
            <div className="metric-value">24%</div>
            <div className="metric-label">LSTM Projected Risk</div>
            <div className="progress-bar-bg">
              <div className="progress-bar-fill" style={{ width: '24%', background: '#ec4899' }}></div>
            </div>
          </div>

          {/* Main Chart */}
          <div className="glass-panel col-span-8">
            <div className="card-header">
              <div className="card-title">Future Obesity & Growth Trajectory (LSTM Prediction)</div>
              <span className="status-badge status-warning">Orange Alert</span>
            </div>
            <div style={{ height: 300, width: '100%', marginTop: 20 }}>
              <ResponsiveContainer>
                <LineChart data={growthData}>
                  <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.1)" />
                  <XAxis dataKey="age" stroke="#94a3b8" />
                  <YAxis stroke="#94a3b8" />
                  <Tooltip 
                    contentStyle={{ background: 'rgba(15, 23, 42, 0.9)', border: '1px solid rgba(255,255,255,0.1)', borderRadius: 8 }}
                    itemStyle={{ color: '#fff' }}
                  />
                  <Line type="monotone" dataKey="ideal" stroke="#10b981" strokeWidth={2} dot={false} name="Ideal (50th %ile)" />
                  <Line type="monotone" dataKey="current" stroke="#3b82f6" strokeWidth={3} name="Current BMI %ile" />
                  <Line type="monotone" dataKey="projected" stroke="#f59e0b" strokeWidth={3} strokeDasharray="5 5" name="AI Projection" />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </div>

          {/* Alerts */}
          <div className="glass-panel col-span-4">
            <div className="card-header">
              <div className="card-title">Actionable Insights</div>
            </div>
            
            <div className="alert-item danger">
              <div className="alert-icon"><AlertTriangle size={20} /></div>
              <div className="alert-content">
                <h4>Stunting Risk High</h4>
                <p>Weight velocity alone indicates 84% probability of stunting at current trajectory.</p>
              </div>
            </div>

            <div className="alert-item warning">
              <div className="alert-icon"><Activity size={20} /></div>
              <div className="alert-content">
                <h4>Suboptimal Diet</h4>
                <p>Missing iron-rich foods in last 3 weeks. Suggest starting supplementation.</p>
              </div>
            </div>

            <div className="alert-item success">
              <div className="alert-icon"><ShieldAlert size={20} /></div>
              <div className="alert-content">
                <h4>Deworming Up to Date</h4>
                <p>Albendazole administered 2 months ago. Next due in 4 months.</p>
              </div>
            </div>
          </div>

        </div>
      </main>
    </div>
  )
}
