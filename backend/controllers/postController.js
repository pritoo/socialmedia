const Post = require("../models/postModel");
const User =require("../models/userModel")

exports.createPost = async(req,res)=>{
    try{
        const newPostData ={
            caption:req.body.caption,

            image:{
                public_id:"req.body.public_id",
                url:"req.body.url"
            },
            owner:req.user._id
        }
        const post =await Post.create(newPostData);

        const user = await User.findById(req.user._id);

        user.posts.push(post._id)
        
        res.staus(201).json({
            success:true,
            result:post
        })

    }catch(error){
        res.status(500).json({
            success:false,
            message:error.message
        });
    }
}