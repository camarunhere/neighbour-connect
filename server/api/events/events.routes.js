const express = require("express");
const router = express.Router();
const controller = require("./events.controller");
const { requireAdmin } = require("../../middleware/auth");

router.get("/", controller.getAll);
router.get("/:id", controller.getById);
router.post("/", controller.create);
router.put("/:id", controller.update);
router.delete("/:id", requireAdmin, controller.remove);
router.post("/:id/comments", controller.addComment);
router.delete("/:id/comments/:commentId", requireAdmin, controller.deleteComment);
router.post("/:id/vote", controller.vote);

module.exports = router;
