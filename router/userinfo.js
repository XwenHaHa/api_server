const express = require('express')
const router = express.Router();

// 挂载路由
const userinfo_handle = require('../router_handle/userinfo')

// 导入验证数据的中间件
const expressJoi = require('@escook/express-joi')
// 导入需要验证的对象
const {
    update_userinfo_schema,
    update_password_schema,
    update_avatar_schema
} = require('../schema/user')

// 获取用户基本信息的路由
router.get('/userinfo', userinfo_handle.getUserInfo)

// 更新用户基本信息的路由
router.post('/userinfo', expressJoi(update_userinfo_schema), userinfo_handle.updateUserInfo)

// 重置密码的路由
router.post('/updatepwd', expressJoi(update_password_schema), userinfo_handle.updatePassword)

// 更新用户头像的路由
router.post('/update/avatar', expressJoi(update_avatar_schema), userinfo_handle.updateAvatar)
module.exports = router