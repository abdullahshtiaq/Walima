const express = require('express');
const multer = require('multer');
const app = express();
const port = process.env.PORT || 3001;  // Changed to 3001

// Configure multer for file upload handling
const upload = multer();

app.use(express.static('../public'));

// Endpoint to handle form submission
app.post('/submit', upload.none(), (req, res) => {
    const formData = req.body;
    console.log('Form Data:', formData);
    res.sendStatus(200);
});

app.listen(port, () => {
    console.log(`Server running at http://localhost:${port}`);
});
