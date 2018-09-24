/**
 * @file mergeData.js
 * @author zhouhongxuan (zhouhongxuan@baidu.com)
 * @description merge original map data to force chart data
 * File Created 2018-09-22 11:28:23, Saturday
 * -----
 * Last Modified 2018-09-22 11:28:23, Saturday
 * Modified By zhouhongxuan (zhouhongxuan@baidu.com>)
 * -----
*/
const chalk = require('chalk');
const colors = require('./util').colors;

module.exports = function mergeChartData(map) {
    const keys = Object.keys(map);
    const containLink = [];
    const registerLink = [];
    const callLink = [];
    const revertMap = {};
    const nodes = keys.map((k, idx) => {
        return {
            name: k,
            value: 13,
            category: 1,
            color: colors.module,
            id: idx,
            type: 'module'
        };
    });

    keys.forEach((k, idx) => {
        map[k].hooks.forEach(h => {
            const newIdx = nodes.length;
            containLink.push({
                source: idx,
                target: newIdx
            });
    
            revertMap[h] = newIdx;
    
            nodes.push({
                name: h,
                value: 10,
                category: 2,
                color: colors.hook,
                id: newIdx,
                type: 'hook'
            });
        });
    });
    
    keys.forEach((k, idx) => {
        map[k].taps.forEach(t => {
            const hookIdx = revertMap[t.hook];
            if (!hookIdx) {
                console.log(chalk.yellow(`[warn] miss hook: ${t.hook}`));
            }
            registerLink.push({
                source: idx,
                target: hookIdx
            });
        });
    
        map[k].calls.forEach(t => {
            const hookIdx = revertMap[t.hook];
            callLink.push({
                source: idx,
                target: hookIdx
            });
        });
    });
    
    const links = [].concat(
        containLink.map(l => Object.assign(l, {
            lineStyle: {
                type: 'dashed',
                color: colors.contain
            },
            type: 'contain',
            value: 100
        })),
        registerLink.map(l => Object.assign(l, {
            lineStyle: {
                color: colors.register
            },
            type: 'register',
            value: 200
        })),
        callLink.map(l => Object.assign(l, {
            lineStyle: {
                color: colors.call,
                width: 2
            },
            type: 'call',
            value: 200
        })),
    );
    
    return {nodes, links};
}

