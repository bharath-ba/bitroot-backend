const { response } = require("express");
const Contact = require("../models/Contact");
const path = require("path");
const { v4 } = require("uuid");
const { parse } = require("json2csv");
const fs = require("fs");
var XLSX = require("xlsx");
//Show the list of Contacts

const isExist = async (phoneNumber) => {
  const data = await Contact.find({ phoneNumber });
  return data.length > 0;
};
const fetchAll = (req, res, next) => {
  try {
    Contact.find().then((response) => {
      res.json({
        response,
      });
    });
  } catch (error) {
    console.log("Error: ", error.message);
    res.json({
      message: "something went wrong",
    });
  }
};

const show = async (req, res, next) => {
  try {
    let { phoneNumber } = req.query;

    let data = await isExist(phoneNumber);
    if (!data) {
      return res.status(500).json({
        message: "contact not exist",
      });
    }
    const result = await Contact.findOne({ phoneNumber });
    res.json({
      result,
    });
  } catch (error) {
    console.log("Error: ", error.message);
    res.json({
      message: "something went wrong",
    });
  }
};

const createContact = async (req, res, next) => {
  try {
    let contacts = await isExist(req.body.phoneNumber);
    if (contacts) {
      return res.status(500).json({
        message: "contact already exist",
      });
    }
    const id = v4();
    const { image } = req.files;

    let contact = new Contact({
      name: req.body.name,
      phoneNumber: req.body.phoneNumber,
      image: id + ".jpg",
    });
    const data = await contact.save();
    const imagePath = path.join(__dirname, "../", "images", id + ".jpg");
    image.mv(imagePath + data.id + ".jpg");
    return res.status(500).json({
      message: "created a contact",
    });
  } catch (error) {
    console.log("Error: ", error.message);
    res.json({
      message: "something went wrong",
    });
  }
};

//update Contact by contact ID
const update = async (req, res, next) => {
  try {
    let contacts = await isExist(req.body.phoneNumber);
    if (!contacts) {
      return res.status(500).json({
        message: "contact not exist",
      });
    }
    let contactID = req.body.phoneNumber;
    let updatedContact = {
      name: req.body.name,
      phoneNumber: req.body.newPhone,
      image: req.body.image,
    };
    await Contact.findOneAndUpdate(
      { phoneNumber: contactID },
      { $set: updatedContact }
    );
    return res.json({
      message: "contact Updated Sucessfully!",
    });
  } catch (error) {
    console.log("Error: ", error.message);
    res.json({
      message: "something went wrong",
    });
  }
};

//Delete an Contact
const deleteContact = async (req, res, next) => {
  try {
    let contacts = await isExist(req.body.phoneNumber);
    if (!contacts) {
      return res.status(500).json({
        message: "contact not exist",
      });
    }
    let contactID = req.body.phoneNumber;
    await Contact.findOneAndDelete({ phoneNumber: contactID });
    return res.json({
      message: "contact deleted successfully",
    });
  } catch (error) {
    console.log("Error: ", error.message);
    res.json({
      message: "something went wrong",
    });
  }
};

// export to csv
const exportToCsv = async (req, res, next) => {
  var wb = XLSX.utils.book_new(); //new workbook
  Contact.find((err, data) => {
    if (err) {
      console.log(err);
    } else {
      var temp = JSON.stringify(data);
      temp = JSON.parse(temp);
      var ws = XLSX.utils.json_to_sheet(temp);

      var down = path.join(__dirname, "../", "csv/exportdata.xlsx");
      XLSX.utils.book_append_sheet(wb, ws, "sheet1");
      XLSX.writeFile(wb, down);
      res.download(down);
    }
  });
};

module.exports = {
  fetchAll,
  show,
  createContact,
  update,
  deleteContact,
  exportToCsv,
};
