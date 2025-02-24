import simpleGit from "simple-git";
import fs from "fs";
import logger from "../_errors/ActuatorErrors.js";

export default class GitManager {
    #repoLink;
    #git;
    #progress;
    #simpleGitOptions = {
        baseDir: process.cwd(),
        binary: 'git',
        maxConcurrentProcesses: 6,
        trimmed: false,
    };

    constructor(repoLink) {
        this.#repoLink = repoLink;
        this.#progress = ({ method, stage, progress }) =>
            logger.info(`git.${method} ${stage} stage ${progress}% complete`);
        this.#git = simpleGit({ progress: this.#progress, ...this.#simpleGitOptions });
    }

    async pullRepository(branch, localDir) {
        if (typeof branch !== "string") {
            logger.error(`Invalid branch ${branch} provided.`);
            throw new Error(`Invalid branch ${branch} provided.`);
        }

        try {
            if (fs.existsSync(localDir)) {
                console.log(`Directory ${localDir} already exists. Pulling changes...`);
                await this.#git.cwd(localDir);
                await this.#git.checkout(branch);
                await this.#git.pull(['--progress']);
                console.log(`✅ Pulled changes for branch '${branch}'`);
            } else {
                console.log("Cloning the repository...");
                await this.#git.clone(this.#repoLink, localDir, ['--progress']);
                console.log("✅ Repository cloned successfully.");
            }
        } catch (error) {
            logger.error(`Error during git operation: ${error.message}`);
            throw new Error(`Git operation failed: ${error.message}`);
        }
    }
}
