const http = require('http');
const url = require('url');
const querystring = require('querystring');
const hostname = '127.0.0.1';
const port = 3270;
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
            var update = {$set:{grade:obj.grade}};
            dbase.collection('userinfo').updateOne(wherestr,update,function (err,rese) {
                if (err) throw err;
            });
            var findpog = {username:obj.username};
            var setpog = {$set:{pog:"true"}};
            dbase.collection('userinfo').updateOne(findpog,setpog,function (err,resu) {
                if(err) throw err;
            })
            var findgrade = {username:obj.username,log:"true"};
            dbase.collection('userinfo').find(findgrade).toArray(function (err,rest) {
                if(err) throw err;
                if(rest.length!=0) {
                    opj.fog  = true;//判断已经批改完试卷了

                }
                else if(rest.length==0){
                    opj.fog  = false;//判断已经批改完试卷了
                }
                res.end(JSON.stringify(opj));
            })
        });
    });
    res.statusCode = 200;
    res.setHeader('Content-type','application/json'); /*json格式*/
    res.setHeader('Access-Control-Allow-Origin','*');
});
server.listen(port,hostname,()=>{
    console.log(`server run at http://${hostname}:${port}`);
});