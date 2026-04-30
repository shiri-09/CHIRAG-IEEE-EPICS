import React, { useState } from 'react';
import { BrainCircuit, Activity, CheckSquare, HeartPulse, User, ShieldAlert, Sparkles, AlertTriangle, ShieldCheck, FileText } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import GrowthModule from './components/GrowthModule';
import DevelopmentModule from './components/DevelopmentModule';
import './index.css';

export default function App() {
  const [activeTab, setActiveTab] = useState('growth');

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
              Growth & Nutrition
            </div>
            
            <div 
              className={`nav-link ${activeTab === 'development' ? 'active' : ''}`}
              onClick={() => setActiveTab('development')}
            >
              <CheckSquare size={20} /> 
              Development 0-5y
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
              <DevelopmentModule />
            </motion.div>
          )}
        </AnimatePresence>
      </main>
    </div>
  );
}
