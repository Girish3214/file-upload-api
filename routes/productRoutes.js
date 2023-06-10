import express from "express";

import {
  createProduct,
  getAllProduct,
} from "../controllers/productController.js";
import { uploadProductImage } from "../controllers/uploadsController.js";

const router = express.Router();

router.route("/").get(getAllProduct).post(createProduct);
router.route("/upload").post(uploadProductImage);

export default router;
