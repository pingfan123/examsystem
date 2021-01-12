const http = require('http');
const url = require('url');
const querystring = require('querystring');
const hostname = '127.0.0.1';
const port = 3260;
var MongoClient = require('mongodb').MongoClient;
var mongoUrl = "mongodb://admin:123456@127.0.0.1:27017/admin";
const server = http.createServer( (req,res) => {
    var obj = {};
    var opj = {};
    var post = '';
    req.on('data',function (chunk) {
        post+=chunk;
    });
    req.on('end',function () {
        if(req.method == 'GET') {
            querys = url.parse(req.url).query;
        }
        obj = querystring.parse(post);
        MongoClient.connect(mongoUrl,{useUnifiedTopology:true},{uri_decode_auth:true},function (err,db) {
            if(err) throw err;
            var dbase = db.db('examsystem');
            var wherestr = {username:obj.username};
            dbase.collection('anwserlist').find(wherestr).toArray(function (err,result) {
                if (err) throw err;
                opj.name = result[0].username;
                opj.answer = result[0].answer;
                console.log(opj);
                res.end(JSON.stringify(opj));
            });
            //在答题库中遍历名字，查询答题状态并返回值
        });
    });
    res.statusCode = 200;
    res.setHeader('Content-type','application/json'); /*json格式*/
    res.setHeader('Access-Control-Allow-Origin','*');
});
server.listen(port,hostname,()=>{
    console.log(`server run at http://${hostname}:${port}`);
});