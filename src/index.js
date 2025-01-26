const express = require('express');
const CloneRepo = require('./utils/cloneRepo');

const app = express();
const port = 3000;

// Middleware for parsing JSON bodies
app.use(express.json());

// Middleware for parsing URL-encoded bodies
app.use(express.urlencoded({ extended: true }));



// or use named properties


// Basic route
app.get('/', (req, res) => {
    res.send('Hello World!');
    simpleGit.clone()
});

app.use('/clone',CloneRepo);

// Start server
app.listen(port, () => {
    console.log(`Server running at http://localhost:${port}`);
});