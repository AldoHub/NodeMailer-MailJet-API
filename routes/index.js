const express = require("express");
const router = express.Router();
const mailerController = require("../controller/mailerController");

router.post("/mailer", mailerController.sendMail);

module.exports = router;