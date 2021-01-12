const http = require('http');
const url = require('url');
const querystring = require('querystring');
const hostname = '127.0.0.1';
const port = 3210;
var MongoClient = require('mongodb').MongoClient;
var mongoUrl = "mongodb://admin:123456@127.0.0.1:27017/admin";
const server = http.createServer( (req,res) => {
    var obj = {};
    var opj = {};
    var post = '';
    var name = [];
    req.on('data',function (chunk) {
        post+=chunk;
    });
    req.on('end',function () {
        if(req.method == 'GET') {
            querys = url.parse(req.url).query;
        }
        obj = querystring.parse(post);
        if(obj.login == 'false') {
            MongoClient.connect(mongoUrl,{useUnifiedTopology:true},{uri_decode_auth:true},function (err,db) {
                if(err) throw err;
                var dbase = db.db('examsystem');
                var whereStr1 = {login:'true'};
                var updateStr1 = {$set:{login:"false"}};
                dbase.collection('userinfo').updateOne(whereStr1,updateStr1,function (err,res) {
                    if(err) throw err;
                })
            });
        }
        MongoClient.connect(mongoUrl,{useUnifiedTopology:true},{uri_decode_auth:true},function (err,db) {
            if(err) throw err;
            var dbase = db.db('examsystem');
            var whereStr = {login:"true"};
            dbase.collection('userinfo').find(whereStr).toArray(function (err,result) {
                var whereStr1 = {username:obj.username};
                dbase.collection('anwserlist').find(whereStr1).toArray(function (err,result) {
                    if (err) throw err;
                    if(result.length==0) {
                        opj.log = false
                    }
                    else if(result.length!=0){
                        opj.log = true;
                    }
                    res.end(JSON.stringify(opj));
                });
            });
        });
    });
    res.statusCode = 200;
    res.setHeader('Content-type','application/json'); /*json格式*/
    res.setHeader('Access-Control-Allow-Origin','*');
});
server.listen(port,hostname,()=>{
    console.log(`server run at http://${hostname}:${port}`);
});