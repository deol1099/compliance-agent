import React from 'react';
import './Sidebar.css';

const Sidebar = ({ sections, isOpen, onToggle }) => {
    return (
        <div className={`sidebar ${isOpen ? 'open' : 'closed'}`}>
            <button className="toggle-btn" onClick={onToggle}>
                {isOpen ? '⮜' : '☰'}
            </button>
            {isOpen && (
                <button className="close-btn" onClick={onToggle}>
                    ×
                </button>
            )}
            <div className={`sidebar-content ${isOpen ? 'open' : 'closed'}`}>
                <ul>
                    {sections.map((section, idx) => (
                        <li key={idx}>
                            <a href={`#${section.replace(/\s+/g, '-').toLowerCase()}`}>{section}</a>
                        </li>
                    ))}
                </ul>
            </div>
        </div>
    );
};


export default Sidebar;
