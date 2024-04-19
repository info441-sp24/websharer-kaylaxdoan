import express from 'express';

var router = express.Router();

import getURLPreview from '../utils/urlPreviews.js';

//TODO: Add handlers here
router.get('/preview', async (req, res, next) => {
    try {
        let url = req.query.url
        let previewData = await getURLPreview(url)
        res.json(previewData);
    } catch (error) {
        console.log(error)
        res.status(500).send("Error loading website information")
    }
});

export default router;