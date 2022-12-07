const mongoose = require("mongoose")


const messageSchema = new mongoose.Schema({

    sender: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User"
    },
    payload: {
        type: String,
        trim: true,
        required: [true, "Message is Required "]
    }, chat: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Chat"
    }

}, {
    timestamps: true
})

module.exports = mongoose.model("Message", messageSchema)