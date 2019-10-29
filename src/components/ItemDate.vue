<template>
  <div class="date">
    <span>
      <span class="title-neccesarry" v-if="validator.required">*</span>
      {{text}}
    </span>
    <el-date-picker
      v-model="value"
      type="date"
      :placeholder="tips"
      onPick="onPick"
      :picker-options="pickerOptions"
      @change="change"
    ></el-date-picker>
  </div>
</template>
<script>
import { mapState, mapActions, mapMutations } from "vuex";
import { formatDate } from "@/utils/date.js";
export default {
  name: "itemDate",
  props: {
    text: String,
    column: String,
    tips: String,
    validator: {
      type: Object,
      default: function() {
        return {};
      }
    }
  },
  data() {
    return {
      value: '',
      pickerOptions: {
        // disabledDate(time) {
        //   return time.getTime() <Date.now()-3600*24*1000;
        // }
      }
    };
  },
  computed: {
    computedColumn() {
      return this.column.split(",");
    },
    ...mapState({
      ddd(state) {
        let key = this.computedColumn;
        let str = `state.form.form`;
        if (key.length > 1) {
          for (let i = 0; i < key.length; i++) {
            str += `["${key[i]}"]`;
          }
          // console.log(str);
          return eval(str);
        }
        return state.form.form[this.column].value;
      }
    })
  },
  methods: {
    ...mapMutations("form", ["changeFormData"]),
    change(value) {
      if (value) {
        value = formatDate(new Date(value));
      } else {
        value = "";
      }
      // console.log(value);
      // console.log(this.column);
      this.changeFormData({ key: this.computedColumn, value });
    }
  }
};
</script>
<style lang="less" scoped>
.date {
  display: flex;
  flex-direction: row;
  justify-content: space-between;
  align-items: center;
  padding: 0.5em;
  margin-bottom: 1em;
  background: #fff;
  .title-neccesarry {
    color: red;
    font-size: 1em;
  }
  span {
    width: 10em;
    text-align: left;
  }
  .el-date-editor {
    width: 17em;
  }
}
</style>