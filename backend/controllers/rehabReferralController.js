const Client = require("../config/dbConn");
const responseCode = require("../config/responseCode");

const referPatientController = async (req, res) => {

  try {

    const payload = req.body;

    const result = await Client.query(
      `INSERT INTO rehab_referral
      (patient_id,hospital_id,rehab_center_id,referral_notes)
      VALUES($1,$2,$3,$4)
      RETURNING id`,
      [
        payload.patient_id,
        payload.hospital_id,
        payload.rehab_center_id,
        payload.referral_notes,
      ]
    );

    return res.status(responseCode.created).json({
      msg: "Referral created",
      referral_id: result.rows[0].id,
    });

  } catch (err) {
    return res.status(responseCode.internalServerError).json({
      msg: err.message,
    });
  }
};

const getPatientReferralsController = async (req, res) => {

  try {

    const { patient_id } = req.params;

    const result = await Client.query(
      `SELECT rr.*, rc.center_name
       FROM rehab_referral rr
       JOIN rehab_center rc
       ON rr.rehab_center_id=rc.id
       WHERE patient_id=$1`,
      [patient_id]
    );

    return res.json(result.rows);

  } catch (err) {
    return res.status(responseCode.internalServerError).json({
      msg: err.message,
    });
  }
};

module.exports = {
  referPatientController,
  getPatientReferralsController,
};