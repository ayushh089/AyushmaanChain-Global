const { Router } = require("express");

const {
  referPatientController,
  getPatientReferralsController,
} = require("../controllers/rehabReferralController");

const router = Router();

router.post("/refer", referPatientController);
router.get("/:patient_id", getPatientReferralsController);

module.exports = router;