const express = require('express')
const path = require('path')
const server = express()

server.all('*', function(req, res, next) {
 
    res.header("Access-Control-Allow-Origin", "*");
     
    // res.header("Access-Control-Allow-Headers", "X-Requested-With");
     
    res.header("Access-Control-Allow-Methods","PUT,POST,GET,DELETE,OPTIONS");
     
    // res.header("X-Powered-By",' 3.2.1')
     
    // res.header("Content-Type", "application/json;charset=utf-8");
     
    next();
     
    });
server.listen(5050, () => {
    console.log('running......')
} )

server.use( express.static('./') )
server.get('/', (req, res) => {
    // console.log(1)
    res.sendFile( path.join( __dirname, 'bujiadi.html') )
})

server.get('/getColor', function (req, res, next) {
    res.json({
        msg:'success',
        data: 'rgb(' + Math.floor( Math.random()*255 ) + ',' + Math.floor( Math.random()*255 ) + ',' + Math.floor( Math.random()*255 ) + ')'
    });
})
server.get('/getPercent', function (req, res) {
    res.json({
        msg: 'success',
        data: Math.floor( Math.random() * 10000 ) / 100
    });
})
server.get('/getTemp', function (req, res) {
    res.json({
        msg: 'success',
        data: Math.floor( ( Math.random() + 3 ) * 9 )
    });
})
server.get('/getText', function (req, res) {
    let arr = [ '金', '木', '水', '火', '土' ]
    res.json({
        msg: 'success',
        data: '随机文字：“' + arr[Math.floor( Math.random()*5 )] + '”，' +  '随机数字：“' + Math.floor( Math.random()*1000 ) + '”' 
    });
})