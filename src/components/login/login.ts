import { Component, Vue, Prop } from 'vue-property-decorator';
import { authAPI } from '@/providers/apis/auth/auth';
@Component({})
export default class Login extends Vue {
  private isLoading: boolean = false;

  @Prop()
  private show: boolean;

  private userName: string = '';

  private password: string = '';

  private closeLogin() {
    this.$emit('onCloseLogin');
  }

  private login() {
    this.isLoading = true;
    const params = {
      user_name: this.userName,
      user_password: this.password,
    };
    authAPI.login(params).then((result) => {
      if (result.status !== 'error') {
        authAPI.getBetSlipConfigByUser(result.token).then((config) => {
          this.$cookies.set('bet1_session', result.token, { expires: '60min' });
          this.$store.dispatch('config/setBetSlipConfig', config);
          window.localStorage.setItem('userProfile', JSON.stringify({
            username: this.userName,
            currency: result.currency,
          }));
          this.$emit('isLogInSuccess');
          this.isLoading = false;
          this.closeLogin();
        });
      } else {
        alert(result.message);
        this.isLoading = false;
      }
    });
  }
}
