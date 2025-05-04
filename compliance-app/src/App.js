import React from 'react';
import './App.css';
import Hero from './components/Hero';
import Features from './components/Features';
import MergeForm from './components/MergeForm';
import FAQ from './components/FAQ';
import Contact from './components/Contact';

function App() {
  return (
      <div className="App">
        <Hero />
        <Features />
          <div className="App1">
            <MergeForm />
            <FAQ />
          </div>
        <Contact />
      </div>
  );
}

export default App;
