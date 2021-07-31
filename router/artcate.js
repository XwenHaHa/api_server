// 初始化文章分类列表路由模块
const express = require('express')
const router = express.Router()

// 导入文章分类的路由处理函数模块   
const artCate_handle = require('../router_handle/artcate')

// 导入验证数据的中间件
const expressJoi = require('@escook/express-joi')
// 导入文章分类的验证模块
const {
    add_cate_schema,
    delete_cate_schema,
    get_cate_schema,
    update_cate_schema
} = require('../schema/artcate')

// 获取文章分类路由
router.get('/cates', artCate_handle.getArtCates)

// 新增文章分类路由
router.post('/addcates', expressJoi(add_cate_schema), artCate_handle.addArticleCates)

// 根据id删除文章分类的路由
router.get('/deletecate/:id', expressJoi(delete_cate_schema), artCate_handle.deleteCateById)

// 根据id获取文章分类数据路由
router.get('/cates/:id', expressJoi(get_cate_schema), artCate_handle.getArtCateById)
// 根据id更新文章分类的路由
router.post('/updatecate', expressJoi(update_cate_schema), artCate_handle.updateCateById)
module.exports = router