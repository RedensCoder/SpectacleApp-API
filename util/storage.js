const { S3Client, PutObjectCommand, GetObjectCommand } = require("@aws-sdk/client-s3");
const {config} = require("dotenv");

config();

// инициализация клиента
const s3 = new S3Client({
    region: "ru-1",
    endpoint: "https://s3.twcstorage.ru",
    credentials: {
        accessKeyId: process.env.S3_ACCESS_KEY,
        secretAccessKey: process.env.S3_SECRET_KEY,
    },
});

// запись файла
async function uploadFile(key, content) {
    await s3.send(
        new PutObjectCommand({
            Bucket: "7b7d2ff3-spectacleapp",
            Key: key,
            Body: content,
        })
    );
    return `https://s3.twcstorage.ru/7b7d2ff3-spectacleapp/${key}`;
}

// чтение файла
async function readFile(key) {
    const res = await s3.send(
        new GetObjectCommand({
            Bucket: "7b7d2ff3-spectacleapp",
            Key: key,
        })
    );

    const chunks = [];
    for await (const chunk of res.Body) {
        chunks.push(chunk);
    }
    return Buffer.concat(chunks);
}

module.exports = { uploadFile, readFile };