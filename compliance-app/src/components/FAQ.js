import React, { useState } from 'react';
import './FAQ.css';

const FAQ = () => {
    const faqs = [
        {
            question: "What types of PDF files can I merge?",
            answer: "You can merge any mortgage-related PDF documents such as disclosures, loan estimates, and compliance checklists.",
        },
        {
            question: "Do I need a Dropbox account?",
            answer: "Yes, you’ll need to provide Dropbox links to the PDF files you want to merge.",
        },
        {
            question: "Is my data secure?",
            answer: "Absolutely. We do not store your files; we only use them to generate a merged PDF in real time.",
        },
        {
            question: "How long does the merge process take?",
            answer: "Typically, just a few seconds depending on the number and size of files.",
        },
    ];

    const [openIndex, setOpenIndex] = useState(null);

    const toggleFAQ = (index) => {
        setOpenIndex(openIndex === index ? null : index);
    };

    return (
        <section className="faq-section">
            <h2 className="faq-title">❓ Frequently Asked Questions</h2>
            <div className="faq-list">
                {faqs.map((faq, index) => (
                    <div key={index} className={`faq-item ${openIndex === index ? 'open' : ''}`}>
                        <div className="faq-question" onClick={() => toggleFAQ(index)}>
                            <span>{faq.question}</span>
                            <span className="faq-toggle">{openIndex === index ? "−" : "+"}</span>
                        </div>
                        {openIndex === index && <p className="faq-answer">{faq.answer}</p>}
                    </div>
                ))}
            </div>
        </section>
    );
};

export default FAQ;
