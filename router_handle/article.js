// 这是文章管理处理函数模块
const path = require('path')
const db = require('../db/index')
// 发布新文章的处理函数
exports.addArticle = (req, res) => {
    // console.log(req.file);
    if (!req.file || req.file.fieldname !== 'cover_img') return res.cc('文章封面是必选参数')

    // 处理文章的信息对象
    const articleInfo = {
        // 标题、内容、发布状态、所属分类的id
        ...req.body,
        // 文章封面的存放路径
        cover_img: path.join('/uploads', req.file.filename),
        // 文章的发布时间
        pub_date: new Date(),
        // 文章的作者id
        author_id: req.user.id
    }
    const sql = 'insert into ev_articles set ?'
    db.query(sql, articleInfo, (err, results) => {
        if (err) return res.cc(err)
        if (results.affectedRows !== 1) {
            return res.cc('发布文章失败')
        }
        res.cc('发布文章成功!', 0)
    })
}
// 获取文章的列表数据的处理函数
exports.getArticle = (req, res) => {
    // res.send('ok')
    // console.log(req);
    const sql = 'SELECT ev_article_cate.name as cate_name, ev_articles.*FROM ev_article_cate, ev_articles WHERE ev_article_cate.Id = ev_articles.cate_id and ev_articles.is_delete=0 order by ev_articles.Id asc'
    // const sql = 'select * from ev_articles where is_delete=0 order by id asc'
    db.query(sql, (err, results) => {
        // console.log(123);
        if (err) return res.cc(err)
        res.send({
            status: 0,
            message: '获取文章列表数据成功',
            data: results
        })
    })
}
// 根据id删除文章数据的处理函数
exports.deleteArticleById = (req, res) => {
    // 定义删除文章分类的sql语句
    const sql = 'update ev_articles set is_delete = 1 where id = ?'
    db.query(sql, req.params.id, (err, results) => {
        if (err) return res.cc(err)
        if (results.affectedRows !== 1) {
            return res.cc('删除文章分类失败!')
        }
        res.cc('删除文章分类成功!', 0)
    })
}
// 根据id获取文章详情的处理函数
exports.getArticleById = (req, res) => {
    const sql = 'select * from ev_articles where id = ?'
    db.query(sql, req.params.id, (err, results) => {
        if (err) res.cc(err)
        if (results.length !== 1) {
            res.cc('获取文章分类数据失败')
        }
        res.send({
            status: 0,
            message: '获取文章分类数据成功',
            data: results[0]
        })
    })
}
// 根据id更新文章信息的处理函数
exports.updateArticlerById = (req, res) => {

}