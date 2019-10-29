<template>
  <div id="app">
    <router-view />
  </div>
</template>

<style lang="less">
* {
  margin: 0;
  padding: 0;
}
body,html{
  width: 100%;
  height: 100%;
  display: flex;
  justify-content: center;
  align-items: center;
}
ul,li{
  list-style: none;
}
#app {
  box-sizing: border-box;
  max-width: 1002px;
  font-family: "Avenir", Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #2c3e50;
  width: 100%;
  height: 100%;
  border: 1px solid #ccc;
}
</style>
