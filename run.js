var test = require('./test.js')

r = async function() {
    try {
        await test.runtests();
        process.exit(0)
    } catch (err) {
        console.log('FAILURE. ERR=' + err);
        process.exit(1)
    }
}
r()