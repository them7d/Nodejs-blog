const express = require("express");
const router = express.Router();

const Post = require("../modules/Post");

router.get("/", async (req, res) => {
      try {
            const locals = {
                  title: "NodeJs Blog",
                  description: "Simple Blog created with NodeJs, Express & MongoDb."
            }
            let perPage = 1;
            let page = req.query.page || 1;
            const data = await Post.aggregate([{ $sort: { createdAt: -1 } }])
                  .skip(perPage * page - perPage)
                  .limit(perPage)
                  .exec();
            const count = await Post.countDocuments();
            const nextPage = parseInt(page) + 1;
            const hasNextPage = nextPage <= Math.ceil(count / perPage);

            res.render("index", {
                  locals,
                  data,
                  current: page,
                  nextPage: (hasNextPage ? nextPage : null)
            });


            // const data = await Post.find();
      }
      catch (err) {
            console.error(err);
      }
});

router.get("/post/:id", async (req, res) => {
      try {
            const slug = req.params.id;
            const data = await Post.findById({ _id: slug })
            // remove it later
            // const locals = {
            //       title: "NodeJs Blog",
            //       description: "Simple Blog created with NodeJs, Express & MongoDb."
            // }
            const post = await Post.find();
            res.render("post", { data });
      }
      catch (error) {
            console.log(error);
      }
});
function insertPostData() {
      post.insertMany([
            {
                  title: "Building a Blog",
                  body: ""
            }
      ]);
}


router.post("/search", async (req, res) => {
      try {
            let searchTerm = req.body.searchTerm;
            const searchNoSpecialChar = searchTerm.replace(/[^a-zA-Z0-9]/g, "");
            const data = await Post.find({
                  $or: [
                        { title: { $regex: new RegExp(searchNoSpecialChar, 'i') } },
                        { body: { $regex: new RegExp(searchNoSpecialChar, 'i') } }
                  ]
            });

            res.render('search', { data });
      }
      catch (error) {
            console.log(error)
      }
});


router.get("/about", async (req, res) => {
      try {
            const data = await Post.find();
            res.render("about", data);
      }
      catch (err) { console.error(err) }
      // res.render("about", { title: "about" });
});

// function insertPostData() {
//       Post.insertMany([{
//             title: "building a blog",
//             body: "this is the body text"
//       }]);
// }
// insertPostData()
module.exports = router;