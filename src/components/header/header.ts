import { Component, Vue, Watch, Prop } from 'vue-property-decorator';
import { SportsModel } from '@/models/config/sports';
import { FlagsModel } from '@/models/config/flags';
import { CountryModel } from '@/models/sports/country';
import { requestFullScreenMode, closeFullscreenMode } from '@/utils/utils';
import SportCountriesList from '@/components/sport-countries-list/sport-countries-list';
import Login from '@/components/login/login';
import { authAPI } from '@/providers/apis/auth/auth';
import moment from 'moment';

const THEMES = [{
  id: 'theme1',
  label: 'Blue',
}, {
  id: 'theme2',
  label: 'White',
}, {
  id: 'theme3',
  label: 'Black',
}];

@Component({
  name: 'app-header',
  components: {
    'login': Login,
    'sport-countries-list': SportCountriesList,
  },
})
export default class Header extends Vue {

  get themes() {
    return THEMES;
  }

  get defaultSportName() {
    return this.$route.params.sportName;
  }

  private currentTime: string = moment().format('h:mm');

  private activeTheme: string = 'theme1';

  private isFullScreen: boolean = false;

  get selectedTheme() {
    return THEMES.find((theme) => {
      return theme.id === this.activeTheme;
    });
  }

  get sports(): SportsModel[] {
    const sports = this.$store.state.config.sports;
    const casinoIndex = sports.findIndex((sport) => {
      return sport.displayName === 'Casino';
    });
    if (casinoIndex !== -1) {
      sports.splice(casinoIndex, 1);
    }
    sports.forEach((sport: SportsModel) => {
      if (sport.displayName === this.defaultSportName) {
        this.onSelectSport(sport);
      }
    });
    return sports;
  }

  get languages(): FlagsModel[] {
    const languages = this.$store.state.config.languages;
    languages.forEach((language: FlagsModel) => {
      if (language.id === this.defaultLanguageId) {
        this.selectedLanguage = language;
      }
    });
    return languages;
  }

  private profile: any = {};

  private userBalance: string = '';

  @Prop()
  private selectedSport: SportsModel;

  @Prop()
  private isLoggedIn: boolean;

  private isShow: boolean = false;

  private selectedLanguage: FlagsModel = {
    id: '',
    imageName: '',
  };

  private defaultLanguageId: string = 'tr';

  public showLogin() {
    this.isShow = true;
  }

  @Watch('selectedLanguage')
  private onLanguageChange(value: FlagsModel, oldValue: FlagsModel) {
    this.$i18n.locale = value.id;
  }

  private fullScreenMode() {
    this.isFullScreen = !this.isFullScreen;
    if (!this.isFullScreen) {
      closeFullscreenMode();
    } else {
      requestFullScreenMode();
    }
  }

  private onSelectSport(sport: SportsModel) {
    this.$emit('onSelectSport', sport);
  }

  private onSelectLanguage(language: FlagsModel) {
    this.selectedLanguage = language;
  }

  private onSelectCountry(country: CountryModel) {
    this.$emit('onSelectCountry', country);
  }

  private onSelectTodayMatch() {
    this.$emit('onSelectTodayMatch');
  }

  private onSelectLiveMatch() {
    this.$emit('onSelectLiveMatch');
  }

  private onCloseLogin() {
    this.isShow = false;
  }

  private isLogInSuccess() {
    this.$emit('isLogInSuccess');
    this.updateUserBalance();
    this.updateUserProfile();
  }

  private logout() {
    this.userBalance = '';
    this.$emit('logout');
  }

  private created() {
    setInterval(() => {
      const time = moment().format('h:mm');
      this.currentTime = time;
    }, 1000);
    this.updateUserBalance();
    this.updateUserProfile();
  }

  private updateUserProfile() {
    const profileData = window.localStorage.getItem('userProfile');
    const profile = JSON.parse(profileData);
    this.profile = profile;
  }

  private updateUserBalance() {
    const intervalTimer = setInterval(() => {
      const token = this.$cookies.get('bet1_session');
      if (token) {
        authAPI.getUserBalance(token).then((response) => {
          const balance = response.balance;
          this.userBalance = balance;
          this.$store.dispatch('config/setUserBalance', this.userBalance);
        });
      } else {
        clearInterval(intervalTimer);
        this.redirectToSportPage();
        this.logout();
        this.$store.dispatch('config/setUserBalance', '');
      }
    }, 1000);
  }

  private redirectToSportPage() {
    let sportName = this.$route.params.sportName;
    if (!sportName) {
      sportName = 'Football';
      this.$root.$router.push({
        path: `/sport/${sportName}`,
      });
    }
  }

  private onSelectTheme(theme) {
    if (this.activeTheme !== theme.id) {
      const bodyEle = document.getElementsByTagName('body')[0];
      bodyEle.classList.remove(this.activeTheme);
      this.activeTheme = theme.id;
      bodyEle.classList.add(this.activeTheme);
    }
  }
}
