import express from "express";
import { MerchantController } from "../../controllers/merchant.controller";

const router = express.Router();

// Get routes
router.get("/", MerchantController.getAll);
router.get("/:id", MerchantController.get);
router.get("/:id/products", MerchantController.getAvailableProducts);

// Post routes
router.post("/", MerchantController.create);
router.post("/:id/products", MerchantController.addProduct);

// Put routes
// Could have been replaced by patch since we doesn't need to update every fields, but we're sending all data actually and updating all
// So we're using put
router.put("/:id", MerchantController.update);
router.put("/:id/products", MerchantController.updateProduct);

// Delete routes
router.delete("/:id", MerchantController.remove);
router.delete("/:id/products", MerchantController.removeProduct);

export default router;
