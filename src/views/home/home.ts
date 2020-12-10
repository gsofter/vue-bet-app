import { Component, Vue } from 'vue-property-decorator';
import Header from '@/components/header/header';
import { configDataSetAPI } from '@/providers/apis/config/config';
import { sportsDataSetAPI } from '@/providers/apis/sports/sports';
import { sportsService } from '@/providers/services/sports/sports';
import { CountryModel } from '@/models/sports/country';
import { SportsModel } from '@/models/config/sports';
import { authAPI } from '@/providers/apis/auth/auth';
import axios from 'axios';
import moment from 'moment';
@Component({
  components: {
    'app-header': Header,
  },
})
export default class Home extends Vue {
  // -----------------------------------------
  // Properties
  private isLoading: boolean = false;

  private isLoggedIn: boolean = false;

  public isLogInSuccess() {
    this.isLoggedIn = true;
  }

  public logout() {
    const session = this.$cookies.remove('bet1_session');
    window.localStorage.removeItem('userProfile');
    this.isLoggedIn = false;
  }

  public checkLogin() {
    const session = this.$cookies.get('bet1_session');
    if (session) {
      this.isLoggedIn = true;
    }
  }

  private redirectToDefaultSport() {
    let sportName = this.$route.params.sportName;
    if (!sportName) {
      sportName = 'Football';
      this.$root.$router.push({
        path: `/sport/${sportName}`,
      });
    }
  }
  // -----------------------------------------
  // Hooks
  private created() {
    this.checkLogin();
    this.isLoading = true;
    const token = this.$cookies.get('bet1_session');
    configDataSetAPI.getConfig().then((config) => {
      return axios.all([
        sportsDataSetAPI.getLiveSportFixtures(),
        sportsDataSetAPI.getAllSportFixtures(),
        this.isLoggedIn ? authAPI.getBetSlipConfigByUser(token) : null,
      ]).then(axios.spread((preLiveFixturesData, allSportFixturesData, betSlipUserConfig) => {
        const betslipConfig = this.isLoggedIn ? betSlipUserConfig : config;
        const currentTime = moment().unix();
        const filterData = allSportFixturesData.filter((fixture) => {
          return (Number(fixture.StartDate) > currentTime);
        });
        const sportsData = sportsService.parseFixturesData(filterData, config);
        const todayFixtures = sportsService.getTodayFixtureList(sportsData);
        let preLiveFixtures;
        if (preLiveFixturesData) {
          preLiveFixtures = preLiveFixturesData.filter((preFixture) => {
            return (Number(preFixture.StartDate) > currentTime);
          });
        }
        this.$store.dispatch('config/setSports', config.sports);
        this.$store.dispatch('config/setLayoutConfig', config.sportsConfig);
        this.$store.dispatch('config/setPopup', config.popup);
        this.$store.dispatch('config/setLivePopup', config.livePopup);
        this.$store.dispatch('config/setLanguages', config.flags);
        this.$store.dispatch('config/setBetSlipConfig', betslipConfig);
        this.$store.dispatch('sports/setSports', sportsData);
        this.$store.dispatch('sports/setTodayFixtures', todayFixtures);
        this.$store.dispatch('sports/setLiveFixtures', preLiveFixtures);
        this.isLoading = false;
        this.redirectToDefaultSport();
      }));
    });
  }
}
