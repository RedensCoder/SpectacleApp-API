const express = require("express");
const crypto = require('crypto');
const prisma = require("../util/client");
const {config} = require("dotenv");
const {generateAccessToken, authenticateToken, authenticateTokenParams, authenticateTokenBody} = require("../util/security");
const fs = require("fs");
const path = require("path");

config();

const router = express.Router();

router.post("/create", async (req, res) => {
    if (!req.body.login || !req.body.password || !req.body.name || !req.body.lastName || !req.body.dateBirth) {
        return res.sendStatus(204);
    }

    const user = await prisma.users.findFirst({where: {login: req.body.login}});

    if (user !== null) {
        res.sendStatus(409);
    } else {
        const Hasher = crypto.createHmac("sha256", process.env.SECRET_TOKEN);
        const password = Hasher.update(req.body.password).digest("hex");

        const {publicKey, privateKey} = crypto.generateKeyPairSync('rsa', {
            modulusLength: 2048,
            publicKeyEncoding: {
                type: 'pkcs1',
                format: 'pem'
            },
            privateKeyEncoding: {
                type: 'pkcs1',
                format: 'pem'
            }
        });

        const dirPath = path.join(__dirname, "../keys");
        const filePath = path.join(dirPath, `${req.body.login}_private.pem`);

        if (!fs.existsSync(dirPath)) {
            fs.mkdirSync(dirPath, { recursive: true });
        }

        fs.writeFileSync(filePath, privateKey);

        const createdUser = await prisma.users.create({
            data: {
                login: req.body.login,
                password: password,
                pKey: publicKey
            }
        });

        await prisma.user_infos.create({
            data: {
                userId: createdUser.id,
                avatar: `${req.protocol}://${req.get('host')}/files/avanull.png`,
                name: req.body.name,
                last_name: req.body.lastName,
                date_birth: new Date(req.body.dateBirth)
            }
        });

        const token = generateAccessToken(Number(createdUser.id), req.body.login);

        res.send({
            token,
            privateKey
        });
    }
});

module.exports = router;