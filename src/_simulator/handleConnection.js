import net from 'net';
import { defaultValues } from '../constants/default-values.js';

class ConnectionHandler {
    constructor(
        tcpHost,
        tcpPort,
        responseHandler = defaultValues.responseHandler,
        challengeName = defaultValues.challengeName
    ) {
        this.tcpHost = tcpHost;
        this.tcpPort = tcpPort;
        this.responseHandler = responseHandler;
        this.challengeName = challengeName;
        this.client = new net.Socket();
    }

    dialHost() {
        this.client.connect(this.tcpPort, this.tcpHost, () => {
            console.log(`Connected to ${this.challengeName} server at ${this.tcpHost}:${this.tcpPort}`);
        }).on('data', (data) => {
            this.responseHandler(data);
        }).on('close', () => {
            console.log('Connection closed');
        }).on('error', (error) => {
            console.error(`Error: ${error.message}`);
        });
    }

    disconnect() {
        this.client.end().catch((error) => {
            console.error(`Error: ${error}`);
        });
        console.log('Disconnected from server');
    }
}

export default ConnectionHandler;
