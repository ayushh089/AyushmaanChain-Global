const { Router } = require("express");
const { loginHandler } = require("../controllers/loginController");

const router = Router();

router.post("/", loginHandler)

module.exports = router;

