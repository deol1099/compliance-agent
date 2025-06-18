// Navbar.js
import React from 'react';
import { useLocation } from 'react-router-dom';
import './Hero.css';

const Navbar = ({ onHamburgerClick }) => {
    const location = useLocation();

    // Show hamburger only if NOT on homepage
    const showHamburger = location.pathname !== '/';

    return (
        <nav className="navbar">
            {showHamburger && (
                <button className="toggle-btn" onClick={onHamburgerClick}>
                    ☰
                </button>
            )}
            <div className="logo">
                <a href="/"><img src="/pdf.png" alt="Logo" height="40" /></a>
            </div>
        </nav>
    );
};

export default Navbar;
