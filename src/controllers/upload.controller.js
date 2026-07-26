const { uploadBuffer } = require("../services/cloudinary.service");

exports.uploadImage = async (req, res) => {
  try {

    if (!req.file) {
      return res.status(400).json({
        success: false,
        message: "Image is required",
      });
    }

    const folder = req.body.folder || "aitradex";

    const result = await uploadBuffer(
      req.file.buffer,
      folder,
    );

    return res.status(200).json({
      success: true,
      message: "Uploaded successfully",
      url: result.secure_url,
      publicId: result.public_id,
    });

  } catch (e) {

    console.error(e);

    return res.status(500).json({
      success: false,
      message: e.message,
    });

  }
};