//一个发布者
var pub = {
    publish: function () {
        dep.notify();
    }
};
//多个订阅者
var sub1 = {
    update: function () {
        console.log(1)
    },
    register: function () {
        dep.addSub(this)
    }
};
var sub2 = {
    update: function () {
        console.log(2)
    },
    register: function () {
        dep.addSub(this)
    }
};
//一个主题对象
var dep = {
    subs: [],
    addSub: function (sub) {
        this.subs.push(sub)
    },
    notify: function () {
        this.subs.forEach(sub => {
            sub.update();
        })
    }
};
//订阅者注册
sub1.register();
sub2.register();
pub.publish();
//结果:
// 1
// 2
