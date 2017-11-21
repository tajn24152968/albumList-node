'use strict';
const express = require('express');
//引入数据库对象
const mysql = require('mysql');
const pool = mysql.createPool({
    connectionLimit: 10,
    host: '127.0.0.1',
    user: 'root',
    password: 'root',
    database: 'album'
});

//创建服务器
let app = express();
//配置模板引擎
app.engine('html', require('express-art-template'));

//配置路由规则
let router = express.Router();
//测试路由
router.get('/test', (req, res, next) => {
    pool.getConnection(function(err, connection) {
        connection.query('SELECT * FROM album_dir', function(error, results, fields) {
            //查询完毕以后，释放连接
            connection.release();
            if (error) throw error;
            res.render('test.html', {
                    text: results[2].dir
            });
        });
    });  
})
.get('/',(req,res,next)=>{
    //获取连接
    pool.getConnection((err, connection)=> {
        //处理获取连接时的异常，比如停网了
        if(err) return next(err);
        //使用连接查询所有的album_dir所有数据
        connection.query('select * from album_dir',(error, results)=>{
            //处理查询时带来的异常，比如表名错误
            if(err) return next(err);
            res.render('index.html',{
                album:results
            });
        })
    });
})


//处理静态资源
// /public/vender/bootstrap/js/bootstrap.js
app.use('/public',express.static('./public'));
// app.use((req,res,next)=>{
//     req.aaa = '123';
//     next();
// })
///中间件执行列表
app.use(router);

// 错误处理中间件
app.use((err,req,res,next)=>{
    console.log('出错啦.-------------------------');
    console.log(err);
    console.log('出错啦.-------------------------');
    res.send(`
            您要访问的页面出异常拉...请稍后再试..
            <a href="/">去首页玩</a>
    `);
})


//开启服务器
app.listen(8888, () => {
    console.log('服务器启动了');
});