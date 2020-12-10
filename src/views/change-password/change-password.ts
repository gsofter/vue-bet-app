import { Component, Vue } from 'vue-property-decorator';
import { authAPI } from '@/providers/apis/auth/auth';

@Component({})
export default class ChangePassword extends Vue {
  private isLoading: boolean = false;
  private oldPassword: string = '';
  private newPassword: string = '';
  private confirmPassword: string = '';
  private isMismatch: boolean = false;
  private successMessage: string = '';
  private status: string = '';

  private passwordCheck() {
    if (this.isMismatch) {
      if (this.newPassword && this.confirmPassword) {
        if (this.newPassword === this.confirmPassword) {
          this.isMismatch = false;
        } else {
          this.isMismatch = true;
        }
      } else {
        this.isMismatch = false;
      }
    }
  }

  private changePassword() {
    if (this.newPassword !== this.confirmPassword) {
      this.isMismatch = true;
    } else {
      this.isMismatch = false;
      this.isLoading = true;
      const token = this.$cookies.get('bet1_session');
      const params = {
        old_password: this.oldPassword,
        new_password: this.newPassword,
      };
      authAPI.changePassword(params, token).then((result) => {
        this.successMessage = result.message;
        this.status = result.status;
        if (this.status === 'success') {
          this.oldPassword = '';
          this.newPassword = '';
          this.confirmPassword = '';
        }
        const self = this;
        setTimeout(() => {
          self.successMessage = '';
        }, 2000);
        this.isLoading = false;
      });
    }
  }
}
