// 导入自定义的验证模块
const joi = require('joi')

// 分别定义标题、分类id、内容、发布状态的检验规则
const page = joi.number().integer().min(1)
const title = joi.string().required()
const cate_id = joi.number().integer().min(1).required()
const content = joi.string().required().allow('')
const state = joi.string().valid('已发布', '草稿').required()
const id = joi.number().integer().min(1).required()

// 验证规则对象
exports.add_article_schema = {
    body: {
        title,
        cate_id,
        content,
        state,
    }
}

// 校验规则对象，获取文章信息
exports.get_allarticle_schema = {
    body: {
        pagenum: page,
        pagesize: page,
        cate_id: joi.number().integer().min(1),
        state: joi.string().valid('已发布', '草稿')
    }
}
// 校验规则对象，删除文章数据
exports.delete_article_schema = {
    params: {
        id
    }
}

// 校验规则对象，根据id获取文章详情
exports.get_article_schema = {
    params: {
        id
    }
}