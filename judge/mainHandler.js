import net from 'net'

// Get TCP server details from environment variables
const TCP_HOST = process.env.TCP_HOST || '127.0.0.1';
const TCP_PORT = process.env.TCP_PORT || 6379;

// Create a TCP client socket
const client = new net.Socket();


// Connect to the TCP server
const f1 = ()=>{
    client.connect(TCP_PORT, TCP_HOST, () => {
        console.log(`Connected to TCP server at ${TCP_HOST}:${TCP_PORT}`);

        // Send data to the server
        const message = `*1\r\n$4\r\nPING\r\n`;
        client.write(message);
        console.log(`Sent: ${message}`);
    })
    client.on('data', (data) => {
        console.log(`Received: ${data.toString()}`);
        client.destroy();
    });
}
f1();
    // client.connect(TCP_PORT, TCP_HOST, () => {
    //     console.log(`Connected to TCP server at ${TCP_HOST}:${TCP_PORT}`);
    //
    //     // Send data to the server
    //     const message = 'Hello, Server!';
    //     client.write(message);
    //     console.log(`Sent: ${message}`);
    // });
    //
    // // Handle data received from the server
    // client.on('data', (data) => {
    //     console.log(`Received: ${data.toString()}`);
    //
    //     // Close the connection after receiving data
    //     client.destroy();
    // });
    //
    // // Handle connection close
    // client.on('close', () => {
    //     console.log('Connection closed');
    // });
    //
    // // Handle errors
    // client.on('error', (err) => {
    //     console.error(`Connection error: ${err.message}`);
    // });
