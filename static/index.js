/**
 * @file index.js
 * @author alienzhou
 * @description show force chart
 * File Created 2018-09-23 22:33:04, Sunday
 * -----
 * Last Modified 2018-09-23 22:33:04, Sunday
 * Modified By alienzhou
 * -----
*/

import * as echarts from 'echarts/lib/echarts';
import 'echarts/lib/component/tooltip';
import 'echarts/lib/chart/graph';

import forceData from '../config/forceData.json';
import colors from '../config/color.json';

// modify style
document.querySelectorAll('.tooltip .contain').forEach(
    e => e.style = `border-bottom: 1px dashed ${colors.contain}`
);
document.querySelectorAll('.tooltip .register').forEach(
    e => e.style = `border-bottom: 1px solid ${colors.register}`
);
document.querySelectorAll('.tooltip .call').forEach(
    e => e.style = `border-bottom: 1px solid ${colors.call}`
);
document.querySelectorAll('.category .module').forEach(
    e => e.style = `background: ${colors.module}`
);
document.querySelectorAll('.category .hook').forEach(
    e => e.style = `background: ${colors.hook}`
);

// chart init
const myChart = echarts.init(document.getElementById('main'));

// option config
const option = {
    emphasis: {
        label: {
            show: false
        }
    },
    tooltip: {
        position: function (point) {
            return [point[0], point[1]];
        },
        formatter: function (params) {
            return params.dataType === 'node' ? params.name : `${params.data.type} relationship`;
        }
    },
    series: [{
        edgeSymbol: ['none', 'arrow'],
        edgeSymbolSize: 5,
        type: 'graph',
        layout: 'force',
        animation: false,
        force: {
            gravity: 0.02,
            repulsion: 80,
            edgeLength: 80,
            initLayout: 'circular'
        },
        emphasis: {
            label: {
                show: false
            }
        },
        symbolSize: function (value) {
            return value;
        },
        draggable: true,
        data: forceData.nodes,
        force: {
            // initLayout: 'circular'
            // repulsion: 20,
            edgeLength: 5,
            repulsion: 20,
            gravity: 0.2
        },
        itemStyle: {
            color: function (v) {
                return v.data.color;
            }
        },
        links: forceData.links
    }]
};

// paint
myChart.setOption(option);

myChart.on('click', function (params) {
    const base = 'https://github.com/webpack/webpack/tree/master/';
    if (params.dataType === 'node' || params.data.type === 'module') {
        window.open(`${base}${params.name}`, null);
    }
    if (params.dataType === 'edge') {
        window.open(`${base}${params.data.sourceFile}#L${params.data.sourceLine}`, null);
    }
});