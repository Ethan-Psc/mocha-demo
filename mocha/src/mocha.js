const Suite = require("./suite");
const Interfaces = require("../interfaces");
const { findCaseFile } = require("./utils");
const { Runner } = require("./runner");
class Mocha {
  constructor() {
    // 创建根结点
    this.rootSuite = new Suite(null, "");
  }
  run() {
    // 完成bdd代码风格的全局API挂载
    Interfaces["bdd"](global, this.rootSuite);
    // 加载test文件夹中的所有文件
    const files = findCaseFile("test");
    files.forEach((file) => require(file));
    const runner = new Runner();
    runner.runSuite();
  }
}
module.exports = Mocha;
