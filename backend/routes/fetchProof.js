const { Router } = require("express");
const { fetchProofController } = require("../controllers/fetchProofController");

const router = Router();

router.post("/", fetchProofController)

module.exports = router;

