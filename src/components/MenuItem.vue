<template>
  <span class="menu-item" @click="handleClick">
    <img src alt  :style="{ background: item.background}"/>
    <span>{{item.title}}</span>
  </span>
</template>
<script>
export default {
  name: "MenuItem",
  props: {
    item: Object
  },
  data: function() {
    return {
      title: ""
    };
  },
  methods:{
    handleClick(){
      // console.log(this.item.value);
      this.$router.push(`/about?flowTypeId=${this.item.value}&name=${this.item.title}`);
    }
  }
};
</script>
<style lang="less">
.menu-item {
  cursor: pointer;
  width: 5.2em;
  box-sizing: border-box;
  padding: .2em;
  display: flex;
  flex-direction: column;
  align-items: center;
  img {
    display: inline-block;
    width: 3em;
    height: 3em;
    border-radius: 3px;
    // background: blue;
  }
  span {
    display: inline-block;
    margin-top: 1em;
    font-size: .8em;
  }
}
</style>
