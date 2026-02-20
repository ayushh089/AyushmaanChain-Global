const { Router } = require("express");
const { decryptQRController } = require("../controllers/decryptQRController");

const router = Router();

router.post("/", decryptQRController)

module.exports = router;

