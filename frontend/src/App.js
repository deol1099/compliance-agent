import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import './App.css';
import {useState} from "react";
import Hero from './components/Hero';
import Features from './components/Features';
import FAQ from './components/FAQ';
import Contact from './components/Contact';
import  { MultiPDFDropBox } from './components/MultiPDFDropBox';
import Navbar from "./components/Navbar";
import Sidebar from "./components/Sidebar";
function HomePage() {
    return (
        <>
            <Navbar/>
            <Hero />
            <Features />
            <FAQ />
            <Contact />
        </>
    );
}

function ComplianceUploadPage() {
    const [isSidebarOpen, setSidebarOpen] = useState(false);
    const toggleSidebar = () => setSidebarOpen(prev => !prev);

    const sections = [
        "Client Checklist",
        "AML - Signed PEP, AML risk assessment form Photo ID",
        "Client Engagement and WSA",
        "CB - B1",
        "CB - B2",
        "Mortgage Application",
        "Lender Commitment",
        "MPP Application",
        "Indemnification Form",
        "Income - B1 (LOE, Pay stubs, T4/T1, NOA, Bank Statements, Declared Income, Pension)",
        "Income - B2",
        "Down-payment Verification",
        "MLS and Offer to Purchase",
        "Owner occupied - mg statement, pty tax, fire insurance",
        "Rental - mg statement, pty tax (if required) lease.",
        "Rental Analysis",
        "Appraisal (if required)",
        "Bankruptcy, Divorce/Separation Agreement",
        "Any other supporting docs that may be requested by lender",
    ];
    return (

        <div>
            <Navbar onHamburgerClick={toggleSidebar} />
            <Sidebar sections={sections} isOpen={isSidebarOpen} onToggle={toggleSidebar} />
            <h2 style={{ textAlign: 'center', marginBottom: '20px' }}>Compliance Document Upload</h2>
            <MultiPDFDropBox />
        </div>
    );
}

function App() {

    return (
        <Router>
            <div className="App">


                <Routes>
                    <Route path="/" element={<HomePage />} />
                    <Route path="/compliance-upload" element={<ComplianceUploadPage />} />
                </Routes>
            </div>
        </Router>
    );
}

export default App;