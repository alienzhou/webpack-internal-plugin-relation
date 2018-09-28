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
import 'echarts/lib/component/legendScroll';

import forceData from '../config/forceData.json';
import colors from '../config/color.json';

import './index.less';
import { join } from 'path';

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

// 图表大小调整比例
const ratio = document.getElementById('main').clientHeight / 970;

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
            return params.dataType === 'node' ? params.name : `${params.data.type} relation`;
        }
    },
    legend: {
        type: 'scroll',
        orient: 'vertical',
        right: 20,
        top: 20,
        bottom: 20,
        width: 30,
        data: forceData.legend,
        align: 'right',
        selected: {},
        inactiveColor: '#444',
        itemWidth: 0,
        itemHeight: 0,
        pageIconColor: '#F1DAF0',
        pageIconInactiveColor: '#888',
        animation: true,
        animationDurationUpdate: 200,
        pageTextStyle: {
            color: '#888'
        },
        textStyle: {
            fontSize: '11',
            color: '#888'
        }
    },
    series: [{
        edgeSymbol: ['none', 'arrow'],
        edgeSymbolSize: 5,
        type: 'graph',
        layout: 'force',
        animation: false,
        focusNodeAdjacency: true,
        roam: true,
        categories: forceData.legend.map(i => ({name: i})),
        force: {
            gravity: 0.12 / ratio,
            repulsion: 40 * ratio,
            edgeLength: 8 * ratio,
            initLayout: 'circular'
        },
        emphasis: {
            label: {
                show: false
            }
        },
        symbolSize: v => v,
        draggable: true,
        data: forceData.nodes,
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

myChart.on('dblclick', params => {
    const base = 'https://github.com/webpack/webpack/tree/master/';
    if (params.dataType === 'node' && params.data.type === 'module') {
        window.open(`${base}${params.name}`, null);
    }
    if (params.dataType === 'edge') {
        window.open(`${base}${params.data.sourceFile}#L${params.data.sourceLine}`, null);
    }
});
myChart.on('click', params => {
    if (params.dataType === 'node' && params.data.type === 'module') {
        import('../config/hook.json').then(module => {
            const json = module.default;
            const {
                hooks,
                taps,
                calls
            } = json[params.name];

            document.getElementById('js-info-contain').innerHTML = (
                hooks.length ? dereplicate(hooks.map(i => i.name)).join('<br>') : '无'
            );
            document.getElementById('js-info-register').innerHTML = (
                taps.length ? dereplicate(taps.map(i => `${i.hook} - ${i.type}`)).join('<br>') : '无'
            );
            document.getElementById('js-info-call').innerHTML = (
                calls.length ? dereplicate(calls.map(i => `${i.hook} - ${i.type}`)).join('<br>') : '无'
            );
        });
    }
});

const dereplicate = arr => [...new Set(arr)];

function selectNone() {
    const selected = {};
    forceData.legend.forEach(i => {
        selected[i] = false;
    });
    option.legend.selected = selected;
    myChart.setOption(option);
}

function selectAll() {
    const selected = {};
    forceData.legend.forEach(i => {
        selected[i] = true;
    });
    option.legend.selected = selected;
    myChart.setOption(option);
}

function resize() {
    const ratio = document.getElementById('main').clientHeight / 970;
    myChart.resize({
        width: document.getElementById('main').clientWidth,
        height: document.getElementById('main').clientHeight
    });
    // 图表大小调整比例
    option.series[0].force.gravity = 0.12 / ratio;
    option.series[0].force.repulsion = 40 * ratio;
    option.series[0].force.edgeLength = 8 * ratio;
    myChart.setOption(option);
}

// bind click
document.getElementById('js-select-none').addEventListener('click', selectNone);
document.getElementById('js-select-all').addEventListener('click', selectAll);
window.addEventListener('resize', resize);