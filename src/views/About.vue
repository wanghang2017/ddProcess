<template>
  <div class="about" @scroll.stop>
    <div class="about-title">
      <span class="title-back" @click="handleBack">返回</span>
      <span class="title-text">{{title}}</span>
    </div>
    <div class="about-submit">
      <p @click="handleSubmit">提交</p>
    </div>
    <ul class="content-container">
      <!-- <ItemDate tagName="申请日期" />
      <ItemInput tagName="垫款充值单号" />
      <ItemRadio tagName="付款方式" />-->

      <div v-for="(item,index) in template" :key="index" class="content-item">
        <ItemInput
          v-if="item.type==='input'"
          :text="item.text"
          :upper="item.upper"
          :column="index+''"
          :tips="item.tips"
          :validator="item.validator||{}"
        />
        <ItemLabel
          v-if="item.type==='label'"
          :text="item.text"
          :column="index+''"
          :tips="item.tips"
          :upper="item.upper"
          :validator="item.validator||{}"
          :disabled="true"
          :operator="item.operator"
        />
        <ItemRadio
          v-if="item.type==='select' && !item.multipleChoice"
          :text="item.text"
          :column="index+''"
          :tips="item.tips"
          :selectAcceptValue="item.selectAcceptValue||'text'"
          :validator="item.validator||{}"
          :source="item.source"
          :cascader="item.cascader"
        />
        <ItemCheckBox
          v-if="item.type==='select' && item.multipleChoice"
          :text="item.text"
          :column="index+''"
          :tips="item.tips"
          :validator="item.validator||{}"
          :source="item.source"
          :cascader="item.cascader"
        />
        <ItemDate
          v-if="item.type==='date'"
          :text="item.text"
          :column="index+''"
          :tips="item.tips"
          :validator="item.validator||{}"
        />
        <ItemList
          v-if="item.type==='detail'"
          :text="item.text"
          :column="index+''"
          :tips="item.tips"
          :validator="item.validator||{}"
          :details="item.details"
        />
        <ItemUpload
          v-if="item.type==='image'"
          :text="item.text"
          :column="index+''"
          :tips="item.tips"
          :validator="item.validator||{}"
        />
        <ItemUploadFile
          v-if="item.type==='file'"
          :text="item.text"
          :column="index+''"
          :tips="item.tips"
          :validator="item.validator||{}"
        />
      </div>
    </ul>

    <div class="gray-marsk" v-show="showModal">
      <div class="marsk-content" @click.stop>
        <p>{{content}}</p>
        <div>
          <span @click="clickContent" class="ok">确认</span>
        </div>
      </div>
    </div>
    <div class="gray-marsk" v-show="showTips">
      <div class="marsk-content" @click.stop>
        <p>{{contentTips}}</p>
      </div>
    </div>
    <div class="gray-marsk" v-show="showTipsSuccess">
      <div class="marsk-content" @click.stop>
        <p>提交成功</p>
        <div>
          <span @click="clickGo" class="ok">确认</span>
        </div>
      </div>
    </div>
  </div>
</template>
<script>
// @ is an alias to /src
// import Nav from "@/components/Nav.vue";
import { mapState, mapActions, mapMutations } from "vuex";
import { submit } from "@/api/form";
import { Loading } from "element-ui";
import ItemDate from "@/components/ItemDate.vue";
import ItemInput from "@/components/ItemInput.vue";
import ItemRadio from "@/components/ItemRadio.vue";
import ItemCheckBox from "@/components/ItemCheckBox.vue";
import ItemList from "@/components/ItemList.vue";
import ItemUpload from "@/components/ItemUpload.vue";
import ItemLabel from "@/components/ItemLabel.vue";
import ItemUploadFile from "@/components/ItemUploadFile.vue";

let submitDisabled = false;
export default {
  name: "about",
  created() {
    let flowTypeId = this.$router.history.current.query.flowTypeId;
    let title = this.$router.history.current.query.name;
    let userId = localStorage.getItem("userId");
    this.flowTypeId = flowTypeId;
    this.userId = userId;
    this.title = title;
    this.showTips = true;
    this.contentTips = "模板加载中...";

    this.initAll({ flowTypeId, cuid: userId }).then(()=>{
      this.showTips = false;
    });
    // this.initAll({ flowTypeId:4 , cuid: "101277" });
  },
  beforeDestroy() {
    this.changeModalData({ showModal: false, content: "" });
  },

  methods: {
    ...mapActions("form", ["initAll"]),
    ...mapMutations("form", ["initForm", "changeModalData", "checkForm","initClean"]),
    handleBack() {
      // this.$router.go(-1);
      this.initClean();
      this.$router.push("/");
    },
    async handleSubmit() {
      // console.log(submitDisabled);
      if (submitDisabled) return;
      this.checkForm();
      // console.log(this.ok);
      if (this.ok) {
        let form = this.form;
        let ary = [];
        for (let i = 0; i < form.length; i++) {
          let obj = {};
          let cur = form[i];
          obj.elementType = cur.elementType;
          obj.name = cur.name;
          obj.type = cur.type;

          if (cur.type == "JSON") {
            obj.value = JSON.stringify(cur.value).replace(
              new RegExp(',"required":true', "g"),
              ""
            );
          } else {
            obj.value = cur.value;
          }
          if (cur.splitId) {
            obj.value = obj.value.replace(/\((\d+)\)/, (...arg) => arg[1]);
          }
          if (cur.elementType == "image" || cur.elementType == "file") {
            obj.value = JSON.stringify(cur.value);
          }
          ary.push(obj);
        }
        submitDisabled = true;
        this.showTips = true;
        this.contentTips = "提交中,请稍后...";
        try {
          // let response = await submit({list:ary,flowTypeId:this.flowTypeId},this.flowTypeId,101277);
          let response = await submit(
            { list: ary, flowTypeId: this.flowTypeId },
            this.flowTypeId,
            this.userId
          );
          this.showTips = false;
          this.contentTips = "";
          submitDisabled = false;
          let { code, data, message } = response;
          if (code == 0) {
            this.showTipsSuccess = true;
          } else {
            this.changeModalData({ showModal: true, content: message });
          }
        } catch (e) {
          this.showTips = false;
          this.contentTips = "";
          submitDisabled = false;
          console.log(e);
        }
      }
    },
    clickGo() {
      this.showTipsSuccess = false;
      this.initClean();
      this.$router.push("/");
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
  computed: {
    ...mapState({
      form: state => state.form.form,
      template: state => state.form.template,
      showModal: state => state.form.showModal,
      content: state => state.form.content,
      ok: state => state.form.formOk
    })
  },
  data() {
    return {
      title: "",
      contentTips: "",
      showTips: false,
      showTipsSuccess: false
    };
  },
  components: {
    ItemDate,
    ItemInput,
    ItemRadio,
    ItemCheckBox,
    ItemList,
    ItemUpload,
    ItemLabel,
    ItemUploadFile
  }
};
</script>

<style lang="less" scoped>
.about {
  width: 100%;
  height: 100%;
  overflow: scroll;
  background: #f1f1f1;
  overflow: scroll;
  padding: 1em 0;
  box-sizing: border-box;
  .about-title {
    max-width: 1000px;
    display: flex;
    justify-content: center;
    align-items: center;
    background: #fff;
    top: 0;
    // left: 0;
    position: fixed;
    height: 3em;
    width: 100%;
    z-index: 999;
    padding: 0.5em;
    box-sizing: border-box;
    .title-back {
      position: absolute;
      left: 0;
      color: #409eff;
      padding: 0 1.2em;
      cursor: pointer;
    }
    .title-text {
      width: 15em;
      overflow: hidden;
      white-space: nowrap;
      text-overflow: ellipsis;
    }
    .title-back::before {
      content: "";
      left: 0.5em;
      top: 5px;
      position: absolute;
      width: 10px;
      height: 10px;
      transform: rotate(45deg);
      border-bottom: 1px solid #409eff;
      border-left: 1px solid #409eff;
    }
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

  .content-container {
    padding: 3em 0 4em 0;
  }
  .content-item {
    margin-bottom: 1em;
    background: #fff;
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