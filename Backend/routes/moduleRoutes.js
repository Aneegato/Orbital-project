const express = require('express');
const axios = require('axios');
const router = express.Router();

router.get('/:moduleCode', async (req, res) => {
    const { moduleCode } = req.params;
    try {
        const response = await axios.get(`https://api.nusmods.com/v2/2023-2024/modules/${moduleCode}.json`);
        res.json(response.data);
    } catch (error) {
        res.status(500).json({ error: 'Failed to fetch module data' });
    }
});

module.exports = router;
