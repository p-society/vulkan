import net from 'net';
import { SimulatorDefaultValues } from '../constants/default-values.js';

class ConnectionHandler {

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
    }
    
    #processQueue() {

        if (this.lock || this.queue.length == 0) {
            return;
        }

        this.lock = true;
        const buffer = this.queue.shift();
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
                this.lock = false;
                this.#processQueue();
            })
            .on('close', () => {
                this.isConnected = false;
                console.log('Connection closed');
            })
            .on('error', (error) => {
                this.isConnected = false; 
                console.error(`Error: ${error.message}`);
            });
    }

    sendData(buffer) {
        this.queue.push(buffer);
        this.#processQueue();
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

export default ConnectionHandler;
