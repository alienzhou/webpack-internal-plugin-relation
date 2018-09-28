/**
 * @file index.js
 * @author alienzhou
 * @description
 * File Created 2018-09-22 11:29:13, Saturday
 * -----
 * Last Modified 2018-09-22 11:29:13, Saturday
 * Modified By alienzhou
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

const chalkCtx = new chalk.constructor({level: 3});

module.exports = function (output = OUTPUT_DIR, base) {
    console.log(chalkCtx.magenta('=========== starting ===========\n'));

    console.log(chalkCtx.blue('start load modules...'));
    console.time(chalkCtx.green('[load modules]'));
    const files = getFilePath(base);
    console.timeEnd(chalkCtx.green('[load modules]'));

    console.log(chalkCtx.blue('\nstart collecting hooks...'));
    console.time(chalkCtx.green('[collect hooks]'));
    const originMap = traverse(files, base);
    console.timeEnd(chalkCtx.green('[collect hooks]'));

    console.log(chalkCtx.blue('\nstart merging data...'));
    console.time(chalkCtx.green('[merge data]'));
    const forceMap = mergeData(originMap);
    console.timeEnd(chalkCtx.green('[merge data]'));

    console.log(chalkCtx.blue('\nstart writing data...'));
    console.time(chalkCtx.green('[write data]'));
    writeJson(originMap, 'hook.json', output);
    writeJson(forceMap, 'forceData.json', output);
    console.timeEnd(chalkCtx.green('[write data]'));

    console.log(chalkCtx.magenta('\n============= end ==============\n'));
}