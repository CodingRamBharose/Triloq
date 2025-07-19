import mongoose from "mongoose";
import User from "../models/UserModel.js";
import Message from "../models/MessagesModel.js";



export const searchContacts = async (req, res, next) => {

    try{
        const {query} = req.body;
        console.log("search query:", query);
        if(query === undefined || query === null){
            return res.status(400).send("search query is required");
        }

        const senitizedQuery = query.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");

        const regex = new RegExp(senitizedQuery, 'i');
        console.log("searching contacts with query:", regex);

        const contacts = await User.find({
            $and: [
                {_id:{$ne: req.userId}},
                {
                    $or: [
                        {firstName: regex},
                        {lastName: regex},
                        {email: regex}
                    ]
                }
            ]
        })

        return res.status(200).json({contacts});
    }catch (error) {
        console.error('Error searching contacts:', error);
        return res.status(500).send('Internal server error');
    }
}

export const getContactForDMList = async (req, res, next) => {

    try{
        let {userId} = req;
        
        userId = new mongoose.Types.ObjectId(userId);
        const contacts = await Message.aggregate([
            {
                $match: {
                    $or: [{sender: userId}, {receiver: userId}]
                }
            },
            {
                $sort: {timestamp: -1}
            },
            {
                $group : {
                    _id: {
                        $cond: {
                            if: {$eq: ["$sender", userId]},
                            then: "$recipient",
                            else: "$sender"
                        }
                    },
                    lastMessage: {$first: "$timestamp"},
                }
            },
            {
                $lookup: {
                    from: "users",
                    localField: "_id",
                    foreignField: "_id",
                    as: "contactInfo"
                
                }
            },
            {
                $unwind: "$contactInfo"
            },
            {
                $project: {
                    _id : 1,
                    lastMessage: 1,
                    email: "$contactInfo.email",
                    firstName: "$contactInfo.firstName",
                    lastName: "$contactInfo.lastName",
                    image: "$contactInfo.image",
                    color: "$contactInfo.color"
                }
            },
            {
                $sort: {lastMessageTime: -1}
            }
        ])

        return res.status(200).json({contacts});
    }catch (error) {
        console.error('Error searching contacts:', error);
        return res.status(500).send('Internal server error');
    }
}
