/**
 * 事件对象 ==> 对应data的一个属性
 * 两个方法：notify/addSub
 * */
function Dep() {
    this.subs = [];
}

Dep.prototype = {
    notify: function () {
        this.subs.forEach(sub => {
            sub.update()
        })
    },
    addSub: function (sub) {
        this.subs.push(sub)
    }
};

/**
 * 订阅者 ==>对应data某个属性的一个绑定节点
 * 两个方法:update/register
 * */
function Watcher(vm, name, dom) {
    this.vm = vm;
    this.name = name;
    this.dom = dom;
}

Watcher.prototype = {
    update: function () {
        this.dom.value = this.vm.data[this.name];
        this.dom.nodeValue = this.vm.data[this.name];
    },
    register: function (dep) {
        dep.addSub(this)
    }
};


/**
 * 编译dom
 * */
//全局变量：正则表达式
regEx = /\{\{(.*)\}\}/;

function compile(dom, vm) {
    if (dom.nodeType === 1) {//元素节点
        let attrs = dom.attributes;
        for (let i = 0, attr; attr = attrs[i]; i++) {
            if (attr.nodeName === 'v-model') {
                let name = attr.nodeValue;
                //初始化data-->view （单标签input元素节点）
                dom.value = vm.data[name];
                //动态view-->data (input事件)
                dom.addEventListener('input', function (evt) {
                    vm.data[name] = evt.target.value;
                })
            }
        }
    } else if (dom.nodeType === 3) {//文本节点
        if (regEx.test(dom.nodeValue)) {
            let name = RegExp.$1.trim();
            //初始化data-->view （文本节点）
            dom.nodeValue = vm.data[name];
        }
    }
}

/**
 * dom劫持到fragment
 * */
function nodeToFragment(dom, vm) {
    let child,
        fragment = document.createDocumentFragment();
    while (child = dom.firstChild) {
        //递归编译
        if (child.hasChildNodes()) {
            child = nodeToFragment(child, vm)
        }
        compile(child, vm);
        fragment.appendChild(child);

    }
    return fragment;
}

/**
 * 构造函数
 * */
function Vue(options) {
    this.data = options.data;
    let dom = document.querySelector(options.el);
    dom.appendChild(nodeToFragment(dom, this))
}