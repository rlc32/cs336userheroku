/**
 * This file provided by Facebook is for non-commercial testing and evaluation
 * purposes only. Facebook reserves all rights not expressly granted.
 *
 * THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
 * IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
 * FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL
 * FACEBOOK BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY, WHETHER IN AN
 * ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION
 * WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE SOFTWARE.
 */

var fs = require('fs');
var path = require('path');
var express = require('express');
var bodyParser = require('body-parser');
var assert = require('assert');
var MongoClient = require('mongodb').MongoClient;
var db;
var app = express();

//adding comment for lab11 - exercise 11.2

app.set('port', (process.env.PORT || 3000));

app.use('/', express.static(path.join(__dirname, 'dist/')));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: true}));

// Additional middleware which will set headers that we need on each request.
app.use(function(req, res, next) {
    // Set permissive CORS header - this allows this server to be used only as
    // an API server in conjunction with something like webpack-dev-server.
    res.setHeader('Access-Control-Allow-Origin', '*');

    // Disable caching so we'll always get the latest comments.
    res.setHeader('Cache-Control', 'no-cache');
    next();
});


app.get('/api/comments', function(req, res) {
    db.collection("comments").find({}).toArray(function(err, docs) {
        if (err) throw err;
        res.json(docs);
    });
});



app.post('/api/comments', function(req, res) {
    var newComment = {
        id: Date.now(),
        author: req.body.author,
        text: req.body.text,
    };
    db.collection("comments").insertOne(newComment, function(err, result) {
        if (err) throw err;
        db.collection("comments").find({}).toArray(function(err, docs) {
            if (err) throw err;
            res.json(docs);
        });
    });
});



var mongoURL = 'mongodb://user1:bjarne@ds043022.mlab.com:43022/mdavis';
MongoClient.connect(mongoURL, function(err, dbConnection) {
     if (err) throw err;
     db = dbConnection;
 });


app.listen(app.get('port'), function() {
  console.log('Server started: http://localhost:' + app.get('port') + '/');
});
