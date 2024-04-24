import express from "express";
import { ProductController } from "../../controllers/product.controller";

const router = express.Router();

// Get routes
router.get("/", ProductController.getAll);
router.get("/:id", ProductController.get);
router.get("/merchant/:id", ProductController.getByMerchantId);

// Post routes
router.post("/", ProductController.create);

// Put routes
// Could have been replaced by patch since we doesn't need to update every fields, but we're sending all data actually and updating all
// So we're using put
router.put("/:id", ProductController.update);

// Delete routes
router.delete("/:id", ProductController.remove);
router.delete("/merchant/:id", ProductController.deleteByMerchantId);
router.delete("/", ProductController.deleteAll);

export default router;
