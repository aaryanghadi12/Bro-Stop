import React from 'react';
import { LayoutDashboard, PlusCircle, History, Mail, Settings } from 'lucide-react';

export function MobileNav({ activeTab, setActiveTab, onOpenSettings }) {
  const tabs = [
    { id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard },
    { id: 'add', label: 'Log Spend', icon: PlusCircle, isHighlight: true },
    { id: 'feed', label: 'Roasts', icon: History },
    { id: 'email', label: 'Report', icon: Mail }
  ];

  return (
    <nav className="mobile-bottom-nav">
      {tabs.map(tab => {
        const Icon = tab.icon;
        const isActive = activeTab === tab.id;

        if (tab.isHighlight) {
          return (
            <button
              key={tab.id}
              className={`mobile-nav-item highlight ${isActive ? 'active' : ''}`}
              onClick={() => setActiveTab(tab.id)}
            >
              <div className="mobile-nav-circle">
                <Icon size={20} />
              </div>
              <span>{tab.label}</span>
            </button>
          );
        }

        return (
          <button
            key={tab.id}
            className={`mobile-nav-item ${isActive ? 'active' : ''}`}
            onClick={() => setActiveTab(tab.id)}
          >
            <Icon size={18} />
            <span>{tab.label}</span>
          </button>
        );
      })}
    </nav>
  );
}
