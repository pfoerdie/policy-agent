const
    testCases = new Set(),
    Utility = require('../Utility.js');

testCases.add({
    label: "Utility.validParam('${this.args[0]}', ...)",
    fn: Utility.validParam,
    args: [
        'array<string|number>',
        ['test', 1],
        'stringy',
        3,
        ['blu', 'foo', 'bar'],
        ['next']
    ]
});

testCases.add({
    label: "Utility.validParam('${this.args[0]}', ...)",
    fn: Utility.validParam,
    args: [
        'string|array<string>',
        ['test', 1],
        'stringy',
        3,
        ['blu', 'foo', 'bar'],
        ['next']
    ]
});

function displayLabel(test) {
    return test.label.replace(/\${(.*?)}/g, (match, arg) => {
        return (function () {
            return eval(arg);
        }).call(test);
    })
} // displayLabel

testCases.forEach(async (test) => {
    try {
        let result = await test.fn(...test.args);
        console.log(displayLabel(test), result);
    } catch (err) {
        console.error(displayLabel(test), err);
    }
}); // testCases.forEach