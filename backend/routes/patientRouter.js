const { Router } = require("express");

const {
  registerPatientController,
  getPatientController,
} = require("../controllers/patientController");

const router = Router();

router.post("/register", registerPatientController);
router.get("/:wallet_address", getPatientController);

module.exports = router;