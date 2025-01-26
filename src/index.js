const express = require('express');
const CloneRepo = require('./utils/cloneRepo');
const path = require('path');
const fs = require('fs');


const app = express();
const port = 3000;

// Middleware for parsing JSON bodies
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

const REPO_DIR = path.join(__dirname, 'repo');
if (!fs.existsSync(REPO_DIR)) {
    fs.mkdirSync(REPO_DIR);
}





// Basic route
app.get('/', (req, res) => {
    res.send('Hello World!');
    simpleGit.clone()
});

app.post('/clone', async (req, res) => {
    const { repoUrl } = req.body;
    console.log(repoUrl);
    try {
        const clonedRepoPath = await CloneRepo(repoUrl);
        res.status(200).json({
            message: 'Repository cloned successfully.',
            repoPath: clonedRepoPath
        });
    } catch(error) {
        res.status(400).json({
            message: error.message
        });
    }
});


// Start server
app.listen(port, () => {
    console.log(`Server running at http://localhost:${port}`);
});