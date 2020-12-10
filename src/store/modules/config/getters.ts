export default {
  getSports(state: any) {
    return state.sports;
  },
  getLanguages(state: any) {
    return state.languages;
  },
  getMarkets(state: any) {
    return state.markets;
  },
  getPopup(state: any) {
    return state.popup;
  },

  getLivePopup(state: any) {
    return state.livePopup;
  },

  getLayoutConfig(state: any) {
    return state.layoutConfig;
  },

  getBetSlipConfig(state: any) {
    return state.betslip;
  },

  getUserBalance(state: any) {
    return state.userBalance;
  },
};
