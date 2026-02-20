const { Router } = require("express");
const { fetchRecordController } = require("../controllers/fetchRecordController");

const router = Router();

router.post("/", fetchRecordController)

module.exports = router;

