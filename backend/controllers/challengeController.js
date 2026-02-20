const challengeStore = {}; // Temporary storage (Use Redis for production)

const challengeHandler = async (req, res) => {
  try {
    const { walletAddress } = req.query;

    if (!walletAddress) {
      console.error("Error: Wallet address is missing");
      return res.status(400).json({ msg: "Wallet address is required" });
    }

    // Generate a unique challenge message
    const challengeMessage = `Please sign this message to log in. Nonce: ${Date.now()}`;

    // Store the challenge
    challengeStore[walletAddress] = challengeMessage;

    console.log(`Generated challenge for ${walletAddress}: ${challengeMessage}`);
    return res.status(200).json({ challenge: challengeMessage });
  } catch (error) {
    console.error("Internal Server Error:", error);
    return res.status(500).json({ msg: "Internal server error" });
  }
};

module.exports = { challengeHandler };
