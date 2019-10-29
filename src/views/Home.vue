<template>
  <div class="home" @scroll.stop>
    <div class="container">
      <MenuContainer v-for="(menu,index) in menus" :menu="menu" :key="index" />
    </div>

    <div class="about-submit">
      <p @click="handleClick">退出登陆</p>
    </div>

    <div class="gray-marsk" v-show="showModal">
      <div class="marsk-content" @click.stop>
        <p>{{content}}</p>
        <div>
          <span @click="clickContent" class="ok">确认</span>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
// @ is an alias to /src
import Nav from "@/components/Nav.vue";
import MenuContainer from "@/components/MenuContainer.vue";
import { menu } from "@/data/data.js";
import { mapState, mapActions, mapMutations } from "vuex";
// import {logout} from "@/api/login.js";
export default {
  name: "home",
  beforeDestroy() {
    this.changeModalData({ showModal: false, content: "" });
  },
  created() {
    // this.init({ cuid: localStorage.getItem("userId") });
    if (this.menus.length <= 0) {
      this.init({ cuid: localStorage.getItem("userId") });
    }
  },
  data: function() {
    return {};
  },
  computed: {
    ...mapState({
      userInfo: state => state.login.userInfo,
      menus: state => state.home.menu,
      showModal: state => state.form.showModal,
      content: state => state.form.content
    })
  },
  methods: {
    ...mapMutations("login", ["changeModalData"]),
    ...mapActions("home", ["init"]),
    ...mapActions("login", ["logout"]),
    handleClick() {
      // console.log("xxx");
      this.logout({ userId: localStorage.getItem("userId") }).then(() => {
        if (!this.userInfo) {
          localStorage.clear();
          this.$router.push("/login");
        }
      });
    },
    clickContent(e) {
      e = e || window.event;
      if (e.stopPropagation) {
        e.stopPropagation();
      } else {
        e.cancelBubble = true;
      }
      this.changeModalData({ showModal: false, content: "" });
    }
  },
  components: {
    Nav,
    MenuContainer
  }
};
</script>
<style lang="less" scoped>
.home {
  width: 100%;
  height: 100%;
  background: #eee;
  overflow: scroll;
  // padding-bottom: 4em;
  .container {
    padding-bottom: 4em;
  }
  .about-submit {
    max-width: 1000px;
    background: #fff;
    bottom: 0;
    // left: 0;
    position: fixed;
    height: 4em;
    width: 100%;
    z-index: 999;
    padding: 0.5em;
    box-sizing: border-box;
    display: flex;
    justify-content: center;
    align-items: center;
    p {
      max-width: 500px;
      border-radius: 3px;
      display: flex;
      justify-content: center;
      align-items: center;
      width: 100%;
      height: 100%;
      background: #409eff;
      color: #fff;
      cursor: pointer;
    }
  }

  .gray-marsk {
    position: fixed;
    z-index: 1000;
    top: 0;
    left: 0;
    width: 100vw;
    height: 100vh;
    background: rgba(0, 0, 0, 0.3);
    display: flex;
    justify-content: center;
    align-items: center;
    box-sizing: border-box;
    // padding: 1em;
    .marsk-content {
      max-width: 500px;
      width: 50%;
      background: #fff;
      padding: 1em;
    }
    .ok {
      background: #409eff;
      border-radius: 3px;
      width: 4em;
      display: inline-block;
      margin-top: 1em;
    }
  }
}
</style>
