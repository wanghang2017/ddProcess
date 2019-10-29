<template>
  <div class="item-input">
    <span class="item-span">大写</span>
    <span class="item-content">{{newValue}}</span>
  </div>
</template>
<script>
import { mapState, mapActions, mapMutations } from "vuex";
import { arrayToStr } from "@/utils/utils.js";

export default {
  name: "itemBigRMB",
  props: {
    value: String
  },
  data() {
    return {
      input: ""
    };
  },
  computed: {
    newValue() {
      let value = this.value;
      if (!value) {
        return "";
      }
      return parseFloat(value).numToChinese();
    }
  }
};
</script>

<style lang="less" scoped>
.item-input {
  display: flex;
  flex-direction: row;
  justify-content: space-between;
  align-items: center;
  padding: 0.5em;
  background: #fff;
  font-size: 0.8em;
  .item-span {
    width: 10em;
    color: #ccc;
    text-align: left;
  }
  .item-content {
    width: 100%;
    color: #ccc;
    // text-align: left;
    text-overflow: ellipsis;
    overflow: hidden;
    white-space: nowrap;
    text-align: right;
  }
  .title-neccesarry {
    color: red;
    font-size: 1em;
  }
  div {
    width: 17em;
  }
}
</style>