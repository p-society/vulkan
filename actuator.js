import express from 'express';
import axios from 'axios';
import bodyParser from 'body-parser';
import Fetcher from './_fetcher/Fetch.js';
import EventBus from './_event-bus/eventBus.js';
import { Events } from './_ee/events.js';
import { parseTargetYAML } from './_config/parse.js';
import Fetch from './_fetcher/Fetch.js';
import logger from './_errors/ActuatorErrors.js';
const app = express();
app.use(bodyParser.json());


//--------------------------------------------------------


const EVENT_BUS = new EventBus();
const PORT = 2609;
const ENVIRONMENT = process.env.NODE_ENV || 'development';

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
    console.log(`  \`-\'        Running in ${ENVIRONMENT} mode.               `);
    console.log(`  Port: ${PORT}                                          `);
    console.log('  PID: ' + process.pid + '                                   ');
    console.log(' Ready to accept requests at: http://localhost:' + PORT);
    console.log(' '.repeat(60));
});

// --------------------------------------------------------

EVENT_BUS.on(Events.TEST_LINK_RECEIVED, ({ repoLink, fetcher }) => {
    if (!(fetcher instanceof Fetcher)) {
        logger.error(`Didn't receive an instance of Fetcher! Aborting Actuation... oooOOOOooO `)
    }
})