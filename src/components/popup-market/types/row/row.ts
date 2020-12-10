import { Component, Vue, Prop } from 'vue-property-decorator';
@Component({
  name: 'row',
})
export default class Row extends Vue {
  @Prop()
  private market: any;

  @Prop()
  private sportId: any;

  @Prop()
  private selectedTips: any[];

  public onSelectTip(tip) {
    this.$emit('onSelectTip', tip);
  }
}
