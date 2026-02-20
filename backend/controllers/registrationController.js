const Client = require("../config/dbConn.js");
const responseCode = require("../config/responseCode.js");
const { config } = require("dotenv");
config();

const registrationHandler = async (req, res) => {
  try {
    const payload = req.body.offChainData || req.body;
    console.log("Payload:", payload);

    if (!payload || !payload.wallet_address || !payload.name || !payload.role) {
      return res
        .status(responseCode.badRequest)
        .json({ msg: "Missing required fields" });
    }

    const validRoles = ["patient", "doctor", "admin", "pharmacist","admin","manufacturer","distributor"];
    if (!validRoles.includes(payload.role)) {
      console.log("Invalid role:", payload.role);

      return res.status(responseCode.badRequest).json({ msg: "Invalid role" });
    }

    const existingUser = await Client.query(
      "SELECT * FROM users WHERE wallet_address = $1",
      [payload.wallet_address]
    );
    if (existingUser.rowCount > 0) {
      return res
        .status(responseCode.conflict)
        .json({ msg: "Wallet address already registered" });
    }

    const query = `
            INSERT INTO users (wallet_address, name,role) 
            VALUES ($1, $2, $3) 
            RETURNING id;
        `;

    const values = [payload.wallet_address, payload.name, payload.role];
    // const query = `
    //         INSERT INTO users (wallet_address, name, email, phone, role, date_of_birth, gender)
    //         VALUES ($1, $2, $3, $4, $5, $6, $7)
    //         RETURNING id;
    //     `;

    // const values = [
    //   payload.wallet_address,
    //   payload.name,
    //   payload.email || null,
    //   payload.phone || null,
    //   payload.role,
    //   payload.date_of_birth || null,
    //   payload.gender || null,
    // ];

    const newUser = await Client.query(query, values);
    console.log("Hey", newUser);

    return res.status(responseCode.created).json({
      msg: "User registered successfully",
      user_id: newUser.rows[0].id,
    });
  } catch (err) {
    console.error("@registrationHandler : \n", err);
    return res
      .status(responseCode.internalServerError)
      .json({ msg: err.message });
  }
};

module.exports = { registrationHandler };
