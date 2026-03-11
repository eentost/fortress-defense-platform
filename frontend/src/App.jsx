import React, { useState, useEffect } from 'react';
import './App.css';
import ThreatDashboard from './components/ThreatDashboard';
import AlertCenter from './components/AlertCenter';
import MitigationPanel from './components/MitigationPanel';

function App() {
  const [threats, setThreats] = useState([]);
  const [alerts, setAlerts] = useState([]);
  const [loading, setLoading] = useState(false);
  const [activeTab, setActiveTab] = useState('dashboard');

  const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:8080/api';

  useEffect(() => {
    fetchThreats();
    fetchAlerts();
    const interval = setInterval(() => {
      fetchThreats();
      fetchAlerts();
    }, 30000); // Refresh every 30 seconds
    return () => clearInterval(interval);
  }, []);

  const fetchThreats = async () => {
    try {
      setLoading(true);
      const response = await fetch(`${API_URL}/threats`);
      const data = await response.json();
      setThreats(data || []);
    } catch (error) {
      console.error('Failed to fetch threats:', error);
    } finally {
      setLoading(false);
    }
  };

  const fetchAlerts = async () => {
    try {
      const response = await fetch(`${API_URL}/alerts`);
      const data = await response.json();
      setAlerts(data || []);
    } catch (error) {
      console.error('Failed to fetch alerts:', error);
    }
  };

  const handleCreateThreat = async (threatData) => {
    try {
      const response = await fetch(`${API_URL}/threats`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(threatData),
      });
      if (response.ok) {
        fetchThreats();
      }
    } catch (error) {
      console.error('Failed to create threat:', error);
    }
  };

  const handleMitigate = async (actionData) => {
    try {
      const response = await fetch(`${API_URL}/mitigate`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(actionData),
      });
      if (response.ok) {
        fetchThreats();
        fetchAlerts();
      }
    } catch (error) {
      console.error('Failed to mitigate threat:', error);
    }
  };

  return (
    <div className="app">
      <header className="app-header">
        <h1>🛡️ Fortress Defense Platform</h1>
        <p>Enterprise-Grade Threat Detection & Mitigation System</p>
      </header>

      <nav className="app-nav">
        <button
          className={`nav-btn ${activeTab === 'dashboard' ? 'active' : ''}`}
          onClick={() => setActiveTab('dashboard')}
        >
          Threat Dashboard
        </button>
        <button
          className={`nav-btn ${activeTab === 'alerts' ? 'active' : ''}`}
          onClick={() => setActiveTab('alerts')}
        >
          Alerts ({alerts.length})
        </button>
        <button
          className={`nav-btn ${activeTab === 'mitigate' ? 'active' : ''}`}
          onClick={() => setActiveTab('mitigate')}
        >
          Mitigation
        </button>
      </nav>

      <main className="app-main">
        {loading && <div className="loading">Loading data...</div>}
        
        {activeTab === 'dashboard' && (
          <ThreatDashboard threats={threats} onCreateThreat={handleCreateThreat} />
        )}
        {activeTab === 'alerts' && <AlertCenter alerts={alerts} />}
        {activeTab === 'mitigate' && (
          <MitigationPanel threats={threats} onMitigate={handleMitigate} />
        )}
      </main>

      <footer className="app-footer">
        <p>© 2024 Fortress Defense Platform. Based on OpenClaw Kill Chain Methodology.</p>
      </footer>
    </div>
  );
}

export default App;
