# vue-eventbus
特性：支持事件回调自动绑定组件this、支持组件销毁时自动取消事件绑定
## 使用

1. 安装

```shell
# use npm
npm install @lifuzhao100/vue-eventbus

# use yarn 
yarn add @lifuzhao100/vue-eventbus
```

2. 注册

```javascript
import Vue from 'vue'
import eventBus from '@lifuzhao100/vue-eventbus'

Vue.use(eventBus)
// or 指定全局属性名，默认$bus
Vue.use(eventBus, '$eventBus')
```

3. 使用

- 组件a

```html
<template>
    <button @click="handleClick">click me</button>
</template>
<script>
    export default {
        methods: {
            handleClick() {
                this.$bus.emit('event-name', 'are u ok ?')
            }
        }
    }
</script>
```

- 组件b

```html
<template>
    <p>{{message}}</p>
</template>
<script>
    export default {
        data() {
            return {
                message: 'default message'
            }
        },
        mounted() {
            this.$bus.on('event-name', function (message) {
                this.message = message
            })
        }
    }
</script>
```
> 在Vue组件内部使用时，无需关注事件回调的销毁，在组件销毁时会自动清除

## api
- $on   别名on
```typescript
function $on(event: string | Array<string>, fn: Function) : EventBus;
```
注册事件监听，event为Array时注册多个相同回调的事件监听
- $off  别名off
```typescript
function $off(event: string | Array<string>, fn: Function | undefined) : EventBus;
```
为 !fn === true时清空当前事件监听

- $once 别名once
```typescript
function $once(event: string | Array<string>, fn: Function | undefined) : EventBus;
```
执行第一次事件回调前会将当前回调移除(fn为Function时)或者清空(!fn === false时)

- $emit 别名emit
```typescript
function $emit(event: string, ...rest) : EventBus;
```
触发事件监听，将注册的同名事件的所有回调执行，参数为rest。(背后执行的是fn.apply(eventBus, rest))