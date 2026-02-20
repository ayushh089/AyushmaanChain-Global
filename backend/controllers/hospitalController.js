const Client = require("../config/dbConn");
const responseCode = require("../config/responseCode");

const registerHospitalController = async (req, res) => {
  try {

    const payload = req.body;

    if (!payload.hospital_name || !payload.wallet_address) {
      return res.status(responseCode.badRequest).json({
        msg: "hospital_name and wallet_address required",
      });
    }

    const exists = await Client.query(
      "SELECT * FROM hospital WHERE wallet_address=$1",
      [payload.wallet_address]
    );

    if (exists.rowCount > 0) {
      return res.status(responseCode.conflict).json({
        msg: "Hospital already exists",
      });
    }

    const result = await Client.query(
      `INSERT INTO hospital
      (hospital_name,email,phone_number,city,specialization,wallet_address)
      VALUES($1,$2,$3,$4,$5,$6)
      RETURNING id`,
      [
        payload.hospital_name,
        payload.email,
        payload.phone_number,
        payload.city,
        payload.specialization,
        payload.wallet_address,
      ]
    );

    return res.status(responseCode.created).json({
      msg: "Hospital registered",
      hospital_id: result.rows[0].id,
    });

  } catch (err) {
    return res.status(responseCode.internalServerError).json({
      msg: err.message,
    });
  }
};

const getAllHospitalsController = async (req, res) => {
  try {

    const result = await Client.query(
      "SELECT * FROM hospital ORDER BY created_at DESC"
    );

    return res.json(result.rows);

  } catch (err) {
    return res.status(responseCode.internalServerError).json({
      msg: err.message,
    });
  }
};

module.exports = {
  registerHospitalController,
  getAllHospitalsController,
};