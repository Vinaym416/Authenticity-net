const express = require('express');
const axios = require('axios');
const router = express.Router();

// Example Adobe SDK endpoint (replace with real one)
const ADOBE_SDK_URL = 'https://your-adobe-sdk-api-endpoint.com/verify';

router.post('/verify', async (req, res) => {
  try {
    const { imageUrl } = req.body;
    console.log(`Verifying image via Adobe SDK: ${imageUrl}`);

    const response = await axios.post(ADOBE_SDK_URL, { imageUrl });

    res.json(response.data);
  } catch (error) {
    console.error('Error in Adobe Verify:', error.message);
    res.status(500).json({ message: 'Failed to verify image', error: error.message });
  }
});

module.exports = router;
