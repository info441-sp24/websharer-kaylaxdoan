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
    created_date: Date
})


models.Post = mongoose.model('Post', postSchema)

console.log("mongoose models created")

export default models