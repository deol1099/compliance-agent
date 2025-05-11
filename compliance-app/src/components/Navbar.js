import React from 'react';
import './Hero.css'; // optional for styling

const Navbar = () => {
    return (
        <nav className="navbar">
            <div className="logo">
                <a href="/"><img src="/pdf.png" alt="Logo" height="40" /></a>
            </div>
        </nav>
    );
};

export default Navbar;
