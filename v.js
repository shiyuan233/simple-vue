class V {
  constructor(options) {
    this.$options = options
    this.$data = options.data
    this.$el = options.el

    // 增加data属性的get/set
    new Observer(this, this.$data)
    // 模板编译
    new Compiler(this.$el, this)
  }
}


class Observer {
  constructor(vm, data) {
    this.vm = vm
    this.data = data
    Object.keys(this.data).forEach((key) => {
      this.observe(this.data, key, this.data[key])
    })
    this.proxy(vm, this.data)
  }

  // 添加监听代理
  observe(obj, key, val) {
    const dep = new Dep()
    Object.defineProperty(obj, key, {
      get() {
        Dep.target && dep.add(Dep.target)
        return val
      },
      set(newVal) {
        if (newVal !== val) {
          val = newVal
          // 重新更新方法 通知
          dep.notify()
        }
      },
    })
  }
  // 代理到实例上
  proxy(vm, obj) {
    Object.keys(obj).forEach((key) => {
      this.observe(vm, key, obj[key])
    })
  }
}

// 编译类
class Compiler {
  constructor(el, vm) {
    this.$el = document.querySelector(el)
    this.$vm = vm
    this.compiler(this.$el)
  }
  compiler(node) {
    const childNodes = node.childNodes
    if (childNodes) {
      childNodes.forEach((node) => {
        if (node.nodeType === 1) {
          // 元素
          Array.from(node.attributes).forEach((attr) => {
            const attrName = attr.name
            const exp = attr.value
            if (attrName.startsWith('v-')) {
              const dir = attrName.slice(2)
              this.updater(node, dir, exp)
            }
          })
          if (node.childNodes) {
            this.compiler(node)
          }
        }
        if (node.nodeType === 3 && /\{\{(.*)}\}/.test(node.textContent)) {
          // 文本
          let key = RegExp.$1
          this.updater(node, 'text', key)
        }
      })
    }
  }

  // 更新dom
  updater(node, dir, exp) {
    // 初始化
    this[dir] && this[dir](node, this.$vm[exp])
    // 更新
    let that = this
    new Watcher(this.$vm, exp, function (val) {
      that[dir] && that[dir](node, val)
    })
  }

  // 文本类型
  text(node, value) {
    node.textContent = value
  }
}

// 页面上每展示一个属性 就得有一个watcher  标配小秘书 用一次就一个  
// 观察者类
class Watcher {
  constructor(vm, key, updateFn) {
    this.vm = vm
    this.key = key
    this.updateFn = updateFn
    Dep.target = this
    this.vm[this.key]
    Dep.target = null
  }
  // 更新
  update() {
    this.updateFn.call(this.vm, this.vm[this.key])
  }
}

// 依赖类
// 管理观察者 一个属性一个收集依赖类  里面可能会有一个或多个观察者  可能是同一个属性的
// [watcher1,watcher2,watcher3] watcher1 watcher2 可能都是counter的观察者
class Dep {
  constructor() {
    this.deps = []
  }

  // 添加
  add(dep) {
    this.deps.push(dep)
  }

  // 通知
  notify() {
    this.deps.forEach((dep) => dep.update())
  }
}
