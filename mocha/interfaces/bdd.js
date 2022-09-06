// mocha为BDD测试风格提供多个全局API
const Suite = require('../src/suite');
const Test = require('../src/test');
const {adaptPromise} = require('../src/utils'); 
module.exports = function(context, root) {
    const suites = [root];
    context.describe = context.context = function(title, fn) {
        const cur = suites[0];
        const suite = new Suite(cur, title);
        suites.unshift(suite);
        fn.call(suite);
        suites.shift();
    }
    context.it = context.specify = function(title, fn) {
        const suite = suites[0];
        const test = new Test(title, adaptPromise(fn));
        suite.tests.push(test);
    }
    context.beforeAll = function(fn) {
        const suite = suites[0];
        suite._beforeAll.push(adaptPromise(fn));
    }
    context.afterAll = function(fn) {
        const suite = suites[0];
        suite._afterAll.push(adaptPromise(fn));
    }
    context.beforeEach = function(fn) {
        const suite = suites[0];
        suite._beforeEach.push(adaptPromise(fn));
    }
    context.afterEach = function(fn) {
        const suite = suites[0];
        suite._afterEach.push(adaptPromise(fn));
    }
}