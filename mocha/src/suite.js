class Suite {
  constructor(parent, title) {
    this.title = title;
    this.parent = parent;
    this.suites = [];
    this.tests = [];
    this._beforeAll = [];
    this._afterAll = [];
    this._beforeEach = [];
    this._afterEach = [];
    if (parent instanceof Suite) {
      parent.suites.push(this);
    }
  }
}
module.exports = Suite;
