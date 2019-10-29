import { login, logout} from '@/api/login';

// initial state
const state = {
    userInfo: null,
    showModal: false,
    content: "",
}

// getters
const getters = {}

// actions
const actions = {
    // 登陆
    login: async ({ commit }, { username, password }) => {
        // console.log(username,password);
        try {
            let userInfo = await login({ username, password });
            let { code, data, message } = userInfo;
            if (code == 200) {
                commit("updateUserInfo", data.user);
            } else {
                commit("changeModalData",{showModal:true,content:message});
            }
        } catch (e) {
            console.log(e)
        }
    },
    // 登出
    logout: async ({ commit },{userId}) => {
        // console.log(username,password);
        try {
            let userInfo = await logout(userId);
            let { code, data, message } = userInfo;
            if (code == 100) {
                commit("updateUserInfo", null);
            } else {
                commit("changeModalData",{showModal:true,content:message});
            }
        } catch (e) {
            console.log(e)
        }
    }
}
// mutations
const mutations = {
    // 登陆
    updateUserInfo: (state, userInfo) => {
        state.userInfo = userInfo;
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