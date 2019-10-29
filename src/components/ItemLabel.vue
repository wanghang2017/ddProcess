<template>
  <div class="item-input-container">
    <div class="item-input">
      <span>
        <span class="title-neccesarry" v-if="validator.required">*</span>
        {{text}}
      </span>
      <el-input :value="ddd" :disabled="true" :placeholder="tips"></el-input>
    </div>
    <ItemBigRMB v-if="upper" :value="ddd+''" />
  </div>
</template>
<script>
import { mapState, mapActions, mapMutations } from "vuex";
import ItemBigRMB from "./ItemBigRMB.vue";

// import { formatDate } from "@/utils/date.js";
import { arrayToStr } from "@/utils/utils.js";
export default {
  name: "ietmLabel",
  props: {
    text: String,
    column: String,
    tips: String,
    upper: Boolean,
    validator: {
      type: Object,
      default: function() {
        return {};
      }
    },
    operator: Object
  },
  computed: {
    computedColumn() {
      return this.column.split(",");
    },
    ...mapState({
      ddd(state) {
        let key = [...this.computedColumn];
        let field = this.operator.field;
        const baseStr = `state.form.form`;
        let parent = null;
        // console.log(key);
        if (key.length > 1) {
          key.pop();
          let str = baseStr + arrayToStr(key);
          //   console.log(str);
          parent = eval(str);
        } else {
          parent = state.form.form;
        }
        let value = (parent
          .filter(item => field.indexOf(item.name) != -1)
          .reduce((prev, next) => prev + parseFloat(next.value || "0"), 0)).toFixed(2);
        // console.log(this.computedColumn);
        this.changeFormData({ key: this.computedColumn, value });
        return value;
      }
    })
  },
  methods: {
    ...mapMutations("form", ["changeFormData"])
  },
  components: {
    ItemBigRMB
  }
};
</script>

<style lang="less" scoped>
.item-input-container {
  display: flex;
  flex-direction: column;
}
.item-input {
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
    width: 10em;
    text-align: left;
  }
  div {
    width: 17em;
  }
}
</style>