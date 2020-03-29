<template>
  <div id="app">
    <img alt="Vue logo" src="./assets/logo.png" v-bind="{id: 'a123'}" @click="onC">
    <transition
        appear
        appear-class="custom-appear-class"
        appear-active-class="custom-appear-active-class"
        name="fade"
    >
        <HelloWorld :msg="msg"/>
    </transition>
    <foo/>
  </div>
</template>

<script>
import HelloWorld from './components/HelloWorld.vue'
import foo from './components/foo'

export default {
  name: 'app',
  components: {
    HelloWorld,
    foo,
  },
  data() {
      return {
          msg: 'Welcome to Your Vue.js App',
      }
  },
  methods: {
      onC() {
          this.msg=Math.random()
      }
  }
}
</script>

<style>
#app {
  font-family: 'Avenir', Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #2c3e50;
  margin-top: 60px;
}
.custom-appear-class {
    opacity: 0;
}
.custom-appear-active-class {
    transition: 1s;
}
.fade-enter-active, .fade-leave-active {
    transition: opacity .5s;
}
.fade-enter, .fade-leave-to {
    opacity: 0;
}
</style>
