const http = require('http');
const url = require('url');
const querystring = require('querystring');
const hostname = '127.0.0.1';
const port = 3230;
var arr = [1,2,3,4,5];
var count = 0;
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
            var ra = Math.floor(Math.random()*arr.length);
            var re = arr[ra];
            opj.index = re;
            var where = {_id:re};
            dbase.collection('questionlist').find(where).toArray(function (err,result) {
                if (err) throw err;
                //console.log(result[0].question);
                opj.question=result[0].question;
                res.end(JSON.stringify(opj));
            });
            count++;
            if(count>=4) {
                arr = [1,2,3,4,5];
                count = 0;
            }
            arr.splice(ra,1);

        });
    });
    res.statusCode = 200;
    res.setHeader('Content-type','application/json'); /*json格式*/
    res.setHeader('Access-Control-Allow-Origin','*');
});
server.listen(port,hostname,()=>{
    console.log(`server run at http://${hostname}:${port}`);
});