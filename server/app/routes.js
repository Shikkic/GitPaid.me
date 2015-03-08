// app/routes.js
module.exports = function (app,request,db) {
    var collection = db.collection('test123');

    //Get listener for our splash page 'gitpayed.me'
    app.get('/', function(req, res){
        res.sendfile('index.html');
    });

    // CHROME EXT ONLOAD: Returns information for buttons on an issue page
    app. get('/api', function(req, res){
        //parse the params for url and see if it exists
        var params = req.param('url');
        //check to see if the doc exists
        collection.findOne({url:params}, function(err, document){
            if((!err)&&(document!=null)){
                //if it exists return the document
                res.status(200).send(document);
            }else{
                res.status(200).send({'exists': 'false'});
            }
        });
    });

    //FUNDING A PROJECT listens if funds are sent on an issue
    app.post('/fund', function(req, res){
        req.on('data', function(data){
            //parse the values fromt the fund request
            var bodyObject = JSON.parse(data);
            var apiURL = bodyObject.apiURL;
            var sponsorName = bodyObject.sponsorName;
            var amount = bodyObject.amount;
            //attempt to find if an issue already exists in db
            collection.findOne({apiURL:apiURL}, function(err, document){
                if((!err)&&(document!=null)){
                    //if it exists update the doc with the params of the request
                    //var docURL = document.url;
                    collection.update({apiURL:apiURL}, {$set: {sponsorName: sponsorName, total: (document.total + amount)}}, function(err, result){});
                }else{
                    //create a new db entry
                    console.log("In the else");
                    getInfoFromGit(apiURL, request, collection, function(){
                        collection.update({apiURL: apiURL}, {$set: {sponsorName: sponsorName, total: amount}}, function(err, result){});
                    });
                }
            });
        });
        req.on('end', function(){
            console.log("finished processing request");
        });
        res.status(200).send({status: 'recieved'});
    });
};

function generateKey(){
    var dig1 = ~~(Math.random() * 62);
    var dig2 = ~~(Math.random() * 62);
    var dig3 = ~~(Math.random() * 62);
    var dig4 = ~~(Math.random() * 62);
    var dig5 = ~~(Math.random() * 62);
    var dig6 = ~~(Math.random() * 62);

    var digits = [dig1, dig2, dig3, dig4, dig5, dig6];
    
    var alpha = ["a", "b", "c", "d", "e", "f", "g", "h", "i", "j", "k", "l", "m",     "n", "o", "p", "q", "r", "s", "t", "u", "v", "w", "x", "y", "z", "A", "B", "C    ", "D", "E", "F", "G", "H", "I", "J", "K", "L", "M", "N", "O", "P", "Q", "R",    "S", "T", "U", "V", "W", "X", "Y", "Z"];

    var key = "";

    for(var i = 0; i< digits.length; i++){
        if(digits[i] > 51){
            digits[i] = 61 - digits[i];
        }else{
            digits[i] = alpha[digits[i]];
        }
        digits[i] = digits[i].toString();
        key += digits[i];
    }
    return key;
}

function getInfoFromGit(gitUrl, request, collection, cb){
    var options = {
        url: gitUrl,
        headers: {
            'User-Agent': 'Shikkic'
        }
    };
    
    console.log(collection);

    request.get(options, function(error, response, body){
        if(!error){
            var data = JSON.parse(body);
            var key = generateKey();
            console.log(collection);
            collection.insert({
                url:data.html_url,
                apiURL: data.url,
                open: data.state,
                total:0,
                exists: true,
                sponsorName: ' ',
                key:key
            },
            function(err){
                if(err){
                    cb(err);
                }else{
                    cb();
                }
            });
            console.log("done, check it!");
        }else
            console.log('error');
    });
};
