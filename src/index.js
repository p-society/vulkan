const Docker = require('dockerode');
const docker = new Docker({ socketPath: '/var/run/docker.sock' });

async function run() {
    try {
        console.log("Listing all containers...");

        const containers = await docker.listContainers({ all: true });
        console.log("Containers:", containers);

        console.log("Creating a new Redis container...");
        const container = await docker.createContainer({
            Image: 'redis:latest',
            name: 'soubhik-redis',
        });

        console.log("Starting the container...");
        await container.start();

        console.log("Container started. Logs:");
        const logs = await container.logs({
            follow: true,
            stdout: true,
            stderr: true,
        });

        logs.pipe(process.stdout);

        console.log("Waiting for the container to finish...");
        await container.wait();

        console.log("Container execution completed. Removing it...");
        await container.remove();

        console.log("Container removed successfully.");
    } catch (error) {
        console.error("Error:", error);
    }
}

run();
