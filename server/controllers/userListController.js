import User from "../models/userModel.js"

export const userList = async(req,res)=>{
    try {
        const allUsers = await User.find();
        res.status(200).json(allUsers)
    } catch (error) {
        res.status(500).json({message:"Unable to fetch all users"})
    }
}

export const blockUser = async(req,res)=>{
    
    try {
        
        
        const {userId} = req.params;
        
        const user = await User.findById(userId)

        if(!user){
            return res.status(404).json({message:'User not found'})
        }
        user.isBlock = !user.isBlock;
        await user.save()
        res.status(200).json({
            message: user.isBlock ? 'User blocked successfully' : 'User unblocked successfully',
            user: {
              _id: user._id,
              name: user.name,
              email: user.email,
              isBlock: user.isBlock
            }
          });
    } catch (error) {
        res.status(500).json({ message: 'Internal server error' ,error});
    }
}