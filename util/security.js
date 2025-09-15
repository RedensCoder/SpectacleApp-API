const jwt = require("jsonwebtoken");
const {config} = require("dotenv");

config();

exports.generateAccessToken = (id, login) => {
    return jwt.sign({
        data: {
            id: id,
            login: login
        }
    }, process.env.SECRET_TOKEN || "Secret", {expiresIn: "7d"});
}

exports.authenticateToken = (req, res, next) => {
    const token = req.headers['authorization'];
    if (token === undefined) return res.sendStatus(401);
    jwt.verify(token, process.env.SECRET_TOKEN || "Secret", (err) => {
        if (err) return res.sendStatus(403)
        next()
    })
}

exports.authenticateTokenParams = (req, res, next) => {
    const token = req.headers['authorization'];
    if (token === undefined) return res.sendStatus(401);

    jwt.verify(token, process.env.SECRET_TOKEN || "Secret", (err, decoded) => {
        if (err) return res.sendStatus(403)

        if (decoded === undefined) return res.sendStatus(403)

        if (decoded.data.id == req.params.id) { next() } else {
            return res.sendStatus(403);
        }
    })
}

exports.authenticateTokenBody = (req, res, next) => {
    const token = req.headers['authorization'];
    if (token === undefined) return res.sendStatus(401);

    jwt.verify(token, process.env.SECRET_TOKEN || "Secret", (err, decoded) => {
        if (err) return res.sendStatus(403)

        if (decoded === undefined) return res.sendStatus(403)

        if (Number(decoded.data.id) === Number(req.body.id) || Number(decoded.data.id) === Number(req.body.userId)) { next() } else {
            return res.sendStatus(403);
        }
    })
}