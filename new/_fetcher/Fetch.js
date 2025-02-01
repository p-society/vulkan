import logger from "../_errors/ActuatorErrors.js";

export default class Fetch {
    #fetchURI;
    static #GITHUB_DOMAIN_URI = `github.com`;
    static #SEC_SCHEME = `https://`;

    constructor(uri) {
        this.#fetchURI = uri;
        const isGithubURI = Fetch.#isGitHubURI(this.#fetchURI);
        if (!isGithubURI) throw new Error(`Not a valid Github URI!`);
        console.log(`Valid Github URI...`)
    }

    static #isGitHubURI(uri) {
        console.log(uri);

        if (!(typeof uri === 'string' || uri instanceof String)) {
            return false;
        }

        if (!uri.startsWith(Fetch.#SEC_SCHEME)) {
            logger.error(`Invalid Scheme, expected ${Fetch.#SEC_SCHEME}`);
            return false;
        }

        const isGitHubURI = uri.startsWith(Fetch.#SEC_SCHEME + Fetch.#GITHUB_DOMAIN_URI);
        console.log(isGitHubURI);

        return true;
    }

    
}