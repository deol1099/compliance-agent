import React from 'react';
import { BrowserRouter as Router, Routes, Route, Link } from 'react-router-dom';
import './App.css';

import Hero from './components/Hero';
import Features from './components/Features';
import FAQ from './components/FAQ';
import Contact from './components/Contact';
import { MultiPDFDropBox } from './components/MultiPDFDropBox';
import Navbar from "./components/Navbar";

function HomePage() {
    return (
        <>
            <Hero />
            <Features />
            {/*<div className="App1">*/}
            {/*    /!* Wrap MergeForm in a Link *!/*/}
            {/*    <Link to="/compliance-upload" style={{ textDecoration: 'none' }}>*/}
            {/*    </Link>*/}
                <FAQ />
            {/*</div>*/}
            <Contact />
        </>
    );
}

function ComplianceUploadPage() {
    return (
        <div style={{ padding: '20px' }}>
            <h2 style={{ textAlign: 'center', marginBottom: '20px' }}>Compliance Document Upload</h2>
            <MultiPDFDropBox />
        </div>
    );
}

function App() {
    return (
        <Router>
            <div className="App">
                <Navbar />
                <Routes>
                    <Route path="/" element={<HomePage />} />
                    <Route path="/compliance-upload" element={<ComplianceUploadPage />} />
                </Routes>
            </div>
        </Router>
    );
}

export default App;