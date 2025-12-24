import { NavLink } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import {
  HomeIcon,
  LocationIcon,
  DashboardIcon,
  SettingsIcon,
  LogoutIcon,
  ChevronLeftIcon,
  ChevronRightIcon,
  UserIcon
} from './Icons';

interface SidebarProps {
  isCollapsed: boolean;
  onToggle: () => void;
}

const Sidebar = ({ isCollapsed, onToggle }: SidebarProps) => {
  const { user, logout } = useAuth();

  const handleLogout = () => {
    logout();
  };

  return (
    <aside className={`sidebar ${isCollapsed ? 'collapsed' : ''}`}>
      <div className="sidebar-header">
        {!isCollapsed && (
          <div className="sidebar-brand">
            <img src="/images/logo.jpg" alt="Koncord" className="sidebar-logo" />
            <span className="sidebar-title">Location Manager</span>
          </div>
        )}
        <button className="sidebar-toggle" onClick={onToggle}>
          {isCollapsed ? <ChevronRightIcon /> : <ChevronLeftIcon />}
        </button>
      </div>

      <nav className="sidebar-nav">
        <ul className="sidebar-menu">
          <li>
            <NavLink to="/" className={({ isActive }) => `sidebar-link ${isActive ? 'active' : ''}`} end>
              <span className="sidebar-icon"><HomeIcon /></span>
              {!isCollapsed && <span className="sidebar-text">Home</span>}
            </NavLink>
          </li>
          <li>
            <NavLink to="/dashboard" className={({ isActive }) => `sidebar-link ${isActive ? 'active' : ''}`}>
              <span className="sidebar-icon"><DashboardIcon /></span>
              {!isCollapsed && <span className="sidebar-text">Dashboard</span>}
            </NavLink>
          </li>
          <li>
            <NavLink to="/" className={({ isActive }) => `sidebar-link ${isActive ? 'active' : ''}`}>
              <span className="sidebar-icon"><LocationIcon /></span>
              {!isCollapsed && <span className="sidebar-text">Locations</span>}
            </NavLink>
          </li>
          <li>
            <NavLink to="/settings" className={({ isActive }) => `sidebar-link ${isActive ? 'active' : ''}`}>
              <span className="sidebar-icon"><SettingsIcon /></span>
              {!isCollapsed && <span className="sidebar-text">Settings</span>}
            </NavLink>
          </li>
        </ul>
      </nav>

      <div className="sidebar-footer">
        {user && (
          <div className="sidebar-user">
            <div className="user-avatar">
              <UserIcon />
            </div>
            {!isCollapsed && (
              <div className="user-info">
                <span className="user-name">{user.name}</span>
                <span className="user-email">{user.email}</span>
              </div>
            )}
          </div>
        )}
        <button className="sidebar-logout" onClick={handleLogout}>
          <span className="sidebar-icon"><LogoutIcon /></span>
          {!isCollapsed && <span className="sidebar-text">Logout</span>}
        </button>
      </div>
    </aside>
  );
};

export default Sidebar;
