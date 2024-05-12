const express = require("express")
const expressLayouts = require("express-ejs-layouts")
const router = require("./server/routes/main");
const app = express();

app.set("view engine", "ejs");
app.use(express.static('public'))

app.use(expressLayouts);
app.set("layout", "./layouts/main")

app.use("/", router);

app.listen(5000, () => {
      console.log(`servcer is running on port 5000`);
});