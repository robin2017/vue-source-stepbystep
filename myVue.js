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
    Dep.target = this;
    this.update();
}

Watcher.prototype = {
    update: function () {
        this.dom.value = this.vm[this.name];
        this.dom.nodeValue = this.vm[this.name];
    },
    register: function (dep) {
        dep.addSub(this)
    }
};

/**
 * 编译dom
 * */
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
                    vm[name] = evt.target.value;
                });
                new Watcher(vm, name, dom);
            }
        }
    } else if (dom.nodeType === 3) {//文本节点
        if (compile.regEx.test(dom.nodeValue)) {
            let name = RegExp.$1.trim();
            //初始化data-->view （文本节点）
            dom.nodeValue = vm.data[name];
            new Watcher(vm, name, dom);
        }
    }
}

//全局变量放在构造器上
compile.regEx = /\{\{(.*)\}\}/;

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
 * 递归式数据代理
 * */
function proxyData(vm,data) {
    Object.keys(data).forEach(key => {
        defineReactive(vm, key, data[key])
        if(typeof  data[key] ==='object'){
            proxyData(vm[key],data[key])
        }
    })
}
/**
 * 响应式交互
 * */
function defineReactive(obj, key, val) {
    console.log('建立事件对象:',obj,key,val);
    let dep = new Dep();
    Object.defineProperty(obj, key, {
        get: function () {
            if (Dep.target) {
                console.log('建立依赖:', Dep.target);
                dep.addSub(Dep.target);
                Dep.target = null;
            }
            return val;
        },
        set: function (newValue) {
            //左值不能为obj[key],否则堆栈溢出
            val = newValue;
            //发布者发布消息，则事件对象通知
            dep.notify();
        }
    })
}

/**
 * 构造函数
 * */
function Vue(options) {
    this.data = options.data;
    proxyData(this,this.data);
    let dom = document.querySelector(options.el);
    dom.appendChild(nodeToFragment(dom, this))
}