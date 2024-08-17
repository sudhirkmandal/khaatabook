const express = require("express");
const router = express.Router();
const userModel = require("../models/users-model");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const {isLoggedIn, redirectIfLogin} = require("../middleware/login-middleware")
const upload = require("../config/multer-config");

router.get("/", redirectIfLogin, function (req, res) {
  let err = req.flash("error")
  res.render("index", {loggedin:false, error:err});
});

router.get("/register", redirectIfLogin, function (req, res) {
  let err = req.flash("error")
  res.render("register", {loggedin: false, error:err});
});

router.post("/register", async function (req, res) {
  try {
    let { name, email, username, password } = req.body;
    let user = await userModel.findOne({ email });
    if (user) {
      req.flash("error", "Sorry, you already have an account");
      return res.redirect("/register");
    }

    if (process.env.JWT_SECRET) {
      bcrypt.genSalt(10, function (err, salt) {
        bcrypt.hash(password, salt, async function (err, hash) {
          let createdUser = await userModel.create({
            name,
            email,
            username,
            password: hash,
          });
          let token = jwt.sign(
            { email, id: createdUser._id },
            process.env.JWT_SECRET
          );
          res.cookie("token", token);
          res.redirect("/")
        });
      });
    } else {
      res.send("you forgot the env variables");
    }
  } catch (err) {
    console.log(err);
  }
});

router.post("/login", async function (req, res) {
  try {
    let { email, password } = req.body;
    let user = await userModel.findOne({ email }).select("+password");
    if (!user) {
      req.flash("error", "email or password did not match")
      return res.redirect("/")
    }

    if (process.env.JWT_SECRET) {
      bcrypt.compare(password, user.password, function (err, result) {
        if (result) {
          let token = jwt.sign({ email, id: user._id }, process.env.JWT_SECRET);
          res.cookie("token", token);
          res.redirect("/profile")
        } else {
          req.flash("error", "email or password did not match")
      return res.redirect("/")
        }
      });
    } else {
      res.send("you forgot the env variables");
    }
  } catch (err) {
    console.log(err);
  }
});



router.get("/logout", function (req, res) {
  res.cookie("token", "");
  res.redirect("/");
});


router.get("/profile", isLoggedIn, async function(req, res){  
  let byDate = Number(req.query.byDate)
  let {startDate, endDate} = req.query;

  byDate = byDate ? byDate : -1;
  startDate = startDate ? startDate : new Date("1970-01-01");
  endDate = endDate ? endDate : new Date();


  let user = await userModel.findOne({email: req.user.email}).populate({
    path: "hisaab",
    match: {createdAt: {$gte: startDate, $lte: endDate}},
    options:{sort : {createdAt: byDate}}
  })
  res.render("profile", {user})
})

router.get("/profile/upload", function(req, res){
  res.render("upload")
})

router.post("/upload",isLoggedIn, upload.single("image"), async function(req, res){
  let user = await userModel.findOne({email:req.user.email})  
  user.profilepicture = req.file.filename;
  await user.save();
  res.redirect("/profile")
})

module.exports = router;
