const
    Asset = require('./Asset.js');

Asset
    .register("Test", class extends Asset { })
    .defineAction('test', function (...args) {
        console.log(this);
    }, 'use', []);

let tmp = Asset.create('Test', "Hello World", { 'test': "Lorem Ipsum" });
tmp.request('test').then(console.log).catch(console.error);