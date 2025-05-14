import express from "express";
import user from "../../models/user";
import jwt from "jsonwebtoken";
import { checkuserlogin } from "../../checkuser";

const router = express.Router({ mergeParams: true });

// Done : data , signup , signin

// pading : edit , delete


router.get("/data", checkuserlogin , async (req, res) => {
    try{
        // @ts-ignore
        const userData = await user.findById(req.userId);
        res.json(userData);
    } catch(e) {
        res.status(303).json({
            message: "Not Authorized"
        })  
    }
});

router.post("/signup", async (req, res) => {
  // TODO: zod validation , hash the password
  const username = req.body.username;
  const password = req.body.password;

  try {
      await user.create({
          username: username,
          password: password
      }) 

      res.json({
          message: "User signed up"
      })
  } catch(e) {
      res.status(411).json({
          message: "User already exists"
      })
  }
});

router.post("/signin", async (req, res) => {
    const username = req.body.username;
    const password = req.body.password;

    const existingUser = await user.findOne({
        username,
        password
    })
  
    if (existingUser) {
        const token = jwt.sign({
            id: existingUser._id
            //@ts-ignore
        }, process.env.JWT_PASSWORD)

        res.json({
            token
        })
    } else {
        res.status(403).json({
            message: "Incorrrect credentials"
        })
    }
})

export default router;