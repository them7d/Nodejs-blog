const express = require("express");
const router = express.Router();

router.get("/", (req, res) => {
      res.render("index", { title: "home" });
})
router.get("/about", (req, res) => {
      res.render("about", { title: "about" });
});
module.exports = router;