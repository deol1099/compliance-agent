import React from 'react';

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

    return (
        <section className="faq">
            <h2>Frequently Asked Questions</h2>
            <div>
                {faqs.map((faq, index) => (
                    <div key={index} className="faq-item">
                        <h4>{faq.question}</h4>
                        <p>{faq.answer}</p>
                    </div>
                ))}
            </div>
        </section>
    );
};

export default FAQ;
