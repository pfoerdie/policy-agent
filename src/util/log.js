const Colors = require("colors");
const _ = require(".");
module.exports = log;
let logCount = 0, logSilent = false, logColored = true, logDisabled = false;

function log(scope, method, ...args) {
    if (logDisabled) return;
    let raw = "", colored = "";

    if (typeof scope === "string") {
        raw = scope;
        colored = Colors.yellow(scope);
    } else if (scope instanceof Object) {
        let scopeName = scope.__proto__.constructor.name;
        let scopeData = _.is.string(scope.id, 1) ? scope.id : _.is.string(scope.uid, 1) ? scope.uid : JSON.stringify(scope.data) || "";

        if (scope instanceof Error) {
            raw = `${scopeName}<${scopeData}> ${scope.message}`;
            colored = Colors.red(scopeName) + Colors.grey("<") + Colors.green(scopeData) + Colors.grey("> ")
                + Colors.yellow(scope.message);
        } else if (_.is.string(method, 1) && Reflect.has(scope, method) && _.is.function(scope[method])) {
            let argPairs = args.map(arg => [
                arg === undefined ? "undefined" : arg === null ? "null" : arg.__proto__.constructor.name,
                !arg ? "" : _.is.string(arg.id, 1) ? arg.id : _.is.string(arg.uid, 1) ? arg.uid : JSON.stringify(arg.data) || ""
            ]);

            raw = `${scopeName}<${scopeData}>.${method}(${argPairs.map(([argName, argData]) => argName + (argData ? `<${argData}>` : "")).join(", ")})`;
            colored = Colors.cyan(scopeName) + Colors.grey("<") + Colors.green(scopeData) + Colors.grey(">")
                + Colors.grey(".") + Colors.magenta(method) + Colors.grey("(")
                + argPairs.map(([argName, argData]) =>
                    Colors.blue(argName) + (argData ? Colors.grey("<") + Colors.green(argData) + Colors.grey(">") : "")
                ).join(Colors.grey(", "))
                + Colors.grey(")");
        } else if (!method) {
            let argPairs = Object.entries(Object.assign({}, scope)).map(([argName, argData]) => [argName, argData instanceof Object ? argData.__proto__.constructor.name : argData]);

            raw = `${scopeName}<${scopeData}> {${argPairs.map(([argName, argData]) => `${argName}: ${argData}`).join(", ")}}`;
            colored = Colors.cyan(scopeName) + Colors.grey("<") + Colors.green(scopeData) + Colors.grey(">")
                + Colors.grey(" {")
                + argPairs.map(([argName, argData]) =>
                    Colors.blue(argName) + Colors.grey(": ") + Colors.green("" + argData)
                ).join(Colors.grey(", "))
                + Colors.grey("}");
        } else {
            raw = "invalid scope";
            colored = Colors.red("invalid scope");
            debugger;
        }
    } else {
        raw = "invalid scope";
        colored = Colors.red("invalid scope");
        debugger;
    }

    raw = `log[${logCount}]: ` + raw;
    colored = Colors.grey(`log[${logCount}]: `) + colored;
    logCount++;

    if (!logSilent) console.log(logColored ? colored : raw);
    return raw;
}