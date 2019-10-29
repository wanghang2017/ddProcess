import { getTemplate, getProjetcByAd } from '@/api/form';
import { arrayToStr } from "@/utils/utils.js";
// initial state
const state = {
  formOk: false, // 表单是否成功
  showModal: false,// 是否弹窗显示
  content: "",//弹窗提示内容
  template: [],
  form: [],
}

// getters
const getters = {}

// actions
const actions = {
  async initAll({ commit }, { flowTypeId, cuid }) {
    try {
      let response = await getTemplate(flowTypeId, cuid);
      let { code, data, message } = response;
      if (code == 0) {
        commit("initTemplate", {
          template: [...data.elementList]
        });
        // commit("initForm");
      } else {
        commit("changeModalData", { showModal: true, content: message });
      }
    } catch (e) {
      console.log(e);
    }

  },
  async changeTemplate({ commit }, { cascader, value, key }) {
    try {
      let api = cascader.api;
      if (value) {
        api = api.replace(/{{\w+}}/i, value);
      } else {
        api = `${api}&cuid=${localStorage.getItem("userId")}`
      }
      // console.log(api);
      let response = await getProjetcByAd(api);
      let { code, data, message } = response;
      if (code == 0) {
        if (cascader.items) {
          commit("changeTemplateOptions", { source: data, cascader });
        } else {
          commit("changeTemplateSource", { source: data, key })
        }

      } else {
        commit("changeModalData", { showModal: true, content: message });
      }
    } catch (e) {
      console.log(e)
    }
  },
}

// mutations
const mutations = {
  // 初始化表单数据
  "initClean": () => {
    state.form = [];
    state.template = []
  },
  // 初始化模板和提交数据
  initTemplate: (state, { template }) => {

    function deepClone(template) {
      var ary = []
      for (let i = 0; i < template.length; i++) {
        var obj = {};
        let cur = template[i];
        // console.log(cur);
        if (cur.push) {
          return [deepClone(cur)];
        }
        obj.elementType = cur.type;
        obj.name = cur.text;
        obj.value = "";
        obj.splitId = cur.splitId;
        if (cur.selectDefaultConfigSpec) {
          let selectDefaultConfigSpec = JSON.parse(cur.selectDefaultConfigSpec)
          obj.value = selectDefaultConfigSpec.defaultOption;
        }
        if (cur.details) {
          cur.validator = {
            required: true
          }
          obj.total = [];
          obj.value = deepClone(cur.details);
          obj.type = "JSON";
        } else {
          obj.type = "string";
        }
        if (cur.validator.required) {
          obj.required = true;
        }
        ary.push(obj);

      }
      return ary;
    }
    state.form = deepClone(template);
    state.template = template;
    state.defaultTemplate = JSON.parse(JSON.stringify(template));
  },
  // list 修改  增加一项
  addItem: (state, { key }) => {
    let template = state.template[key];
    // console.log(template);
    let form = state.form[key].value;
    let defaultData = form[0];
    // console.log(form);
    // console.log(defaultData);
    let ary = [];
    defaultData.forEach(item => {
      ary.push({ ...item, value: "" });
    });
    form.push(ary);
    // console.log(form);
    template.details.push([...template.details[0]]);
    // console.log(template);
  },
  // list 修改  删除一项
  removeItem: (state, { key, index }) => {

    let template = state.template[key];
    let form = state.form[key].value;
    // console.log(index);
    // console.log(template)
    // console.log(form);
    if (template.details.length <= 1) return;
    form.splice(index, 1);

    template.details.splice(index, 1);
    // console.log(template)
    // console.log(form);
    // console.log(xx2);
  },
  // 修改表单数据
  changeFormData: (state, { key, value }) => {
    // console.log(key);
    let str = `state.form`;
    if (key.length > 1) {
      str += arrayToStr([...key, "value"]);;
      str += `= ${JSON.stringify(value)}`;
      // console.log(str);
      eval(str);
      // state = [...state];
    } else {
      // console.log(state.form)
      state.form[key[0]].value = value;
      // state = [...state];

    }
  },
  // 项目id联动当前层级的数据
  changeFormDataCascader: (state, { key, value, cascader }) => {
    // 构造父级的下标
    key.pop();
    // console.log(key);
    let str = `state.form`;
    let parent = null;
    // 找到父级
    if (key.length > 1) {
      str += arrayToStr([...key]);
      // console.log(str);
      eval("parent=" + str);
    } else {
      parent = state.form;
    }
    // console.log(parent);
    // console.log(cascader);
    // 通过父级找到联动级  并设置联动级的值
    for (let cakey in cascader) {
      // console.log(cakey);
      let newValue = value[cakey];
      let curname = cascader[cakey];
      // console.log(curname);
      let child = parent.find(item => item.name == curname);
      // console.log(child);
      if (child) child.value = newValue;
    }
  },

  //根据column（key）改变对应项的source
  changeTemplateSource: (state, { key, source }) => {
    let str = `state.template`;
    // console.log(key);
    if (key.length > 1) {
      str += arrayToStr([...key, "source"]);;
      str += `= ${JSON.stringify(source)}`;
      // console.log(str);
      eval(str);
      // state = [...state];
    } else {
      // console.log(state.form)
      state.template[key[0]].source = source;
      // state = [...state];

    }
  },
  // 修改模板数据   （联动 source
  changeTemplateOptions: (state, { cascader, source }) => {
    // 根据 cascader 中的 items 寻找到模板里所有联动关联的项
    let { items } = cascader;
    let args = items.split("/").filter(item => !!item);
    // 修改模板 更新对应的可选集合
    function deepFind(form, index) {
      let current = args[index];
      for (let i = 0; i < form.length; i++) {
        let cur = form[i];
        if (cur.text == current) {
          if (index == args.length - 1) {
            cur.source = source;
          } else {
            deepFind(cur.details, index + 1);
          }
        }
        if (cur.pop) {
          deepFind(cur, index)
        }
      }
    }

    // 将对应的值设置为""
    function deepFind2(form, index) {
      let current = args[index];
      // console.log(form);
      for (let i = 0; i < form.length; i++) {
        let cur = form[i];
        if (cur.name == current) {
          if (index == args.length - 1) {
            cur.value = "";
          } else {
            deepFind2(cur.value, index + 1);
          }
        }
        if (cur.pop) {
          deepFind2(cur, index)
        }
      }
    }
    // 
    deepFind(state.template, 0)
    deepFind2(state.form, 0)
  },

  // 修改弹窗数据
  changeModalData: (state, { showModal, content }) => {
    state.showModal = showModal;
    state.content = content;
  },
  // 表单验证
  checkForm: (state) => {
    function deepClone(parentName, form) {
      // console.log(form);
      for (let i = 0; i < form.length; i++) {
        let cur = form[i];
        // console.log(cur);
        if (cur.pop) {
          let { ok, text } = deepClone(`${parentName}下的第${i + 1}项`, cur);
          if (!ok) return { ok, text }
        }
        if (cur.required) {
          if (typeof cur.value == "string" && cur.value.length <= 0) return { ok: false, text: parentName + (parentName.length > 0 ? "下的" : "") + cur.name, };
          if (cur.value.pop) {
            let { ok, text } = deepClone(parentName + (parentName.length > 0 ? "下的" : "") + cur.name, cur.value);
            if (!ok) return { ok, text }
          }
        }
      }
      return { ok: true };
    }
    // console.log(deepClone("", state.form));
    let { ok, text } = deepClone("", state.form);
    if (ok) {
      state.formOk = ok;
    } else {
      state.formOk = ok;
      state.showModal = true;
      state.content = "请填写" + text;
    }
  },
  // 特殊处理 
  //是否首次合作 -> 影响到合同编号的 是否 必填
  changeTempaleSpecial_first: (state, { isFirst }) => {
    let curT = state.template.find(item => item.text == "合同编号")
    let curF = state.form.find(item => item.name == "合同编号")
    if (curT && curF && curT.validator) {
      curT.validator.required = isFirst;
      curF.required = isFirst;
    }

  },

  //根据选项修改模板   是否必填
  changeTempaleByOptions: (state, { cascader_fields }) => {
    cascader_fields = JSON.parse(cascader_fields);
    cascader_fields = cascader_fields;
    state.template.forEach(item => {
      cascader_fields.forEach(cur => {
        if (cur.field == item.text) {
          item.validator.defaultRequired = item.validator.required
          item.validator.required = cur.required;
        }
      })
    })
    state.form.filter(item => {
      cascader_fields.forEach(cur => {
        if (cur.field == item.name) {
          item.defaultRequired = item.required
          item.required = cur.required;
        }
      })
    });

  },

  //根绝选项修改模板   恢复到之前的样子
  changeTempaleByOptionsBack: (state, { cascader_fields }) => {
    cascader_fields = JSON.parse(cascader_fields);
    cascader_fields = cascader_fields;
    state.template.forEach(item => {
      cascader_fields.forEach(cur => {
        if (cur.field == item.text) {
          item.validator.required = item.validator.defaultRequired
        }
      })
    })
    state.form.filter(item => {
      cascader_fields.forEach(cur => {
        if (cur.field == item.name) {
          item.required = item.defaultRequired
        }
      })
    });

  }
}

export default {
  namespaced: true,
  state,
  getters,
  actions,
  mutations
}