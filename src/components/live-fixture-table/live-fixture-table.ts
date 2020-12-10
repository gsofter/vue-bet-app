import { Component, Vue, Prop, Watch } from 'vue-property-decorator';
import LiveFixtureRow from '@/components/live-fixture-table/live-fixture-row/live-fixture-row';
import LiveFixtureHeader from '@/components/live-fixture-table/live-fixture-header/live-fixture-header';
import { db } from '@/main';
import _ from 'lodash';

@Component({
  name: 'live-fixture-table',
  components: {
    'live-fixture-header': LiveFixtureHeader,
    'live-fixture-row': LiveFixtureRow,
  },
})
export default class LiveFixtureTable extends Vue {

  get liveRef() {
    return db.ref('/live');
  }

  get config() {
    // TODO: Live supports only Football
    const layoutConfig = this.$store.state.config.layoutConfig;
    const sports = this.$store.state.config.sports;
    const sportData = sports.find((sport) => sport.displayName === 'Football');
    return layoutConfig[sportData.sportId];
  }

  get markets() {
    const liveDisplayConfig = this.config ? this.config.live_display_config : null;
    const markets = [];
    if (liveDisplayConfig) {
      Object.keys(liveDisplayConfig).forEach((marketName, index) => {
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

  private get liveFixturesData() {
    const liveFixtures: any = this.liveFixtures.sort(this.compare);
    let countryNm = '';
    liveFixtures.forEach((liveFixture, index) => {
      const countryId = liveFixture.LocationId;
      const isDisable = liveFixture.Disable;
      const status = liveFixture.Status;
      if (status === 2) {
        if (countryId !== countryNm && isDisable === 0) {
          liveFixture.country_show = 1;
        } else {
          liveFixture.country_show = 0;
        }
        countryNm = countryId;
      } else {
        liveFixture.country_show = 0;
      }
    });
    return liveFixtures;
  }

  @Prop()
  private sportId: string;

  @Prop()
  private countryId: string;

  @Prop()
  private selectedTips: any[];

  private selectedFixtureId: string = '';

  private isSubscribed: boolean = false;

  private isLoading: boolean = false;

  private tempLiveFixtures: any[] = [];

  private liveFixtures: any[] = [];

  private countryIsSame(locationId) {
    return this.countryId ? Number(this.countryId) === locationId : true;
  }

  private created() {
    this.isLoading = true;
    this.liveRef.on('child_removed', (snapshot) => {
      const fixtureSnapshot = snapshot.val();
      if (fixtureSnapshot) {
        this.onRemoveFixture(snapshot.key);
      }
    });
    this.liveRef.on('child_added', (snapshot) => {
      const fixtureSnapshot = snapshot.val();
      if (fixtureSnapshot && fixtureSnapshot.Status === 2) {
        this.liveFixtures.push(fixtureSnapshot);
      }
    });
    this.liveRef.once('value', (snapshot) => {
      this.isLoading = false;
      const fixtureSnapshot = snapshot.val();
      const liveFixtures = [];
      if (fixtureSnapshot) {
        Object.keys(fixtureSnapshot).forEach((fixtureId) => {
          const value = fixtureSnapshot[fixtureId];
          if ([1, 2, 6, 8, 9].includes(value.Status)) {
            value.fixtureId = fixtureId;
            liveFixtures.push(value);
          }
        });
        this.tempLiveFixtures = liveFixtures;
        this.liveFixtures = liveFixtures;
      }
    });
  }

  private beforeDestroy() {
    this.liveRef.off('child_added');
    this.liveRef.off('child_removed');
  }

  private onStatusChange(fixtureId, status) {
    const fixtureSnapshot: any = this.liveFixtures.find((fixture: any) => fixture.fixtureId === fixtureId);
    fixtureSnapshot.Status = status;
  }

  private onDisableChange(fixtureId, isDisable) {
    const fixtureSnapshot: any = this.liveFixtures.find((fixture: any) => fixture.fixtureId === fixtureId);
    fixtureSnapshot.Disable = isDisable;
  }
  private onRemoveFixture(fixtureId) {
    const index = this.liveFixtures.findIndex((fixture: any) => fixture.fixtureId === fixtureId);
    this.liveFixtures.splice(index, 1);
    if (index !== -1) {
      db.ref(`/live/${fixtureId}`).off('value');
    }
  }

  private compare(a, b) {
    if (a.Disable > b.Disable) { return 1; }
    if (a.Disable < b.Disable) { return -1; }
    if (a.CountrySeq > b.CountrySeq) { return 1; }
    if (a.CountrySeq < b.CountrySeq) { return -1; }
    if (a.LeagueSeq > b.LeagueSeq) { return 1; }
    if (a.LeagueSeq < b.LeagueSeq) { return -1; }
    if (a.Time < b.Time) { return 1; }
    if (a.Time > b.Time) { return -1; }
  }

  private openPopupMarket(fixtureId: string) {
    this.selectedFixtureId = fixtureId;
    this.$bvModal.show(`live-popup-market-modal-${fixtureId}`);
  }

  private onSelectTip(tip, fixture) {
    this.$emit('onSelectTip', tip, fixture, true);
  }

  private onChangeSelectedTip(keyName, value, id) {
    this.$emit('onChangeSelectedTip', keyName, value, id);
  }
}
