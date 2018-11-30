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