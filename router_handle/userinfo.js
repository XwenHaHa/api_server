// 导入数据库模块
const db = require('../db/index')
// 导入密码验证模块
const bcrypt = require('bcryptjs')
// 获取用户基本信息的处理函数
exports.getUserInfo = (req, res) => {
    // res.send('ok')
    // 密码这种隐私的字段十分重要不能随意展示给用户
    const sql = 'select id,username,nickname,email,user_pic from ev_users where id=?'
    // 执行sql语句
    // req对象上的user属性，是Token解析成功，express-jwt中间件帮我们挂载上去的
    db.query(sql, req.user.id, (err, results) => {
        // console.log(results);
        if (err) return res.cc(err)
        if (results.length !== 1) {
            res.cc('查询用户信息失败')
        }
        res.send({
            status: 0,
            message: '查询用户信息成功',
            data: results[0]
        })
    })
}
// 更新用户基本信息的处理函数
exports.updateUserInfo = (req, res) => {
    // res.send('ok')
    // 定义待执行的sql语句
    const sql = 'update ev_users set ? where id = ?'
    // 调用db.query()执行sql语句并传递参数
    db.query(sql, [req.body, req.body.id], (err, results) => {
        if (err) return res.cc(err)
        // 执行update语句返回的是一个对象，里面有一个affectedRows属性   
        if (results.affectedRows !== 1) {
            return res.cc('更新用户基本信息失败')
        }
        res.cc('更新用户基本信息成功', 0)
    })
}
// 重置密码的处理函数
exports.updatePassword = (req, res) => {
    // res.send('ok')
    // 根据id查询用户是否存在
    const sql = 'select * from ev_users where id = ?'
    db.query(sql, req.user.id, (err, results) => {
        if (err) return res.cc(err)
        if (results.length !== 1) {
            return res.cc('用户不存在')
        }
        // 判断提交的旧密码是否正确
        const compareResult = bcrypt.compareSync(req.body.oldPwd, results[0].password)
        if (!compareResult) return res.cc('原密码错误')
        // 定义更新用户密码的sql语句
        const pwdsql = 'update ev_users set password=? where id=?'
        // 对新密码进行加密处理
        const newPwd = bcrypt.hashSync(req.body.newPwd, 10)
        db.query(pwdsql, [newPwd, req.user.id], (err, results) => {
            if (err) return res.cc(err)
            if (results.affectedRows !== 1) {
                return res.cc('更新密码失败!')
            }
            res.cc('更新密码成功!', 0)
        })
    })
}
// 更新用户头像的处理函数
exports.updateAvatar = (req, res) => {
    // res.send('ok')
    const avasql = 'update ev_users set user_pic=? where id=?'
    db.query(avasql, [req.body.avatar, req.user.id], (err, results) => {
        if (err) return res.cc(err)
        if (results.affectedRows !== 1) {
            return res.cc('更新用户头像失败')
        }
        res.cc('更新用户头像成功!', 0)
    })
}