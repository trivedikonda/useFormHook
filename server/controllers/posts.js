import formFields from "../models/formModel.js"

//POST
export const createUser = async(req,res)=>{
    const newPost = new formFields(req.body)
    try{
        await newPost.save()
        res.status(201).json(newPost)
    }catch(error){
        res.status(400).json({message:error.message})
    }
}

//GET
export const getUserData = async (req, res) => {
    try {
        const userData = await formFields.find();
        console.log(userData);
        res.status(200).json(userData || []); // Return an empty array if no data
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
};

//DELETE
export const deleteUser = async(req,res)=>{
    try{
        const userId = req.params.id
        const deleteItem = await formFields.deleteOne({_id: userId});
        if (deleteItem.deletedCount === 1) {
            console.log("User removed");
            res.status(200).json({ message: "User removed successfully" });
        } else {
            console.log("User not found");
            res.status(404).json({ message: "User not found" });
        }
    }catch(error){
        console.error("Error deleting user:", error);
        res.status(500).json({ message: "Internal server error" });
    }
}

//PUT
export const updateUserDetails = async(req,res)=>{
    let userId=req.params.id 
    let newUser={
        firstName:req.body.firstName,
        lastName:req.body.lastName,
        mailId:req.body.mailId,
        facebook:req.body.facebook,
        twitter:req.body.twitter,
        phoneNumbers:req.body.phoneNumbers,
        phNumbers: req.body.phNumbers
    }
    try{
        console.log('New user data:', newUser);
        const result = await formFields.findByIdAndUpdate(userId, newUser, {new: true})
        if (!result) {
            return res.status(404).send("User not found");
        }
        res.send(result)   
    }catch(error){
        if (error.name === 'ValidationError') {
           
            return res.status(400).send(error.message);
        }
   
        console.error(error);
        res.status(500).send("internal server error")
    }
}