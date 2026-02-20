const pg = require('pg');
const { config } = require('dotenv');
config();

const Client = new pg.Client({
    user: process.env.USER,
    database: process.env.DATABASE,
    password: process.env.PASSWORD,
    port: process.env.PORT
})

Client.connect().then(() => {
    console.log("Connected to DB");
})
.catch((err) => { console.log("Error connecting to DB \n"+err) })

module.exports = Client;