import { Component, Vue, Prop, Watch } from 'vue-property-decorator';
import PreLiveFixtureRow from '@/components/pre-live-fixture-table/pre-live-fixture-row/pre-live-fixture-row';
import PreLiveFixtureHeader from '@/components/pre-live-fixture-table/pre-live-fixture-header/pre-live-fixture-header';
import moment from 'moment';
import _ from 'lodash';
@Component({
  name: 'pre-live-fixture-table',
  components: {
    'pre-live-fixture-header': PreLiveFixtureHeader,
    'pre-live-fixture-row': PreLiveFixtureRow,
  },
})
export default class PreLiveFixtureTable extends Vue {

  get config() {
    // TODO: Live supports only Football
    const layoutConfig = this.$store.state.config.layoutConfig;
    const sports = this.$store.state.config.sports;
    const sportData = sports.find((sport) => sport.displayName === 'Football');
    return layoutConfig[sportData.sportId];
  }

  get preLiveFixtures() {
    const preLiveFixtures = this.$store.state.sports.liveFixtures;
    const sortedPreLiveFixtures: any = preLiveFixtures ? preLiveFixtures.sort(this.compare) : [];
    let leagueId = '';
    sortedPreLiveFixtures.map((sortedPreLiveFixture) => {
      const id = sortedPreLiveFixture.LeagueId;
      const eventOrdering = sortedPreLiveFixture.event_ordering;
      if (id !== leagueId && eventOrdering === '1') {
        sortedPreLiveFixture.country_show = 1;
      } else {
        sortedPreLiveFixture.country_show = 0;
      }
      leagueId = id;
    });
    return sortedPreLiveFixtures;
  }

  get markets() {
    const liveDisplayConfig = this.config ? this.config.live_display_config : null;
    const markets = [];
    if (liveDisplayConfig) {
      Object.keys(liveDisplayConfig).map((marketName, index) => {
        if (index % 2 === 0) {
          const marketObject = {};
          const market = _.cloneDeep(liveDisplayConfig[marketName]);
          if (marketName === 'Under/Over') {
            market.odds = ['O/U'].concat(market.odds);
          }
          marketObject[marketName] = market;
          markets.push(marketObject);
        }
      });
    }
    return markets;
  }

  @Prop()
  private sportId: string;

  @Prop()
  private selectedTips: any[];

  public created() {
    setInterval(() => {
      const time = moment().unix();
      for (let i = 0; i < this.preLiveFixtures.length; i++) {
        const startDate = this.preLiveFixtures[i].StartDate;
        if (Number(startDate) < time) {
          this.preLiveFixtures.splice(i, 1);
          break;
        }
      }
    }, 1000);
  }

  private compare(a, b) {
    if (a.StartDate > b.StartDate) { return 1; }
    if (a.StartDate < b.StartDate) { return -1; }
    if (a.LeaugeSequence > b.LeaugeSequence) { return 1; }
    if (a.LeaugeSequence < b.LeaugeSequence) { return -1; }
  }

  private onSelectTip(tip, fixture) {
    this.$emit('onSelectTip', tip, fixture, false);
  }
}
