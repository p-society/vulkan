import net from 'net';
import { SimulatorDefaultValues } from '../constants/default-values.js';

class Connection {

    constructor(
        tcpHost,
        tcpPort,
        responseHandler = SimulatorDefaultValues.responseHandler,
        challengeName = SimulatorDefaultValues.challengeName
    ) {
        this.tcpHost = tcpHost;
        this.tcpPort = tcpPort;
        this.responseHandler = responseHandler;
        this.challengeName = challengeName;
        this.client = new net.Socket();
        this.isConnected = false;
        this.lock = false;
        this.queue = [];
        this.pendingResponse = null;
    }

    #processQueue() {

        if (this.lock || this.queue.length == 0) {
            return;
        }

        this.lock = true;

        const { buffer, resolve, reject } = this.queue.shift();

        this.pendingResponse = { resolve, reject };
        this.client.write(buffer);
    }

    dialHost() {
        this.client
            .connect(this.tcpPort, this.tcpHost, () => {
                this.isConnected = true;
                console.log(`Connected to ${this.challengeName} server at ${this.tcpHost}:${this.tcpPort}`);
            })
            .on('data', (data) => {
                this.responseHandler(data.toString());

                this.pendingResponse.resolve(data);

                this.pendingResponse = null;
                this.lock = false;
                this.#processQueue();
            })
            .on('close', () => {
                this.isConnected = false;
                console.log('Connection closed');
            })
            .on('error', (error) => {
                this.isConnected = false;

                this.pendingResponse.reject(error);

                console.error(`Error: ${error.message}`);
            });
    }

    sendData(buffer) {
        return new Promise((resolve, reject) => {
            this.queue.push({ buffer, resolve, reject });
            this.#processQueue();
        })
    }


    getStatus() {
        if (this.client.connecting) {
            return 'connecting';
        } else if (this.isConnected) {
            return 'connected';
        } else if (this.client.destroyed) {
            return 'disconnected';
        } else {
            return 'idle';
        }
    }

    disconnect() {
        this.client.end();
    }
}

export default Connection;
