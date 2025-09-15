const express = require("express");
const cors = require("cors");
const {config} = require("dotenv");

const User = require("./handlers/users");

config();

const app = express();

app.use(cors())
app.use(express.json());

app.use("/user", User);

const server = app.listen(8080, () => {
    console.log(`Server started...`);
});