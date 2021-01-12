const http = require('http');
const url = require('url');
const querystring = require('querystring');
const hostname = '127.0.0.1';
const port = 3240;
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
        var answer = JSON.parse(obj.answer);
        MongoClient.connect(mongoUrl,{useUnifiedTopology:true},{uri_decode_auth:true},function (err,db) {
            if(err) throw err;
            var dbase = db.db('examsystem');
            /*var getidentity = {identity:0};
            dbase.collection('userinfo').find(getidentity).toArray(function (err,result) {
                 if(err) return err;
                for(var i = 0;i<result.length;i++) {
                     var setlog1 = {$set:{log:"false"}};
                     var getname1 = {username:result[i].username};
                    dbase.collection('userinfo').updateMany(getname1,setlog1,function (err,res) {
                        if(err) throw err;
                    });
                 }

            });*/
            var getname = {username:obj.username};
            var setlog = {$set:{log:"true"}};
            dbase.collection('userinfo').updateOne(getname,setlog,function (err,resul) {
                if(err) return err;
            })
        });
        MongoClient.connect(mongoUrl,{useUnifiedTopology:true},{uri_decode_auth:true},function (err,db) {
            if(err) throw err;
            console.log("数据库已经创建");
            var dbase = db.db('examsystem');
            var myobj = {username:obj.username,answer:answer};
            dbase.collection('anwserlist').insertOne(myobj,function (err,res) {
                if(err) throw err;
                console.log('文档插入成功');
                db.close();
            })
        });
    });
    res.statusCode = 200;
    res.setHeader('Content-type','application/json'); /*json格式*/
    res.setHeader('Access-Control-Allow-Origin','*');
    res.end(JSON.stringify(opj));
});
server.listen(port,hostname,()=>{
    console.log(`server run at http://${hostname}:${port}`);
});