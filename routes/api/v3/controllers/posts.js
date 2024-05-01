import express from 'express';

var router = express.Router();

import getURLPreview from '../utils/urlPreviews.js';

//TODO: Add handlers here
router.post("/", async (req, res) => {
    if (!req.session || !req.session.isAuthenticated) {
        return res.status(401).json({
            status: "error",
            error: "not logged in"
        });
    }
   
    try {
        console.log(req.body)

        const newPost = new req.models.Post({
            url: req.body.url,
            description: req.body.description,
            username: req.session.account.username,
            created_date: new Date()
        })
        await newPost.save()

        res.send({"status": "success"})
    } catch(error){
        console.log("Error:", error)
        res.status(500).json({"status": "error", "error": error})
    }
})

router.get("/", async function(req, res, next) {
    try {
        const query = req.query.username ? { username: req.query.username } : {};
        const posts = await req.models.Post.find(query);

        let postData = await Promise.all(posts.map(async post => {
            try {
                const htmlPreview = await getURLPreview(post.url);
                return { username: post.username, 
                        description: post.description, 
                        htmlPreview: htmlPreview };
            } catch (error) {
                return { username: post.username, 
                        description: post.description, 
                        htmlPreview: `Error: ${error.message}`};
            }
        }));
        res.json(postData);
    }catch(error){
        console.log("Error:", error)
        res.status(500).json({"status": "error", "error": error})
    }
})

export default router;