import { set } from "mongoose";
import Connection from "./_simulator/handleConnection.js";
import init from "./init.js";

async function main() {
    // await init(); 
    const connection = new Connection('localhost', 6379, () => { });
    connection.dialHost();

    let sum = 0;

    for (let i = 0; i < 10000; i++) {
        const now = new Date();
        const res = await connection.sendData(`*1\r\n$4\r\nPING\r\n`)
        const then = new Date();
        console.log(`${i}. `, res.toString('hex'), then - now)
        sum += then - now;
    }

    console.log('Avg Response Time: ', sum/10000)
}

main();

