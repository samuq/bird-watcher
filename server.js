const express = require('express');
const app = express();
const path = require('path');
// Run the app by serving the static files
// in the dist directory


app.use(express.static(__dirname + '/dist/bird-watcher'));
// Start the app by listening on the default
// Heroku port
app.listen(process.env.PORT || 4200);
app.get('/*', function(req, res) {
    console.log(__dirname);
    res.sendFile(path.join(__dirname + '/dist/bird-watcher/index.html'));
  });