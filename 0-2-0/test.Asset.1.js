const
    Asset = require('./Asset.1.js');

Asset
    .register("Test", class extends Asset { })
    .defineAction('test2', function (...args) {
        return this['uid'];
    }, 'use', [])
    .defineAction('test', function (...args) {
        console.log(this);
        return args.join("");
    }, 'use', []);

let testAsset = Asset
    .create('Test', { 'uid': "Hello World", 'test': "Lorem Ipsum" });

testAsset
    .request('test', "FOO", "BAR")
    .then(console.log)
    .catch(console.error);
testAsset
    .request('test2', "FOO", "BAR")
    .then(console.log)
    .catch(console.error);