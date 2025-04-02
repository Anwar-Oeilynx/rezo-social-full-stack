const PostModel = require('../models/post.model');
const UserModel = require('../models/user.model');
const ObjectID = require('mongoose').Types.ObjectId;


module.exports.readPost = async (req, res) => {
    PostModel.find((err, docs) => {
        if (!err) res.send(docs);
        else console.log('Error to get data or ID unknown : ' + err).sort({ createdAt: -1 });
    });
    res.status(200).json(posts);
}   
module.exports.createPost = async (req, res) => {

    // let fileName;
    if (req.file !== null) {
        fileName = '';
    } else {    
        fileName = req.body.posterId + Date.now() + '.jpg';
        const base64Data = req.file.replace(/^data:image\/jpeg;base64,/, '');
        const buffer = Buffer.from(base64Data, 'base64');
    }
    const newPost = new PostModel({
        posterId: req.body.userId,
        message: req.body.message,
        picture: req.file ? `./uploads/posts/${fileName}` : '',
        video: req.body.video,
        likers: [],
        comments: [],
    });
    try {
        const post = await newPost.save();
        res.status(201).json(post);
    } catch (err) {
        return res.status(400).json({ message: err });
    }
}
//update post

module.exports.updatePost = async (req, res) => {
    if (!ObjectID.isValid(req.params.id))
        return res.status(400).send('ID unknown : ' + req.params.id);

    try {
        await PostModel.findOneAndUpdate(
            { _id: req.params.id },
            {
                $set: {
                    posterId: req.body.posterId,
                    message: req.body.message,
                    picture: req.body.picture,
                    video: req.body.video,
                },
            },
            { new: true, upsert: true, setDefaultsOnInsert: true },
            (err, docs) => {
                if (!err) return res.send(docs);
                if (err) return res.status(500).send({ message: err });
            }
        );
    } catch (err) {
        return res.status(500).json({ message: err });
    }
}
// delete post
module.exports.deletePost = async (req, res) => {   
    if (!ObjectID.isValid(req.params.id))
        return res.status(400).send('ID unknown : ' + req.params.id);

    try {
        await PostModel.remove({ _id: req.params.id }).exec();
        res.status(200).json({ message: "Successfully deleted. " });
    } catch (err) {
        return res.status(500).json({ message: err });
    }
}
// like post
module.exports.likePost = async (req, res) => {   
    if (!ObjectID.isValid(req.params.id) || !ObjectID.isValid(req.body.idToLike))
        return res.status(400).send('ID unknown : ' + req.params.id);

    try {
        await PostModel.findByIdAndUpdate(
            req.params.id,
            { $addToSet: { likers: req.body.idToLike } },
            { new: true, upsert: true },
            (err, docs) => {
                if (!err) res.status(201).json(docs);
                else return res.status(400).json(err);
            }
        );
        await UserModel.findByIdAndUpdate(
            req.body.idToLike,
            { $addToSet: { likes: req.params.id } },
            { new: true, upsert: true },
            (err, docs) => {
                if (err) return res.status(400).json(err);
            }
        );
    } catch (err) {
        return res.status(500).json({ message: err });
    }
}
// unlike post
module.exports.unlikePost = async (req, res) => {   
    if (!ObjectID.isValid(req.params.id) || !ObjectID.isValid(req.body.idToUnLike))
        return res.status(400).send('ID unknown : ' + req.params.id);

    try {
        await PostModel.findByIdAndUpdate(
            req.params.id,
            { $pull: { likers: req.body.idToUnLike } },
            { new: true, upsert: true },
            (err, docs) => {
                if (!err) res.status(201).json(docs);
                else return res.status(400).json(err);
            }
        );
        await UserModel.findByIdAndUpdate(
            req.body.idToUnLike,
            { $pull: { likes: req.params.id } },
            { new: true, upsert: true },
            (err, docs) => {
                if (err) return res.status(400).json(err);
            }
        );
    } catch (err) {
        return res.status(500).json({ message: err });
    }
}   
// comment post
module.exports.commentPost = async (req, res) => {   
    if (!ObjectID.isValid(req.params.id) || !ObjectID.isValid(req.body.idToComment))
        return res.status(400).send('ID unknown : ' + req.params.id);

    try {
        await PostModel.findByIdAndUpdate(
            req.params.id,
            {
                $push: {
                    comments: {
                        commenterId: req.body.idToComment,
                        commentPseudo: req.body.commentPseudo,
                        text: req.body.text,
                        timestamp: new Date().getTime(),
                    },
                },
            },
            { new: true, upsert: true },
            (err, docs) => {
                if (!err) res.status(201).json(docs);
                else return res.status(400).json(err);
            }
        );
    } catch (err) {
        return res.status(500).json({ message: err });
    }
}

// edit comment post
module.exports.editCommentPost = async (req, res) => {   
    if (!ObjectID.isValid(req.params.id) || !ObjectID.isValid(req.body.idToEdit))
        return res.status(400).send('ID unknown : ' + req.params.id);

    try {
        await PostModel.findById(
            { _id: req.params.id, "comments._id": req.body.idToEdit },
            {
                $set: {
                    "comments.$.text": req.body.text,
                },
            },
            { new: true, upsert: true },
            (err, docs) => {
                if (!err) res.status(201).json(docs);
                else return res.status(400).json(err);
            }
        );
    } catch (err) {
        return res.status(500).json({ message: err });
    }
}   

// delete comment post
module.exports.deleteCommentPost = async (req, res) => {   
    if (!ObjectID.isValid(req.params.id) || !ObjectID.isValid(req.body.idToDelete))
        return res.status(400).send('ID unknown : ' + req.params.id);

    try {
        await PostModel.findByIdAndUpdate(
            req.params.id,
            { $pull: { comments: { _id: req.body.idToDelete } } },
            { new: true, upsert: true },
            (err, docs) => {
                if (!err) res.status(201).json(docs);
                else return res.status(400).json(err);
            }
        );
    } catch (err) {
        return res.status(500).json({ message: err });
    }
}