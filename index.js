const express = require("express")
const expressLayouts = require("express-ejs-layouts")
const cookieParser = require("cookie-parser")
const session = require("express-session")
const MongoStore = require("connect-mongo")
const router = require("./server/routes/main");
const app = express();
const connect_db = require("./server/config/db.js")
app.set("view engine", "ejs");
app.use(express.static('public'))
require("dotenv").config();

connect_db();
require('dotenv').config()
app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(cookieParser());

app.use(session({
      secret: "keyboard cat",
      resave: false,
      saveUnitialized: true,
      store: MongoStore.create({
            mongoUrl: process.env.MONGODB_URI
      })
}))

app.use(expressLayouts);
app.set("layout", "./layouts/main")

app.use("/", router);
app.use("/", require("./server/routes/admin.js"));

app.listen(5000, () => {
      console.log(`servcer is running on port 5000`);
});