/**
 * @file traverse.js
 * @author zhouhongxuan (zhouhongxuan@baidu.com)

 * File Created 2018-09-22 11:28:23, Saturday
 * -----
 * Last Modified 2018-09-22 11:28:23, Saturday
 * Modified By zhouhongxuan (zhouhongxuan@baidu.com>)
 * -----
*/
const fs = require('fs-extra');
const path = require('path');
const babel = require('@babel/core');
const traverse = require('@babel/traverse').default;
const t = require('@babel/types');
const DEFAULT_WEBPACK_PATH = require('./util').DEFAULT_WEBPACK_PATH;

const hookVisitor = {
    AssignmentExpression(path) {
        if (
            t.isMemberExpression(path.node.left)
            && t.isThisExpression(path.node.left.object)
            && t.isIdentifier(path.node.left.property)
            && path.node.left.property.name === 'hooks'
            && t.isObjectExpression(path.node.right)
        ) {
            const properties = path.node.right.properties
                .filter(p => t.isProperty(p))
                .filter(p => t.isIdentifier(p.key))
                .filter(p => t.isNewExpression(p.value));
            properties.forEach(p => this.hooks.push(p.key.name));
        }
    }
};

const classVisitor = {
    ClassMethod(path) {
        if (path.node.kind === 'constructor') {
            path.traverse(hookVisitor, {hooks: this.hooks});
        }
        path.skip();
    }
};

module.exports = function (filelist = [], base = DEFAULT_WEBPACK_PATH) {
    const map = {};
    const hooks = [];
    const taps = [];
    const calls = [];

    for (let i = 0; i < filelist.length; i++) {
        const ast = babel.transformFileSync(filelist[i], {ast: true}).ast;
        traverse(ast, {
            ClassBody(path) {
                path.traverse(classVisitor, {hooks});
            },
            CallExpression(path) {
                if (!t.isMemberExpression(path.node.callee)
                    || !t.isIdentifier(path.node.callee.property)
                    || !t.isMemberExpression(path.node.callee.object)
                    || !t.isIdentifier(path.node.callee.object.property)
                ) {
                    return;
                }
                if (
                    ['tap', 'tapAsync', 'tapPromise'].indexOf(path.node.callee.property.name) > -1
                    && ['_pluginCompat'].indexOf(path.node.callee.object.property.name) === -1
                ) {
                    let hookName;
                    let pluginName;
                    let type;
                    if (t.isLiteral(path.node.arguments[0])) {
                        pluginName = path.node.arguments[0].value;
                        hookName = path.node.callee.object.property.name;
                        type = path.node.callee.property.name;
                        taps.push({
                            hook: hookName,
                            type: type,
                            plugin: pluginName
                        });
                    }
                }
                else if (
                    ['call', 'callAsync', 'promise'].indexOf(path.node.callee.property.name) > -1
                    && ['_pluginCompat'].indexOf(path.node.callee.object.property.name) === -1
                ) {
                    let hookName;
                    let type;
                    hookName = path.node.callee.object.property.name;
                    type = path.node.callee.property.name;
                    calls.push({
                        hook: hookName,
                        type: type
                    });
                }
            },
            Program: {
                exit() {
                    if (
                        hooks.length === 0
                        && taps.length === 0
                        && calls.length === 0
                    ) {
                        return;
                    }
                    let key = path.relative(base, filelist[i]);
                    if (!map[key]) {
                        map[key] = {};
                    }
                    map[key].hooks = hooks.splice(0);
                    map[key].taps = taps.splice(0);
                    map[key].calls = calls.splice(0);
                }
            }
        });
    }

    return map;
}