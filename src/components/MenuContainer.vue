<template>
  <div class="menu-list">
    <div class="menu-title">
      <span class="left">{{menu.title}}</span>
      <span class="right" v-on:click="handleClick">{{isOpen?"收起":"展开"}}</span>
    </div>
    <div class="menu-content" v-show="isOpen">
      <MenuItem v-for="(item,index) in menu.children" v-bind:item="item" :key="index" />
    </div>
  </div>
</template>
<script>
import MenuItem from "@/components/MenuItem.vue";
export default {
  name: "MenuContainer",
  props: {
    menu: Object
  },
  components: {
    MenuItem
  },
  created: function() {
    // console.log(this.menu);
  },
  data: function() {
    return {
      isOpen: true
    };
  },
  methods: {
    handleClick: function() {
      this.isOpen = !this.isOpen;
    }
  }
};
</script>
<style lang="less">
.menu-list {
  background: #ffffff;
  margin-bottom: 1em;
  display: flex;
  flex-direction: column;
  color: #777;
  .menu-title {
    width: 100%;
    box-sizing: border-box;
    display: flex;
    flex-direction: row;
    justify-content: space-between;
    padding: 0.5em 0.5em 1em 0.5em;
    .left {
      // font-weight: normal;
      color: #000;
    }
    .right {
      // color: #aaaaaa;
      cursor: pointer;
      -webkit-touch-callout: none;
      -webkit-user-select: none;
      -khtml-user-select: none;
      -moz-user-select: none;
      -ms-user-select: none;
      user-select: none;
    }
  }
  .menu-content {
    padding: 1em 0.5em 1em 0.5em;
    display: flex;
    flex-direction: row;
    flex-wrap: wrap;
  }
}
</style>
