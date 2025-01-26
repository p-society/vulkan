co
const express = require('express');

const app = express();
const port = 3000;

// Middleware for parsing JSON bodies
app.use(express.json());

// Middleware for parsing URL-encoded bodies
app.use(express.urlencoded({ extended: true }));


const simpleGit = require('simple-git');
simpleGit().clean(simpleGit.CleanOptions.FORCE);

// or use named properties
const { simpleGit, CleanOptions } = require('simple-git');
simpleGit().clean(CleanOptions.FORCE);

// Basic route
app.get('/', (req, res) => {
    res.send('Hello World!');
});

// Start server
app.listen(port, () => {
    console.log(`Server running at http://localhost:${port}`);
});