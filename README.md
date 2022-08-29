# simple-vue
简单实现vue
  - 为传入的data属性设置代理（get/set监听）
  - 最外部的实例拥有传入的data所有属性
  - 拥有一个模板编译器 根据特定的插值符号将对应的值动态插入模板中 并生成html
  - 拥有watcher 观察者 对模板中声明的每一次变量进行观察监听 内部包含一个update函数用来更新视图
  - 拥有Dep 依赖 用来管理watchers 一个属性会生成一个Dep 最后再调用watchers 实现视图更新
