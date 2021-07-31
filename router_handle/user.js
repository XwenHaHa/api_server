// 导入数据库操作模块
const db = require('../db/index')
// 导入bcryptjs这个包
const bcrypt = require('bcryptjs')
// 导入生成Token的包
const jwt = require('jsonwebtoken')
// 导入全局配置文件
const config = require('../config')
// 注册新用户的处理函数
exports.regUser = (req, res) => {
    // 获取客户端提交到服务器的信息
    const userinfo = req.body
    // 对表单中的数据进行合法性的校验
    // if (!userinfo.username || !userinfo.password) {
    //     // return res.send({
    //     //     status: 1,
    //     //     message: '用户名或密码不合法!'
    //     // })
    //     return res.cc('用户名或密码不合法!')
    // }
    // 定义sql语句,查询用户名是否被占用
    const sqlStr = 'select * from ev_users where username = ?'
    db.query(sqlStr, [userinfo.username], (err, results) => {
        // 执行sql语句失败
        if (err) {
            // return res.send({
            //     status: 1,
            //     message: err.message
            // })
            return res.cc(err)
        }
        // 判断用户名是否被占用,查询语句得到的results必然是一个数组，会包含符合条件的数据项
        if (results.length > 0) {
            // return res.send({
            //     status: 1,
            //     message: '用户名被占用请使用其他用户名！'
            // })
            return res.cc('用户名被占用请使用其他用户名！')
        }
        // 调用bcrypt.hashSync()对密码进行加密,通过第二个参数10可以提高密码的安全性
        userinfo.password = bcrypt.hashSync(userinfo.password, 10)
        // 定义插入新用户的SQL语句
        const sql = 'insert into ev_users set ?'
        // 调用db执行sql语句
        db.query(sql, {
            username: userinfo.username,
            password: userinfo.password
        }, (err, results) => {
            // 判断sql语句是否执行成功
            if (err) return res.cc(err)
            // 判断影响行数是否为1
            if (results.affectedRows !== 1) return res.cc('注册用户失败，请稍候再试')
            // 注册成功
            res.cc('注册成功', 0)
        })
    })
}
// 登录的处理函数
exports.login = (req, res) => {
    // 接收表单数据
    const userinfo = req.body
    // 定义sql语句
    const sql = 'select * from ev_users where username=?'
    // 执行sql语句，查询用户的数据
    db.query(sql, userinfo.username, (err, results) => {
        if (err) return res.cc(err)
        if (results.length !== 1) {
            return res.cc('登录失败')
        }
        // 判断密码是否正确
        // res.send('login ok')
        const compareResult = bcrypt.compareSync(userinfo.password, results[0].password)
        if (!compareResult) return res.cc('登录失败')
        // 在服务端生成token字符串
        // es6语法，扩展运算符，这里用于剔除敏感信息
        const user = {
            ...results[0],
            password: '',
            user_pic: ''
        }
        // 对用户的信息加密，生成Token字符串
        const tokenStr = jwt.sign(user, config.jwtSecretKey, {
            expiresIn: config.expiresIn
        })
        // console.log(tokenStr);
        res.send({
            status: 0,
            message: '登录成功!',
            token: 'Bearer ' + tokenStr
        })
    })
}