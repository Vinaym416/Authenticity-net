import { useState } from 'react';
import axios from 'axios';

export default function App() {
  const [file, setFile] = useState(null);
  const [url, setUrl] = useState('');
  const [response, setResponse] = useState('');
  const [loadingMessage, setLoadingMessage] = useState('');

  const handleFileChange = (e) => {
    setFile(e.target.files[0]);
    setUrl('');
  };

  const handleUrlChange = (e) => {
    setUrl(e.target.value);
    setFile(null);
  };

  const handleSubmit = async (endpoint) => {
    if (!file && !url) return alert('Please select a file or enter a URL');
    setResponse('');
    setLoadingMessage(`Starting scan on ${endpoint}...`);

    try {
      let res;
      if (file) {
        const formData = new FormData();
        formData.append('file', file);
        res = await axios.post(`http://localhost:5000/api/${endpoint}/scan`, formData, {
          headers: { 'Content-Type': 'multipart/form-data' },
        });
      } else {
        res = await axios.post(`http://localhost:5000/api/${endpoint}/scan`, {
          videoUrl: url
        });
      }
      setLoadingMessage(`Scan complete from ${endpoint} `);
      setResponse(JSON.stringify(res.data, null, 2));
    } catch (err) {
      console.error('Error:', err);
      setResponse(err.response?.data || 'Error occurred while testing API.');
      setLoadingMessage('Error occurred ');
    }
  };

  return (
    <div style={{ padding: 20 }}>
      <h1>Deepfake API Tester</h1>

      <div style={{ marginBottom: 20 }}>
        <h3>Upload File</h3>
        <input type="file" accept="image/*,video/*" onChange={handleFileChange} />
      </div>

      <div style={{ marginBottom: 20 }}>
        <h3>Or Enter URL</h3>
        <input 
          type="url" 
          placeholder="Enter media URL"
          value={url}
          onChange={handleUrlChange}
          style={{ width: '100%', maxWidth: '500px', padding: '8px' }}
        />
      </div>

      <div style={{ marginTop: 10 }}>
        <button onClick={() => handleSubmit('deepware')} style={{ marginRight: '10px' }}>Test Deepware</button>
        <button onClick={() => handleSubmit('invid')} style={{ marginRight: '10px' }}>Test InVID</button>
        <button onClick={() => handleSubmit('adobesdk')}>Test AdobeSDK</button>
      </div>

      <div style={{ marginTop: 20 }}>
        {loadingMessage && <p><b>Status:</b> {loadingMessage}</p>}
        {response && (
          <pre style={{ background: '#f4f4f4', padding: '15px', borderRadius: '5px' }}>
            {response}
          </pre>
        )}
      </div>
    </div>
  );
}
