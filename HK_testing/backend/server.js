const express = require('express');
const multer = require('multer');
const axios = require('axios');
const cors = require('cors');
const FormData = require('form-data');
const fs = require('fs');
require('dotenv').config();

const app = express();
const port = 5000;

// Middlewares
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

const upload = multer({ dest: 'uploads/' });

console.log(' Server setup done. Awaiting requests...');

// Route for Deepware API
app.post('/api/deepware/scan', upload.single('file'), async (req, res) => {
    console.log('\n[Deepware]  Received request.');
    try {
        let formData = new FormData();

        if (req.file) {
            console.log('[Deepware]  Uploading file:', req.file.originalname);
            formData.append('media', fs.createReadStream(req.file.path));
        } else if (req.body && req.body.videoUrl) {
            console.log('[Deepware]  Scanning video URL:', req.body.videoUrl);
            formData.append('media_url', req.body.videoUrl);
        } else {
            console.error('[Deepware]  No file or videoUrl provided.');
            return res.status(400).json({ error: 'No file or videoUrl provided.' });
        }

        const response = await axios.post('https://api.deepware.ai/v1/scan', formData, {
            headers: {
                'Authorization': `Bearer ${process.env.DEEPWARE_API_KEY}`,
                ...formData.getHeaders()
            }
        });

        console.log('[Deepware]  Scan request sent successfully.');
        res.json(response.data);

    } catch (error) {
        console.error('[Deepware]  Error during scan:', error.response?.data || error.message);
        res.status(500).json({ error: error.response?.data || error.message });
    } finally {
        if (req.file) {
            try {
                fs.unlinkSync(req.file.path); 
                console.log('[Deepware]  Uploaded file deleted.');
            } catch (e) {
                console.error('[Deepware]  Failed to delete file:', e.message);
            }
        }
    }
});

// Route for InVID Analyze
app.post('/api/invid/analyze', async (req, res) => {
    console.log('\n[InVID]  Received request.');
    try {
        const videoUrl = req.body?.videoUrl;
        if (!videoUrl) {
            console.error('[InVID]  videoUrl missing.');
            return res.status(400).json({ error: 'videoUrl is required' });
        }
        console.log('[InVID]  Analyzing video URL:', videoUrl);

        const response = await axios.post('https://your-invid-api-endpoint.com/analyze', {
            url: videoUrl
        }, {
            headers: {
                'Authorization': `Bearer ${process.env.INVID_API_KEY}`,
                'Content-Type': 'application/json'
            }
        });

        console.log('[InVID]  Analyze request sent successfully.');
        res.json(response.data);

    } catch (error) {
        console.error('[InVID]  Error during analyze:', error.response?.data || error.message);
        res.status(500).json({ error: error.response?.data || error.message });
    }
});

// Route for Adobe SDK Verify
app.post('/api/adobesdk/verify', async (req, res) => {
    console.log('\n[AdobeSDK]  Received request.');
    try {
        const imageUrl = req.body?.imageUrl;
        if (!imageUrl) {
            console.error('[AdobeSDK] ❌ imageUrl missing.');
            return res.status(400).json({ error: 'imageUrl is required' });
        }
        console.log('[AdobeSDK]  Verifying image URL:', imageUrl);

        const response = await axios.post('https://your-adobe-sdk-endpoint.com/verify', {
            imageUrl
        }, {
            headers: {
                'Authorization': `Bearer ${process.env.ADOBE_API_KEY}`,
                'Content-Type': 'application/json'
            }
        });

        console.log('[AdobeSDK]  Verify request sent successfully.');
        res.json(response.data);

    } catch (error) {
        console.error('[AdobeSDK]  Error during verify:', error.response?.data || error.message);
        res.status(500).json({ error: error.response?.data || error.message });
    }
});

app.listen(port, () => {
    console.log(`Server running at: http://localhost:${port}`);
});
