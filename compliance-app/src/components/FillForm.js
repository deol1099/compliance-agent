import React, { useEffect, useState } from "react";
import axios from "axios";

const FillForm = () => {
    const [formData, setFormData] = useState({
        "Client Name(s)": "",
        "Deal Number": "",
        "Broker/Agent Name(s)": "",
        "Closing Date": "",
    });

    const [checkboxes, setCheckboxes] = useState([]);
    const [checkedStates, setCheckedStates] = useState({});
    const [files, setFiles] = useState([]);

    // Fetch checkbox field names on mount
    useEffect(() => {
        axios.get("http://localhost:8080/pdf/checkboxes")
            .then((res) => {
                setCheckboxes(res.data);
                const initialStates = {};
                res.data.forEach(name => initialStates[name] = false);
                setCheckedStates(initialStates);
            })
            .catch(err => console.error("Failed to fetch checkboxes:", err));
    }, []);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData({ ...formData, [name]: value });
    };

    const handleCheckboxChange = (e) => {
        const { name, checked } = e.target;
        setCheckedStates({ ...checkedStates, [name]: checked });
    };

    const handleFileChange = (e) => {
        setFiles(Array.from(e.target.files));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        const combinedData = { ...formData };
        Object.entries(checkedStates).forEach(([key, val]) => {
            combinedData[key] = val ? "Yes" : "Off";
        });

        const formDataObj = new FormData();
        formDataObj.append("data", new Blob([JSON.stringify(combinedData)], { type: "application/json" }));
        files.forEach(file => formDataObj.append("files", file));

        try {
            const response = await axios.post("http://localhost:8080/pdf/fill-merge", formDataObj, {
                responseType: "blob"
            });

            const url = window.URL.createObjectURL(new Blob([response.data]));
            const a = document.createElement("a");
            a.href = url;
            a.download = "merged-filled-checklist.pdf";
            a.click();
            window.URL.revokeObjectURL(url);
        } catch (err) {
            console.error("PDF generation failed:", err);
        }
    };

    return (
        <div style={{ padding: "2rem" }}>
            <h2>Fill & Merge AB Checklist</h2>
            <form onSubmit={handleSubmit}>
                <div>
                    <label>Client Name(s):</label>
                    <input type="text" name="Client Name(s)" value={formData["Client Name(s)"]} onChange={handleChange} />
                </div>
                <div>
                    <label>Deal Number:</label>
                    <input type="text" name="Deal Number" value={formData["Deal Number"]} onChange={handleChange} />
                </div>
                <div>
                    <label>Broker/Agent Name(s):</label>
                    <input type="text" name="Broker/Agent Name(s)" value={formData["Broker/Agent Name(s)"]} onChange={handleChange} />
                </div>
                <div>
                    <label>Closing Date:</label>
                    <input type="text" name="Closing Date" value={formData["Closing Date"]} onChange={handleChange} />
                </div>

                <h4>Checklist Options</h4>
                {checkboxes.map((cbName) => (
                    <div key={cbName}>
                        <label>{cbName}:</label>
                        <input
                            type="checkbox"
                            name={cbName}
                            checked={checkedStates[cbName] || false}
                            onChange={handleCheckboxChange}
                        />
                    </div>
                ))}

                <div>
                    <label>Upload Additional PDF(s):</label>
                    <input type="file" multiple onChange={handleFileChange} />
                </div>

                <button type="submit">Download Merged & Filled PDF</button>
            </form>
        </div>
    );
};

export default FillForm;
