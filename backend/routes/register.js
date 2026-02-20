const { Router } = require("express");
const { registrationHandler } = require("../controllers/registrationController");

const router = Router();

router.post("/", registrationHandler)

module.exports = router;

