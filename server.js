const express = require('express');
const app = express();
const path = require('path');
const pathExists = require('path-exists');
const fs = require('fs');
const mongoose = require('mongoose'); 
const GoogleImages = require('google-images');
const CSE_ID = '000159574199953062775:n6zak4l42ou';
const API_KEY = 'AIzaSyCJQejAeUHanrPAz_c-lxZVf8Q9KO22_KU';
const {google} = require('googleapis');
const customsearch = google.customsearch('v1');
const bodyParser = require('body-parser');
let client;
if(CSE_ID && API_KEY){
    client = new GoogleImages(CSE_ID, API_KEY);
}
else{
    client = undefined;
}
async function runSample (options) {
    const res = await customsearch.cse.list({
      cx: options.cx,
      q: options.q,
      auth: options.apiKey,
      searchType: 'image',
      imgType: 'photo',
      imgSize: 'medium'
    });
    return res.data.items[0].link;
}
const uri = 'mongodb://heroku_dl0s6x8r:r550tr9vfbegl44jovfb2b46qf@ds129821.mlab.com:29821/heroku_dl0s6x8r'
// Run the app by serving the static files
// in the dist directory
var Counter = mongoose.model('Counter', {
    species : String,
    count: Number
}, 'counters');
var Report = mongoose.model('Report', {
    logline : String
}, 'reports');
if(uri){
    mongoose.connect(uri);
}

app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());
app.use(express.static(__dirname + '/dist/bird-watcher'));
// Start the app by listening on the default
// Heroku port
app.listen(process.env.PORT || 4300);
app.get('/api/counters', function(req, res) {
    
    getCounters(req, res);
    
});
app.post('/api/counters', function(req, res){
    addCounter(req, res);
})
app.get('/api/counters/:species', function(req, res){
    addToCounter(req, res);
})
app.get('/api/report', function(req, res){
    getReport(req, res);
})
app.get('/*', function(req, res) {
    res.sendFile(path.join(__dirname + '/dist/bird-watcher/index.html'));
});
fileUrl = '/counters.json';
reportFileUrl = '/report.text';
function setReportLine(species){
    return getDateTime() + " - " + species + '\r\n';
}
function setNewSpeciesLogLine(species){
    return getDateTime() + " - lajin lisäys: " + species;
}
function setNewSightingLogLine(species, counterArray){
    let allSightings = "";
    for(let i = 0; i < counterArray.length; i++){
        allSightings += " " + counterArray[i].species + " " + counterArray[i].count + " kappaletta"
        const char = i < (counterArray.length-1) ? "," : ".";
        allSightings += char;
    }

    return getDateTime() + " - uusi havainto: " + species + " - kaikki havainnot:" + allSightings;
}
function getDateTime() {

    var date = new Date();
    var hour = date.getHours();
    hour = (hour < 10 ? "0" : "") + hour;

    var min  = date.getMinutes();
    min = (min < 10 ? "0" : "") + min;

    var sec  = date.getSeconds();
    sec = (sec < 10 ? "0" : "") + sec;

    var year = date.getFullYear();

    var month = date.getMonth() + 1;
    month = (month < 10 ? "0" : "") + month;

    var day  = date.getDate();
    day = (day < 10 ? "0" : "") + day;

    return day + "/" + month + "/" + year + " " + hour + ":" + min + ":" + sec;

}
function getReportArray(callback){
    var rl = require('readline').createInterface({
        input: fs.createReadStream(reportFileUrl)
      });
      
      myArray = [];
      rl.on('line', function (line) {
        console.log('Line from file:', line);
        myArray.push({ 'logline': line });
      });
      
      rl.on('close', function () {
          callback(myArray);
      });
}
function getReport(req, res){
    !uri ?
    pathExists(reportFileUrl).then(function (exists) {
        if(exists){
            getReportArray( function (rprt){
                res.send({ 'status': 200, 'data': rprt });
            });
        }
    })
    :Report.find({}, 'logline -_id' , function(err, report){
        if(err) {
            console.log(err);
            res.send({ 'status': 500 });
        }
        res.send({ 'status': 200, 'data': report });
    });
}
function addToCounter(req, res){
    !uri ?  fs.readFile(fileUrl, function (err, data) {
        if (err) {
            throw err;
        }
        let counters = JSON.parse(data);
        counters = counters.map(counter => {
            if(counter['species']===req.params.species) {
                counter.count ++;
                return counter;
             } else {
                return counter;
             } 
        });
        fs.writeFile(fileUrl, JSON.stringify(counters, null, 4), function(err) {
            if(err) {
                console.log(err);
                res.send({ 'status': 500 });
            }
            fs.appendFile(reportFileUrl, setReportLine(req.params.species), function (err) {
                if(err) {
                    console.log(err);
                    res.send({ 'status': 500 });
                }
                console.log(setNewSightingLogLine(req.params.species, counters));
                res.send({ 'status': 200, 'data': counters });
            });
            
        }); 
    })
    : Counter.findOneAndUpdate({ species: req.params.species }, {$inc : { count: 1 }}, function(err, counter) {
        if (err){
            res.send(err);
        }

        Report.collection.insert({ logline: setReportLine(req.params.species)}, function(err, counter) {
            if(err) {
                console.log(err);
                res.send({ 'status': 500 });
            }
            Counter.find({}, 'species -_id count image',function(err, counters) {
                if(err) {
                    console.log(err);
                    res.send({ 'status': 500 });
                }
                console.log(setNewSightingLogLine(req.params.species, counters));
                res.json({ status: 200, data: counters});
            });
        });
        
        
    });
}
function addCounter(req, res){
    !uri ?
    pathExists(this.fileUrl).then(function (exists) {
        if(exists){
            fs.readFile(fileUrl, function (err, data) {
                if (err) {
                    throw err;
                }
                let counters = JSON.parse(data);
                let isAlreadyIn=false;
                let counter = {};
                counters.forEach(function(counter){
                    if(counter['species']===req.body.species)isAlreadyIn=true;
                })
                if(!isAlreadyIn){
                    counter = {
                        species: req.body.species,
                        count: 0
                    };
                    
                    
                    const counterArray = [counter];
                    
                    if(client){
                        Promise.all(counterArray.map(counter => {
                            const options = {
                                q: counter.species,
                                apiKey: API_KEY,
                                cx: CSE_ID
                            };
                            return runSample(options).catch(console.error);
                        })).then(function(values) {
                            let val= {};
                            for(let i = 0; i < values.length; i++ ){
                                const val = { species: counterArray[i].species, count: counterArray[i].count, image: values[i]};
                            }
                            counters.push(val);
                            fs.writeFile(fileUrl, JSON.stringify(counters, null, 4), function(err) {
                                if(err) {
                                    console.log(err);
                                    res.send({ 'status': 500 });
                                }
                                console.log(setNewSpeciesLogLine(req.body.species));
                                res.send({ 'status': 200, 'data': counters });
                            }); 
                        })
                    }
                    else{
                        counters.push(counter);
                        fs.writeFile(fileUrl, JSON.stringify(counters, null, 4), function(err) {
                            if(err) {
                                console.log(err);
                                res.send({ 'status': 500 });
                            }
                            console.log(setNewSpeciesLogLine(req.body.species));
                            res.send({ 'status': 200, 'data': counters });
                        }); 
                    }
                }
                else{
                    res.send({ 'status': 200 });
                }
            })
        }
    })
    :Counter.find({ species: req.body.species }, 'species -_id count image', function(err, counters) {
        if (err)
        res.send(err)

        if(counters.length>0){          
            res.json({ status: 200}); // return all counters in JSON format   
        }

        else{
            if(client){
                const counterArray = [{
                    species : req.body.species,
                    count : 0
                }
                ]
                Promise.all(counterArray.map(counter => {
                    const options = {
                        q: counter.species,
                        apiKey: API_KEY,
                        cx: CSE_ID
                    };
                    return runSample(options).catch(console.error);
                })).then(function(values) {
                    let countersArray= [];
                    for(let i = 0; i < values.length; i++ ){
                        const val = { species: counterArray[i].species, count: counterArray[i].count, image: values[i]}
                        countersArray.push(val);
                    }
                    Counter.collection.insert(countersArray, function(err, counter) {
                        if(err) {
                            console.log(err);
                            res.send({ 'status': 500 });
                        }
                        // get and return all the todos after you create another
                        Counter.find({}, 'species -_id count image',function(err, counters) {
                            if(err) {
                                console.log(err);
                                res.send({ 'status': 500 });
                            }
                            console.log(setNewSpeciesLogLine(req.body.species));
                            res.json({ status: 200, data: counters});
                        });
                    });
                }).catch(err => {console.log(`err: {$err} `);res.json({ status: 500 });});
            }
            else{
                Counter.collection.insert(counterArray, function(err, counter) {
                    if(err) {
                        console.log(err);
                        res.send({ 'status': 500 });
                    }
                    // get and return all the todos after you create another
                    Counter.find({}, 'species -_id count',function(err, counters) {
                        if(err) {
                            console.log(err);
                            res.send({ 'status': 500 });
                        }
                        console.log(setNewSpeciesLogLine(req.body.species));
                        res.json({ status: 200, data: counters});
                    });
                });
            }           
        }
    })

}
function getCounters(req, res) {
    !uri ?
        pathExists(this.fileUrl).then(function (exists) {
            
            if(exists){
                fs.readFile(fileUrl, function (err, data) {
                    if (err) {
                        throw err;
                    }
                    res.send({ 'status': 200, 'data': JSON.parse(data)});
                });
                
            }
            else{
                
                let counters = [{
                    species: 'varis',
                    count: 0
                },{
                    species: 'harakka',
                    count: 0
                }];
                if(client){
                    Promise.all(counters.map(counter => {
                        const options = {
                            q: counter.species,
                            apiKey: API_KEY,
                            cx: CSE_ID
                        };
                        return runSample(options).catch(console.error);
                    })).then(function(values) {
                        let countersArray= [];
                        for(let i = 0; i < values.length; i++ ){
                            const val = { species: counterArray[i].species, count: counterArray[i].count, image: values[i]}
                            countersArray.push(val);
                        }
                        fs.writeFile(fileUrl, JSON.stringify(countersArray, null, 4), function(err) {
                            if(err) {
                                res.send({ 'status': 500 });
                                return console.log(err);
                            }
                            console.log(setNewSpeciesLogLine('varis'));
                            console.log(setNewSpeciesLogLine('harakka'));
                            res.send({ 'status': 200, 'data': countersArray });
                        }); 
                    })
                }
                else{
                    fs.writeFile(fileUrl, JSON.stringify(counters, null, 4), function(err) {
                        if(err) {
                            res.send({ 'status': 500 });
                            return console.log(err);
                        }
                        console.log(setNewSpeciesLogLine('varis'));
                        console.log(setNewSpeciesLogLine('harakka'));
                        res.send({ 'status': 200, 'data': counters });
                    }); 
                }
            }
        })
    : Counter.find({}, 'species -_id count image', function(err, counters) {

        // if there is an error retrieving, send the error. nothing after res.send(err) will execute
        if (err)
            res.send(err)

        if(counters.length>0){          
            res.json({ status: 200, data: counters}); // return all todos in JSON format   
        }
        else{
            const counterArray = [{
                species : 'varis',
                count : 0
            },
            {
                species : 'harakka',
                count : 0
            }
            ]
            if(client){
                Promise.all(counterArray.map(counter => {
                    const options = {
                        q: counter.species,
                        apiKey: API_KEY,
                        cx: CSE_ID
                    };
                    return runSample(options).catch(console.error);
                })).then(function(values) {
                    let countersArray= [];
                    for(let i = 0; i < values.length; i++ ){
                        const val = { species: counterArray[i].species, count: counterArray[i].count, image: values[i]}
                        countersArray.push(val);
                    }
                    Counter.collection.insert(countersArray, function(err, counter) {
                        if(err) {
                            res.send({ 'status': 500 });
                            return console.log(err);
                        }
                        // get and return all the todos after you create another
                        Counter.find({}, 'species -_id count image',function(err, counters) {
                            if(err) {
                                res.send({ 'status': 500 });
                                return console.log(err);
                            }
                            console.log(setNewSpeciesLogLine('varis'));
                            console.log(setNewSpeciesLogLine('harakka'));
                            res.json({ status: 200, data: counters});
                        });
                    });
                }).catch(err => {console.log(`err: {$err} `);res.json({ status: 500 });});
            }
            else{
                Counter.collection.insert(counterArray, function(err, counter) {
                    if(err) {
                        res.send({ 'status': 500 });
                        return console.log(err);
                    }
                    // get and return all the todos after you create another
                    Counter.find({}, 'species -_id count',function(err, counters) {
                        if(err) {
                            res.send({ 'status': 500 });
                            return console.log(err);
                        }
                        console.log(setNewSpeciesLogLine('varis'));
                        console.log(setNewSpeciesLogLine('harakka'));
                        res.json({ status: 200, data: counters});
                    });
                });
            }           
        }
    });
}