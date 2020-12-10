import { SportModel } from '@/models/sports/sport';

export default {
  setSports(state: any, value: SportModel) {
    state.sports = value;
  },
  setTodayFixtures(state: any, value: SportModel) {
    state.todayFixtures = value;
  },

  setLiveFixtures(state: any, value: SportModel) {
    state.liveFixtures = value;
  },
};
