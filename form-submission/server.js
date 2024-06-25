const express = require('express');
const multer = require('multer');
const app = express();
const port = process.env.PORT || 3000;

// Configure multer for file upload handling
const upload = multer();

app.use(express.static('public'));

// Endpoint to handle form submission
app.post('/api/submit', upload.none(), (req, res) => {
    const formData = req.body;
    console.log('Form Data:', formData);
    // Placeholder for actual data storage logic (e.g., database)
    res.sendStatus(200);
});

app.listen(port, () => {
    console.log(`Server running at http://localhost:${port}`);
});
