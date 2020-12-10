import { Component, Vue, Prop } from 'vue-property-decorator';
@Component({
  name: 'clubed',
})
export default class Clubed extends Vue {
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
