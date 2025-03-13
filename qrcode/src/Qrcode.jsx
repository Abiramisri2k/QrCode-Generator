import { jsPDF } from "jspdf";
import { useState } from "react";

export const Qrcode = () => {
    const [img, setImg] = useState("");
    const [loading, setLoading] = useState(false);
    const [qrData, setQrData] =  useState("");
    const [qrSize, setQrSize] = useState("");
    const [error, setError] = useState(false);
    const [format, setFormat] = useState("png");

    async function generateQR(){
        if (!qrData) {
            setError(true); 
            setTimeout(() => setError(false), 1000);  
            return;  
        }

        setLoading(true);
        try {
            const url = `https://api.qrserver.com/v1/create-qr-code/?size=${qrSize}x${qrSize}&data=${encodeURIComponent(qrData)}&format=${format}`; //remove &format=svg for png
            setImg(url);
        } catch (error) {
            console.error("Error generating QR code", error);
        } finally {
            setLoading(false);
        }
    }
    function downloadQR(){
        if (!img) {
            alert("Please generate a QR code before downloading.");
            return;
        }

    if (format === "pdf") {
        fetch(img)
            .then((response) => response.blob())
            .then((blob) => {
                const reader = new FileReader();
                reader.onloadend = function () {
                    const pdf = new jsPDF();
                    const imgData = reader.result;
                    pdf.addImage(imgData, 'PNG', 10, 10, 50, 50);
                    pdf.save("Qrcode.pdf");
                };
                reader.readAsDataURL(blob);
            })
            .catch((error) => console.error("Error Downloading QR Code as PDF", error));
    } else {
        fetch(img)
            .then((response) => response.blob())
            .then((blob) => {
                const link = document.createElement("a");
                link.href = URL.createObjectURL(blob);
                link.download = `Qrcode.${format}`;
                document.body.appendChild(link);
                link.click();
                document.body.removeChild(link);
            })
            .catch((error) => console.error("Error Downloading QR Code", error));
    }
}
    

  return (
    <div className="app-container">
            <h1>QR Code Generator</h1>
            {loading && <p>Please wait...</p>}
            {img && <img src={img} className="qr-code-image" /> }
            <div>
            <label htmlFor="dataInput" className="Input-label">Data for QR code : </label>
            <input type="text" value={qrData} id="dataInput" placeholder="Enter data for QR code" onChange={(e) => setQrData(e.target.value)} className={error ? 'error' : ''}/>
            <label htmlFor="sizeInput" className="Input-label">Image size : </label>
            <input type="text" value={qrSize} onChange={(e) => setQrSize(e.target.value)} id="sizeInput" placeholder="Enter image size"/>
            <label htmlFor="formatSelect" className="input-label">Select Format : </label>
            <select id="formatSelect" value={format} onChange={(e) => setFormat(e.target.value)}>
               <option value="png">PNG</option>
               <option value="svg">SVG</option>
               <option value="pdf">PDF</option>
            </select> 

            <button className="generate-btn" disabled={loading} onClick={generateQR}>Generate QR Code</button>
            <button className="download-btn" onClick={downloadQR} disabled={!img} >Download QR Code</button>
        </div>
        <p className="footer">Designed by <span>Abiramisri</span></p>
    </div>
  )
}

export default Qrcode;