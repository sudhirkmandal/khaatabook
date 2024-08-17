const jwt = require("jsonwebtoken")
function isLoggedIn(req, res, next) {
    if (req.cookies.token) {
      if (process.env.JWT_SECRET) {
        jwt.verify(
          req.cookies.token,
          process.env.JWT_SECRET,
          function (err, decoded) {
            if (err) {
              res.redirect("/");
            } else {
              req.user = decoded;
              next();
            }
          }
        );
      } else {
        res.send("you forgot the env variables");
      }
    }else{
      res.redirect("/")
    }
  }

function redirectIfLogin(req, res, next){
  if(req.cookies.token){
    res.redirect("/profile")
  }else{
    next()
  }
}
  module.exports.isLoggedIn = isLoggedIn;
  module.exports.redirectIfLogin = redirectIfLogin;
  