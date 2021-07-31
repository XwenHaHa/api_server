// 导入定义验证规则的包
const joi = require('joi')

// 定义用户名和密码的验证规则
const username = joi.string().alphanum().min(1).max(10).required()
const password = joi.string().pattern(/^[\S]{6,12}$/).required()

// 定义id, nickname, email的验证规则
const id = joi.number().integer().min(1).required()
const nickname = joi.string().required()
const email = joi.string().email().required()

// 定义验证avatar头像的规则,dataUri() 指的是base64格式的字符串
const avatar = joi.string().dataUri().required()

// 定义验证注册和登录表单数据的规则对象
exports.reg_login_schema = {
    body: {
        username,
        password,
    },
}

// 定义验证规则对象，定义用户的基本信息
exports.update_userinfo_schema = {
    // 需要对req.body表单数据进行验证 
    body: {
        id,
        nickname,
        email
    }
}

// 定义验证规则对象，重置密码
exports.update_password_schema = {
    body: {
        // 使用password这个定义好的规则验证req.body.oldPwd的值
        oldPwd: password,
        // joi.ref('oldPwd')值保持一致，not说明两个值不等，concat合并验证规则
        newPwd: joi.not(joi.ref('oldPwd')).concat(password)
    }
}

// 定义验证规则对象，更新头像
exports.update_avatar_schema = {
    body: {
        avatar
    }
}