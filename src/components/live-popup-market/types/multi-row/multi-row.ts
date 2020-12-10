import { Component, Vue, Prop } from 'vue-property-decorator';
@Component({
  name: 'multi-row',
})
export default class MultiRow extends Vue {
  @Prop()
  private market: any;

  @Prop()
  private sportId: any;

  @Prop()
  private selectedTipList: any[];

  public onSelectTip(tip) {
    this.$emit('onSelectTip', tip);
  }
}
