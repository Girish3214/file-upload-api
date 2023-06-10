import { StatusCodes } from "http-status-codes";
import path from "path";
import fs from "fs";
import { fileURLToPath } from "url";

import { BadRequestError } from "../errors/index.js";
import cloudinary from "cloudinary";

let cloudinaryV2 = cloudinary.v2;
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const uploadProductImageLocal = async (req, res) => {
  if (!req.files) {
    throw new BadRequestError("No file uploaded");
  }
  let productImage = req.files.image;

  if (!productImage.mimetype.startsWith("image")) {
    throw new BadRequestError("Please upload image only");
  }
  if (productImage.size > 1024 * 1024) {
    throw new BadRequestError("Please upload image less then 1MB");
  }
  const imagePath = path.join(
    __dirname,
    "../public/uploads/" + `${productImage.name}`
  );
  await productImage.mv(imagePath);
  return res.status(StatusCodes.OK).json({
    image: {
      src: `/uploads/${productImage.name}`,
    },
  });
};

const uploadProductImage = async (req, res) => {
  const result = await cloudinaryV2.uploader.upload(
    req.files.image.tempFilePath,
    {
      use_filename: true,
      folder: "files-upload-nodejs",
    }
  );
  if (!req.files) {
    throw new BadRequestError("No file uploaded");
  }
  let productImage = req.files.image;

  if (!productImage.mimetype.startsWith("image")) {
    throw new BadRequestError("Please upload image only");
  }
  if (productImage.size > 1024 * 1024) {
    throw new BadRequestError("Please upload image less then 1MB");
  }

  fs.unlinkSync(req.files.image.tempFilePath);
  return res.status(StatusCodes.OK).json({
    image: {
      src: result.secure_url,
    },
  });
};

export { uploadProductImage };
