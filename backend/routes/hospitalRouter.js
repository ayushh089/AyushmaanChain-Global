const { Router } = require("express");

const {
  registerHospitalController,
  getAllHospitalsController,
} = require("../controllers/hospitalController");

const router = Router();

router.post("/register", registerHospitalController);
router.get("/all", getAllHospitalsController);

module.exports = router;