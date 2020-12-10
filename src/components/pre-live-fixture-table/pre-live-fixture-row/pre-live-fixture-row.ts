import { Component, Vue, Prop, Watch } from 'vue-property-decorator';
import PopupMarket from '@/components/popup-market/popup-market';
import { sportsSerializer } from '@/providers/serializers/sports/sports';
import i18n from '@/i18n';

@Component({
  name: 'pre-live-fixture-row',
  components: {
    'popup-market': PopupMarket,
  },
})
export default class PreLiveFixtureRow extends Vue {

  @Prop()
  private fixture: any;

  @Prop()
  private config: any;

  @Prop()
  private selectedTips: any[];

  private selectedFixture: any = {};


  private created() {
    const fixture = this.fixture;
    fixture.markets = sportsSerializer.getMarketsAndOdds(fixture, this.config);
  }

  private openPopupMarket(fixture) {
    this.selectedFixture = fixture;
    this.$bvModal.show(`pre-popup-market-modal-${fixture.FixtureId}`);
  }

  private onSelectTip(tip) {
    this.$emit('onSelectTip', tip, this.fixture);
  }

  private openBetRadar(betRadarId) {
    if (betRadarId != null) {
      const lang = i18n.locale;
      window.open('https://s5dev.sir.sportradar.com/betone/' + lang + '/match/' + betRadarId, 'Statistics');
    } else {
      window.open('https://s5dev.sir.sportradar.com/betone', 'Statistics');
    }
  }

}
