const express = require("express");
const app = express();
const path = require("path");
const indexRouter = require("./routes/index")
const hisaabRouter = require("./routes/hisaab")
const db = require("./config/mongoose-connection");
const cookieParser = require("cookie-parser");
const flash = require("connect-flash");
const expressSession = require("express-session");

app.use(cookieParser())

app.set("view engine", "ejs");
app.use(express.json());
app.use(express.urlencoded({extended:true}));
app.use(express.static(path.join(__dirname, "public")))
app.use(expressSession({
    resave:false,
    saveUninitialized:false,
    secret: "secret",
}))

app.use(flash());

require('dotenv').config()

app.use("/", indexRouter);
app.use("/hisaab", hisaabRouter)

app.listen(process.env.PORT || 3002, function(){
    console.log("Server is running on port 3002");
})