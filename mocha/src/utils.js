const fs = require('fs');
const path = require('path');
function findCaseFile (filePath) {
    const fileList = [];
    const fullPath = path.join(__dirname, filePath);
    const stat = fs.statSync(fullPath);
    if (stat.isFile()) {
        fileList.push(fullPath);
        return fileList;
    }
    findFileDir(fullPath, fileList);
    return fileList;
}
function findFileDir (filePath, fileList = []) {
    const files = fs.readdirSync(filePath);
    files.forEach((file) => {
        const fullPath = path.join(filePath, file);
        const stat = fs.statSync(fullPath);
        if (stat.isFile()) {
            fileList.push(fullPath);
        }
        else {
            findFileDir(fullPath, fileList);
        }
    })
}
// 适配器模式实现异步
function adaptPromise(fn) {
    return () => new Promise((resolve) => {
        // 没有done
        if (fn.length === 0) {
            try {
                const res = fn();
                if (res instanceof Promise) {
                    return res.then(resolve, reject);
                }
                else {
                    resolve();
                }
            }
            catch (error) {
                resolve(error)
            }
        }
        else {
            // 使用done参数
            function done (error) {
                resolve(error);
            }
            fn(done);
        }
    })
}
module.exports = {
    findCaseFile,
    adaptPromise
}