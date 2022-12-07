//message Controller

/**
 * send messages 
 * 
 * get all messages
 */
const BigPromise = require("../middleware/BigPromise")
const Message = require("../models/message")
const Chat = require("../models/chat")
const allMessages = BigPromise(async (req, res) => {
    try {
        const messages = await Message.find({ chat: req.params.chatId })
            .populate("sender", "name photo email")
            .populate("chat");
        res.status(201).json(messages);
    } catch (error) {
        res.status(400);
        throw new Error(error.message);
    }
});


const sendMessage = BigPromise(async (req, res) => {
    const { content, chatId } = req.body;

    if (!content || !chatId) {
        console.log("Invalid data passed into request");
        return res.sendStatus(400);
    }

    var newMessage = {
        sender: req.user._id,
        payload: content,
        chat: chatId,
    };

    try {
        var message = await Message.create(newMessage);

        message = await message.populate("sender", "name photo ")
        message = await message.populate("chat");
        message = await User.populate(message, {
            path: "chat.users",
            select: "name photo email",
        });

        message = await Chat.findByIdAndUpdate(req.body.chatId, { latestMessage: message });

        res.status(201).json({
            message
        })
    } catch (error) {
        res.status(400);
        throw new Error(error.message);
    }
});

module.exports = { allMessages, sendMessage };