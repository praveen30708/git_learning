//Chat controller 
const BigPromise = require("../middleware/BigPromise")
const CustomError = require("../utils/customError")
const Chat = require("../models/chat")
const User = require("../models/user")

//creating the single One to One 



exports.createOneToOneChat = BigPromise(async (req, res, next) => {

    const { userId } = req.body
    if (!userId) {
        return next(new CustomError("user is unAurthorized", 400))
    }

    //verfifying if the users array conatins the User_id of the login user id and passed userid

    let chat = await Chat.find({
        isGroupChat: false,
        $and: [
            {
                users: { $elemMatch: { $eq: { _id: req.user._id } } }
            },
            {
                users: { $elemMatch: { $eq: { _id: userId } } }
            }
        ]
    })
    if (!chat.length) {

        const chat = {
            chatName: "sender",
            isGroupChat: false,
            users: [userId, req.user._id],
        }

        const newChat = await Chat.create(chat)
        const fullChat = await Chat.findById(newChat._id).populate("users")

        res.status(201).json({
            ...fullChat
        })
    }
})

//fetching all the chat in the login User present for the message Screen page

exports.fetchChats = BigPromise(async (req, res, next) => {

    const data = await Chat.findById({
        users: {
            $elemMatch: {
                $eq: {
                    _id: req.user._id
                }
            }
        }
    }).populate("users")
        .populate("lastestMessage")
        .populate("groupAdmin")
        .sort({ updatedAt: -1 })
        .then(async (result) => {
            result = await User.populate(result, {
                path: "latestMessage.sender",
                select: "email name photo"
            })
            res.status(200).json({
                result
            })
        })

    if (!data) {
        return next(new CustomError("No User's in Your's Contact"))
    }
})


//create the Group Chat 


exports.createGroupChat = BigPromise(async (req, res, next) => {
    const { chatName, users } = req.body

    if (!(chatName || users && users.length <= 2)) {
        return next(new CustomError("provide Group Name (or) minimum above users needs to create group", 401))
    }
    const group = {
        isGroupChat: true,
        chatName,
        groupAdmin: req.user._id,
        users
    }
    const createGroup = await Chat.create(group);

    const newGroup = await Chat.findById(createGroup._id).populate("users")
        .populate("groupAdmin")

    res.status(201).json({
        newGroup
    })
})




//updateing the  group Name

exports.updateChatInfo = BigPromise(async (req, res, next) => {

    const { groupId, chatName } = req.body

    if ((groupId || chatName)) {
        return next(new CustomError("All Field's are Required"))
    }

    const updatedGroup = await Chat.findByIdAndUpdate({
        groupId
    }, {
        chatName
    }, {
        new: true
    }).populate("users")
        .populate("groupAdmin")
        .populate("users")
    res.status(202).json({
        updatedGroup
    })
})

exports.addUserToGroup = BigPromise(async (req, res, next) => {

    const { userId, groupId } = req.body
    if (!(userId || groupId)) return next(new CustomError("provide the user Credentails", 400))

    const userAdded = await Chat.findByIdAndUpdate({
        groupId
    }, {
        $push: { users: userId }
    }, { new: true }).populate("users")
        .populate("groupAdmin")

    res.status(202).json({
        success: true,
        userAdded
    })
})
exports.removeUserFromGroup = BigPromise(async (req, res, next) => {

    const { userId, groupId } = req.body
    if (!(userId || groupId)) return next(new CustomError("provide the user Credentails", 400))

    const removedUsers = await Chat.findByIdAndUpdate({
        groupId
    }, {
        $pull: { users: userId }
    }, { new: true }).populate("users")
        .populate("groupAdmin")
    res.status(202).json({
        success: true,
        removedUsers
    })
})









