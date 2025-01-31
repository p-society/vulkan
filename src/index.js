import Manager from "./_sim-manager/manager.js";
import init from "./init.js";

async function main() {
    // await init(); 

    const manager = new Manager({
        name: "Test",
        stages: [
            {
                connections: 10,
                duration: 5000,
            },
        ],
    });

    await manager.start();
}

main();

