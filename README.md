# simple-vue

简单实现 vue mvvm 实现数据驱动功能

- 为传入的 data 属性设置代理（get/set 监听）
- 最外部的实例拥有传入的 data 所有属性
- 拥有一个模板编译器 根据特定的插值符号将对应的值动态插入模板中 并生成 html
- 拥有 watcher 观察者 对模板中声明的每一次变量进行观察监听 内部包含一个 update 函数用来更新视图
- 拥有 Dep 依赖 用来管理 watchers 一个属性会生成一个 Dep 最后再调用 watchers 实现视图更新

#### 思考点

    个人觉得 在实例化watcher 、绑定watcher和Dep关系时比较难于理解 还需要再琢磨琢磨
    1. watcher 实例化
      是需要页面上使用一次属性 就要绑定一次 所以适合在模板渲染函数中进行绑定 那么在模板编译类中的updater函数中 再合适不过了
      例如页面上使用了 两次counter 虽然是同一个属性 但是会生成两个watcher去监听他
    2. watcher和dep关系绑定
      当watcher被实例化之后 需要主动把自己设置到Dep类中的一个属性里 然后主动调用传进watcher的属性，这样就能主动触发get钩子，此时在get钩子里再去判断是否添加到dep实例中 这样下来最终页面上使用了几个属性就会有几个watcher 并且能进入相应的dep实例中

      最终在set钩子中 只要数值一被改变  只会有对应的dep实例调用通知方法更新视图


      而且dep在observ中是不会销毁的 闭包 所以能实现保留之前的watcher 相同的一个属性 进入同一个dep

#### todo 
实现事件监听处理（@xxx形式即可）done
双绑（v-model）done