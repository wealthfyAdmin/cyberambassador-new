const express = require("express");
const router = express.Router();


const livekitController = require("../controllers/livekit/livekit.controller");

router.post(
  "/livekit/get-token",
  livekitController.getToken
);

router.get("/livekit/health", livekitController.health);

module.exports = router;
