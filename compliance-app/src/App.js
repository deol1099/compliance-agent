import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import './App.css';

import Hero from './components/Hero';
import Features from './components/Features';
import FAQ from './components/FAQ';
import Contact from './components/Contact';
import { MultiPDFDropBox } from './components/MultiPDFDropBox';
import Navbar from "./components/Navbar";
import FillForm from './components/FillForm';

function HomePage() {
    return (
        <>
            <Hero />
            <Features />
            <FAQ />
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

function FillFormPage() {
    return (
        <div style={{ padding: '20px' }}>
            <h2 style={{ textAlign: 'center', marginBottom: '20px' }}>Fill & Merge AB Checklist</h2>
            <FillForm />
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
                    <Route path="/fill-form" element={<FillFormPage />} />
                </Routes>
            </div>
        </Router>
    );
}

export default App;
