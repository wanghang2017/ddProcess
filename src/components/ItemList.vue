<template>
  <div class="item-list">
    <div v-for="(item,index) in details" :key="1+'-'+index+Date.now()">
      <p class="list-title">
        <span>
          <span class="title-neccesarry" v-if="validator.required">*</span>
          {{text}}({{index+1}})
        </span>
        <span v-if="details.length>1" @click="remove(index)" class="list-remove">删除</span>
      </p>
      <div v-for="(item,index2) in item" :key="index2" class="list-item">
        <ItemInput
          v-if="item.type==='input'"
          :text="item.text"
          :upper="item.upper"
          :column="column+',value,'+index+','+index2"
          :tips="item.tips"
          :validator="item.validator||{}"
        />
        <ItemRadio
          v-if="item.type==='select'"
          :text="item.text"
          :upper="item.upper"
          :column="column+',value,'+index+','+index2"
          :tips="item.tips"
          :selectAcceptValue ="item.selectAcceptValue||'text'"
          :validator="item.validator||{}"
          :source="item.source"
          :cascader="item.cascader"
        />
        <ItemDate
          v-if="item.type==='date'"
          :text="item.text"
          :column="column+',value,'+index+','+index2"
          :tips="item.tips"
          :validator="item.validator||{}"
        />
        <ItemLabel
          v-if="item.type==='label'"
          :upper="item.upper"
          :text="item.text"
          :column="column+',value,'+index+','+index2"
          :tips="item.tips"
          :validator="item.validator||{}"
          :disabled="true"
          :operator="item.operator"
        />
      </div>
    </div>
    <div @click="add" class="list-add">+ {{text}}</div>
    <div class="list-total">
      <div v-for="(item,index) in totalList" :key="'total-'+index">
        <ItemTotal
          :text="item.text"
          :column="column+',total,'+index"
        />
      </div>
      <!-- <div>
        总收款金额(元):
        <span>100</span>
      </div>
      <div>
        总返点金额(元):
        <span>100</span>
      </div>
      <div>
        总充值金额(元):
        <span>100</span>
      </div>
      <div>大写:零元整</div>-->
    </div>
  </div>
</template>
<script>
import { mapState, mapActions, mapMutations } from "vuex";
import ItemDate from "@/components/ItemDate.vue";
import ItemInput from "@/components/ItemInput.vue";
import ItemRadio from "@/components/ItemRadio.vue";
import ItemLabel from "@/components/ItemLabel.vue";
import ItemTotal from "@/components/ItemTotal.vue";

export default {
  name: "itemList",
  created() {
    // console.log(this.details);
  },
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
    details: Array
  },
  components: {
    ItemDate,
    ItemInput,
    ItemRadio,
    ItemLabel,
    ItemTotal
  },
  computed: {
    totalList() {
      // console.log(this.details[0]);
      return this.details[0].filter(item => item.crossAdd||item.collectAdd);
    }
  },
  data() {
    return {
      input: ""
    };
  },
  methods: {
    // ...mapActions("form", [""]),
    ...mapMutations("form", ["addItem", "removeItem"]),
    add() {
      this.addItem({ key: this.column });
    },
    remove(index) {
      this.removeItem({ key: this.column, index });
    }
  }
};
</script>

<style lang="less" scoped>
.item-list {
  display: flex;
  flex-direction: column;
  background: #fff;
  .list-total {
    padding: 0.5em 0;
    background: #f1f1f1;
    font-size: 0.8em;
    color: #aaa;
    div {
      display: block;
      text-align: left;
      padding: 0 0.5em;
      span {
        color: #000;
      }
      // display: flex;
      // flex-direction: row;
    }
  }
  .list-title {
    // margin-top: .5em;
    display: flex;
    flex-direction: row;
    justify-content: space-between;
    padding: 0.5em 0.5em 0.5em 0.5em;
    background: #f1f1f1;
    font-size: 0.8em;
    .title-neccesarry {
      color: red;
      font-size: 1em;
    }
  }
  .list-item {
    border-bottom: 1px solid #eee;
  }
  .list-add {
    padding: 0.5em 0;
    color: #409eff;
  }
  .list-remove {
    // padding: 0.5em 0;
    color: #409eff;
  }
}
</style>