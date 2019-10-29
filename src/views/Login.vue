<template>
  <div class="login">
    <ul class="login-container">
      <li>
        <span>用户名</span>
        <input type="text" v-model="username" />
      </li>
      <li>
        <span>密码</span>
        <input type="password" v-model="password" />
      </li>
      <li>
        <button class="login-btn" v-on:click="handleClick">登陆</button>
      </li>
    </ul>
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
import { mapState, mapActions, mapMutations } from "vuex";

export default {
  name: "login",
  beforeDestroy() {
    this.changeModalData({ showModal: false, content: "" });
  },
  data: function() {
    return {
      username: "",
      password: ""
    };
  },
  computed: {
    ...mapState({
      showModal: state => state.login.showModal,
      content: state => state.login.content,
      userInfo: state => state.login.userInfo,
    })
  },
  methods: {
    ...mapMutations("login", ["changeModalData"]),
    ...mapActions("login", ["login"]),
    handleClick() {
      // console.log("xxx");
      this.login({ username: this.username, password: this.password }).then(()=>{
        if(this.userInfo){
          // console.log(this.userInfo);
          let {displayName,userId} = this.userInfo;
          localStorage.setItem("userId",userId);
          localStorage.setItem("displayName",displayName);
          this.$router.push("/");
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
  }
};
</script>


<style lang="less" scoped>
.login {
  width: 100%;
  //   padding-top:20%;
  height: 100%;
  display: flex;
  justify-content: center;
  align-items: center;
  .login-container {
    width: 100%;
    height: 50%;
    display: flex;
    flex-direction: column;
    input {
      // text-align: center;
      padding-left: 5px;
      font-size: 1em;
      outline: none;
      border: none;
      border-bottom: 1px solid #ccc;
    }
    li {
      margin-top: 1em;
      span {
        display: inline-block;
        width: 4em;
        margin-right: 0.5em;
        font-size: 1em;
        text-align: left;
      }
    }
    button {
      cursor: pointer;
      outline: none;
      width: 10em;
      background: #1890ff;
      border: #1890ff;
      color: #fff;
      text-shadow: 0 -1px 0 rgba(0, 0, 0, 0.12);
      -webkit-box-shadow: 0 2px 0 rgba(0, 0, 0, 0.045);
      box-shadow: 0 2px 0 rgba(0, 0, 0, 0.045);
    }
    .login-btn {
      margin-top: 1em;
      border-radius: 5px;
      height: 2em;
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
