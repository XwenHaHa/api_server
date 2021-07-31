// 初始化文章管理路由模块
const express = require('express')
const router = express.Router()

// 导入文章管理的路由处理函数模块
const article_handle = require('../router_handle/article')

// 导入multer和path
const multer = require('multer')
const path = require('path')

// 创建multer，multer是用来解析 multipart/form-data 格式的数据的
const uploads = multer({
    dest: path.join(__dirname, '../uploads')
})
// 导入验证数据的中间件
const expressJoi = require('@escook/express-joi')
const {
    add_article_schema,
    get_allarticle_schema,
    delete_article_schema,
    get_article_schema
} = require('../schema/article')
// 发布新文章路由
router.post('/add', uploads.single('cover_img'), expressJoi(add_article_schema), article_handle.addArticle)
// 获取文章列表数据路由
// router.get('/list', article_handle.getArticle)
router.get('/list', expressJoi(get_allarticle_schema), article_handle.getArticle)
// 根据id删除文章数据的路由
router.get('/delete/:id', expressJoi(delete_article_schema), article_handle.deleteArticleById)
// 根据id获取文章详情的路由
router.get('/:id', expressJoi(get_article_schema), article_handle.getArticleById)
// 根据id更新文章信息的路由
router.post('/edit', article_handle.updateArticlerById)
module.exports = router