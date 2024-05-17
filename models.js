import mongoose from 'mongoose'

let models = {}

console.log("connecting to mongodb")
//TODO: Add your mongoDB connection string (mongodb+srv://...)
await mongoose.connect("mongodb+srv://kaydoan:Kayla5901$@cluster0.7joe7g5.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0")

console.log("successfully connected to mongodb")

const postSchema = new mongoose.Schema({
    url: String,
    description: String,
    username: String,
    likes: [String],
    created_date: Date
})

const commentSchema = new mongoose.Schema({
    username: String,
    comment: String,
    post: { type: mongoose.Schema.Types.ObjectId, ref: 'Post' },
    created_date: Date
})

const userInfoSchema = new mongoose.Schema({
    username: String,
    pronouns: String,
    bio: { type: String, default: ''},
})

models.Post = mongoose.model('Post', postSchema)
models.Comment = mongoose.model('Comment', commentSchema)
models.UserInfo = mongoose.model('UserInfo', userInfoSchema)

console.log("mongoose models created")

export default models