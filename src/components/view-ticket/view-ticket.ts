import { Component, Vue, Prop } from 'vue-property-decorator';
import { authAPI } from '@/providers/apis/auth/auth';
import _ from 'lodash';
@Component({})
export default class ViewTicket extends Vue {
  @Prop()
  private ticketId: string;
  private isLoading: boolean = false;
  private selectedTicketToView: any = {};
  private sportName: string = '';
  private barCodePath: string = '';

  get ticket() {
    return this.selectedTicketToView.ticket || {};
  }

  get comList() {
    const com = this.selectedTicketToView.com || [];
    return _.chunk(com, 2);
  }

  get tips() {
    const tempData = _.cloneDeep(this.selectedTicketToView);
    delete tempData.ticket;
    delete tempData.com;
    if (tempData) {
      let tempFixtureId = '';
      Object.values(tempData).forEach((tip: any) => {
        const fixtureId = tip.FixtureId;
        if (tempFixtureId !== fixtureId) {
          tip.showFixtureName = 1;
        } else {
          tip.showFixtureName = 0;
        }
        const count = Object.values(tempData).filter((item: any) => item.FixtureId === fixtureId);
        tip.count = count;
        tempFixtureId = fixtureId;
      });
    }
    return tempData;
  }

  get logoPath() {
    return `${process.env.VUE_APP_API_URL}/${this.ticket.logo}`;
  }

  private isArray(item) {
    return Array.isArray(item);
  }

  private getLivePath(keyname) {
    return `${process.env.VUE_APP_API_URL}/${keyname}`;
  }

  private getSportId(sportName) {
    // TODO: transform sport name by trailing space and capitalize
    sportName = this.capitalize(sportName);
    const sports = this.$store.state.config.sports;
    const sport = sports.find((sportItem) => sportItem.displayName === sportName);
    return sport.sportId;
  }

  private capitalize(text) {
    text = text.replace(' ', '').toLowerCase();
    return text.charAt(0).toUpperCase() + text.slice(1);
  }

  private close() {
    this.$bvModal.hide('view-ticket');
  }

  private created() {
    this.isLoading = true;
    const token = this.$cookies.get('bet1_session');
    authAPI.getTicketInfo({ mt: this.ticketId }, token).then((result) => {
      authAPI.getBarCode({ mt: this.ticketId }, token).then((response) => {
        let data;
        try {
          data = JSON.parse(response);
        } catch (e) {
          const res = response.substr(response.indexOf('{'), response.indexOf('<'));
          data = JSON.parse(res);
        }
        this.barCodePath = `${process.env.VUE_APP_API_URL}/${data.barcode}`;
        this.selectedTicketToView = result;
        this.isLoading = false;
      });
    });
  }
}
