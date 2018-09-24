/**
 * @file getFilePath.js
 * @author zhouhongxuan (zhouhongxuan@baidu.com)
 * @description get all modules filepath in webpack
 * File Created 2018-09-22 11:39:26, Saturday
 * -----
 * Last Modified 2018-09-22 11:39:26, Saturday
 * Modified By zhouhongxuan (zhouhongxuan@baidu.com>)
 * -----
*/

const fs = require('fs-extra');
const path = require('path');
const DEFAULT_WEBPACK_PATH = require('./util').DEFAULT_WEBPACK_PATH;

module.exports = function loadFilePaths (webpackPath = DEFAULT_WEBPACK_PATH) {
    let result = [];
    let list = fs.readdirSync(webpackPath).map(p => path.resolve(webpackPath, p));
    let filepath;
    while (filepath = list.shift()) {
        const stats = fs.statSync(filepath);
        if (stats.isDirectory()) {
            list = list.concat(fs.readdirSync(filepath).map(p => path.resolve(filepath, p)));
        }
        if (/.js$/.test(filepath)) {
            result.push(filepath);
        }
    }

    return result;
}