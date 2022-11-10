const Contact = require("../models/Contact");
const path = require("path");
const { v4 } = require("uuid");
const json2csv = require("json2csv").parse;
const fs = require("fs");

const isExist = async (phoneNumber) => {
  const data = await Contact.find({ phoneNumber });
  return data.length > 0;
};

//Show the list of Contacts
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
  try {
    Contact.find((err, data) => {
      console.log(data);
      if (err) {
        console.log(err);
      } else {
        const csv = json2csv(data, {
          fields: ["name", "phoneNumber", "image"],
        });
        fs.writeFile("csv/exportdata.csv", csv, function (err) {
          if (err) {
            throw err;
          }
          res.attachment("exportdata.csv");
          res.status(200).send(csv);
        });
      }
    });
  } catch (error) {
    console.log("Error: ", error.message);
    res.json({
      message: "something went wrong",
    });
  }
};

module.exports = {
  fetchAll,
  show,
  createContact,
  update,
  deleteContact,
  exportToCsv,
};
