# vue源码由浅入深
### step1、简单双向数据绑定
+ 实现
    + 正向：Object.defineProperty接口的set特性
    + 反向：input事件
+ 缺点
    + 绑定过程和模版紧密耦合
+ 示例

![avatar](./images/1.png)
### step2、双向绑定框架模型
+ 优点
    + 配置和模版交给用户，绑定过程交给框架
+ 示例

![avatar](./images/2.png)

### step3、初始化数据绑定
+ 过程
    + 编译compile
        + 编译元素节点和文本节点
        + 文本节点使用正则表达式匹配{{}}符号
        + 注意innerText,value,nodeValue三者区别
    + dom劫持到DocumentFragment
        + appendChild是对dom节点进行剪切，配合firstChild则可以遍历
        + 递归遍历进行编译
    + vue构造函数
        + options选项数据作为vue对象数据
        + 将编译好的fragment挂载到根节点
+ 示例

![avatar](./images/3.png)

### step4:视图到数据的动态绑定
+ 原理
    + input事件
        + 给拥有v-model属性的节点添加input事件监听
+ 示例

![avatar](./images/4.png)

### step5:发布订阅模式
+ 三个角色
    + 发布者
        + 发布publish
    + 订阅者
        + 更新update
        + 注册register
    + 事件对象
        + 通知notify
        + 添加订阅者addSub
+ 示例

![avatar](./images/5.png)
### step6：数据代理-set时发布通知
+ 过程
    + vm.text代理vm.data.text
    + 对vm.text修改时，调用pub.publish()
+ 核心API
    + Object.defineProperty()
+ 示例

![avatar](./images/6.png)
