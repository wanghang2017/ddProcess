<template>
  <div class="item-input-container">
    <div class="item-input">
      <span>
        <span class="title-neccesarry" v-if="validator.required">*</span>
        {{text}}
      </span>
      <el-input :value="ddd" :disabled="disabled" :placeholder="tips" @input="change"></el-input>
    </div>
    <ItemBigRMB v-if="upper" :value="ddd+''" />
  </div>
</template>
<script>
import { mapState, mapActions, mapMutations } from "vuex";
import { arrayToStr } from "@/utils/utils.js";
import ItemBigRMB from "./ItemBigRMB.vue";
// import ItemTotal from "@/components/ItemTotal.vue";

export default {
  name: "itemInput",

  props: {
    text: String,
    disabled: Boolean,
    column: String,
    tips: String,
    upper: Boolean,
    validator: {
      type: Object,
      default: function() {
        return {};
      }
    }
  },
  data() {
    return {
      input: ""
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
        // console.log(state.form.form[this.column]);

        if (key.length > 1) {
          str += arrayToStr([...key, "value"]);
          // console.log(eval(str));
          return eval(str);
        }
        return state.form.form[this.column].value;
      }
    })
  },
  methods: {
    ...mapMutations("form", ["changeFormData"]),
    change(value) {
      // console.log(this.computedColumn);
      if (this.validator) {
        let { regExp } = this.validator;
        if (regExp) {
          let reg = new RegExp(regExp);
          // window.reg = reg;
          if (reg.test(value)) {
            this.changeFormData({ key: this.computedColumn, value });
            return;
          } else {
            return;
          }
        }
      }
      this.changeFormData({ key: this.computedColumn, value });
    }
  },
  components: {
    ItemBigRMB
  }
};
</script>

<style lang="less" scoped>
.item-input-container{
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