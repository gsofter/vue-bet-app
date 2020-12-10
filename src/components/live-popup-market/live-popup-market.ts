import { Component, Vue, Prop } from 'vue-property-decorator';
import Clubed from '@/components/live-popup-market/types/clubed/clubed';
import Row from '@/components/live-popup-market/types/row/row';
import MultiRow from '@/components/live-popup-market/types/multi-row/multi-row';
import _ from 'lodash';
import { db } from '@/main';

@Component({
  name: 'live-popup-market',
  components: {
    clubed: Clubed,
    multirow: MultiRow,
    row: Row,
  },
})
export default class LivePopupMarket extends Vue {

  get popupConfig() {
    return this.$store.state.config.livePopup;
  }

  get popupMarkets() {
    return this.fixture.popupMarkets;
  }

  @Prop()
  private fixture: any;

  @Prop()
  private selectedTipList: any[];

  @Prop()
  private selectedTips: any[];

  private refList: any = [];

  public checkUpDownValue(oldPrice, newPrice, id, index) {
    const cls = ['greater', 'lower'];
    let priceRate;
    if (Number(newPrice) > Number(oldPrice)) {
      priceRate = 'greater';
    } else if (Number(newPrice) < Number(oldPrice)) {
      priceRate = 'lower';
    }
    const ele = this.$refs.component[index] ? this.$refs.component[index].$refs[id][0] : null;
    if (ele) {
      ele.classList.remove(...cls);
      ele.classList.add(priceRate);
      setTimeout(() => {
        const element = this.$refs.component[index] ? this.$refs.component[index].$refs[id][0] : null;
        if (element) {
          element.classList.remove(...cls);
        }
      }, 5000);
    }
  }

  private close() {
    this.$bvModal.hide(`live-popup-market-modal-${this.fixture.fixtureId}`);
  }


  private mounted() {
    this.subscribeMarketData(this.fixture);
  }

  private subscribeMarketData(fixture) {
    const fixtureId = fixture.fixtureId;
    const popupConfig = this.popupConfig;
    Object.keys(popupConfig).map((marketName) => {
      const index = this.fixture.popupMarkets.findIndex((market) => market.name === marketName);
      if (marketName === 'Under/Over') {
        marketName = 'Under-Over';
      }
      const childNode = fixture[marketName];
      if (childNode) {
        Object.keys(childNode).map((childKey) => {
          const childNodeValue = childNode[childKey];
          if (childNodeValue.hasOwnProperty('BetsPrice')) {
            const refPath = `live/${fixtureId}/${marketName}/${childKey}`;
            const ref = db.ref(refPath);
            ref.on('child_changed', (snapshot) => {
              const transformedMarketName = marketName === 'Under-Over' ? 'Under/Over' : marketName;
              const element = this.fixture[marketName][childKey].BetsPrice;
              const oldPrice = element.BetsPrice;
              const id = `${fixtureId}_${transformedMarketName}_${childKey}`;
              this.checkUpDownValue(oldPrice, snapshot.val(), id, index);
              const isSelected = this.selectedTips.find((x) => x.id === id);
              if (isSelected) {
                this.$emit('onChangeSelectedTip', snapshot.key, snapshot.val(), id);
              }
            });
            this.refList.push(ref);
          } else {
            Object.keys(childNodeValue).map((childNodeKey) => {
              const refPath = `live/${fixtureId}/${marketName}/${childKey}/${childNodeKey}`;
              const ref = db.ref(refPath);
              ref.on('child_changed', (snapshot) => {
                const transformedMarketName = marketName === 'Under-Over' ? 'Under/Over' : marketName;
                const id = `${fixtureId}_${transformedMarketName}_${childKey}_${childNodeKey}`;
                const element = this.fixture[marketName][childKey][childNodeKey];
                const oldPrice = element.BetsPrice;
                this.checkUpDownValue(oldPrice, snapshot.val(), id, index);
                const isSelected = this.selectedTips.find((x) => x.id === id);
                if (isSelected) {
                  this.$emit('onChangeSelectedTip', snapshot.key, snapshot.val(), id);
                }
              });
              this.refList.push(ref);
            });
          }
        });
      }
    });
  }

  private onSelectTip(tip) {
    this.$emit('onSelectTip', tip);
  }

  private beforeDestroy() {
    this.refList.map((ref) => {
      ref.off('value');
    });
  }
}
