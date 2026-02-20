const Client = require("../config/dbConn.js");
const responseCode = require("../config/responseCode.js");

const registerPatientController = async (req, res) => {
  try {
    const payload = req.body.offChainData || req.body;

    if (!payload.wallet_address || !payload.full_name) {
      return res.status(responseCode.badRequest).json({
        msg: "wallet_address and full_name required",
      });
    }

    const exists = await Client.query(
      "SELECT * FROM patient WHERE wallet_address=$1",
      [payload.wallet_address]
    );

    if (exists.rowCount > 0) {
      return res.status(responseCode.conflict).json({
        msg: "Patient already exists",
      });
    }

    const result = await Client.query(
      `INSERT INTO patient(full_name,country,wallet_address)
       VALUES($1,$2,$3)
       RETURNING id`,
      [
        payload.full_name,
        payload.country || null,
        payload.wallet_address,
      ]
    );

    return res.status(responseCode.created).json({
      msg: "Patient registered",
      patient_id: result.rows[0].id,
    });

  } catch (err) {
    return res.status(responseCode.internalServerError).json({
      msg: err.message,
    });
  }
};

const getPatientController = async (req, res) => {
  try {
    const { wallet_address } = req.params;

    const result = await Client.query(
      "SELECT * FROM patient WHERE wallet_address=$1",
      [wallet_address]
    );

    return res.json(result.rows[0]);

  } catch (err) {
    return res.status(responseCode.internalServerError).json({
      msg: err.message,
    });
  }
};

module.exports = {
  registerPatientController,
  getPatientController,
};