import { Component, Vue, Prop } from 'vue-property-decorator';
import { sportsDataSetAPI } from '@/providers/apis/sports/sports';
import Clubed from '@/components/popup-market/types/clubed/clubed';
import Row from '@/components/popup-market/types/row/row';
import MultiRow from '@/components/popup-market/types/multi-row/multi-row';

@Component({
  name: 'popup-market',
  components: {
    clubed: Clubed,
    multirow: MultiRow,
    row: Row,
  },
})
export default class PopupMarket extends Vue {

  @Prop()
  private fixture: any;

  @Prop()
  private type: any;

  @Prop()
  private sportId: string;

  @Prop()
  private selectedTips: any[];

  private popupMarkets: any = [];

  get popupConfig() {
    return this.$store.state.config.popup;
  }

  get isFootball() {
    const sportName = this.$route.params.sportName;
    return sportName === 'Football';
  }

  private close() {
    if (this.type === 'pre') {
      this.$bvModal.hide(`pre-popup-market-modal-${this.fixture.FixtureId}`);
    } else {
      this.$bvModal.hide(`popup-market-modal-${this.fixture.FixtureId}`);
    }
  }

  private created() {
    if (this.fixture.FixtureId) {
      sportsDataSetAPI.getMarketsByFixtureId(this.fixture.FixtureId, this.popupConfig)
        .then((popupMarkets) => {
          this.popupMarkets = popupMarkets;
        });
    }
  }

  private onSelectTip(tip) {
    this.$emit('onSelectTip', tip, this.fixture);
  }
}
