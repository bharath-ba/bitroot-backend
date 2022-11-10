const express = require("express");
const router = express.Router();

const ContactController = require("../controllers/ContactController");
// const upload = require("../uploads/upload");
router.get("/", ContactController.fetchAll);
router.get("/show", ContactController.show);
router.post("/create", ContactController.createContact);
router.post("/update", ContactController.update);
router.post("/delete", ContactController.deleteContact);
router.get("/fetchAll", ContactController.fetchAll);
router.get("/export", ContactController.exportToCsv);

module.exports = router;
