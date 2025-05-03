import React from 'react';

const Contact = () => {
    return (
        <section className="contact">
            <h2>Contact Us</h2>
            <ul>
                <li><strong>Email:</strong> support@complianceagent.com</li>
                <li><strong>Phone:</strong> +1 (555) 123-4567</li>
                <li><strong>Address:</strong> 123 Mortgage Blvd, Suite 200, Loanville, USA</li>
            </ul>
            <p>Follow us:</p>
            <ul className="socials">
                <li><a href="https://linkedin.com">LinkedIn</a></li>
                <li><a href="https://twitter.com">Twitter</a></li>
            </ul>
        </section>
    );
};

export default Contact;
