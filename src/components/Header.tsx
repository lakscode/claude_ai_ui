import { Link } from 'react-router-dom';

const Header = () => {
  return (
    <header className="app-header">
      <Link to="/" className="header-logo-link">
        <img src="/images/logo.jpg" alt="Logo" className="header-logo" />
        <span className="header-title">Location Manager</span>
      </Link>
    </header>
  );
};

export default Header;
