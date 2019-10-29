import { getMenu } from '@/api/home.js';
// initial state
const state = {
    menu: [],
    showModal: false,// 是否弹窗显示
    content: "",//弹窗提示内容
}

// getters
const getters = {}

// actions
const actions = {
    async init({ commit }, { cuid }) {
        try {
            let response = await getMenu(cuid);
            let { code, data, message } = response;
            if (code == 0) {
                commit("initMenu", { menu: data });
                // commit("initForm");
            } else {
                commit("changeModalData", { showModal: true, content: message });
            }
        } catch (e) {
            console.log(e);
        }

    }
}

// mutations
const mutations = {
    // 初始化表单数据
    initMenu: (state, { menu }) => {
        state.menu = menu;
    },
    // 修改弹窗数据
    changeModalData: (state, { showModal, content }) => {
        state.showModal = showModal;
        state.content = content;
    },
}

export default {
    namespaced: true,
    state,
    getters,
    actions,
    mutations
}