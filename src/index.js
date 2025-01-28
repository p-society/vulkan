import { set } from "mongoose";
import ConnectionHandler from "./_simulator/handleConnection.js";
import init from "./init.js";

async function main() {
    // await init(); 
    const connection = new ConnectionHandler('localhost', 6379);
    console.log(connection.getStatus());
    connection.dialHost();
    console.log(connection.getStatus());
    connection.sendData("*1\r\n$4\r\nPING\r\n");
    connection.sendData("*1\r\n$4\r\nPING\r\n");
    connection.sendData("*1\r\n$4\r\nPING\r\n");
    connection.sendData("*1\r\n$4\r\nPING\r\n");
    setTimeout(() => { 
        console.log(connection.getStatus());
        connection.sendData("*1\r\n$4\r\nPING\r\n");
     }, 1000)
    
}

main();

