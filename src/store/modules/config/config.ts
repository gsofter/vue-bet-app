import state from '@/store/modules/config/state';
import getters from '@/store/modules/config/getters';
import actions from '@/store/modules/config/actions';
import mutations from '@/store/modules/config/mutations';

export default {
  namespaced: true,
  state,
  getters,
  actions,
  mutations,
};
