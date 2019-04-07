const
    Asset = require('./Asset.2.js');

class Test extends Asset {
    get use() {
        return {
            includedIn: null,
            implies: [],
            callback: function () { return "use"; }
        }
    }
    transfer() {
        return {
            includedIn: null,
            implies: [],
            callback: function () { return "transfer"; }
        }
    }
    test() {
        return "test";
    }
}

Asset
    .register("Test", Test);

console.log(Test.prototype);
console.log(new Test().transfer());

// let testAsset = Asset
//     .create('Test', { 'uid': "Hello World", 'test': "Lorem Ipsum" });
