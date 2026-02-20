const { Router } = require("express");
const { uploadFileHandler, upload } = require("../controllers/uploadFileController");

const router = Router();

router.post("/", upload.single("file"), uploadFileHandler);

module.exports = router;
