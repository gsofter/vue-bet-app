import { Component, Vue, Prop } from 'vue-property-decorator';

@Component({
  name: 'pre-live-fixture-header',
})
export default class PreLiveFixtureRow extends Vue {
  @Prop()
  private markets: any;

  @Prop()
  private sportId: string;

  @Prop()
  private countryName: string;

  @Prop()
  private leagueName: string;
}
