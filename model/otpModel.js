const mongoose = require("mongoose");
var Schema = mongoose.Schema;
const bcrypt = require("bcrypt");

const userOtpSchema = new Schema(
    {
      
      email:{
        type:String,
       // required:true,
      },
      otp:{
        type:String,
       // required:true
      },
      username:String,
      password:String,
      createAt:{type:Date,default:Date.now,index:{expires:300}}
    },
    { timestamps: true }
  ); 
//   userOtpSchema.pre("save", async function (next) {
//     if (!this.isModified("password")) {
//         next();
//     }

//     const salt = await bcrypt.genSalt(10);
//     this.password = await bcrypt.hash(this.password, salt);
//     next();
// });
 

  const otp = mongoose.model("otp", userOtpSchema);
module.exports = otp;
