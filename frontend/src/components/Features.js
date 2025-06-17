import "./Features.css"
const Features = () => (
    <div className="features1">
        <img className="features-img" src="/pic2.png" alt="Feature 1" />
        <div className="features">
            <h2>Why Compliance Agent?</h2>
            <ul className="features-list">
                <li>
                    <div>
                        <strong>⚙️ Automated Merging</strong>
                        <p>Say goodbye to manual PDF work.</p>
                    </div>
                </li>
                <li>
                    <div>
                        <strong>📄 Smart File Handling</strong>
                        <p>Drop PDFs, JPEGs, or PNGs — our system automatically converts images into PDFs.</p>

                    </div>
                </li>
                <li>
                    <div>
                        <strong>🚀 Faster Compliance</strong>
                        <p>Complete compliance packaging in seconds.</p>
                    </div>
                </li>
                <li>
                    <div>
                        <strong>🧑‍💻 User-Friendly Interface</strong>
                        <p>Built for non-tech-savvy team members.</p>
                    </div>
                </li>
            </ul>

        </div>
    </div>
);
export default Features;
