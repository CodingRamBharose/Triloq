import User from "../models/UserModel.js";



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
