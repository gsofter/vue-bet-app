import { Component, Vue, Prop, Watch } from 'vue-property-decorator';
import { LeagueModel } from '@/models/sports/league';
import PopupMarket from '@/components/popup-market/popup-market';
import moment from 'moment';
import _ from 'lodash';
import i18n from '@/i18n';

@Component({
  name: 'league-container-list',
  components: {
    'popup-market': PopupMarket,
  },
})
export default class LeagueContainerList extends Vue {
  @Prop()
  private leagues: LeagueModel[];

  @Prop()
  private sportId: string;

  @Prop()
  private selectedTips: any[];

  @Prop()
  private showTodayMatch: boolean;

  private selectedFixture: any = {};

  private selectedLeague: LeagueModel = {
    leagueId: '',
    leagueName: '',
    fixtures: [],
    markets: [],
  };

  @Prop()
  private countryId: string;

  @Watch('leagues')
  private onChange(value: LeagueModel, oldValue: LeagueModel) {
    this.setDefaultLeague();
  }

  @Watch('selectedLeague')
  private onChangeLeague() {
    if (this.selectedLeague) {
      this.$emit('onSelectLeague', this.selectedLeague);
    }
  }

  private created() {
    this.setDefaultLeague();
    setInterval(() => {
      const time = moment().unix();
      if (this.selectedLeague && this.selectedLeague.fixtures.length) {
        for (let i = 0; i < this.selectedLeague.fixtures.length; i++) {
          const startDate = this.selectedLeague.fixtures[i].StartDate;
          if (Number(startDate) < time) {
            this.selectedLeague.fixtures.splice(i, 1);
            this.$emit('onClearLeague', this.selectedLeague.leagueId, this.countryId);
            break;
          }
        }
      } else {
        this.$emit('onClearLeague', this.selectedLeague.leagueId, this.countryId);
      }
    }, 1000);
  }

  private setDefaultLeague() {
    const defaultLeague = this.leagues.find((league) => {
      return league.fixtures.length;
    });
    this.selectedLeague = defaultLeague ? defaultLeague : {
      leagueId: '',
      leagueName: '',
      fixtures: [],
      markets: [],
    };
  }

  private openPopupMarket(fixture) {
    this.selectedFixture = fixture;
    this.$bvModal.show(`popup-market-modal-${fixture.FixtureId}`);
  }

  private selectLeague(league: LeagueModel) {
    this.selectedLeague = league;
  }

  private openBetRadar(betRadarId) {
    if (betRadarId != null) {
      const lang = i18n.locale;
      window.open('https://s5dev.sir.sportradar.com/betone/' + lang + '/match/' + betRadarId, 'Statistics');
    } else {
      window.open('https://s5dev.sir.sportradar.com/betone', 'Statistics');
    }
  }

  private onSelectTip(tip, fixture) {
    this.$emit('onSelectTip', tip, fixture, false);
  }
}
