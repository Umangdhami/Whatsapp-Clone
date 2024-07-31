const bcrypt = require("bcrypt");
const saltRound = 10;
const registerModel = require("../model/registerModel");
const loginModel = require("../model/LoginModel");
const chatModel = require("../model/chatModel");
const jwt = require("jsonwebtoken");
const dotenv = require("dotenv");
const profileModel = require("../model/profileModel");
dotenv.config();
const secretKey = process.env.SECRET_KEY;
const fs = require("fs");
const path = require("path");
const mongoose = require("mongoose");
const defaultRoute = (req, res) => {
  res.render("index");
};
const moment = require('moment');
const getCurrentTime = () => moment().format('HH:mm');


const userRegister = async (req, res) => {
  const { username, email, password, conf_pass, phone } = req.body;

  if (password === conf_pass) {
    try {
      const userExistEmail = await registerModel.findOne({ email });
      const userExistPhone = await registerModel.findOne({ phone });

      if (userExistEmail || userExistPhone) {
        res.json({
          status: false,
          message: "User Olready Exists...",
          data: null,
        });
      } else {
        const hashPass = await bcrypt.hash(password, saltRound);

        const user = new registerModel({
          email,
          password: hashPass,
          phone,
        });

        const profile = new profileModel({
          username: "Test",
          user_id: user.id,
          profile_pic: "user.jpg",
        });

        await profile.save();
        await user.save();
        res.json({
          status: true,
          message: "User Registred.....",
          data: user,
        });
      }
    } catch (err) {
      res.json({ msg: err });
    }
  } else {
    res.json({ msg: "Pass Not Match..." });
  }
};

const userLogin = async (req, res) => {
  try {
    const { email, password } = req.body;

    const loginUser = await loginModel.findOne({ email });

    if (loginUser) {
      jwt.verify(loginUser.token, secretKey, async (err, decoded) => {
        if (err) {
          await loginModel.findByIdAndDelete(loginUser.id);
          return res.json({ msg: "Token Expire..." });
        }

        if (decoded) {
          res.json({ msg: "User Is Loginned Another Device..." });
        }
      });
    } else {
      const user = await registerModel.findOne({ email });

      if (user) {
        const dPass = await bcrypt.compare(password, user.password);

        if (dPass) {
          const token = jwt.sign({ user }, secretKey, { expiresIn: "3d" });

          const login = await loginModel({
            user_id: user.id,
            email,
            password : user.password,
            token,
          });
          login.save();

          res.json({ token, status : true, msg: "Login Successfully...", data : user});
        } else {
          res.json({ msg: "Wrong Password Entered..." });
        }
      } else {
        res.json({ msg: "User Not Fount Register First..." });
      }
    }
  } catch (err) {
    res.json({ msg: err });
  }
};

const getChatUser = async (req, res) => {
  try {
    const { _id } = req.user.user;
    const objectId = new mongoose.Types.ObjectId(_id);

    const users = await registerModel.aggregate([
      {
        $match: {
          _id: { $ne: objectId },
        },
      },
      {
        $lookup: {
          from: "profiles",
          localField: "_id",
          foreignField: "user_id",
          as: "profiles",
        },
      },
      {
        $unwind: {
          path: "$profiles",
          preserveNullAndEmptyArrays: true, // Preserve registers without profiles
        },
      },

      {
        $project: {
          _id: 1, // Include _id for matching later
          email: 1,
          phone: 1,
          is_online: 1,
          profile: {
            username: "$profiles.username",
            user_id: "$profiles.user_id",
            profile_pic: {
              $cond: {
                if: { $ifNull: ["$profiles.profile_pic", false] },
                then: {
                  $concat: [
                    `${process.env.IMAGE_ACCESS_PATH}/profileimg/`,
                    "$profiles.profile_pic",
                  ],
                },
                else: null,
              },
            },
          },
        },
      },
    ]);

    // users now contains an array of users with their profiles, excluding the current user

    res.json({
      status: true,
      message: "User Fetch...",
      data: users,
    });
  } catch (err) {
    console.log(err);
    res.json({
      status: false,
      message: "Server Error",
    });
  }
};

const saveChat = async (req, res) => {
  try {
    const { reciver_id, message, username } = req.body;
    const { _id } = req.user.user;

    const chat = await chatModel({
      sender_id: _id,
      reciver_id,
      message,
      sent_time : getCurrentTime(),
      reciver_username: username,
      sender_username: req.user.user.username,
      is_send : 1
    });
    chat.save();

    res.json({
      status: true,
      message: "Chat Saved....",
      data: chat,
      device_id: _id,
    });
  } catch (error) {
    console.log(error);
    res.json({
      status: false,
      message: error.message,
    });
  }
};

const getSingleUser = async (req, res) => {
  try {
    const { id } = req.params;
    const objectId =new mongoose.Types.ObjectId(id)
    const singleUser = await registerModel.findById(id);

    if (!singleUser) {
      return res.json({
        status: false,
        message: "User not found",
      });
    } 
      const singleUsers = await registerModel.aggregate([
        {
          $match: {
            _id:  objectId ,
          },
        },
        {
          $lookup: {
            from: "profiles",
            localField: "_id",
            foreignField: "user_id",
            as: "profiles",
          },
        },
        {
          $unwind: {
            path: "$profiles",
            preserveNullAndEmptyArrays: true, // Preserve registers without profiles
          },
        },

        {
          $project: {
            sender_id: req.user.user._id,
            _id: 1, // Include _id for matching later
            email: 1,
            phone: 1,
            is_online: 1,
            profile: {
              username: "$profiles.username",
              user_id: "$profiles.user_id",
              profile_pic: {
                $cond: {
                  if: { $ifNull: ["$profiles.profile_pic", false] },
                  then: {
                    $concat: [
                      `${process.env.IMAGE_ACCESS_PATH}/profileimg/`,
                      "$profiles.profile_pic",
                    ],
                  },
                  else: null,
                },
              },
            },
          },
        },
      ]);
   


    let user = {
      ...singleUser.toObject(),
    };


    res.json({
      status: true,
      message: "User retrieved successfully",
      data: singleUsers,
    });
  } catch (error) {
    console.log(error);
    res.json({
      status: false,
      message: error.message,
    });
  }
};

const getLoginUser = async (req, res) => {
  try {
    const  id  = req.user.user._id;
    const objectId =new mongoose.Types.ObjectId(id)
    const singleUser = await registerModel.findById(id);

    if (!singleUser) {
      return res.json({
        status: false,
        message: "User not found",
      });
    } 
      const singleUsers = await registerModel.aggregate([
        {
          $match: {
            _id:  objectId ,
          },
        },
        {
          $lookup: {
            from: "profiles",
            localField: "_id",
            foreignField: "user_id",
            as: "profiles",
          },
        },
        {
          $unwind: {
            path: "$profiles",
            preserveNullAndEmptyArrays: true, // Preserve registers without profiles
          },
        },

        {
          $project: {
            sender_id: req.user.user._id,
            _id: 1, // Include _id for matching later
            email: 1,
            phone: 1,
            is_online: 1,
            profile: {
              username: "$profiles.username",
              user_id: "$profiles.user_id",
              profile_pic: {
                $cond: {
                  if: { $ifNull: ["$profiles.profile_pic", false] },
                  then: {
                    $concat: [
                      `${process.env.IMAGE_ACCESS_PATH}/profileimg/`,
                      "$profiles.profile_pic",
                    ],
                  },
                  else: null,
                },
              },
            },
          },
        },
      ]);
   



    res.json({
      status: true,
      message: "User retrieved successfully",
      data: singleUsers,
    });


  } catch (error) {
    console.log(error);
    res.json({
      status: false,
      message: error.message,
    });
  }
};

const getChat = async (req, res) => {
  try {
    const { reciver_id } = req.body;
    const { _id } = req.user.user;
    // console.log(_id, 'sender_id');
    // console.log(reciver_id, 'reciver_id');

    const chats = await chatModel.aggregate([
      {
        $match: {
          $or: [
            { sender_id: _id, reciver_id: reciver_id },
            { sender_id: reciver_id, reciver_id: _id },
          ],
        },
      },
    ]);

    // console.log(chats);

    res.json({
      data: chats,
    });
  } catch (error) {
    res.json({
      status: false,
      message: error.message,
    });
  }
};

const deleteChatUserside = async (req, res) => {
  try {
    const { id } = req.params;

    const chat = await chatModel.findByIdAndUpdate(id, {
      delete_me: 1,
    });

    res.json({
      status: true,
      message: "Chat Deleted User Side...",
      data: chat,
    });
  } catch (error) {
    console.log(error);
    res.json({
      status: false,
      message: error.message,
    });
  }
};

const deleteChatBothside = async (req, res) => {
  try {
    const { id } = req.params;

    const chat = await chatModel.findByIdAndUpdate(
      id,
      { delete_everyone: 1 },
      { new: true } // This option ensures the updated document is returned
    );

    res.json({
      status: true,
      message: "Chat Deleted Both Side...",
      device_id: req.user.user._id,
      data: chat,
    });
  } catch (error) {
    console.log(error);
    res.json({
      status: false,
      message: error.message,
    });
  }
};

const updateChat = async (req, res) => {
  try {
    const { msg } = req.body;
    const { id } = req.params;

    const chat = await chatModel.findByIdAndUpdate(
      id,
      { message: msg, edited: 1 },
      { new: true }
    );

    res.json({
      status: true,
      message: "Chat Updated...",
      data: chat,
    });
  } catch (error) {
    console.log(error);
    res.json({
      status: false,
      message: error.message,
    });
  }
};

const updateProfile = async (req, res) => {
  try {
    const { id } = req.params;
    const { username } = req.body;
    let file = req.file;

    const profile = await profileModel.findOne({ user_id: id });

    if (req.file) {
      if (
        profile.profile_pic !== "user.jpg" &&
        fs.existsSync(
          path.join(__dirname, `../public/profileImg/${profile.profile_pic}`)
        )
      ) {
        fs.unlinkSync(
          path.join(__dirname, `../public/profileImg/${profile.profile_pic}`)
        );
      }

      file = file.filename;
    } else {
      file = profile.profile_pic;
    }

    if (profile) {
      const user_profile = await profileModel.findByIdAndUpdate(
        profile.id,
        { username, profile_pic: file },
        { new: true }
      );

      const user = await registerModel.findByIdAndUpdate(id, {
        username,
      });

      res.json({
        status: true,
        message: "Profile Update Successfully...",
        data: user_profile,
      });
    } else {
      res.json({
        status: false,
        message: "Profile Not Found...",
      });
    }
  } catch (error) {
    console.log(error);
    res.json({
      status: false,
      message: error.message,
    });
  }
};

const getNotificationChat  = async(req, res) => {
  try {

    const {reciver_id, sender_id} = req.body
            // chat.reciver_id == reciver_id && chat.sender_id == sendrId

    const chats = await chatModel.find({
      reciver_id : reciver_id,
      sender_id : sender_id,
      is_read : 0
    });

    res.json({
      status : true,
      message : 'Notification Fetch Successfully...',
      data : chats
    })

  } catch (error) {
    res.json({
      status : false,
      message : error.message
    })
  }

}

// const getNotificationChat  = (req, res) => {
//   try {

//   } catch (error) {
//     res.json({
//       status : false,
//       message : error.message
//     })
//   }

// }
module.exports = {
  defaultRoute,
  userRegister,
  userLogin,
  getChatUser,
  saveChat,
  getSingleUser,
  getChat,
  deleteChatUserside,
  deleteChatBothside,
  updateChat,
  updateProfile,
  getLoginUser,
  getNotificationChat
};
