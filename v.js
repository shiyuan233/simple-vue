class V {
  constructor(options) {
    this.$options = options
    this.$data = options.data
    this.$el = options.el

    Object.keys(this.$data).forEach((key) => {
      this.observer(this.$data, key, this.$data[key])
    })
    this.proxy(this, this.$data)
    let node = document.querySelector(`#${this.$el}`)
    this.compiler(node)
  }

  compiler(node) {
    console.dir(node)
    const childNodes = node.childNodes
    if (childNodes) {
      childNodes.forEach((node) => {
        if (node.nodeType === 1) {
          // 元素
          if (node.childNodes) {
            this.compiler(node)
          }
        }
        if (node.nodeType === 3 && /\{\{(.*)}\}/.test(node.nodeValue)) {
          // 文本
          let key = RegExp.$1
          node.nodeValue = this.$data[key]
        }
      })
    }
  }

  // 添加监听代理
  observer(obj, key, val) {
    Object.defineProperty(obj, key, {
      get() {
        return val
      },
      set(newVal) {
        if (newVal !== val) {
          val = newVal
        }
      },
    })
  }
  // 代理到实例上
  proxy(vm, obj) {
    Object.keys(obj).forEach((key) => {
      this.observer(vm, key, obj[key])
    })
  }
}
