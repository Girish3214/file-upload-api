import dotenv from "dotenv";
import "express-async-errors";
import express, { json } from "express";
import fileUpload from "express-fileupload";
import cloudinary from "cloudinary";

let cloudinaryV2 = cloudinary.v2;
// error handler
import notFound from "./middleware/not-found.js";
import errorHandler from "./middleware/error-handler.js";

import connectDB from "./db/connect.js";

import productRoutes from "./routes/productRoutes.js";

const app = express();
dotenv.config();
cloudinaryV2.config({
  cloud_name: process.env.CLOUD_NAME,
  api_secret: process.env.CLOUD_SECRET,
  api_key: process.env.CLOUD_API_KEY,
});

app.use(express.static("./public"));
app.use(json());
app.use(
  fileUpload({
    useTempFiles: true,
  })
);

const baseUrl = process.env.BASEURL;

// routes
app.use(`${baseUrl}/products`, productRoutes);

app.use(notFound);
app.use(errorHandler);

const port = process.env.PORT || 3000;

const start = async () => {
  try {
    await connectDB();
    app.listen(port, () =>
      console.log(`Server is listening on port ${port}...`)
    );
  } catch (error) {
    console.log(error);
  }
};

start();
