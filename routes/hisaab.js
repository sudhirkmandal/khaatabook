const express = require("express");
const router = express.Router();
const { isLoggedIn } = require("../middleware/login-middleware");
const hisaabModel = require("../models/hisaab-model");
const userModel = require("../models/users-model");

router.get("/", function (req, res) {
  res.send("Hisaab route");
});

router.get("/create", isLoggedIn, function (req, res) {
  res.render("create");
});

router.post("/create", isLoggedIn, async function (req, res) {
  let { title, description, encrypted, shareable, passcode, editpermissions } =
    req.body;

  encrypted = encrypted === "on" ? true : false;
  editpermissions = editpermissions === "on" ? true : false;
  shareable = shareable === "on" ? true : false;

  let createdHisaab = await hisaabModel.create({
    title: title,
    description: description,
    user: req.user.id,
    encrypted: encrypted,
    shareable: shareable,
    passcode: passcode,
    editpermissions: editpermissions,
  });
  let user = await userModel.findOne({ email: req.user.email });
  user.hisaab.push(createdHisaab._id);
  await user.save();
  res.redirect("/profile");
});

router.get("/view/:id", async function (req, res) {
  let hisaab = await hisaabModel.findOne({ _id: req.params.id });
  if (hisaab.encrypted) {
    res.render("passcode", { hisaabid: req.params.id });
  } else {
    res.render("view", { hisaab: hisaab });
  }
});

router.post("/:id/verify", async function (req, res) {
  let hisaab = await hisaabModel.findOne({ _id: req.params.id });
  if (hisaab.passcode === req.body.passcode) {
    req.session.hisaabaccess = req.params.id;
    res.redirect(`/hisaab/${req.params.id}`);
  } else {
    res.send("Wrong passcode");
  }
});

router.get("/:id", isLoggedIn, checkHisaabAccess, async function (req, res) {
  let hisaab = await hisaabModel.findOne({ _id: req.params.id });
  res.render("view", { hisaab: hisaab });
});

router.get("/delete/:id", isLoggedIn, async function (req, res) {
  let hisaab = await hisaabModel.findOne({ _id: req.params.id });
  if (hisaab.user.toString() === req.user.id) {
    await hisaabModel.deleteOne({ _id: req.params.id });
    res.redirect("/profile");
  } else {
    res.send("access nahi hai");
  }
});

router.get("/edit/:id", isLoggedIn, async function (req, res) {
  let hisaab = await hisaabModel.findOne({ _id: req.params.id });
  res.render("edit", { hisaab });
});

router.post("/edit/:id", isLoggedIn, async function (req, res) {
  try {
    let hisaab = await hisaabModel.findOne({ _id: req.params.id });
    if (hisaab.user.toString() === req.user.id) {
      hisaab.title = req.body.title;
      hisaab.description = req.body.description;
      hisaab.encrypted = req.body.encrypted === "on" ? true : false;
      hisaab.shareable = req.body.shareable === "on" ? true : false;
      hisaab.passcode = req.body.passcode;
      hisaab.editpermissions = req.body.editpermissions === "on" ? true : false;
      await hisaab.save();
      res.redirect("/profile");
    } else {
      res.send("access nahi hai");
    }
  } catch (error) {
    res.status(500).send("An error occurred");
  }
});

function checkHisaabAccess(req, res, next) {
  if (req.session.hisaabaccess === req.params.id) {
    next();
  } else {
    res.redirect(`/hisaab/view/${req.params.id}`);
  }
}

module.exports = router;
