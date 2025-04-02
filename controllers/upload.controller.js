const UserModel = require("../models/user.model");
const fs = require("fs"); //    
const { promisify } = require("util");
const pipeline = promisify(require("stream").pipeline);


module.exports.uploadProfil = async (req, res) => {
    // Check if the request contains a file
        try {
        if (req.file) {
            const fileName = req.body.name + ".jpg";
            const filePath = `${__dirname}/../client/public/uploads/profil/${fileName}`;
            await pipeline(req.file.stream, fs.createWriteStream(filePath));
            await UserModel.findByIdAndUpdate(
                req.body.userId,
                { $set: { picture: `./uploads/profil/${fileName}` } },
                { new: true, upsert: true, setDefaultsOnInsert: true }
            );
            res.status(200).json({ message: "File uploaded successfully" });
        } else {
            res.status(400).json({ error: "No file uploaded" });
        }
    } catch (error) {
        res.status(400).json({ error: "Error uploading file" });
    }
}