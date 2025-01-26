import ConnectionHandler from "./_simulator/handleConnection.js";
import init from "./init.js";

async function  main() {
    // await init(); 
    const connection = new ConnectionHandler('localhost', 3030);
    connection.dialHost();

}

main();