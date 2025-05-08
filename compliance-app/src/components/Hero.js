import React from 'react';
import "./Hero.css"
import { Link } from 'react-router-dom';

const Hero = () => (
    <div className="hero">
        <div className="hero-body">
            <h1>Simplify Mortgage Compliance</h1>
            <p>Merge multiple mortgage-related PDFs into a single, compliant file with just a few clicks.</p>
            <Link to={"compliance-upload"}>
                <button className="merge-button">Merge PDFs Now</button>
            </Link>
        </div>
        <div className="pdf">
            <img className="pdf1" src="pdf.png" alt="PDF logo" />
        </div>
    </div>
);

export default Hero;