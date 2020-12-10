import { Component, Vue, Prop, Watch } from 'vue-property-decorator';
import LivePopupMarket from '@/components/live-popup-market/live-popup-market';
import { sportsSerializer } from '@/providers/serializers/sports/sports';
import { db } from '@/main';
import _ from 'lodash';

@Component({
  name: 'live-fixture-row',
  components: {
    'live-popup-market': LivePopupMarket,
  },
})
export default class LiveFixtureRow extends Vue {

  get popupConfig() {
    return this.$store.state.config.livePopup;
  }

  get liveFixtureRef() {
    return db.ref(`/live/${this.fixtureId}`);
  }

  public get fixtureData() {
    return this.fixture;
  }

  public set fixtureData(newValue) {
    this.fixture = newValue;
  }
  @Prop()
  private selectedTipList: any[];

  @Prop()
  private fixtureId: string;

  @Prop()
  private config: any;

  private isSubscribed: boolean = false;

  private fixture: any = {};

  private refList: any = [];

  private selectedTips = [];

  private showMatchEndAnimation: boolean = false;

  public checkUpDownValue(oldPrice, newPrice, id) {
    const cls = ['greater', 'lower'];
    let priceRate;
    if (Number(newPrice) > Number(oldPrice)) {
      priceRate = 'greater';
    } else if (Number(newPrice) < Number(oldPrice)) {
      priceRate = 'lower';
    }
    const ele = this.$refs[id] ? this.$refs[id][0] : null;
    if (ele) {
      ele.classList.remove(...cls);
      ele.classList.add(priceRate);
      setTimeout(() => {
        const element = this.$refs[id] ? this.$refs[id][0] : null;
        if (element) {
          element.classList.remove(...cls);
        }
      }, 5000);
    }
  }

  private created() {
    let isEventTriggered = false;
    this.liveFixtureRef.on('value', (snapshot) => {
      const fixtureSnapshot = snapshot.val();
      if (fixtureSnapshot) {
        if (fixtureSnapshot.Status !== (this.fixture && this.fixture.Status)) {
          if (fixtureSnapshot.Status === 3) {
            this.showMatchEndAnimation = true;
            setTimeout(() => {
              this.$emit('onStatusChange', this.fixtureId, fixtureSnapshot.Status);
              this.showMatchEndAnimation = false;
            }, 6000);
          } else {
            this.$emit('onStatusChange', this.fixtureId, fixtureSnapshot.Status);
          }
        }
        if (fixtureSnapshot.Disable !== (this.fixture && this.fixture.Disable)) {
          this.$emit('onDisableChange', this.fixtureId, fixtureSnapshot.Disable);
        }
        if (fixtureSnapshot && fixtureSnapshot.Status === 2 && fixtureSnapshot.Disable === 0) {
          fixtureSnapshot.fixtureId = this.fixtureId;
          fixtureSnapshot.markets = sportsSerializer.getMarketsForLive(fixtureSnapshot, this.config);
          fixtureSnapshot.popupMarkets = sportsSerializer.getPopupMarketsForLive(fixtureSnapshot, this.popupConfig);
          if (!isEventTriggered && this.fixture) {
            if (Number(fixtureSnapshot.ParticipantsValue1) > Number(this.fixture.ParticipantsValue1)) {
              fixtureSnapshot.goal = 'active';
              fixtureSnapshot.goal_team = 1;
              isEventTriggered = true;
              setTimeout(() => {
                isEventTriggered = false;
                fixtureSnapshot.goal = '';
              }, 6000);
            } else if (Number(fixtureSnapshot.ParticipantsValue2) > Number(this.fixture.ParticipantsValue2)) {
              fixtureSnapshot.goal = 'active';
              fixtureSnapshot.goal_team = 2;
              isEventTriggered = true;
              setTimeout(() => {
                isEventTriggered = false;
                fixtureSnapshot.goal = '';
              }, 6000);
            }
          }
          this.fixture = fixtureSnapshot;
          if (!this.isSubscribed) {
            this.subscribeMarketData(this.fixture);
            this.isSubscribed = true;
          }
        } else {
          if (fixtureSnapshot.Status === 3) {
            this.showMatchEndAnimation = true;
            setTimeout(() => {
              this.fixture = null;
              this.showMatchEndAnimation = false;
            }, 6000);
          } else {
            this.fixture = null;
          }
        }
      }
    });
  }

  private subscribeMarketData(fixture) {
    const fixtureId = fixture.fixtureId;
    const displayConfig = this.config ? this.config.live_display_config : null;
    if (displayConfig) {
      Object.keys(displayConfig).map((marketName) => {
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
                if (this.fixture) {
                  const element = this.fixture[marketName][childKey];
                  const oldPrice = element.BetsPrice;
                  const id = `${fixtureId}_${marketName}_${childKey}`;
                  this.checkUpDownValue(oldPrice, snapshot.val(), id);
                  const isSelected = this.selectedTips.find((x) => x.id === id);
                  if (isSelected) {
                    this.$emit('onChangeSelectedTip', snapshot.key, snapshot.val(), id);
                  }
                }
              });
              this.refList.push(ref);
            } else {
              Object.keys(childNodeValue).map((childNodeKey) => {
                const refPath = `live/${fixtureId}/${marketName}/${childKey}/${childNodeKey}`;
                const ref = db.ref(refPath);
                ref.on('child_changed', (snapshot) => {
                  const transformedMarketName = marketName === 'Under-Over' ? 'Under/Over' : marketName;
                  if (this.fixture) {
                    const element = this.fixture[marketName][childKey][childNodeKey];
                    const oldPrice = element.BetsPrice;
                    const id = `${fixtureId}_${transformedMarketName}_${childKey}_${childNodeKey}`;
                    this.checkUpDownValue(oldPrice, snapshot.val(), id);
                    const isSelected = this.selectedTips.find((x) => x.id === id);
                    if (isSelected) {
                      this.$emit('onChangeSelectedTip', snapshot.key, snapshot.val(), id);
                    }
                  }
                });
                this.refList.push(ref);
              });
            }
          });
        }
      });
    }
  }

  private onChangeSelectedTip(keyName, value, id) {
    this.$emit('onChangeSelectedTip', keyName, value, id);
  }

  private onSelectTip(tip) {
    const tipIndex = this.selectedTips.indexOf(tip);
    if (tipIndex !== -1) {
      this.selectedTips.splice(tipIndex, 1);
    } else {
      this.selectedTips.push(tip);
    }
    this.$emit('onSelectTip', tip, this.fixture);
  }

  private openPopupMarket() {
    this.$bvModal.show(`live-popup-market-modal-${this.fixtureId}`);
  }

  private beforeDestroy() {
    this.liveFixtureRef.off('value');
    this.refList.map((ref) => {
      ref.off('value');
    });
  }
}
