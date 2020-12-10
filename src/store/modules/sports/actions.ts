import { SportModel } from '@/models/sports/sport';
import { ActionContext } from 'vuex';

export default {
  setSports({ commit, dispatch, state }: ActionContext<SportModel[], any>, value: SportModel[]) {
    commit('setSports', value);
  },

  setTodayFixtures({ commit, dispatch, state }: ActionContext<SportModel[], any>, value: SportModel[]) {
    commit('setTodayFixtures', value);
  },

  setLiveFixtures({ commit, dispatch, state }: ActionContext<SportModel[], any>, value: SportModel[]) {
    commit('setLiveFixtures', value);
  },
};
