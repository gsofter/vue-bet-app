import { Component, Vue, Prop } from 'vue-property-decorator';

@Component({
  name: 'live-fixture-header',
})
export default class LiveFixtureRow extends Vue {

  @Prop()
  private markets: any;

  @Prop()
  private sportId: string;

  @Prop()
  private fixture: any;
}
