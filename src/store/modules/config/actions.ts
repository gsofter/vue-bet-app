import { SportsModel } from '@/models/config/sports';
import { FlagsModel } from '@/models/config/flags';
import { ActionContext } from 'vuex';

export default {
  setSports({ commit, dispatch, state }: ActionContext<SportsModel[], any>, value: SportsModel[]) {
    commit('setSports', value);
  },

  setLanguages({ commit, dispatch, state }: ActionContext<FlagsModel[], any>, value: FlagsModel[]) {
    commit('setLanguages', value);
  },

  setMarkets({ commit, dispatch, state }: ActionContext<any, any>, value: any) {
    commit('setMarkets', value);
  },

  setPopup({ commit, dispatch, state }: ActionContext<any, any>, value: any) {
    commit('setPopup', value);
  },

  setLivePopup({ commit, dispatch, state }: ActionContext<any, any>, value: any) {
    commit('setLivePopup', value);
  },

  setLayoutConfig({ commit, dispatch, state }: ActionContext<any, any>, value: any) {
    commit('setLayoutConfig', value);
  },

  setUserBalance({ commit, dispatch, state }: ActionContext<any, any>, value: any) {
    commit('setUserBalance', value);
  },

  setBetSlipConfig({ commit, dispatch, state }: ActionContext<any, any>, value: any) {
    commit('setBetSlipConfig', value);
  },
};
