import express from "express";
import { UserController } from "../../controllers/user.controller";

const router = express.Router();

// Get routes
router.get("/", UserController.getAll);
router.get("/:id", UserController.get);
router.get("/nfc/:id", UserController.getByNFC);
router.get("/qrcode/:id", UserController.getByQRCode);

// Post routes
router.post("/", UserController.create);

// Put routes
// Could have been replaced by patch since we doesn't need to update every fields, but we're sending all data actually and updating all
// So we're using put
router.put("/:id", UserController.update);

// Delete routes
router.delete("/:id", UserController.remove);
router.delete("/", UserController.deleteAll);

export default router;
