import { Outlet } from 'react-router-dom'
import Navigation from './Navigation'
import './Layout.less'

export default function Layout() {
  return (
    <div className="layout">
      <Navigation />
      <main className="main-content">
        <Outlet />
      </main>
      <footer className="footer">
        <div className="footer-content">
          <div className="footer-brand">
            <span className="paw-icon">🐾</span>
            <span className="brand-text">PawSpace</span>
          </div>
          <p className="footer-tagline">Where every pet finds their voice</p>
          <div className="footer-links">
            <a href="#about">About</a>
            <a href="#privacy">Privacy</a>
            <a href="#terms">Terms</a>
            <a href="#contact">Contact</a>
          </div>
          <p className="copyright">&copy; 2024 PawSpace. All rights reserved.</p>
        </div>
      </footer>
    </div>
  )
}
