import { Component, Vue } from 'vue-property-decorator';
import { authAPI } from '@/providers/apis/auth/auth';
import ViewTicket from '@/components/view-ticket/view-ticket';


@Component({
  components: {
    'view-ticket': ViewTicket,
  },
})
export default class AccountStatement extends Vue {
  private isLoading: boolean = false;
  private statementList: any[] = [];
  private currentPage: number = 1;
  private perPage: number = 10;
  private selectedTicketIdToView: string = null;

  public beforeMount() {
    this.getAccountStatements();
  }

  get rows() {
    return this.statementList.length;
  }

  private viewTicket(ticketId) {
    this.selectedTicketIdToView = ticketId;
    this.$bvModal.show('view-ticket');
  }

  private isDisable(statement) {
    return isNaN(statement);
  }


  private getAccountStatements() {
    this.isLoading = true;
    const token = this.$cookies.get('bet1_session');
    authAPI.getAccountStatements(token).then((result) => {
      if (result) {
        this.statementList = result;
      }
      this.isLoading = false;
    });
  }
}
