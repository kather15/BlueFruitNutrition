import app from "./app.js"
import "./database.js"
import { config } from "./src/config.js"

//Función que ejecuta el servidor
async function main() {
    //Dirección en config
    app.listen(config.server.port);
    console.log("server running: " + config.server.port);
}

main();