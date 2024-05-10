import express from 'express';

var router = express.Router();

router.get("/", async (req, res, next) => {
    try {
        let comments = await req.models.Comment.find({post: req.query.postID});
        res.json(comments)
    }
    catch (error) {
        console.log(error.message)
        res.status(500).json({ "status": "error", "error": error.message });        
    }  
})

router.post("/", async (req, res, next)=> {
    if (req.session.isAuthenticated) {
        let comment = req.body;
        try {
            let newComment = new req.models.Comment({
                url: comment.url,
                username: req.session.account.username,
                comment: comment.newComment,
                post: comment.postID,
                created_date: Date.now()
            });
            await newComment.save();
            res.json({ "status": "success" });
        } catch (error) {
            console.log(error.message)
            res.status(500).json({ "status": "error", "error": error.message });
        }
    } else {
        res.status(401)
        res.json({
            status: "error",
            error: "not logged in"
        })
    }
})
export default router;