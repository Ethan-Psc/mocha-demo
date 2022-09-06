function getTag(val) {
    return Object.prototype.toString.call(val);
}
module.exports = getTag;