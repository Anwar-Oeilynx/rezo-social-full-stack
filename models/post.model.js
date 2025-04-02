const mongoose = require("mongoose");
const PostModel = require("../models/post.model");
const UserModel = require("../models/user.model");

const { isEmail } = require("validator");
const bcrypt = require("bcrypt");   
const { text } = require("body-parser");

const PostSchema = new mongoose.Schema(
    {
        posterId: {
        type: String,
        required: true,
        },
        message: {
        type: String,
        required: true,
        maxlenght: 500,
        },
        description: {
        type: String,
        max: 500,
        },
        picturePath: {
        type: String,
        default: "",
        },
        videoPath: {
        type: String,
        default: "",
        },
        likers: {
        type: [String],
        require: true,
        default: {},
        },
        comments: {
        type: [
            {
            commenterId: String,
            commenterPseudo: String,
            text: String,
            timestamps: Number ,
            },
        ],
        require: true,
       
        },
    },
    {
        timestamps: true,
    }
    
    );

    module.exports = mongoose.model("Post", PostSchema);
    