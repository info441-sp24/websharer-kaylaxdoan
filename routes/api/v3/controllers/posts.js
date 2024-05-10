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


router.post("/like", async (req, res, next) => {
    if (req.session.isAuthenticated) {
        try {
            let ref_post = await req.models.Post.findById(req.body.postID);
            if (!ref_post.likes.includes(req.session.account.username)) {
                ref_post.likes.push(req.session.account.username)
            }
            await ref_post.save()
            res.json( {"status": "success"})
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

router.post("/unlike", async (req, res, next) => {
    if (req.session.isAuthenticated) {
        try {
            let ref_post = await req.models.Post.findById(req.body.postID);
            if (ref_post.likes.includes(req.session.account.username)) {
                ref_post.likes.pull(req.session.account.username)
            }
            await ref_post.save()
            res.json( {"status": "success"})
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

router.delete("/", async (req, res, next) => {
    if (req.session.isAuthenticated) {
        try {
            let ref_post = await req.models.Post.findById(req.body.postID);
            if (ref_post.username !== req.session.account.username) {
                res.status(401).json({
                    status: 'error',
                    error: "you can only delete your own posts"
                })
            } else {
                await req.models.Comment.deleteMany({post: req.body.postID})
                await req.models.Post.deleteOne({_id: req.body.postID})   
            }
            res.json( {"status": "success"})
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

router.get("/", async function(req, res, next) {
    try {
        const query = req.query.username ? { username: req.query.username } : {};
        const posts = await req.models.Post.find(query);

        let postData = await Promise.all(posts.map(async post => {
            try {
                const htmlPreview = await getURLPreview(post.url);
                return { id: post._id,
                        username: post.username, 
                        description: post.description, 
                        htmlPreview: htmlPreview, 
                        likes: post.likes, 
                        created_date: post.created_date};
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