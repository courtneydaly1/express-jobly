// test-pg.js
const { Client } = require("pg");

const client = new Client({
  connectionString: "your_connection_string_here" // Use an actual connection string
});

client.connect()
  .then(() => {
    console.log("Connected to the database");
    return client.end();
  })
  .then(() => console.log("Connection closed"))
  .catch(err => console.error("Connection error", err));
