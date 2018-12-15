/**
 * @file util.js
 * @author alienzhou
 * @description utils
 * File Created 2018-09-23 22:18:37, Sunday
 * -----
 * Last Modified 2018-09-23 22:18:38, Sunday
 * Modified By alienzhou
 * -----
*/
const fs = require('fs-extra');
const path = require('path');
const webpackPath = require.resolve('webpack');
const replacer = new RegExp(`(?<=node_modules${path.sep}webpack)(${path.sep}.+)+`);

module.exports.colors = require('../config/color.json');
module.exports.DEFAULT_WEBPACK_PATH = webpackPath.replace(replacer, '');
module.exports.OUTPUT_DIR = path.resolve(__dirname, '../config');
module.exports.writeJson = (json, filename, dir = OUTPUT_DIR) => fs.writeJsonSync(
    path.resolve(dir, filename),
    json,
    {spaces: 2, replacer: null}
);
