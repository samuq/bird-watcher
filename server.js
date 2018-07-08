const express = require('express');
const app = express();
const path = require('path');
const pathExists = require('path-exists');
const fs = require('fs');

// Run the app by serving the static files
// in the dist directory


app.use(express.static(__dirname + '/dist/bird-watcher'));
// Start the app by listening on the default
// Heroku port
app.listen(process.env.PORT || 4200);
app.get('/api/counters', function(req, res) {
    getCounters(req, res);
    
  });
app.get('/*', function(req, res) {
    console.log(__dirname);
    res.sendFile(path.join(__dirname + '/dist/bird-watcher/index.html'));
  });
fileUrl = '/counters.json';

function getCounters(req, res) {
    pathExists(this.fileUrl).then(function (exists) {
        console.log('exists');
        console.log(exists);
        if(exists){
            fs.readFile(fileUrl, function (err, data) {
                if (err) {
                    throw err;
                }
                res.send({ 'status': 200, 'data': JSON.parse(data)});
            });
            
        }
        else{
            let counters = {
                varis: 0,
                harakka: 0
            };
            fs.writeFile(fileUrl, JSON.stringify(counters, null, 4), function(err) {
                if(err) {
                    res.send({ 'status': 500 });
                    return console.log(err);
                }
                console.log("The file was saved!");
                res.send({ 'status': 200, 'data': counters });
            }); 
        }
    });
}