/**
 * @file getFilePath.js
 * @author alienzhou
 * @description get all modules filepath in webpack
 * File Created 2018-09-22 11:39:26, Saturday
 * -----
 * Last Modified 2018-09-22 11:39:26, Saturday
 * Modified By alienzhou
 * -----
*/

const fs = require('fs-extra');
const path = require('path');
const DEFAULT_WEBPACK_PATH = require('./util').DEFAULT_WEBPACK_PATH;

module.exports = function loadFilePaths (webpackPath = DEFAULT_WEBPACK_PATH) {
    let result = [];
    let list = fs.readdirSync(webpackPath).map(p => path.resolve(webpackPath, p));
    let filePath;
    while (filePath = list.shift()) {
        const stats = fs.statSync(filePath);
        if (stats.isDirectory()) {
            list = list.concat(fs.readdirSync(filePath).map(p => path.resolve(filePath, p)));
        }
        if (/.js$/.test(filePath)) {
            result.push(filePath);
        }
    }

    return result;
}