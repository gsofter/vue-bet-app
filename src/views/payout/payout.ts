import { Component, Vue } from 'vue-property-decorator';
import { authAPI } from '@/providers/apis/auth/auth';


@Component({})
export default class Payout extends Vue {
  private isLoading: boolean = false;
  private requestPayout: string = '';
  private password: string = '';
  private payoutSuccessMsg: string = '';
  private userBalance: string = '';

  private payoutSubmit() {
    this.isLoading = true;
    const token = this.$cookies.get('bet1_session');
    const params = {
      request_payout: this.requestPayout,
    };
    authAPI.requestPayout(params, token).then((result) => {
      this.password = result.password;
      this.payoutSuccessMsg = result.message;
      this.isLoading = false;
      this.$bvModal.show('show-payout-modal');
    });
  }
  private onClose() {
    this.requestPayout = '';
  }

  private created() {
    const intervalTimer = setInterval(() => {
      this.userBalance = this.$store.state.config.userBalance;
    }, 1000);
  }
}
