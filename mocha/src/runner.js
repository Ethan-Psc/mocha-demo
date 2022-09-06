const EventEmitter = require('event').EventEmitter;
const status = {}
class Runner {
    constructor() {
        // 记录根suite到当前suite的路径
        this.suites = [];
    }
    async run(root) {
        await this.runSuite(root);
    }
    async runSuite(suite) {
        await runBeforeAll(suite);
        this.suites.push(suite);
        if (suite.tests.length) {
            for (const test of suite.tests) {
                await this.runTest(test);
            }
        }
        if (suite.suites.length) {
            for (const suite of suite.suites) {
                await this.runSuite(suite);
            }
        }
        this.suites.shift();
        await runAfterAll(suite);
    }
    async runBeforeAll(suite) {
        if (suite._beforeAll.length) {
            for (const fn of suite._beforeAll) {
                const res = await fn();
            }
        }
    }
    async runAfterAll(suite) {
        if (suite._afterAll.length) {
            for (const fn of suite._afterAll) {
                const res = await fn();
            }
        }
    }
    async runTest(test) {
        // 根suite到当前suite的beforeEach路径
        const beforeEach = [].concat(this.suites).reverse().reduce((list, suite) => list.concat(suite._beforeEach), []);
        if (beforeEach.length) {
            for (const fn of beforeEach) {
                await fn();
            }
        }
        const res = await test.fn();
        // 当前suite到根suite的afterEach路径
        const afterEach = [].concat(this.suites).reduce((list, suite) => list.concat(suite._afterEach), []);
        if (afterEach.length) {
            for (const fn of after) {
                await fn();
            }
        }
    }
}
module.exports = Runner;