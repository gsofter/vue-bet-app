import { Component, Vue, Prop, Watch } from 'vue-property-decorator';

@Component({
  name: 'bet-slip',
})
export default class BetSlip extends Vue {

  get minimumStakePerRow() {
    return Number(this.$store.state.config.betslip.betslip.minimum_stake_per_row);
  }

  get minimumStake() {
    return Number(this.$store.state.config.betslip.betslip.min_stake);
  }

  get maxmiumStake() {
    return Number(this.$store.state.config.betslip.betslip.max_stake);
  }

  @Prop()
  public minNoMatches: number;

  @Prop()
  public showMinNoMatchesText: boolean;

  @Prop()
  private selectedTips: any;

  @Prop()
  private rowCount: number;

  private isDisabled: boolean = false;

  @Prop()
  private totalStake: number;

  @Prop()
  private betType: string;

  @Prop()
  private totalOdd: number;

  @Prop()
  private possibleWinnings: number;

  private stakeNumber: string = '';

  private mounted() {
    this.$watch('selectedTips', () => {
      const lockedCount = this.selectedTips.filter((selectedTip) =>
        selectedTip.tip.status !== 1 && selectedTip.tip.isLive);
      this.isDisabled = lockedCount.length;
    }, { deep: true });
  }

  private clearAllTips() {
    this.$emit('clearAllTips');
  }

  private clearTip(tip) {
    this.$emit('clearTip', tip);
  }

  private addNumber(numberInput) {
    this.stakeNumber += numberInput;
  }

  private clearInput() {
    this.stakeNumber = '';
  }

  private decreaseStake() {
    const stakePerRow = this.minimumStakePerRow;
    const minStake = this.minimumStake;
    const maxStake = this.maxmiumStake;
    const updatedStake = Number(this.totalStake) - Number(stakePerRow);
    if (!this.validateStake(updatedStake)) {
      alert(`Total stake enter between ${minStake} and ${maxStake}`);
    } else {
      this.$emit('onChangeStake', updatedStake);
    }
  }

  private increaseStake() {
    const stakePerRow = this.minimumStakePerRow;
    const minStake = this.minimumStake;
    const maxStake = this.maxmiumStake;
    const updatedStake = Number(this.totalStake) + Number(stakePerRow);
    if (!this.validateStake(updatedStake)) {
      alert(`Total stake enter between ${minStake} and ${maxStake}`);
    } else {
      this.$emit('onChangeStake', updatedStake);
    }
  }

  private validateStake(stakeNumber) {
    const minStake = this.minimumStake;
    const maxStake = this.maxmiumStake;
    return (stakeNumber) >= Number(minStake) && stakeNumber <= Number(maxStake);
  }

  private submit() {
    this.$bvModal.hide('stake-calculator-modal');
    const minStake = this.minimumStake;
    const maxStake = this.maxmiumStake;
    if (Number(this.stakeNumber) >= Number(minStake) && Number(this.stakeNumber) <= Number(maxStake)) {
      this.$emit('onChangeStake', Number(this.stakeNumber));
    } else {
      alert(`Total stake enter between ${minStake} and ${maxStake}`);
    }
    this.stakeNumber = '';
  }

  private onSubmitPlaceBet() {
    this.$emit('onSubmitPlaceBet');
  }

}
