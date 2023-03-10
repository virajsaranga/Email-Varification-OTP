//const bcrypt = require("bcrypt")
const _ = require("lodash");
const axios = require("axios");
const otpGenerator = require("otp-generator");
const nodemailer = require("nodemailer");
const bcrypt = require("bcrypt");

const userModel = require("../model/userModel");
const otpModel = require("../model/otpModel");
//const otpModelLogin = require("../model/otpModelLogin")

module.exports.signUp = async (req, res) => {
  const emailExist = await userModel.findOne({ email: req.body.email });
  if (emailExist)
    return res
      .status(200)
      .json({ code: 200, success: true, message: "Email already available" });

  const OTP = otpGenerator.generate(6, {
    digits: true,
    alphabets: false,
    upperCase: false,
    specialChars: false,
  });

  const { username, password, email } = req.body;
  console.log("otp", OTP);

  const sender_email = "viraj@gmail.com";

  const transport = nodemailer.createTransport({
    service: "gmail",
    auth: {
      user: sender_email,
      pass: "wtijnsbsiaazpblf",
    },
  });

  transport
    .sendMail({
      from: sender_email,
      to: email,
      subject: `OTP CODE`,
      html: ` This is OTP code : ${OTP}`,
    })
    .then(() => {
      console.log("Email Sent ");
    })
    .catch(() => {
      console.log("Email Not Sent ");
    });

  const otp = new otpModel({
    email: email,
    otp: OTP,
    username: username,
    password: password,
  });
  const salt = await bcrypt.genSalt(10);
  otp.otp = await bcrypt.hash(otp.otp, salt);
  const result = await otp.save();
  return res
    .status(200)
    .send({
      code: 200,
      success: true,
      message: "OTP successfully send please check your email",
    });
};
module.exports.verifyOtp = async (req, res) => {
  const { username, password, email } = req.body;
  const otpHolder = await otpModel.find({
    email: req.body.email,
  });
  if (otpHolder.length === 0) {
    return res.status(400).send({
      code: 400,
      success: false,
      message: "You use an Expired OTP",
    });
  }
  const rightOtpFind = otpHolder[otpHolder.length - 1];
  const validUser = await bcrypt.compare(req.body.otp, rightOtpFind.otp);
  if (rightOtpFind.email === req.body.email && validUser) {
    const user = new userModel({
      email: rightOtpFind.email,
      username: rightOtpFind.username,
      password: rightOtpFind.password,
    });
    const token = user.generateJWT();
    const result = await user.save();
    const OTPDelete = await otpModel.deleteMany({
      email: rightOtpFind.email,
    });
    return res.status(200).send({
      code: 200,
      message: "User Registration Successfull",
      token: token,
      data: result,
    });
  } else {
    return res.status(400).send({ code: 400 });
  }
};

