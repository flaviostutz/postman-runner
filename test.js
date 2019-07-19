var newman = require('newman');
const fs = require('fs')

var status = "idle"

exports.getStatus = function() {
  return status
}

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
    status = "running";
    const r = newman.run({
      collection: require('/app/provisioning/collection.json'),
      reporters: 'cli,json,htmlextra,junit,json-summary,emojitrain',
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
      environment: require('/app/provisioning/environment.json'),
      abortOnError: false,
      abortOnFailure: false
    },
    function (err, summary) {
      console.log('Tests finished');
      if (err || summary.error) {
          console.error('Test failure. err=' + JSON.stringify(err) + '; summary.error=' + JSON.stringify(summary.error));
          status = "error";
          reject();
        } else {
        if(summary.run.failures.length>0) {
          console.log(`Found ${summary.run.failures.length} test failures. Check log above.`);
          status = "error";
          reject();
        } else {
          console.log('All tests were successfull');
          status = "success";
          accept();
        }
      }
    });
  });
}

exports.run = async function() {
  try {
    await runtests();
    process.exit(0);
  } catch (err) {
    console.log('FAILURE. ERR=' + err);
    process.exit(1);
  }
}

// run();

