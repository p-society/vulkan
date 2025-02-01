import logger from "../_errors/ActuatorErrors.js";
import GitManager from "./Git.js";

export default class Fetch {
    #fetchURI;
    #gitManager;
    #eventBus;

    static #GITHUB_DOMAIN_URI = `github.com`;
    static #SEC_SCHEME = `https://`;

    constructor(uri, eventBus) {
        this.#fetchURI = uri;
        this.#eventBus = eventBus;

        const isGithubURI = this.#isGitHubURI(this.#fetchURI);
        if (!isGithubURI) throw new Error(`Not a valid Github URI!`);
        logger.error(`Valid Github URI, Attaching Git-Manager instance`)
        this.#gitManager = new GitManager(uri);
    }

    #isGitHubURI(uri) {
        logger.info(uri);

        if (!(typeof uri === 'string' || uri instanceof String)) {
            return false;
        }

        if (!uri.startsWith(Fetch.#SEC_SCHEME)) {
            logger.error(`Invalid Scheme, expected ${Fetch.#SEC_SCHEME}`);
            return false;
        }

        const isGitHubURI = uri.startsWith(Fetch.#SEC_SCHEME + Fetch.#GITHUB_DOMAIN_URI);
        logger.info(isGitHubURI);

        return true;
    }

    async fetchTargetRepository(branch, localDir) {
        await this.#gitManager.pullRepository(branch, localDir);
    }
}