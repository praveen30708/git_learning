const mongoose = require("mongoose")


const chatSchema = new mongoose.Schema({

    chatName: {
        type: String,
        trim: true,
        required: [true, "Chat Name is Required"]
    },
    isGroupChat: {
        type: Boolean,
        default: false
    },
    users: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: "User"
    }],
    groupAdmin: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User"
    },
    latestMessage: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Message"
    }
}, {
    timestamps: true
})

module.exports = mongoose.model("Chat", chatSchema)




/***
 * 
 * This Model is used for creating the One to One of Group messages 
 */