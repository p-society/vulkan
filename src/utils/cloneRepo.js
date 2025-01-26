const path = require('path');
const simpleGit = require('simple-git');
const axios = require('axios'); 
const fs = require('fs');

const REPO_DIR = path.join(__dirname, '../../repo');

// Function to fetch repository details using GitHub API
function createEnvFile(targetPath, envVars) {
  if (typeof envVars !== 'object' || envVars === null) {
    throw new Error('Invalid argument: envVars must be an object');
  }
  targetPath=path.join(targetPath,'.env');
  console.log({ targetPath, envVars });

  // Ensure the target directory exists
  const directoryPath = path.dirname(targetPath);
  if (!fs.existsSync(directoryPath)) {
    fs.mkdirSync(directoryPath, { recursive: true });
  }

  // Convert the object to a .env-compatible string
  const envFileContent = Object.entries(envVars)
    .map(([key, value]) => `${key}=${value}`)
    .join('\n');
  console.log({ envFileContent });

  // Write the string to the specified file
  fs.writeFileSync(targetPath, envFileContent, 'utf8');
  console.log(`.env file has been created at ${targetPath}`);
}



const getRepoSize = async (repoUrl) => {
  try {
    // Extract owner and repo name from the URL
    console.log(repoUrl);
    const match = repoUrl.match(/https:\/\/github\.com\/([^/]+)\/([^/]+)\.git/);
    if (!match) throw new Error('Invalid GitHub repository URL.');

    const [_, owner, repo] = match;

    // GitHub API endpoint
    const apiUrl = `https://api.github.com/repos/${owner}/${repo}`;

    // Fetch repo details
    const response = await axios.get(apiUrl);
    const { size } = response.data; // Size is in kilobytes

    // Convert size to MB
    const sizeMB = size / 1024;
    return sizeMB;
  } catch (error) {
    console.error('Error fetching repository size:', error.message);
    throw new Error('Unable to check repository size.');
  }
};

// Function to clone repository
const cloneRepo = async (repoUrl,envVars) => {
  try {
    // Validate the URL
    if (!repoUrl || !/^https:\/\/github\.com\/.+\/.+\.git$/.test(repoUrl)) {
      throw new Error('Invalid Git repository URL.');
    }

    // Check repo size before cloning
    const sizeMB = await getRepoSize(repoUrl);
    if (sizeMB > 50) {
      throw new Error(`Repository size is too big (${sizeMB.toFixed(2)} MB). Maximum allowed size is 50 MB.`);
    }

    // Extract repo name
    const repoName = repoUrl.split('/').pop().replace('.git', '');
    const targetPath = path.join(REPO_DIR, repoName);
    console.log({targetPath})
    // Check if the directory already exists
    if (fs.existsSync(targetPath)) {
      throw new Error(`Repository '${repoName}' already exists.`);
    }

    // Initialize simple-git
    const git = simpleGit();

    // Clone the repository
    await git.clone(repoUrl, targetPath);
    console.log(`Repository cloned successfully: ${targetPath}`);
    createEnvFile(targetPath,envVars)
    return targetPath;
  } catch (error) {
    console.error('Error cloning repository:', error.message);
    throw error;
  }
};

module.exports = cloneRepo;
