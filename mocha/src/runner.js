const EventEmitter = require('event').EventEmitter;
const status = {
  EVENT_RUN_BEGIN: "EVENT_RUN_BEGIN",
  EVENT_RUN_END: "EVENT_RUN_END",
  EVENT_SUITE_BEGIN: "EVENT_SUITE_BEGIN",
  EVENT_SUITE_END: "EVENT_SUITE_END",
  EVENT_SUCCESS: "EVENT_SUCCESS",
  EVENT_FAIL: "EVENT_FAIL",
};
class Runner extends EventEmitter {
  constructor() {
    super();
    // 记录根suite到当前suite的路径
    this.suites = [];
  }
  async run(root) {
    this.emit(status.EVENT_RUN_BEGIN);
    await this.runSuite(root);
    this.emit(status.EVENT_RUN_END);
  }
  async runSuite(suite) {
    await this.runBeforeAll(suite);
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
    await this.runAfterAll(suite);
  }
  async runBeforeAll(suite) {
    if (suite._beforeAll.length) {
      for (const fn of suite._beforeAll) {
        const res = await fn();
        if (res instanceof Error) {
          this.emit(
            status.EVENT_FAIL,
            `"before all" hook in ${suite.title} ${res.message}`
          );
          // suite执行结束
          this.emit(status.EVENT_SUITE_END);
          return;
        }
      }
    }
  }
  async runAfterAll(suite) {
    if (suite._afterAll.length) {
      for (const fn of suite._afterAll) {
        const res = await fn();
        if (res instanceof Error) {
          this.emit(
            status.EVENT_FAIL,
            `"after all" hook in ${suite.title} ${res.message}`
          );
          // suite执行结束
          this.emit(status.EVENT_SUITE_END);
          return;
        }
      }
    }
  }
  async runTest(test) {
    // 根suite到当前suite的beforeEach路径
    const beforeEach = []
      .concat(this.suites)
      .reverse()
      .reduce((list, suite) => list.concat(suite._beforeEach), []);
    if (beforeEach.length) {
      for (const fn of beforeEach) {
        const res = await fn();
        if (res instanceof Error) {
          this.emit(
            status.EVENT_FAIL,
            `"before each" hook in ${test.title} ${res.message}`
          );
        }
      }
    }
    // 执行测试用例
    const res = await test.fn();
    if (res instanceof Error) {
      return this.emit(status.EVENT_FAIL, `${test.title}`);
    } else {
      this.emit(status.EVENT_SUCCESS, `${test.title}`);
    }
    // 当前suite到根suite的afterEach路径
    const afterEach = []
      .concat(this.suites)
      .reduce((list, suite) => list.concat(suite._afterEach), []);
    if (afterEach.length) {
      for (const fn of after) {
        await fn();
        if (res instanceof Error) {
          this.emit(
            status.EVENT_FAIL,
            `"after each" hook in ${test.title} ${res.message}`
          );
        }
      }
    }
  }
}
module.exports = {
    Runner,
    status
};