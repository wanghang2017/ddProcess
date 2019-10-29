<template>
  <div class="item-Radio" @click="click">
    <span class="item-tag">
      <span class="title-neccesarry" v-if="validator.required">*</span>
      {{text}}
    </span>
    <span class="choose-content">{{origValue.length>0?"已选中"+origValue.length+"条":tips}}</span>
    <div class="gray-marsk" v-show="showModal" @click.stop="clickContent">
      <div class="marsk-content" @click.stop>
        <el-input v-model="inputValue" :placeholder="'请输入搜索内容'"></el-input>
        <div class="content-container">
          <el-checkbox-group
            v-model="checkedValue"
            @change="changeRadio"
            v-if="computedList.length>0"
          >
            <el-checkbox
              v-for="(item,index) in computedList"
              :label="item.value+''"
              :key="index"
            >{{item.text+''}}</el-checkbox>
          </el-checkbox-group>
          <span v-else>暂无数据</span>
        </div>
        <div class="mask-footer">
          <button class="okBtn" @click.stop="clickContent">取消</button>
          <button class="okBtn" @click.stop="clickOk">确认</button>
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
      inputValue: "",
      checkedValue: [],
      origValue: []
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
    }
  },
  methods: {
    ...mapActions("form", ["changeTemplate"]),
    ...mapMutations("form", [
      "changeFormData",
      "changeModalData",
      "changeFormDataCascader"
    ]),
    click(e) {
      // e.stopPropagation();
      // let source = this.source || [];
      // console.log(source,this.text);
      this.showModal = true;
    },
    clickOk() {
      this.changeFormData({
        key: this.computedColumn,
        value: JSON.stringify(this.checkedValue)
      });
      this.showModal = false;
      this.inputValue = "";
      this.origValue = [...this.checkedValue];
    },
    changeRadio(value) {
      this.checkedValue = value;
      // console.log(item);
    },
    clickContent() {
      this.showModal = false;
      this.inputValue = "";
      this.checkedValue = [...this.origValue];
    }
  }
};
</script>
<style lang="less">
.content-container {
  .el-checkbox {
    .el-checkbox__label {
      white-space: nowrap;
    }
  }
}
</style>
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
  .mask-footer {
    display: flex;
    flex-direction: row;
    justify-content: space-between;
  }
  .okBtn {
    margin: 1em 0;
    background: #409eff;
    border: none;
    outline: none;
    width: 8em;
    height: 2em;
    border-radius: 3px;
    color: #fff;
  }
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
      border: 1px solid #ccc;
      padding: 0.5em;
      max-height: 18em;
      overflow: scroll;
      // .el-checkbox {
      //   .el-checkbox__label {
      //     text-overflow: ellipsis;
      //     overflow-x: hidden;
      //     width: 85%;
      //     white-space: nowrap;
      //   }
      // }
    }
  }
}
.el-checkbox-group {
  display: flex;
  flex-direction: column;
  // justify-content: flex-start;
  label {
    text-align: left;
    margin-bottom: 1em;
  }
}
</style>