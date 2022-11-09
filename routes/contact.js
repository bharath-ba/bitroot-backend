const express = require("express");
const router = express.Router();

const ContactController = require("../controllers/ContactController");
// const upload = require("../uploads/upload");
router.get("/", ContactController.fetchAll);
router.get("/show", ContactController.show);
router.post("/create", ContactController.createContact);
router.post("/updatet", ContactController.update);
router.post("/delete", ContactController.deleteContact);
router.get("/fetchAll", ContactController.fetchAll);
router.post("/export", ContactController.exportToCsv);

module.exports = router;
