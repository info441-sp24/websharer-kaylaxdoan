import express from 'express';

var router = express.Router();

import getURLPreview from '../utils/urlPreviews.js';

//TODO: Add handlers here
router.post("/", async (req, res) => {
    try {
        console.log(req.body)

        const newPost = new req.models.Post({
            url: req.body.url,
            description: req.body.description,
            username: req.body.username,
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
        const posts = await req.models.Post.find();

        let postData = await Promise.all(posts.map(async post => {
            try {
                const htmlPreview = await getURLPreview(post.url);
                return { username: post.username, description: post.description, htmlPreview: htmlPreview };
            } catch (error) {
                return { username: post.username, description: post.description, htmlPreview: `Error: ${error.message}`};
            }
        }));
        res.json(postData);
    }catch(error){
        console.log("Error:", error)
        res.status(500).json({"status": "error", "error": error})
    }
})

export default router;