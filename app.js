const express = require("express");
const cors = require("cors");
const {config} = require("dotenv");
const fs = require("fs");

const { readFile } = require("./util/storage");

const User = require("./handlers/users");

config();

const startServer = async () => {
    const certBuffer = await readFile("ca.crt");

    const certPath = "ca.crt";
    fs.writeFileSync(certPath, certBuffer);

    const app = express();

    app.use(cors())
    app.use(express.json());

    app.use("/user", User);

    const server = app.listen(8080, () => {
        console.log(`Server started...`);
    });
}

startServer().catch((err) => {
    console.error("Ошибка запуска:", err);
    process.exit(1);
});