const { Router } = require("express");

const {
  createRehabController,
  getRehabController,
} = require("../controllers/rehabController");

const router = Router();

router.post("/create", createRehabController);
router.get("/all", getRehabController);

module.exports = router;