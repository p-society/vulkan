const Docker = require('dockerode');
const docker = new Docker({ socketPath: '/var/run/docker.sock' });

async function run() {
    try {
        const imageName = 'nodejs-express-app-1';
        const containerName = 'nodejs-container-1';

        const buildContextPath = __dirname;

        console.log("Building Docker image...");
        console.log({ buildContextPath })
    
        const buildStream = await docker.buildImage({
            context: buildContextPath, 
            src: ['.']
        }, { t: imageName });

        buildStream.pipe(process.stdout, { end: true });

        await new Promise((resolve, reject) => {
            buildStream.on('end', resolve);
            buildStream.on('error', reject);
        });

        console.log("Docker image built successfully!");

        const container = await docker.createContainer({
            Image: imageName,
            name: containerName,
            ExposedPorts: {
                '6969/tcp': {}
            },
            HostConfig: {
                PortBindings: {
                    '6969/tcp': [{
                        HostPort: '6969'
                    }]
                }
            }
        });

        console.log("Starting the container...");
        await container.start();

        console.log("Container started successfully!");

        container.wait((err, data) => {
            if (err) {
                console.error('Error while waiting for container to stop:', err);
            } else {
                console.log('Container stopped. Exit code:', data.StatusCode);
            }
        });

    } catch (error) {
        console.error("Error:", error);
    }
}

run();
