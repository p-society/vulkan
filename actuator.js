import express from 'express';
import axios from 'axios';
import bodyParser from 'body-parser';
import Fetcher from './_fetcher/Fetch.js';
import EventBus from './_event-bus/eventBus.js';
import { Events } from './_ee/events.js';
import { parseTargetYAML } from './_config/parse.js';
import Fetch from './_fetcher/Fetch.js';
import logger from './_errors/ActuatorErrors.js';
import { INVALID_CONFIG } from './_ee/messages.js';
import { NODEJS_DOCKERFILE } from './_store/node-js-serve.js';
const app = express();
app.use(bodyParser.json());
import getPort from 'get-port';
import fs from 'node:fs';
import ContainerManager from './_builder/ContainerManager.js';

//--------------------------------------------------------


const EVENT_BUS = new EventBus();
const PORT = 2609;
const ENVIRONMENT = process.env.NODE_ENV || 'development';
let INCREMENTAL_ID = 0;
const containerManager = new ContainerManager();


//--------------------------------------------------------


app.post('/submit', async (req, res) => {
    try {

        const { repoLink } = req.body;
        const fetcher = new Fetch(repoLink);
        EVENT_BUS.emit(Events.TEST_LINK_RECEIVED, { repoLink, fetcher });

        res.status(200).json({ message: `Received GitHub repo link: ${repoLink}. Judging will start soon!` });
    } catch (error) {
        throw new Error(error);
    }
});

//--------------------------------------------------------


app.get('/ping-actuator', async (req, res) => {
    const actuatorUrl = '';

    try {
        const response = await axios.post(actuatorUrl);

        if (response.status === 200) {
            res.status(200).json({ message: 'Actuator is ready.' });
        } else {
            res.status(500).json({ message: 'Actuator is not ready.' });
        }
    } catch (error) {
        console.error('Error pinging actuator:', error);
        res.status(500).json({ message: 'Error pinging actuator server.' });
    }
});


// --------------------------------------------------------



EVENT_BUS.on(Events.TEST_LINK_RECEIVED, async ({ repoLink, fetcher }) => {
    if (!(fetcher instanceof Fetcher)) {
        logger.error(`* oO0OoO0OoO0Oo Didn't receive an instance of Fetcher! Aborting Actuation! oO0OoO0OoO0Oo`)
    }
    const HOST_TARGET_PATH = `tests/test - ${INCREMENTAL_ID++}`;
    console.log({ emitting: HOST_TARGET_PATH })
    Promise.resolve(fetcher.fetchTargetRepository(`main`, HOST_TARGET_PATH)).
        then((result) => {
            if (result === true) {
                EVENT_BUS.emit(Events.REPO_CLONED_ON_SERVER, { HOST_TARGET_PATH });
            }
        })
        .catch((error) => {
            console.error("Error fetching the repository:", error);
        });
})



EVENT_BUS.on(Events.REPO_CLONED_ON_SERVER, async ({ HOST_TARGET_PATH }) => {
    const YAML_FILE_PATH = process.cwd() + `/${HOST_TARGET_PATH}` + `/.vulkan/configuration.yaml`;
    const { config } = parseTargetYAML(YAML_FILE_PATH);

    if (!config) {
        const errorMessage = `❌ Error: Failed to parse YAML configuration from ${process.cwd() + HOST_TARGET_PATH}.`;

        logger.error(INVALID_CONFIG(errorMessage));
    }

    // now, we dont have a db service, so i m hardcoding that . CC @majorbruteforce @todo
    let isDockerfileInjected = false;
    let injectPath = null;
    switch (config.runtime.name) {
        case 'node':
            const randomFreePort = await getPort();
            const dockerfile = NODEJS_DOCKERFILE({ NODEJS_VERSION: `latest`, YARN_VERSION: config.runtime.packageManager.version, PORT: randomFreePort });
            injectPath = process.cwd() + `/${HOST_TARGET_PATH}` + '/Dockerfile';
            fs.writeFileSync(injectPath, dockerfile, { encoding: 'utf-8' });
            isDockerfileInjected = true;
            break;
        default:
            logger.error(`invalid runtime!`);
    }

    if (isDockerfileInjected) {
        EVENT_BUS.emit(Events.DOCKERFILE_INJECTED, { HOST_TARGET_PATH, injectPath });
    }
});

EVENT_BUS.on(Events.DOCKERFILE_INJECTED, async ({ HOST_TARGET_PATH, injectPath }) => {
    console.log({ injectPath });
    await containerManager.buildImage(injectPath);
})

// EVENT_BUS.emit(Events.REPO_CLONED_ON_SERVER, { HOST_TARGET_PATH: `tests/test - 0` })

// --------------------------------------------------------


app.listen(PORT, () => {
    console.log(' '.repeat(60));
    console.log('Actuator Server Started 🚀');
    console.log(`
            ░▒▓███████▓▒░ ░▒▓███████▓▒░░▒▓██████▓▒░ ░▒▓██████▓▒░  
            ░▒▓█▓▒░░▒▓█▓▒░▒▓█▓▒░      ░▒▓█▓▒░░▒▓█▓▒░▒▓█▓▒░░▒▓█▓▒░ 
            ░▒▓█▓▒░░▒▓█▓▒░▒▓█▓▒░      ░▒▓█▓▒░░▒▓█▓▒░▒▓█▓▒░        
            ░▒▓███████▓▒░ ░▒▓██████▓▒░░▒▓█▓▒░░▒▓█▓▒░▒▓█▓▒░        
            ░▒▓█▓▒░             ░▒▓█▓▒░▒▓█▓▒░░▒▓█▓▒░▒▓█▓▒░        
            ░▒▓█▓▒░             ░▒▓█▓▒░▒▓█▓▒░░▒▓█▓▒░▒▓█▓▒░░▒▓█▓▒░ 
            ░▒▓█▓▒░      ░▒▓███████▓▒░ ░▒▓██████▓▒░ ░▒▓██████▓▒░
        `)
    console.log(`  Running in ${ENVIRONMENT} mode.               `);
    console.log(`  Port: ${PORT}                                          `);
    console.log('  PID: ' + process.pid + '                                   ');
    console.log('  Ready to accept requests at: http://localhost:' + PORT);
    console.log(' '.repeat(60));
});
