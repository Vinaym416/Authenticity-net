const express = require('express');
const axios = require('axios');
const router = express.Router();

// Example InVID API endpoint (replace with real one)
const INVID_API_URL = 'https://your-invid-api-endpoint.com/analyze';

router.post('/analyze', async (req, res) => {
  try {
    const { videoUrl } = req.body;
    console.log(`Analyzing via InVID: ${videoUrl}`);

    const response = await axios.post(INVID_API_URL, { videoUrl });

    res.json(response.data);
  } catch (error) {
    console.error('Error in InVID Analyze:', error.message);
    res.status(500).json({ message: 'Failed to analyze video', error: error.message });
  }
});

module.exports = router;
