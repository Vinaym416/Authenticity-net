const express = require('express');
const axios = require('axios');
const multer = require('multer');
const fs = require('fs');
const FormData = require('form-data');

const router = express.Router();
const upload = multer({ dest: 'uploads/' });

router.post('/scan', upload.single('file'), async (req, res) => {
    console.log('[Deepware] Received scan request.');
    try {
        let formData = new FormData();

        if (req.file) {
            formData.append('media', fs.createReadStream(req.file.path));
        } else if (req.body.videoUrl) {
            formData.append('media_url', req.body.videoUrl);
        } else {
            return res.status(400).json({ error: 'No file or videoUrl provided.' });
        }

        const scanResponse = await axios.post('https://api.deepware.ai/v1/scan', formData, {
            headers: {
                'Authorization': `Bearer ${process.env.DEEPWARE_API_KEY}`,
                ...formData.getHeaders()
            }
        });

        const reportId = scanResponse.data.report_id;

        if (!reportId) {
            return res.status(500).json({ error: 'Failed to retrieve report_id.' });
        }

        // Polling
        let reportReady = false;
        let reportData = null;
        const maxAttempts = 10;
        const interval = 3000;
        let attempts = 0;

        while (!reportReady && attempts < maxAttempts) {
            attempts++;
            try {
                const reportResponse = await axios.get(`https://api.deepware.ai/v1/report/${reportId}`, {
                    headers: {
                        'Authorization': `Bearer ${process.env.DEEPWARE_API_KEY}`
                    }
                });

                reportData = reportResponse.data;

                if (reportData?.result_available === true) {
                    reportReady = true;
                    break;
                }
            } catch (err) {
                console.error('[Deepware] Polling error:', err.response?.data || err.message);
            }

            await new Promise(resolve => setTimeout(resolve, interval));
        }

        if (!reportReady) {
            return res.status(504).json({ error: 'Report not ready after multiple attempts.' });
        }

        res.json(reportData);

    } catch (error) {
        console.error('[Deepware] Scan error:', error.response?.data || error.message);
        res.status(500).json({ error: error.response?.data || error.message });
    } finally {
        if (req.file) {
            fs.unlinkSync(req.file.path);
        }
    }
});

module.exports = router;
