import Vue from 'vue'
import Vuex from 'vuex'
import form from './modules/form'
import login from './modules/login'
import home from './modules/home'
Vue.use(Vuex)


export default new Vuex.Store({
  modules: {
    form,
    login,
    home
  },
})