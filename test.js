var newman = require('newman');
const fs = require('fs')

exports.status = "idle"
exports.lastMessage = ""

// call newman.run to pass `options` object and wait for callback
exports.runtests = function() {
  return new Promise(function(accept, reject) {

    console.log('Removing previous result files...')
    f1 = '/app/reporter-htmlextra.html'
    if (fs.existsSync(f1)) {
      fs.unlinkSync(f1)
    }
    f2 = '/app/reporter-junit.xml'
    if (fs.existsSync(f2)) {
      fs.unlinkSync(f2)
    }
    f3 = '/app/reporter-json-summary.json'
    if (fs.existsSync(f3)) {
      fs.unlinkSync(f3)
    }

    console.log('Launching tests...')
    exports.status = "running";
    const r = newman.run({
      collection: require('/provisioning/collection.json'),
      reporters: ['cli','json','htmlextra','junit','json-summary','emojitrain'],
      reporter: {
        'json': {
          export: '/app/reporter-json.json'
        },
        'htmlextra': {
            export: '/app/reporter-htmlextra.html'
        },
        'junit': {
          export: '/app/reporter-junit.xml'
        },
        'json-summary': {
          jsonSummaryExport: '/app/reporter-json-summary.json'
        }
      },
      environment: require('/provisioning/environment.json'),
      abortOnError: false,
      abortOnFailure: false
    },
    function (err, summary) {
      console.log('Tests finished');
      if (err || summary.error) {
        exports.lastMessage = 'Test failure. err=' + JSON.stringify(err) + '; summary.error=' + JSON.stringify(summary.error)
        console.error(exports.lastMessage);
        exports.status = "error";
        reject(exports.lastMessage);
      } else if(summary.run.failures.length>0) {
        exports.lastMessage = `Found ${summary.run.failures.length}/${summary.run.executions.length} test failures. Check logs.`
        console.error(exports.lastMessage);
        exports.status = "failed";
        reject(exports.lastMessage);
      } else {
        exports.lastMessage = `All tests were successfull (${summary.run.executions.length})`;
        console.error(exports.lastMessage);
        console.log('All tests were successfull');
        exports.status = "success";
        accept(exports.lastMessage);
      }
    });
  });
}
