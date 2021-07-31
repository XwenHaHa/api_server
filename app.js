// 导入express
const express = require('express');

// 创建服务器的实例对象
const app = express();
const joi = require('joi')

// 导入并配置cors中间件，解决接口跨域问题
const cors = require('cors');
app.use(cors());

// 配置解析表单数据的中间件，注意:这个中间件，只能解析`application/x-www-form-urlencoded`格式的表单数据
app.use(express.urlencoded({
    extended: false
}))

// 托管静态资源文件
app.use('/uploads', express.static('./uploads'))

// 一定要在路由之前，封装res.cc函数
app.use((req, res, next) => {
    // status值默认为1，表示失败的情况
    // err的值，可能是一个错误对象也可能是一个错误的描述字符串
    res.cc = function (err, status = 1) {
        res.send({
            status,
            message: err instanceof Error ? err.message : err
        })
    }
    next();
})
// 一定要在路由之前配置解析Token的中间件
const expressJWT = require('express-jwt')
const config = require('./config')
app.use(expressJWT({
    secret: config.jwtSecretKey
}).unless({
    path: [/^\/api/]
}))
// 导入并使用用户路由模块
const userRouter = require('./router/user');
// 以后访问都需要在路径加api
app.use('/api', userRouter);
// 导入并使用用户信息路由模块
const userinfoRouter = require('./router/userinfo');
app.use('/my', userinfoRouter)
// 导入并使用文章分类列表路由模块
const artCateRouter = require('./router/artcate');
app.use('/my/article', artCateRouter)
// 导入并使用文章管理路由模块
const articleRouter = require('./router/article');
app.use('/my/article', articleRouter)
// 定义错误级别的中间件
app.use((err, req, res, next) => {
    // 验证失败导致的错误
    if (err instanceof joi.ValidationError) return res.cc(err)
    // 身份认证失败后的错误
    if (err.name === 'UnauthorizedError') return res.cc('身份认证失败')
    // 未知的错误
    res.cc(err)
})
// 启动服务器
app.listen(8081, () => {
    console.log('http://127.0.0.1:8081');
})