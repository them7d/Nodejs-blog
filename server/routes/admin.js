const express = require("express");
const router = express.Router();
const Post = require("../modules/Post");
const User = require("../modules/User");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const jwtSecret = process.env.JWT_SECRET;
const adminLayout = "../views/layouts/admin";

/**
 * GET
 * Check Login
 */
const authMiddleware = (req, res, next) => {
      const token = req.cookies.token;
      if (!token) {
            return res.status(401).json({ message: "Unauthorized" })
      }
      try {
            const decoded = jwt.verify(token, jwtSecret);
            req.userId = decoded.userId;
            next();
      } catch (error) {
            console.log(error);
            res.status(401).json({ message: "Unauthorized" });
      }
};




/**
 * GET /
 * Admin - Login Page
 */
router.get("/admin", (req, res) => {
      const locals = {
            title: "admin",
            description: "simple blog created with NodeJs, Express & MongoDb"
      }
      if (req.cookies.token) {
            res.redirect("/dashboard");
      } else {
            try {
                  res.render("admin/index", { locals, layout: adminLayout })
            }
            catch (error) {
                  console.log(error);
            }
      }
});
/**
 * POST /
 * Admin - Login Page
 */
router.post("/admin", async (req, res) => {
      try {
            const { username, password } = req.body;
            const user = await User.findOne({ username });
            if (!user) {
                  return res.status(401).json({ message: 'Invalid credentials' });
            }
            const isPasswordValid = await bcrypt.compare(password, user.password);
            const token = jwt.sign({ userId: user._id }, jwtSecret);
            res.cookie("token", token, { httpOnly: true });
            res.redirect("/dashboard");
      }

      catch (error) {
            console.log(error);
      }
});
/**
 * GET
 * dashboard admin
 */
router.get("/dashboard", authMiddleware, async (req, res) => {
      const locals = {
            title: "Dashboard",
            description: "control panel for managing posts"
      }
      try {
            const data = await Post.find();
            res.render("admin/dashboard", {
                  locals,
                  data,
                  layout: adminLayout,
            });
      } catch (error) {
            console.log(error);
      }

});


/**
 * GET / 
 * admin - Create New Post
 */
router.get("/add-post", authMiddleware, async (req, res) => {
      const locals = {
            title: "add post",
            description: "control panel for managing posts"
      }
      try {
            res.render("admin/add-post", {
                  locals,
                  layout: adminLayout
            });
      }
      catch (error) {
            console.log(error);
      }

});

/**
 * GET / 
 * admin - Edit Post
 */
router.get("/edit-post/:id", authMiddleware, async (req, res) => {
      try {
            const data = await Post.findOne({ _id: req.params.id });
            res.render("admin/edit-post", {
                  data,
                  layout: adminLayout
            });
      }
      catch (error) {
            console.log(error);
      }

});

/**
 * PUT / 
 * admin - Edit Post
 */
router.put("/edit-post/:id", authMiddleware, async (req, res) => {
      try {
            await Post.findByIdAndUpdate(req.params.id, {
                  title: req.body.title,
                  body: req.body.body,
                  updatedAt: Date.now(),
            });
            res.redirect(`/edit-post/${req.params.id}`)
      }
      catch (error) {
            console.log(error);
      }

});

/**
 * POST / 
 * admin - Create New Post
 */
router.post("/add-post", authMiddleware, async (req, res) => {
      try {
            console.log(req.body);
            try {
                  const newPost = new Post({
                        title: req.body.title,
                        body: req.body.body
                  });
                  await Post.create(newPost);
                  res.redirect("/dashboard");
            } catch (error) {
                  console.log(error);

            }
      }
      catch (error) {
            console.log(error);
      }

});



/**
 * POST /users
 * admin - Register Page
 */
router.post("/register", async (req, res) => {
      try {
            const { username, password } = req.body;
            const hashedPassword = await bcrypt.hash(password, 10)
            try {
                  const user = await User.create({ username, password: hashedPassword });
                  res.status(201).json({ message: "User created", user })
            }
            catch (error) {
                  if (error.code === 1000) {
                        res.status(409).json({ message: "user already in use" })
                  }
                  res.status(500).json({ message: "internal server error" })
                  console.log(error);
            }
      }
      catch (error) {
            console.log(error);
      }
});

/**
 * DELELE /
 * Admin - Remove Post
 */
router.delete("/delete-post/:id", authMiddleware, async (req, res) => {
      try {
            await Post.deleteOne({ _id: req.params.id });
            res.redirect("/dashboard");
      }
      catch (error) {
            console.log(error);
      }
});

/**
 * GET / 
 * Admin - logout
 */
router.get("/logout", (req, res) => {
      res.clearCookie("token");
      // res.json({ message: "Logout successfully" });
      res.redirect("/")
});

module.exports = router;