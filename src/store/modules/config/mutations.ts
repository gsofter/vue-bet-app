import { SportsModel } from '@/models/config/sports';
import { FlagsModel } from '@/models/config/flags';

export default {
  setSports(state: any, value: SportsModel) {
    state.sports = value;
  },
  setLanguages(state: any, value: FlagsModel) {
    state.languages = value;
  },
  setMarkets(state: any, value: any) {
    state.markets = value;
  },
  setPopup(state: any, value: any) {
    state.popup = value;
  },
  setLivePopup(state: any, value: any) {
    state.livePopup = value;
  },
  setLayoutConfig(state: any, value: any) {
    state.layoutConfig = value;
  },
  setBetSlipConfig(state: any, value: any) {
    state.betslip = value;
  },

  setUserBalance(state: any, value: any) {
    state.userBalance = value;
  },
};
