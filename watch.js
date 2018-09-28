/**
 * @file watch.js
 * @author alienzhou
 * @description
 * File Created 2018-09-23 22:45:56, Sunday
 * -----
 * Last Modified 2018-09-23 22:45:56, Sunday
 * Modified By alienzhou
 * -----
*/
const chalk = require('chalk');
const chokidar = require('chokidar');
const childProcess = require('child_process');
const chalkCtx = new chalk.constructor({level: 3});

function runInChildProcess() {
    const cp = childProcess.exec('node run.js', {
        stdio: 'inherit'
    });

    cp.stdout.on('data', (data) => {
        console.log(data);
    });

    cp.stderr.on('data', err => {
        console.error(chalkCtx.red('encounter some errors:'));
        console.error(chalkCtx.red(err));
    });

    cp.on('close', code => {
        if (code !== 0) {
            console.log(chalkCtx.red(`child process exited with code ${code}`));
        }
    });
}

require('./index')();

chokidar.watch(['./lib', 'index.js', 'config/color.json']).on('change', p => {
    console.log(chalkCtx.green(`file ${p} changed`));
    runInChildProcess();
});