const express = require("express");
const route = express()
const controller = require("../controllers/controller");
const tokenVerify = require('../MiddleWare/tokenVerify')
const {uploadProfile} = require('../MiddleWare/multer')

route.get("/", controller.defaultRoute);
// route.get("/loginUser", tokenVerify, controller.loginUser);
route.post('/userRegister', controller.userRegister)
route.post('/userLogin', controller.userLogin)
route.get('/getChatUser', tokenVerify, controller.getChatUser)
route.post('/save-chat', tokenVerify, controller.saveChat)
route.get('/getSingleUser/:id',tokenVerify,  controller.getSingleUser)
route.post('/get-chat', tokenVerify, controller.getChat)

route.get('/delete-chat-userside/:id', controller.deleteChatUserside)
route.get('/delete-chat-bothside/:id', tokenVerify, controller.deleteChatBothside)
route.post('/update-chat/:id', tokenVerify, controller.updateChat)
route.post('/updateProfile/:id', uploadProfile, controller.updateProfile)
route.get('/getLoginUser',tokenVerify,  controller.getLoginUser)
route.post('/getNotificationChat',tokenVerify,  controller.getNotificationChat)

module.exports = route;
