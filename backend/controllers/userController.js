const User = require("../models/userModel");

exports.register = async (req, res) => {
  try {
    const { name, email, password } = req.body;

    let user = await User.findOne({ email });
    if (user) {
      return res
        .status(400)
        .json({ success: true, message: "User Already Exists" });
    }

    user = await User.create({
      name,
      email,
      password,
      avatar: { public_id: "sample_id", url: "sampleurl" },
    });

    const token = await user.generateToken()

    //console.log(token);
    const options ={
    expires:new Date(Date.now()+ 90 * 24 * 60 * 60 * 1000),
    httpOnly:true
  }

    res.status(201).cookie("token",token,options).json({
        success:true,
        result:user
    });

   // res.status(201).json({success:true,user})
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};


exports.login =async(req,res)=>{
    try {

        const {email,password}=req.body;

        //console.log(email,password)

        const user = await User.findOne({email}).select("+password");

        if(!user){
            return res.status(400).json({
                success:false,
                message:"user does not exist"
            });
    }

    const isMatch = await user.matchPassword(password);

    if(!isMatch){
        return res.status(400).json({
            success:false,
            message:"Incorrect Password"
        });
    }

    const token = await user.generateToken()

    //console.log(token);
    const options ={
    expires:new Date(Date.now()+ 90 * 24 * 60 * 60 * 1000),
    httpOnly:true
  }

    res.status(200).cookie("token",token,options).json({
        success:true,
        result:user
    });
        
    } catch (error) {
        res.status(500).json({
            success:false,
            message:error.message
        })
    }
};


exports.followUser = async (req,res)=>{
  try {
    const userToFollow = await User.findById(req.params.id);
    const loggedInUser = await User.findById(req.user._id);

    if(!userToFollow){
      return res.status(404).json({
        success:false,
        message:"User not found"
      })
    
    }
    if(loggedInUser.following.includes(userToFollow._id)){
      const indexfollowing= loggedInUser.following.indexOf(userToFollow._id);
      const indexfollowers = userToFollow.followers.indexOf(loggedInUser._id);

      loggedInUser.following.splice(indexfollowing,1);
      userToFollow.followers.splice(indexfollowers,1);

      await loggedInUser.save();
      await userToFollow.save();

      res.status(200).json({
        success:true,
        message:"User Unfollowed"
      });
    }
    else{
      loggedInUser.following.push(userToFollow._id);
      //console.log(userToFollow._id)
      userToFollow.followers.push(loggedInUser._id);
     //console.log(loggedInUser._id)

      await loggedInUser.save();
      await userToFollow.save();

      return res.status(200).json({
        success:true,
        message:"User followed"
      })
      
    }
    
  } catch (error) {
    res.status(500).json({
      success:false,
      message:error.message
    })
    
  }
}
