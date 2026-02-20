const { Router } = require("express");
const { challengeHandler } = require("../controllers/challengeController");

const router = Router();

router.get("/", challengeHandler);

module.exports = router;
