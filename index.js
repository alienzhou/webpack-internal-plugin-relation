/**
 * @file index.js
 * @author zhouhongxuan (zhouhongxuan@baidu.com)
 * @description
 * File Created 2018-09-22 11:29:13, Saturday
 * -----
 * Last Modified 2018-09-22 11:29:13, Saturday
 * Modified By zhouhongxuan (zhouhongxuan@baidu.com>)
 * -----
*/
const chalk = require('chalk');
const getFilePath = require('./lib/getFilePath');
const traverse = require('./lib/traverse');
const mergeData = require('./lib/mergeData');

const {
    OUTPUT_DIR,
    writeJson
} = require('./lib/util');

module.exports = function (output = OUTPUT_DIR, base) {
    console.log(chalk.magenta('=========== starting ===========\n'));

    console.log(chalk.blue('start load modules...'));
    console.time(chalk.green('[load modules]'));
    const files = getFilePath(base);
    console.timeEnd(chalk.green('[load modules]'));

    console.log(chalk.blue('\nstart collecting hooks...'));
    console.time(chalk.green('[collect hooks]'));
    const originMap = traverse(files, base);
    console.timeEnd(chalk.green('[collect hooks]'));

    console.log(chalk.blue('\nstart merging data...'));
    console.time(chalk.green('[merge data]'));
    const forceMap = mergeData(originMap);
    console.timeEnd(chalk.green('[merge data]'));

    console.log(chalk.blue('\nstart writing data...'));
    console.time(chalk.green('[write data]'));
    writeJson(originMap, 'hook.json', output);
    writeJson(forceMap, 'forceData.json', output);
    console.timeEnd(chalk.green('[write data]'));

    console.log(chalk.magenta('\n============= end =============='));
}