const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken")

const userSchema= new mongoose.Schema({
   name:{
        type:String,
        required:[true,"please enter name"]
   },

   avatar:{
     public_id:String,
     url:String
   },
   
   email:{
        type:String,
        required:[true,"please enter email"],
        unique:[true,"Email already exists"]
   },
   password:{
        type:String,
        required:[true,"please enter password"],
        minLength:[6,"minimum 6 character password"],
        select:false
   },
   posts:[
    {
        type:mongoose.Schema.Types.ObjectId,
        ref:"Post"
    }
   ],

   followers:[
    {
        type:mongoose.Schema.Types.ObjectId,
        ref:"User"
    }
   ],

   following:[
    {
        type:mongoose.Schema.Types.ObjectId,
        ref:"User"
    }
   ],

});

userSchema.pre("save",async function (next){
    if(this.isModified("password")){
        this.password = await bcrypt.hash(this.password,10)
    }

    next();
});

userSchema.methods.matchPassword = async function(password){
    //console.log(password,this.password)
    return await bcrypt.compare(password,this.password)
}

userSchema.methods.generateToken = function() {
    return jwt.sign({_id:this.id},process.env.JWT_SECRET)
}
module.exports=mongoose.model("User",userSchema)