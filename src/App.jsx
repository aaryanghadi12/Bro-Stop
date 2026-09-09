import React, { useState, useEffect } from 'react';
import confetti from 'canvas-confetti';
import { LoginPage } from './components/LoginPage';
import { MobileHeader } from './components/MobileHeader';
import { MobileNav } from './components/MobileNav';
import { Sidebar } from './components/Sidebar';
import { ExpenseForm } from './components/ExpenseForm';
import { Dashboard } from './components/Dashboard';
import { RoastFeed } from './components/RoastFeed';
import { RoastModal } from './components/RoastModal';
import { ShameEmailDemo } from './components/ShameEmailDemo';
import { SettingsModal } from './components/SettingsModal';
import { speakSanjuDutt } from './services/voiceService';
import { calculateImpulseScore } from './services/impulseEngine';
import { generateGeminiRoast } from './services/roastEngine';
import { getMemeForCategory } from './data/memeTemplates';
import { getStoredSession, setStoredSession, clearStoredSession } from './services/authService';
import { loadExpenses, saveExpenses, loadSettings, saveSettings, resetToDemoData } from './services/storage';

export function App() {
  // Session persistence: If already logged in, no need to log in again!
  const [currentUser, setCurrentUser] = useState(() => getStoredSession());
  const [expenses, setExpenses] = useState(() => loadExpenses(currentUser?.id || 'default'));
  const [settings, setSettings] = useState(() => loadSettings(currentUser?.id || 'default'));
  const [activeTab, setActiveTab] = useState('dashboard');
  const [modalExpense, setModalExpense] = useState(null);
  const [toast, setToast] = useState(null);
  const [showSettings, setShowSettings] = useState(false);
  const [viewMode, setViewMode] = useState('mobile'); // 'mobile' | 'desktop'

  // Persist expenses whenever changed
  useEffect(() => {
    if (currentUser) {
      saveExpenses(expenses, currentUser.id);
    }
  }, [expenses, currentUser]);

  // Toast auto-dismiss
  useEffect(() => {
    if (toast) {
      const t = setTimeout(() => setToast(null), 3500);
      return () => clearTimeout(t);
    }
  }, [toast]);

  const showToast = (msg) => setToast(msg);

  // Authentication Handlers
  const handleLoginSuccess = (user) => {
    setCurrentUser(user);
    setStoredSession(user);
    const userExpenses = loadExpenses(user.id);
    const userSettings = loadSettings(user.id);
    setExpenses(userExpenses);
    setSettings(userSettings);
    showToast(`Welcome back, ${user.name.split(' ')[0]}! 💸`);
  };

  const handleLogout = () => {
    clearStoredSession();
    setCurrentUser(null);
    showToast('Logged out safely 👋');
  };

  // Expense Handlers
  const handleSubmit = async ({ amount, description, category, timestamp }) => {
    const calc = calculateImpulseScore({ amount, category, timestamp, description, recentExpenses: expenses });
    const roast = await generateGeminiRoast({ description, amount, category, tier: calc.tier, timestamp, apiKey: settings.geminiApiKey });
    const meme = getMemeForCategory(category, calc.tier);

    const exp = {
      id: `exp_${Date.now()}`,
      description, amount, category, timestamp,
      impulseScore: calc.score, tier: calc.tier,
      severityLabel: calc.severityLabel,
      isMidnightDemonic: calc.isMidnightDemonic,
      roastText: roast, memeId: meme.id
    };

    setExpenses(prev => [exp, ...prev]);

    if (calc.tier === 'SAVAGE' || calc.tier === 'MEDIUM') {
      setModalExpense(exp);
      if (settings.audioEnabled) {
        speakSanjuDutt(roast);
      }
    } else {
      showToast(`Logged ₹${amount} — ${roast}`);
      if (calc.tier === 'SAFE') confetti({ particleCount: 25, spread: 50, origin: { y: 0.8 } });
    }
  };

  const handleCancel = (id) => {
    setExpenses(prev => prev.filter(e => e.id !== id));
    showToast('Splurge cancelled! Your dignity is saved 🛡️');
    confetti({ particleCount: 40, spread: 60, origin: { y: 0.7 } });
  };

  const handleDelete = (id) => {
    setExpenses(prev => prev.filter(e => e.id !== id));
    showToast('Record deleted');
  };

  const handleReset = () => {
    const refreshed = resetToDemoData(currentUser?.id || 'default');
    setExpenses(refreshed);
    showToast('Demo data restored 🔄');
  };

  const handleExport = () => {
    const a = document.createElement('a');
    a.href = 'data:text/json;charset=utf-8,' + encodeURIComponent(JSON.stringify(expenses, null, 2));
    a.download = `guilt_trap_${currentUser?.name || 'user'}_${new Date().toISOString().slice(0, 10)}.json`;
    a.click();
    showToast('Exported as JSON');
  };

  const handleSaveSettings = (s) => {
    setSettings(s);
    if (currentUser) {
      saveSettings(s, currentUser.id);
    }
    showToast('Settings saved ⚙️');
  };

  const guiltScore = expenses.length > 0
    ? Math.round(expenses.reduce((a, c) => a + c.impulseScore, 0) / expenses.length) : 0;

  // 1. If not logged in, display the mobile-first Login Screen
  if (!currentUser) {
    return <LoginPage onLoginSuccess={handleLoginSuccess} />;
  }

  // 2. Logged In: Target Audience Mobile View
  if (viewMode === 'mobile') {
    return (
      <div className="mobile-shell-container">
        <div className="mobile-device-canvas">
          {/* Top App Header */}
          <MobileHeader
            user={currentUser}
            guiltScore={guiltScore}
            onOpenSettings={() => setShowSettings(true)}
            onLogout={handleLogout}
          />

          {/* Desktop/Mobile Layout Switcher Banner for convenience */}
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '6px 16px', background: '#f8fafc', borderBottom: '1px solid #f1f5f9', fontSize: '11px', color: '#64748b' }}>
            <span>📱 Mobile Viewport Mode</span>
            <button
              onClick={() => setViewMode('desktop')}
              style={{ background: 'none', border: 'none', color: '#0f172a', fontWeight: 600, cursor: 'pointer', fontSize: '11px' }}
            >
              Switch to Desktop UI ↗
            </button>
          </div>

          {/* Main Mobile Content Area */}
          <main className="mobile-content-scroll">
            {activeTab === 'dashboard' && (
              <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                <Dashboard expenses={expenses} />
                
                {/* Mobile Quick Action Card */}
                <div className="card" style={{ padding: '14px 16px', background: '#f8fafc', border: '1px solid #e2e8f0', borderRadius: '16px' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <div>
                      <div style={{ fontSize: '13px', fontWeight: 700, color: '#0f172a' }}>About to splurge?</div>
                      <div style={{ fontSize: '11px', color: '#64748b' }}>Check your impulse score before paying</div>
                    </div>
                    <button
                      className="btn btn-sm"
                      style={{ background: '#0f172a', color: '#ffffff', border: 'none', fontWeight: 600, borderRadius: '8px', fontSize: '12px' }}
                      onClick={() => setActiveTab('add')}
                    >
                      + Log Spend
                    </button>
                  </div>
                </div>

                {/* Recent Transactions Snippet */}
                <div className="card">
                  <div className="card-header">
                    <h3 className="card-title">Recent Impulses</h3>
                    <button className="btn btn-ghost btn-sm" onClick={() => setActiveTab('feed')}>All ({expenses.length}) →</button>
                  </div>
                  <div className="txn-list">
                    {expenses.slice(0, 3).map(exp => {
                      const tierColors = { SAVAGE: 'red', MEDIUM: 'orange', MILD: 'amber', SAFE: 'green' };
                      return (
                        <div key={exp.id} className="txn-item" style={{ padding: '10px 14px' }}>
                          <div className={`txn-icon ${tierColors[exp.tier] || 'green'}`} style={{ width: '34px', height: '34px', fontSize: '15px' }}>
                            {exp.tier === 'SAVAGE' ? '🔥' : '🛍️'}
                          </div>
                          <div className="txn-details">
                            <div className="txn-title" style={{ fontSize: '13px' }}>{exp.description}</div>
                            <div className="txn-meta">{new Date(exp.timestamp).toLocaleDateString('en-IN', { month: 'short', day: 'numeric' })} · {exp.severityLabel}</div>
                          </div>
                          <div className="txn-right">
                            <div className="txn-amount" style={{ fontSize: '13px' }}>₹{exp.amount.toLocaleString('en-IN')}</div>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>
              </div>
            )}

            {activeTab === 'add' && (
              <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                <ExpenseForm onSubmitExpense={handleSubmit} recentExpenses={expenses} />
              </div>
            )}

            {activeTab === 'feed' && (
              <RoastFeed expenses={expenses} onDeleteExpense={handleDelete} />
            )}

            {activeTab === 'email' && (
              <ShameEmailDemo expenses={expenses} userSettings={settings} />
            )}
          </main>

          {/* Bottom Navigation Bar */}
          <MobileNav
            activeTab={activeTab}
            setActiveTab={setActiveTab}
            onOpenSettings={() => setShowSettings(true)}
          />
        </div>

        {/* Modals */}
        {modalExpense && (
          <RoastModal
            expense={modalExpense}
            onClose={() => setModalExpense(null)}
            onCancelExpense={handleCancel}
          />
        )}

        {showSettings && (
          <SettingsModal
            user={currentUser}
            onLogout={handleLogout}
            settings={settings}
            onSaveSettings={handleSaveSettings}
            onResetDemo={handleReset}
            onExportData={handleExport}
            onClose={() => setShowSettings(false)}
          />
        )}

        {toast && (
          <div className="toast-area">
            <div className="toast-msg">
              <span>✓</span>
              <span>{toast}</span>
            </div>
          </div>
        )}
      </div>
    );
  }

  // 3. Optional Desktop Layout (when user clicks 'Switch to Desktop UI')
  return (
    <div className="app-shell">
      <Sidebar
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        guiltScore={guiltScore}
        expenses={expenses}
        onOpenSettings={() => setShowSettings(true)}
        onResetDemo={handleReset}
      />

      <main className="main-content">
        <div className="page-container">
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
            <div>
              <h1 className="page-title" style={{ textTransform: 'capitalize' }}>{activeTab}</h1>
              <p className="page-description">Welcome back, {currentUser.name}</p>
            </div>
            <div style={{ display: 'flex', gap: '8px' }}>
              <button className="btn btn-outline btn-sm" onClick={() => setViewMode('mobile')}>
                📱 Switch to Mobile View
              </button>
              <button className="btn btn-outline btn-sm" style={{ color: '#dc2626' }} onClick={handleLogout}>
                Log out
              </button>
            </div>
          </div>

          {activeTab === 'dashboard' && (
            <>
              <Dashboard expenses={expenses} />
              <div className="content-grid" style={{ marginTop: '20px' }}>
                <ExpenseForm onSubmitExpense={handleSubmit} recentExpenses={expenses} />
                <div className="card">
                  <div className="card-header">
                    <h3 className="card-title">Recent Activity</h3>
                    <button className="btn btn-ghost btn-sm" onClick={() => setActiveTab('feed')}>View all →</button>
                  </div>
                  <div className="txn-list">
                    {expenses.slice(0, 4).map(exp => (
                      <div key={exp.id} className="txn-item">
                        <div className="txn-details">
                          <div className="txn-title">{exp.description}</div>
                          <div className="txn-meta">{exp.severityLabel}</div>
                        </div>
                        <div className="txn-right">
                          <div className="txn-amount">₹{exp.amount.toLocaleString('en-IN')}</div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </>
          )}

          {activeTab === 'feed' && <RoastFeed expenses={expenses} onDeleteExpense={handleDelete} />}
          {activeTab === 'email' && <ShameEmailDemo expenses={expenses} userSettings={settings} />}
        </div>
      </main>

      {modalExpense && <RoastModal expense={modalExpense} onClose={() => setModalExpense(null)} onCancelExpense={handleCancel} />}
      {showSettings && (
        <SettingsModal
          user={currentUser}
          onLogout={handleLogout}
          settings={settings}
          onSaveSettings={handleSaveSettings}
          onResetDemo={handleReset}
          onExportData={handleExport}
          onClose={() => setShowSettings(false)}
        />
      )}

      {toast && (
        <div className="toast-area">
          <div className="toast-msg">
            <span>✓</span>
            <span>{toast}</span>
          </div>
        </div>
      )}
    </div>
  );
}
