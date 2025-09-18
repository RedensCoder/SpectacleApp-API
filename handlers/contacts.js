const express = require("express");
const prisma = require("../util/client");
const {config} = require("dotenv");

const {authenticateToken, authenticateTokenParams, authenticateTokenBody} = require("../util/security");
const {uploadFile, readFile} = require("../util/storage");

config();

const router = express.Router();

router.get("/getContactByUserId/:id", authenticateTokenParams, async (req, res) => {
   const contacts = await prisma.user_contacts.findMany({
       where: {
           userId: Number(req.params.id)
       },
       include: {
           contact: {
               include: {
                   User_Infos: true
               }
           }
       }
   });

   return res.send(JSON.stringify(
       contacts, (key, value) => (typeof value === 'bigint' ? value.toString() : value)
   ))
});

module.exports = router;