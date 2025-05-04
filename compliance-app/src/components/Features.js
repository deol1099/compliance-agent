import "./Features.css"
const Features = () => (
    <div className="features1">
        <img className="features-img" src="pic2.png" alt="Feature 1" />
        <div className="features">
            <h2>Why Compliance Agent?</h2>
            <ul className="features-list">
                <li>
                    <img src="automated merging.png" alt="Automated Merging Icon"/>
                    <div>
                        <strong>Automated Merging</strong>
                        <p>Say goodbye to manual PDF work.</p>
                    </div>
                </li>
                <li>
                    <img src="dropbox.png" alt="Dropbox-Integration Icon"/>
                    <div>
                        <strong>Dropbox Integration</strong>
                        <p>Secure and seamless file handling.</p>
                    </div>
                </li>
                <li>
                    <img src="faster-compliance.png" alt="Faster Compliance Icon"/>
                    <div>
                        <strong>Faster Compliance</strong>
                        <p>Complete compliance packaging in seconds.</p>
                    </div>
                </li>
                <li>
                    <img src="user-friendly.png" alt="User Friendly Interface Icon"/>
                    <div>
                        <strong>User-Friendly Interface</strong>
                        <p>Built for non-tech-savvy team members.</p>
                    </div>
                </li>
            </ul>
        </div>
    </div>
);
export default Features;
