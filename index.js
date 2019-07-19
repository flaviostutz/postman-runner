var test = require('./test.js')
var express = require('express');

var app = express();

app.get('/',function(req,res) {
    res.json(
        {
            message:'POST /test - run tests; GET /test - view last test results'
        }
    );
});

app.post('/test',function(req,res) {
    test.run()
})

app.get('/results',function(req,res) {
    var options = {
        headers: {
            'Cache-Control': 'no-cache',
            'Content-Type': 'text/html' 
        }
    };    
    res.sendFile('/app/reporter-htmlextra.html', options)
})
app.get('/results/json',function(req,res) {
    var options = {
        headers: {
            'Cache-Control': 'no-cache',
            'Content-Type': 'application/json' 
        }
    };    
    res.sendFile('/app/reporter-json.json', options)
})
app.get('/results/json-summary',function(req,res) {
    var options = {
        headers: {
            'Cache-Control': 'no-cache',
            'Content-Type': 'application/json' 
        }
    };    
    res.sendFile('/app/reporter-json-summary.json', options)
})
app.get('/results/junit',function(req,res) {
    var options = {
        headers: {
            'Cache-Control': 'no-cache',
            'Content-Type': 'application/xml'
        }
    };    
    res.sendFile('/app/reporter-junit.xml', options)
})
app.get('/results/status',function(req,res) {
    var options = {
        headers: {
            'Cache-Control': 'no-cache',
            'Content-Type': 'text/plain'
        }
    };
    res.send(test.getStatus())
})

const server = app.listen(2000, function() {
    logger.info('Web server listening on port 2000');
 });
 server.timeout = 50000;
 