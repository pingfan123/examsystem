const http = require('http');
const url = require('url');
const querystring = require('querystring');
const hostname = '127.0.0.1';
const port = 3200;
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
                var whereStr2 = {};
                var updateStr2 = {$set:{login:"false"}};
                dbase.collection('userinfo').updateMany(whereStr2,updateStr2,function (err,res) {
                    if(err) throw err;
                });
                var whereStr = {username:obj.username,pwd:obj.pwd,identity:Number(obj.identity)};
            dbase.collection('userinfo').find(whereStr).toArray(function (err,result) {
                if (err) throw err;
                if(result.length!=0) {
                    opj.login = true;
                    opj.identity = result[0].identity;
                    var whereStr1 = result[0];
                    var updateStr1 = {$set:{login:"true"}};
                    dbase.collection('userinfo').updateMany(whereStr1,updateStr1,function (err,res) {
                        if(err) throw err;
                        db.close();
                    })
                }
                else {
                    opj.login = false;
                }
                res.end(JSON.stringify(opj));
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


