var test = require('./test.js')
var express = require('express');
var fs = require('fs')

var app = express();

app.get('/',function(req,res) {
    res.send('POST /test - run tests;\nGET /test - view last test results');
});

app.post('/test',async function(req,res) {
    if(test.status=='running') {
        if(!req.query.force) {
            res.status(412).send('Won\'t launch test because there is another test running. To force parallel executions, use POST "/test?force=1"')
            return
        }
    }
    console.log("Running tests...")
    if (req.query.wait) {
        await test.run()
        if(test.status=="success") {
            res.status(200).send(test.lastMessage + ' check "/results" for details')
        } else if(test.status=="failed") {
            res.status(580).send(test.lastMessage + ' check "/results" for details')
        } else {
            res.status(500).send(test.lastMessage)
        }
    } else {
        console.log("Running tests assynchronously...")
        test.run()
        res.status(202).send('Tests started in background. Check results at "/results". To wait for results, use POST "/test?wait=1"')
    }
})

app.get('/results',function(req,res) {
    var options = {
        headers: {
            'Cache-Control': 'no-cache',
            'Content-Type': 'text/html' 
        }
    };    
    f1 = '/app/reporter-htmlextra.html'
    if (fs.existsSync(f1)) {
        res.status(200).sendFile(f1, options)
    } else {
        res.status(404).send('status=' + test.getStatus());
    }
})
app.get('/results/json',function(req,res) {
    var options = {
        headers: {
            'Cache-Control': 'no-cache',
            'Content-Type': 'application/json' 
        }
    };    
    f1 = '/app/reporter-json.json'
    if (fs.existsSync(f1)) {
        res.status(200).sendFile(f1, options)
    } else {
        res.status(404).send('status=' + test.getStatus());
    }
})
app.get('/results/json-summary',function(req,res) {
    var options = {
        headers: {
            'Cache-Control': 'no-cache',
            'Content-Type': 'application/json' 
        }
    };    
    f1 = '/app/reporter-json-summary.json'
    if (fs.existsSync(f1)) {
        res.status(200).sendFile(f1, options)
    } else {
        res.status(404).send('status=' + test.getStatus());
    }
})
app.get('/results/junit',function(req,res) {
    var options = {
        headers: {
            'Cache-Control': 'no-cache',
            'Content-Type': 'application/xml'
        }
    };    
    f1 = '/app/reporter-junit.xml'
    if (fs.existsSync(f1)) {
        res.status(200).sendFile(f1, options)
    } else {
        res.status(404).send('status=' + test.getStatus());
    }
})
app.get('/status',function(req,res) {
    var options = {
        headers: {
            'Cache-Control': 'no-cache',
            'Content-Type': 'text/plain'
        }
    };
    res.status(getStatusCode(test.status)).send(test.status)
})

const server = app.listen(2000, function() {
    console.log('Web server listening on port 2000');
 });
//  server.timeout = 50000;
 
function getStatusCode(testStatus) {
    st = 200
    if(test.status == "failed") {
        st = 580
    } else if(test.status == "error") {
        st = 500
    }
    return st;
}