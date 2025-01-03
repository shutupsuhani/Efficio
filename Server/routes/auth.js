import express from "express";
import bcrypt from "bcrypt";
import dotenv from "dotenv";
import User from "../model/User.js";
import jwt from "jsonwebtoken";
import nodemailer from "nodemailer";
import passport from "passport";
dotenv.config();
const router = express.Router();

router.post("/signup", async (req, res) => {
  const { username, password, email } = req.body;

  // Check if the user already exists
  const existingUser = await User.findOne({ email });

  if (existingUser) {
    return res.status(403).json({ message: "User already exists" });
  }

  // Hash the password
  const hashedPassword = await bcrypt.hash(password, 10);

  // Create a new user instance
  const newUser = new User({
    email,
    password: hashedPassword,
    username,
  });

  // Save the new user to the database
  await newUser.save();

  return res
    .status(200)
    .json({ status: true, message: "Successfully registered" });
});

router.post("/login", async (req, res) => {
  try {
    const { email, password } = req.body;

    // Check if user exists
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(404).json({ message: "User Not Found!" });
    }

    // Validate password
    const validPassword = await bcrypt.compare(password, user.password);
    if (!validPassword) {
      return res.status(403).json({ message: "Incorrect Password" });
    }

    // Generate token
    const token = jwt.sign(
      { _id: user._id, username: user.username, email: user.email },
      process.env.KEY,
      { expiresIn: "1d" }
    );
    

    // Set token in cookie
    res.cookie("token", token, { httpOnly: true, maxAge: 3600000 });

    // Respond with token
    res.status(200).json({ status: true, message: "Login Successfully",user, token });
  } catch (error) {
    console.error("Error during login:", error);
    res.status(500).json({ message: "Internal Server Error" });
  }
});

router.post("/forgot-password", async (req, res) => {
  const { email } = req.body;

  try {
    const user = await User.findOne({ email });

    if (!user) {
      return res.status(403).json({ message: "User does not exist" });
    }

    const token = jwt.sign({ id: user._id }, process.env.KEY, {
      expiresIn: "1d",
    });

    var transporter = nodemailer.createTransport({
      service: "gmail",
      auth: {
        user: process.env.user,
        pass: process.env.pass,
      },
    });

    var mailOptions = {
      from: "sahusuhani14@gmail.com",
      to: email,
      subject: "Reset Password",
      text: `http://localhost:5173/reset-password/${user._id}/${token}`,
    };

    transporter.sendMail(mailOptions, function (error, info) {
      if (error) {
        console.log(error);
        return res.status(500).json({ message: "Error sending email" });
      } else {
        console.log("Email sent: " + info.response);
        return res
          .status(200)
          .json({ status: true, message: "Email sent successfully" });
      }
    });
  } catch (err) {
    console.log(err);
    return res.status(500).json({ message: "Error sending email" });
  }
});

router.post("/reset-password/:id/:token", async (req, res) => {
  const { id, token } = req.params;
  const { password } = req.body;

  jwt.verify(token, process.env.KEY, async (err, decoded) => {
    if (err) {
      return res.status(400).json({ error: "Error with Token" });
    } else {
      try {
        // Check if the user exists
        const user = await User.findById(id);
        if (!user) {
          return res.status(404).json({ error: "User not found" });
        }

        // Hash the new password
        const hashedPassword = await bcrypt.hash(password, 10);

        // Update the user's password
        await User.findByIdAndUpdate(id, { password: hashedPassword });

        // Send success response
        return res.status(200).json({ status: "Success" });
      } catch (error) {
        return res.status(500).json({ error: error.message });
      }
    }
  });
});

router.get("/login/failed",(req,res)=>{
     res.status(401).json({
       error:true,
       message:"login failure"
     })
})

router.get(
     "/google/callback",
     passport.authenticate("google",{
       successRedirect:process.env.Client_URL,
       failureRedirect:"/login/failed"
     })
) 



router.get('/google', (req, res) => {
  const url = `https://accounts.google.com/o/oauth2/v2/auth?client_id=${process.env.Client_ID}&redirect_uri=${process.env.Client_URL}&response_type=code&scope=profile email`;
  res.redirect(url);
});

router.get("/logout",(req,res)=>{
     req.logout();
     res.redirect(process.env.Client_URL);
})

export { router as userRouter };
