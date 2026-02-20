const Client = require("../config/dbConn");
const responseCode = require("../config/responseCode");

const createRehabController = async (req, res) => {

  try {

    const payload = req.body;

    if (!payload.center_name) {
      return res.status(responseCode.badRequest).json({
        msg: "center_name required",
      });
    }

    const result = await Client.query(
      `INSERT INTO rehab_center(center_name)
       VALUES($1)
       RETURNING id`,
      [payload.center_name]
    );

    return res.status(responseCode.created).json({
      msg: "Rehab created",
      rehab_id: result.rows[0].id,
    });

  } catch (err) {
    return res.status(responseCode.internalServerError).json({
      msg: err.message,
    });
  }
};

const getRehabController = async (req, res) => {

  try {

    const result = await Client.query(
      "SELECT * FROM rehab_center"
    );

    return res.json(result.rows);

  } catch (err) {
    return res.status(responseCode.internalServerError).json({
      msg: err.message,
    });
  }
};

module.exports = {
  createRehabController,
  getRehabController,
};