import express from 'express';
var router = express.Router();

router.post("/", async (req, res, next) => {
    if (req.session.isAuthenticated) {
        let info = req.body;
        try {
            let existingUserInfo = await req.models.UserInfo.findOne({ username: req.session.account.username });
            if (existingUserInfo) {
                existingUserInfo.pronouns = info.pronouns;
                existingUserInfo.bio = info.bio;
                await existingUserInfo.save();
            } else {
                let newUserInfo = new req.models.UserInfo({
                    username: req.session.account.username,
                    pronouns: info.pronouns,
                    bio: info.bio
                });
                await newUserInfo.save();
            }
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

router.get("/", async (req, res) => {
    if (req.session.isAuthenticated) {
        try {
            let username = req.query.username;
            if (!username) {
                res.status(400).json({ "status": "error", "error": "Username is required" });
            } else {
                let userInfo = await req.models.UserInfo.findOne({ username: username });
                if (userInfo) {
                    res.json({
                        pronouns: userInfo.pronouns,
                        bio: userInfo.bio
                    });
                } else {
                    res.status(404).json({ "status": "error", "error": "User not found" });
                }
            }
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
