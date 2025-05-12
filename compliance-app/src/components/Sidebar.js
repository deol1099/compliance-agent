import React from 'react';
import './Sidebar.css';

const Sidebar = ({ sections, isOpen, toggleSidebar }) => {
    return (
        <aside className={`sidebar ${isOpen ? 'open' : 'closed'}`} onClick={toggleSidebar}>
            <div className="logo-wrapper">
                <img src="/sidebar.png" alt="Logo" className="logo" />
            </div>
            {isOpen && (
                <>
                    <ul className="nav-list">
                        {[
                            'Client Checklist',
                            'AML - Signed PEP',
                            'Mtg Application',
                            'Income - B1',
                            'Credit Bureau',
                            'Downpayment',
                            'Property Docs',
                            'Compliance Docs'
                        ].map((item, index) => (
                            <li key={index} className="nav-item">
                                {item}
                            </li>
                        ))}
                    </ul>
                    <nav className="sidebar-nav">
                        {sections.map(section => (
                            <a key={section} href={`#${section.replace(/\s+/g, '-')}`} className="nav-link">
                                {section}
                            </a>
                        ))}
                    </nav>
                </>
            )}
        </aside>
    );
};

export default Sidebar;
