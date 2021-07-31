// 这是路由处理函数模块
// 导入数据库模块
const db = require('../db/index')

// 获取文章分类列表的处理函数
exports.getArtCates = (req, res) => {
    // res.send('ok')
    const sql = 'select * from ev_article_cate where is_delete=0 order by id asc'
    db.query(sql, (err, results) => {
        if (err) return res.cc(err)
        res.send({
            status: 0,
            message: '获取文章分类列表信息成功',
            data: results
        })
    })
}
// 新增文章分类的处理函数
exports.addArticleCates = (req, res) => {
    // res.send('ok')
    // 需要对这两个属性进行查重因为是唯一的
    const sql = 'select * from ev_article_cate where name=? or alias=?'
    db.query(sql, [req.body.name, req.body.alias], (err, results) => {
        if (err) return res.cc(err)
        if (results.length === 2) return res.cc('分类名称与别名被占用，请稍候重试')
        if (results.length === 1 && results[0].name === req.body.name && results[0].alias === req.body.alias) return res.cc('分类名称与别名被占用，请稍候重试')
        if (results.length === 1 && results[0].name === req.body.name) return res.cc('分类名称被占用，请稍候重试')
        if (results.length === 1 && results[0].alias === req.body.alias) return res.cc('分类别名被占用，请稍候重试')
        // 定义新增文章分类的sql语句
        const artsql = 'insert into ev_article_cate set ?'
        // 执行新增文章分类的sql语句
        db.query(artsql, req.body, (err, results) => {
            if (err) return res.cc(err)
            if (results.affectedRows !== 1) {
                return res.cc('新增文章分类失败')
            }
            res.cc('新增文章分类成功！', 0)
        })
    })
}
// 根据id删除文章分类的处理函数
exports.deleteCateById = (req, res) => {
    // res.send('ok')
    // 定义删除文章分类的sql语句
    const sql = 'update ev_article_cate set is_delete = 1 where id = ?'
    db.query(sql, req.params.id, (err, results) => {
        if (err) return res.cc(err)
        if (results.affectedRows !== 1) {
            return res.cc('删除文章分类失败!')
        }
        res.cc('删除文章分类成功!', 0)
    })
}
// 根据id获取文章分类的处理函数
exports.getArtCateById = (req, res) => {
    // res.send('ok')
    const sql = 'select * from ev_article_cate where id = ?'
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
// 根据id更新文章分类的处理函数
exports.updateCateById = (req, res) => {
    // res.send('ok')
    // 定义查重的sql语句
    const sql = 'select * from ev_article_cate where id<>? and (name=? or alias=?)'
    db.query(sql, [req.body.Id, req.body.name, req.body.alias], (err, results) => {
        if (err) return res.cc(err)
        if (results.length === 2) return res.cc('分类名称与别名被占用，请更换后重试')
        if (results.length === 1 && results[0].name === req.body.name && results[0].alias === req.body.alias) return res.cc('分类名称与别名被占用，请更换后重试')
        if (results.length === 1 && results[0].name === req.body.name) return res.cc('分类名称被占用，请更换后重试')
        if (results.length === 1 && results[0].alias === req.body.alias) return res.cc('分类别名被占用，请更换后重试')
        // 定义更新文章分类的语句
        const artsql = 'update ev_article_cate set ? where id = ?'
        db.query(artsql, [req.body, req.body.Id], (err, results) => {
            if (err) return res.cc(err)
            if (results.affectedRows !== 1) {
                return res.cc('更新文章分类失败')
            }
            res.cc('更新文章分类成功', 0)
        })
    })
}