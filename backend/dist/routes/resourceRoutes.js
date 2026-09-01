"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const resourceController_1 = require("../controllers/resourceController");
const auth_1 = require("../middleware/auth");
const router = express_1.default.Router();
router.get("/", resourceController_1.getResources);
router.get("/admin/all", auth_1.protect, auth_1.adminOnly, resourceController_1.getAllResourcesAdmin);
router.get("/:slug", resourceController_1.getResourceBySlug);
router.post("/", auth_1.protect, auth_1.adminOnly, resourceController_1.createResource);
router.put("/:id", auth_1.protect, auth_1.adminOnly, resourceController_1.updateResource);
router.delete("/:id", auth_1.protect, auth_1.adminOnly, resourceController_1.deleteResource);
exports.default = router;
