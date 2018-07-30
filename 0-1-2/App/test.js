class Test {
    constructor(test) {
        let target = new.target;
        this.test = test;
    }

    toString() {
        let target = new.target;
        return this.test.toString();
    }
}

let test = new Test('Hello World!');
console.log(test.toString());

return 0;