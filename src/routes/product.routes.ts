import express from "express";
import { upload } from "../middlewares/upload";
import {
  getProducts,
  createProduct,
  updateProduct,
  deleteProduct
} from "../controller/product.controller";

const router = express.Router();

router.get("/", getProducts);
router.post("/", upload.single("image"), createProduct);
router.put("/:id", upload.single("image"), updateProduct);
router.delete("/:id", deleteProduct);

export default router;
