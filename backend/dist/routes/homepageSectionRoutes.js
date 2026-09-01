"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const homepageSectionController_1 = require("../controllers/homepageSectionController");
const auth_1 = require("../middleware/auth");
const router = express_1.default.Router();
router.get("/", homepageSectionController_1.getHomepageSections);
router.get("/all", auth_1.protect, auth_1.adminOnly, homepageSectionController_1.getAllHomepageSections);
router.post("/", auth_1.protect, auth_1.adminOnly, homepageSectionController_1.createHomepageSection);
router.put("/:id", auth_1.protect, auth_1.adminOnly, homepageSectionController_1.updateHomepageSection);
router.delete("/:id", auth_1.protect, auth_1.adminOnly, homepageSectionController_1.deleteHomepageSection);
exports.default = router;
