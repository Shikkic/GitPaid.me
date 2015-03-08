// app/batch.js
module.exports = function(app, request, db) {

    //1). loop through each document
    var collection = db.collection('test123');
    var cursor = collection.find();

    cursor.each(function(err, item) {
        
        if(item != null) {
            console.log(item.open);
            getInfoFromGit(item, request, collection , function(){
                console.log("THIS EVENT IS CLOSED");
            });   
        }
    });

};


function getInfoFromGit(doc, request, collection, cb) {
    var options = {
        url: doc.apiURL,
        headers: {
            'User-Agent': 'Shikkic'
        }
    };

    request.get(options, function(error, response, body){
        if(!error){
            var data = JSON.parse(body);
            var open = data.state;
            //If an issue becomes closed
            if(open == 'closed'){
                //DO AN EVENT
                cb();
                //PAY A PERSON
                //
                //remove the DB entry
            }
            console.log("not closed");
        }
    });
};                        
            
