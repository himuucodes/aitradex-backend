const express = require("express");

const router = express.Router();

const upload = require("../middleware/upload");

const uploadController = require("../controllers/upload.controller");

router.post(
  "/image",
  upload.single("image"),
  uploadController.uploadImage
);

module.exports = router;