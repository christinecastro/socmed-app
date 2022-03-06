const mongoose = require("mongoose");

const PostSchema = new mongoose.Schema({
    userId:{ type: String, required: true },
    username : { type: String, required: true},
    content: { type: String, required: true, max: 500 },
    likes : { type: Array , unique: true, default: []}
    },
    { timestamps: true }
);

module.exports = mongoose.model("Post", PostSchema);