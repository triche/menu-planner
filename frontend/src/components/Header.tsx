import React from 'react';
import { useTheme } from '../contexts/ThemeContext';

interface HeaderProps {
  onOpenSettings: () => void;
}

const Header: React.FC<HeaderProps> = ({ onOpenSettings }) => {
  const { isDark, toggleTheme } = useTheme();

  return (
    <header className="app-header">
      <div className="header-content">
        <div className="header-left">
          <h1>Menu Planner</h1>
          <p>AI-Powered Weekly Meal Planning</p>
        </div>
        
        <div className="header-right">
          <button 
            className="theme-toggle"
            onClick={toggleTheme}
            aria-label={`Switch to ${isDark ? 'light' : 'dark'} mode`}
          >
            {isDark ? '☀️' : '🌙'}
          </button>
          
          <button 
            className="settings-button"
            onClick={onOpenSettings}
            aria-label="Open API settings"
          >
            ⚙️
          </button>
        </div>
      </div>
    </header>
  );
};

export default Header;
