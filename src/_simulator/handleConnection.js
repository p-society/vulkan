import net from 'net'

// Get TCP server details from environment variables
const TCP_HOST = process.env.TCP_HOST || '127.0.0.1';
const TCP_PORT = process.env.TCP_PORT || 6379;

// Create a TCP client socket
const client = new net.Socket();


// Connect to the TCP server
const simulator = (data)=>{
    client.connect(TCP_PORT, TCP_HOST, () => {
        console.log(`Connected to TCP server at ${TCP_HOST}:${TCP_PORT}`);
        // Send data to the server
        client.write(data);
        console.log(`Sent: ${data}`);
    })
    client.on('data', (e) => {
        console.log(`Received: ${e}`);
        otherFunction(e);
        client.destroy();
    });
};

const otherFunction = (passed_data) => {
    // Do something with the data
    console.log(passed_data)
}
simulator(`*2\r\n$4\r\nKEYS\r\n$1\r\n*\r\n`)
