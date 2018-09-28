# webpack-internal-plugin-relation

> 目前支持 webpack v4+

## 介绍

一个用来展示webpack内置插件调用关系（钩子）的小工具。 

[https://alienzhou.github.io/webpack-internal-plugin-relation/index.html](https://alienzhou.github.io/webpack-internal-plugin-relation/index.html)

也许可以用来帮助理清webpack内部插件之间的关系，促进webpack源码结构的理解与阅读。

![](./doc/img/sample.png)

## 演示

![](./doc/img/example.gif)

## 功能

- 收集webpack内部插件中钩子的创建、注册、调用关系，并生成原始数据
- 力导向图可视化展示插件、钩子间关系
- 支持力导向图节点的选择
- 单击javascript module类节点，可在左下角展示详细信息
- 双击javascript module类节点，可直接打开webpack对应源码查看
- 双击节点间关系，可直接打开并定位源码具体行数，进行查看
- ……

## 使用

你可以直接启动查看应用效果，或者只是生成所需的关系数据，或者构建应用并托管在自己的网站……

### 启动服务预览

```bash
# 安装依赖
npm i

# 启动服务
npm start
```

![](./doc/img/start.png)

启动完成后可以在 `127.0.0.1:8085` 上看到服务

### 生成plugin与hook相关数据

如果不想使用力导向图功能，只是需要plugin、hook之间的关系数据，可以

```bash
npm run data
```

生成的数据在 `config/` 目录下：

- hook.json: plugin与hook收集的原始数据
- forceData.json: 整理合并的力导向图数据

![](./doc/img/datapath.png)

### 应用构建

```bash
npm run build
```

生成的静态文件位于 `dist/` 目录下，可将站点应用托管至任何静态文件服务器。