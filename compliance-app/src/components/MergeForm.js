import { useState } from 'react';

const MergeForm = () => {
    const [email, setEmail] = useState('');
    const [links, setLinks] = useState('');
    const [notes, setNotes] = useState('');

    const handleSubmit = (e) => {
        e.preventDefault();
        console.log({ email, links, notes });
        // Submit to backend
    };

    return (
        <section className="form">
            <h2>Merge Your Files</h2>
            <form onSubmit={handleSubmit}>
                <input type="email" placeholder="Your Email" onChange={(e) => setEmail(e.target.value)} />
                <input type="text" placeholder="Dropbox File Links" onChange={(e) => setLinks(e.target.value)} />
                <textarea placeholder="Notes" onChange={(e) => setNotes(e.target.value)} />
                <button type="submit">Generate PDF</button>
            </form>
        </section>
    );
};

export default MergeForm;
