import React from 'react';
import "./Hero.css"
const Hero = () => (
    <div className="hero">
        <div className="hero-body">
        <h1>Simplify Mortgage Compliance</h1>
        <p>Merge multiple mortgage-related PDFs into a single, compliant file with just a few clicks.</p>
        <button>Merge PDFs Now</button>
        </div>
        <div className="pdf">
            <img className="pdf1" src="pdf.png" alt="PDF logo" />
        </div>
    </div>

);
export default Hero;
