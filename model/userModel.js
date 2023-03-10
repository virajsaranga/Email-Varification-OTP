const mongoose = require("mongoose");
var Schema = mongoose.Schema;
const jwt = require("jsonwebtoken")

const userSchema = new Schema(
  {
    
    username:{
      type:String,
     
    },
    password:{
      type:String,
    
    },
    email:{
      type:String,
    
    }
  },
  { timestamps: true }
);
userSchema.methods.generateJWT = function(){
    const token = jwt.sign({
        _id:this._id,
        number:this.number
    },process.env.JWT_SECRET_KEY,{expiresIn:"7d"})
    return token
}
const user = mongoose.model("user", userSchema);
module.exports = user;
