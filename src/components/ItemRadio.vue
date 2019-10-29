<template>
  <div class="item-Radio" @click="click">
    <span class="item-tag">
      <span class="title-neccesarry" v-if="validator.required">*</span>
      {{text}}
    </span>
    <span class="choose-content">{{showText.length>0?showText:tips}}</span>
    <div class="gray-marsk" v-show="showModal" @click="clickContent">
      <div class="marsk-content" @click.stop>
        <el-input v-model="inputValue" :placeholder="'请输入搜索内容'"></el-input>
        <div class="content-container">
          <el-radio-group :value="checkedValue" @input="changeRadio" @click="clickContent">
            <el-radio
              v-for="(item,index) in computedList"
              :label="item.value+''"
              :key="index"
            >{{item.text+''}}</el-radio>
          </el-radio-group>
        </div>
      </div>
    </div>
  </div>
</template>
<script>
import { mapState, mapActions, mapMutations } from "vuex";
import { arrayToStr } from "@/utils/utils.js";

export default {
  name: "itemRadio",
  created() {
    if (this.ddd) {
      let item = this.source.find(
        item => item[[this.selectAcceptValue]] == this.ddd
      );
      this.checkedValue = item.value + "";
      this.showText = item.text + "";
    }
    // console.log(this.source);
    // 存在联动关系
    if (this.cascader) {
      // 有api 的需要修改api
      if (this.cascader.api) {
        // 没有联动项 代表跟自己联动
        if (!this.cascader.items) {
          this.changeTemplate({
            cascader: this.cascader,
            key: this.computedColumn
          });
        }
      }
    }
  },
  // updated() {
  //   console.log(this.ddd);
  // },
  props: {
    text: String,
    column: String,
    tips: String,
    selectAcceptValue: String,
    validator: {
      type: Object,
      default: function() {
        return {};
      }
    },
    cascader: Object,
    source: Array
  },

  data() {
    return {
      showModal: false,
      radio2: "",
      inputValue: "",
      filterList: "",
      checkedValue: "",
      showText: ""
    };
  },
  computed: {
    computedList() {
      let source = this.source || [];
      if (source.length > 0) {
        return this.source.filter(item => {
          let text = item.text || "";
          text = text + "";
          return text.includes(this.inputValue);
        });
      } else {
        return [];
      }
    },
    computedColumn() {
      return this.column.split(",");
    },
    ...mapState({
      ddd(state) {
        let key = this.computedColumn;
        let str = `state.form.form`;
        // console.log(state.form.form[this.column].value);
        if (key.length > 1) {
          str += arrayToStr([...key, "value"]);
          // console.log(eval(str));
          return eval(str) + "";
        }
        return state.form.form[this.column].value;
      }
    })
  },
  methods: {
    ...mapActions("form", ["changeTemplate"]),
    ...mapMutations("form", [
      "changeFormData",
      "changeModalData",
      "changeFormDataCascader",
      "changeTempaleSpecial_first",
      "changeTempaleByOptions",
      "changeTempaleByOptionsBack"
    ]),
    click(e) {
      let source = this.source || [];
      // console.log(source,this.text);
      if (source.length <= 0 && this.text === "项目ID") {
        e.stopPropagation();
        this.changeModalData({ showModal: true, content: "请先选择客户" });
        return;
      }
      this.showModal = true;
    },
    changeRadio(value) {
      let item = this.source.find(item => item.value == value);
      this.checkedValue = item.value + "";
      this.showText = item.text + "";

      // console.log(item);
      // 如果上一个选项存在联动
      if (this.beforeItem) {
        let before = this.beforeItem;
        this.changeTempaleByOptionsBack({
          cascader_fields: before.extraNo1
        });
        // 将上一个选项联动清空
        this.beforeItem = null;
      }

      // 如果当前选项存在联动
      if (item.extraNo1) {
        let before = null;
        this.changeTempaleByOptions({
          cascader_fields: item.extraNo1
        });
        // 记录下当前联动 作为下一次的上一个联动
        this.beforeItem = item;
      }
      // 存在联动关系
      if (this.cascader) {
        // 有api 的需要修改api
        if (this.cascader.api && this.cascader.items) {
          // 有api 并且 有items  访问api 获取模板  并修改source
          this.changeTemplate({ value: item.value, cascader: this.cascader });
        } else if (!this.cascader.api && this.cascader.items) {
          // 没有api 但是有items 的 对象 字符串{} ，直接取值赋值
          // 没有api的直接取值 赋值
          let { items } = this.cascader;
          if (typeof items == "string") {
            items = JSON.parse(items);
          }
          this.changeFormDataCascader({
            key: [...this.computedColumn],
            cascader: items,
            value: item
          });
        }
      }
      // 存在联动2  根据选项联动
      if (item.defaultCascaderAcceptValue) {
        let items = item.defaultCascaderAcceptValue;
        // console.log(items,this.computedColumn);
        if (typeof items == "string") {
          items = JSON.parse(items);
        }
        this.changeFormDataCascader({
          key: [...this.computedColumn],
          cascader: items,
          value: item
        });
      }

      // 当时是否首次合作时， 会影响到模板
      if (this.text === "是否首次合作") {
        let isFirst = true;
        if (value == "否") {
          isFirst = false;
        }
        this.changeTempaleSpecial_first({ isFirst });
      }
      if (this.text === "项目ID") {
        // console.log(item,this.selectAcceptValue);

        this.changeFormData({
          key: this.computedColumn,
          value: item[this.selectAcceptValue]
        });
      } else {
        this.changeFormData({
          key: this.computedColumn,
          value: item[this.selectAcceptValue]
        });
      }
      // console.log(item);
      this.showModal = false;
      this.inputValue = "";
    },
    clickContent(e) {
      e = e || window.event;
      if (e.stopPropagation) {
        e.stopPropagation();
      } else {
        e.cancelBubble = true;
      }
      this.showModal = false;
      this.inputValue = "";
    },
    handleInput(value) {
      this.inputValue = value;
      // console.log(e);
    }
  }
};
</script>

<style lang="less" scoped>
.item-Radio {
  cursor: pointer;
  display: flex;
  flex-direction: row;
  justify-content: space-between;
  align-items: center;
  padding: 0.5em;
  background: #fff;
  .title-neccesarry {
    color: red;
    font-size: 1em;
  }
  span {
    // width: 10em;
    text-align: left;
  }
  .item-tag {
    flex-basis: 35%;
  }
  .choose-content {
    flex-basis: 65%;
    padding-right: 20px;
    position: relative;
    text-align: right;
  }
  .choose-content:after {
    content: "";
    right: 0;
    top: 5px;
    position: absolute;
    width: 10px;
    height: 10px;
    transform: rotate(45deg);
    border-top: 1px solid #aaa;
    border-right: 1px solid #aaa;
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
  // display: flex;
  // justify-content: center;
  // align-items: center;
  box-sizing: border-box;
  // padding: 1em;
  .marsk-content {
    margin: auto;
    margin-top: 10em;
    max-width: 500px;
    width: 80%;
    // min-width: 50%;

    background: #fff;
    padding: 1em 1em 0 1em;
    .el-input {
      margin-bottom: 1em;
    }
    .content-container {
      max-height: 18em;
      overflow-y: scroll;
    }
    .el-radio {
      display: inline-block;
      text-overflow: ellipsis;
      overflow: hidden;
      // overflow-y: hidden
      // max-width: 20em;
    }
  }
}
.el-radio-group {
  display: flex;
  flex-direction: column;
  // justify-content: flex-start;
  label {
    text-align: left;
    margin-bottom: 1em;
  }
}
</style>