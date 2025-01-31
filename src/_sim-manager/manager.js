import fs from "fs";
import Connection from "../_simulator/handleConnection.js";

/**
 * @typedef {Object} LoadStage
 * @property {number} connections
 * @property {number} [rate]
 * @property {number} duration
 */

/**
 * @typedef {Object} LoadProfile
 * @property {string} [name]
 * @property {Array<LoadStage>} stages
 */

class Manager {
    /**
     * @param {LoadProfile} loadProfile 
     * @param {number} [logInterval=5000] 
     */
    constructor(loadProfile, logInterval = 50) {
        this.loadProfile = loadProfile;
        this.connections = [];
        this.logInterval = logInterval;
        this.logFile = "performance.log";
        this.metricsLogger = null;

        this.#initializeMetricsLogger();
    }

    #initializeMetricsLogger() {
        this.metricsLogger = setInterval(() => {
            const numberOfConnections = this.connections.length;
            const throughput = this.#calculateThroughput();

            const logEntry = {
                timestamp: new Date().toISOString(),
                numberOfConnections,
                throughput,
            };

            fs.appendFileSync(this.logFile, JSON.stringify(logEntry) + "\n");
        }, this.logInterval);
    }

    /**
     * @returns {number} - The throughput.
     */
    #calculateThroughput() {
        return this.connections.reduce((sum, conn) => sum + conn.requests, 0);
    }

    /**
     * @param {LoadStage} stage - The load stage to start.
     */
    async #startStage(stage) {
        const { connections, rate, duration } = stage;

        for (let i = 0; i < connections; i++) {
            const conn = new Connection(); // Replace with your actual connection logic
            this.connections.push(conn);
        }

        await new Promise((resolve) => setTimeout(resolve, duration * 1000));
    }

    async start() {
        for (const stage of this.loadProfile.stages) {
            await this.#startStage(stage);
        }

        this.#stopMetricsLogger();
    }

    #stopMetricsLogger() {
        if (this.metricsLogger) {
            clearInterval(this.metricsLogger);
            this.metricsLogger = null;
        }
    }
}

export default Manager;