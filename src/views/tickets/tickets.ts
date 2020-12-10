import { Component, Vue } from 'vue-property-decorator';
import { authAPI } from '@/providers/apis/auth/auth';
import ViewTicket from '@/components/view-ticket/view-ticket';
import i18n from '@/i18n';
import moment from 'moment';
import _ from 'lodash';

@Component({
  components: {
    'view-ticket': ViewTicket,
  },
})
export default class Tickets extends Vue {

  private isLoading: boolean = false;
  private ticketList: any[] = [];
  private activeFilter: any = {};
  private lastTwoDate: any;
  private tempTicketList: any;
  private activeViewFilter: any = {};
  private selectedTicketIdToView: string = null;
  get rows() {
    return this.ticketList.length;
  }

  get viewByFilters() {
    return [{
      label: 'Win',
      filterBy: 'status',
    }, {
      label: 'Lose',
      filterBy: 'status',
    }, {
      label: 'Pending',
      filterBy: 'status',
    }];
  }

  get currentDate() {
    return moment();
  }

  get filterByDates() {
    const currentDate = this.currentDate;
    const yesterdayDate = _.cloneDeep(currentDate).subtract(1, 'day');
    const firstTwoDate = _.cloneDeep(currentDate).subtract(2, 'day');
    const lastTwoDate = _.cloneDeep(currentDate).subtract(3, 'day');
    const filters = [{
      label: 'Today',
      value: currentDate,
      filterBy: 'date',
    }, {
      label: 'Yesterday',
      value: yesterdayDate,
      filterBy: 'date',
    }, {
      label: firstTwoDate.format('ddd, DD.MM'),
      value: firstTwoDate,
      filterBy: 'date',
    }, {
      label: lastTwoDate.format('ddd, DD.MM'),
      value: lastTwoDate,
      filterBy: 'date',
    }];
    this.lastTwoDate = lastTwoDate;
    this.activeFilter = filters[0];
    return filters;
  }

  get filterByOtherDates() {
    const filterByOtherDates = [];
    const lastTwoDate = this.lastTwoDate;
    for (let count = 1; ; count++) {
      const date = _.cloneDeep(lastTwoDate).subtract(count, 'day');
      filterByOtherDates.push({
        label: date.format('ddd, DD.MM'),
        value: date,
        filterBy: 'date',
      });
      if (count > 10) {
        break;
      }
    }
    return filterByOtherDates;
  }
  get fields() {
    return [
      { key: 'DateTime', label: '' },
      { key: 'TicketsNo', label: i18n.t('Tickets No') },
      { key: 'BetType', label: i18n.t('Bet type') },
      { key: 'BetAmount', label: i18n.t('Bet Amount') },
      { key: 'PossibleWinnings', label: i18n.t('Possible winnings') },
      { key: 'Status', label: i18n.t('Status') },
      { key: 'action', label: i18n.t('Action') },
    ];
  }

  private created() {
    this.isLoading = true;
    const token = this.$cookies.get('bet1_session');
    authAPI.getUserTickets(token).then((response) => {
      // TODO: Set Pending value for empty string in status
      const result = response.map((res) => {
        if (res.Status === '') {
          res.Status = 'Pending';
        }
        return res;
      });
      this.ticketList = result;
      this.tempTicketList = result;
      this.filterTicket();
      this.isLoading = false;
    });
  }

  private onSelectFilter(item) {
    this.activeFilter = item;
    this.filterTicket();
  }

  private onSelectViewFilter(item) {
    if (this.activeViewFilter === item) {
      this.activeViewFilter = {};
      this.filterTicket();
    } else {
      this.activeViewFilter = item;
      this.filterViewTicket();
    }
  }

  private viewTicket(ticketId) {
    this.selectedTicketIdToView = ticketId;
    this.$bvModal.show('view-ticket');
  }

  private filterViewTicket() {
    const activeFilter = this.activeFilter;
    const activeViewFilter = this.activeViewFilter;
    const filteredList = this.tempTicketList.filter((ticket) => {
      const ticketDate = ticket.DateTime.split(' ')[0];
      const isSameDate = ticketDate === activeFilter.value.format('MM/DD/YY');
      return activeViewFilter.label === ticket.Status && isSameDate;
    });
    this.ticketList = filteredList;
  }

  private filterTicket() {
    const activeFilter = this.activeFilter;
    const filteredList = this.tempTicketList.filter((ticket) => {
      if (activeFilter.filterBy === 'date') {
        const ticketDate = ticket.DateTime.split(' ')[0];
        return ticketDate === activeFilter.value.format('MM/DD/YY');
      }
    });
    this.ticketList = filteredList;
  }
}
