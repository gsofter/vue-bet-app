import Vue from 'vue';
import Vuex from 'vuex';
import config from '@/store/modules/config/config';
import sports from '@/store/modules/sports/sports';

Vue.use(Vuex);
export default new Vuex.Store({
  modules: {
    config,
    sports,
  },
});
