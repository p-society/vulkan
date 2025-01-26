
const express = require('express');

const app = express();
const port = 3000;

// Middleware for parsing JSON bodies
app.use(express.json());

// Middleware for parsing URL-encoded bodies
app.use(express.urlencoded({ extended: true }));



// or use named properties
const { simpleGit, CleanOptions } = require('simple-git');
simpleGit().clean(CleanOptions.FORCE);
let remoteRepos='https://github.com/p-society/vulkan.git'
// Basic route
app.get('/', (req, res) => {
    res.send('Hello World!');
    simpleGit.clone()
});

// Start server
app.listen(port, () => {
    console.log(`Server running at http://localhost:${port}`);
});