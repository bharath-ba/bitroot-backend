if (process.env.NODE_ENV !== "production") {
  require("dotenv").config();
}

const express = require("express");
const fileUpload = require("express-fileupload");
const multer = require("multer");
const mongoose = require("mongoose");
const morgan = require("morgan");
const bodyParser = require("body-parser");
const ContactRoute = require("./routes/contact");

const dbUrl = process.env.DB_URL || "mongodb://0.0.0.0:27017/contactsdb";

mongoose.connect(dbUrl, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});
const db = mongoose.connection;

db.on("error", (err) => {
  console.log(err);
});

db.once("open", () => {
  console.log("Database connection established!");
});

const app = express();

app.use(morgan("dev"));

app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());
app.use(fileUpload());
app.use("/csv", express.static(__dirname + "/csv"));
const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});

app.use("/api/contact", ContactRoute);
