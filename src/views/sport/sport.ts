import { Component, Vue, Prop, Watch } from 'vue-property-decorator';
import LeagueContainerList from '@/components/league-container-list/league-container-list';
import PreLiveFixtureTable from '@/components/pre-live-fixture-table/pre-live-fixture-table';
import LiveFixtureTable from '@/components/live-fixture-table/live-fixture-table';
import SportCountriesList from '@/components/sport-countries-list/sport-countries-list';
import { sportsService } from '@/providers/services/sports/sports';
import BetSlip from '@/components/bet-slip/bet-slip';
import { CountryModel } from '@/models/sports/country';
import { SportsModel } from '@/models/config/sports';
import { authAPI } from '@/providers/apis/auth/auth';
import ViewTicket from '@/components/view-ticket/view-ticket';
import _ from 'lodash';
import moment from 'moment';
import i18n from '@/i18n';

const BET_TYPES = {
  SIGNLE: 'Single',
  COMBINATIONS: 'Combinations',
  MULTIWAY: 'Multiway',
  EXTMULTIWAY: 'Ext. Multiway',
};

const PAGE_REFRESH_INTERVAL = 1200000; // 20 min
@Component({
  components: {
    'sport-countries-list': SportCountriesList,
    'league-container-list': LeagueContainerList,
    'pre-live-fixture-table': PreLiveFixtureTable,
    'live-fixture-table': LiveFixtureTable,
    'bet-slip': BetSlip,
    'view-ticket': ViewTicket,
  },
})
export default class Sport extends Vue {
  get selectedSport() {
    const sportName = this.$route.params.sportName;
    const sports = this.$store.state.config.sports;
    return sports.find((sport) => sport.displayName === sportName);
  }

  get getBetSlipConfig() {
    return this.$store.state.config.betslip.betslip || this.$store.state.config.betslip;
  }

  get todayFixtures() {
    const todayFixtures = this.$store.state.sports.todayFixtures;
    const todayData = todayFixtures.find((todayFixture) => {
      return todayFixture.sportId === this.selectedSport.sportId;
    });
    return todayData ? todayData : [];
  }

  get minimumStakePerRow() {
    return Number(this.$store.state.config.betslip.betslip.minimum_stake_per_row);
  }

  get minimumStake() {
    return Number(this.$store.state.config.betslip.betslip.min_stake);
  }

  get maxmiumStake() {
    return Number(this.$store.state.config.betslip.betslip.max_stake);
  }

  // -----------------------------------------
  // Properties

  @Prop()
  private isLoggedIn: boolean;

  private minNoMatches: number = 0;

  private showMinNoMatchesText: boolean = false;

  private rowCount: number = 0;

  private totalStake: number = this.minimumStake;

  private betType: string = '';

  private totalOdd: number = null;

  private possibleWinnings: number = null;

  private isLoading: boolean = false;

  private showTodayMatch: boolean = false;

  private showLiveMatch: boolean = false;

  private showPreLiveMatch: boolean = false;

  private timer: number = 0;

  private showTimerCount: boolean = false;

  private showRefreshPrompt: boolean = false;

  private country: CountryModel = {
    countryId: '',
    countryName: '',
    leagues: null,
  };

  private selectedTips: any[] = [];

  private selectedTipsForBet: any[] = [];

  private ticketId: string = null;

  private leagueId: string = null;

  private intervalTimer: any;

  @Watch('isLoggedIn')
  private onChangeLogin() {
    this.clearAllTips();
  }

  private onSelectLeague(league) {
    this.leagueId = league.leagueId;
  }

  private onSelectCountry(country: CountryModel) {
    this.showTodayMatch = false;
    this.showPreLiveMatch = false;
    // TODO: Live supports only Football
    const sportName = this.$route.params.sportName;
    if (sportName === 'Football') {
      this.showLiveMatch = true;
    } else {
      this.showLiveMatch = false;
    }
    if (country) {
      country.isActive = true;
      this.country = country;
    } else {
      this.country = {
        countryId: '',
        countryName: '',
        leagues: null,
      };
    }
  }

  private onClearLeague(leagueId, countryId) {
    if (this.todayFixtures.countries) {
      const country = this.todayFixtures.countries.find((countryItem) => countryItem.countryId === countryId);
      if (country.leagues) {
        const league = country.leagues.find((leagueItem) => leagueItem.leagueId === leagueId);
        if (league) {
          league.fixtures = [];
          league.isHide = true;
        }
      }
    }
  }

  private created() {
    this.initRefreshInterval();
  }

  private initRefreshInterval() {
    this.intervalTimer = setInterval(() => {
      if (!this.showRefreshPrompt) {
        this.showRefreshPrompt = true;
      }
    }, PAGE_REFRESH_INTERVAL);
  }

  private beforeDestroy() {
    clearInterval(this.intervalTimer);
  }

  private onContinue() {
    this.showRefreshPrompt = false;
  }

  private onRefresh() {
    this.showRefreshPrompt = false;
    window.location.reload();
  }

  private onSelectTodayMatch() {
    this.showTodayMatch = true;
    this.showLiveMatch = false;
    this.showPreLiveMatch = false;
  }

  private onSelectTip(tip, fixture, isLive) {
    let currentIndex;
    const maxTipSelect = this.getBetSlipConfig.min_tip_pre;
    const tipIndex = this.selectedTips.findIndex((x) => x.id === tip.id);
    const totalCount = this.selectedTips.filter((item) => item.fixtureId === tip.fixtureId).length;
    tip.isLive = isLive;
    if (!isLive) {
      fixture.ParticipantsValue1 = 0;
      fixture.ParticipantsValue2 = 0;
    }
    if (tipIndex !== -1) {
      this.selectedTips.splice(tipIndex, 1);
      this.selectedTipsForBet.splice(tipIndex, 1);
    } else if (totalCount >= Number(maxTipSelect)) {
      alert('Can\'t pick more than 3 in same match !');
    } else {
      const tipFixtures = this.selectedTips.filter((x) => x.fixtureId === tip.fixtureId);
      const tipFixture = tipFixtures[tipFixtures.length - 1];
      const indexPos = this.selectedTips.indexOf(tipFixture);
      currentIndex = indexPos + 1;
      this.selectedTips.splice(currentIndex, 0, tip);
      this.selectedTipsForBet.splice(currentIndex, 0, {
        tip,
        fixture,
      });
    }
    this.sortTip(this.selectedTips);
    this.handleRowCount(currentIndex);
    this.handleMinNoOfMatches();
  }

  private sortTip(selectedTips) {
    let tempFixtureId = '';
    selectedTips.forEach((tip, index) => {
      const fixtureId = tip.fixtureId;
      if (fixtureId !== tempFixtureId) {
        tip.fixture_show = 1;
      } else {
        tip.fixture_show = 0;
      }
      tempFixtureId = fixtureId;
    });
  }

  private onSelectLiveMatch() {
    if (this.selectedSport.displayName === 'Football') {
      this.showLiveMatch = true;
      this.showPreLiveMatch = true;
    } else {
      this.showPreLiveMatch = false;
      this.showLiveMatch = false;
    }
    this.country = {
      countryId: '',
      countryName: '',
      leagues: null,
    };
    this.showTodayMatch = false;
  }

  private clearAllTips() {
    this.selectedTips.map((selectedTip) => {
      selectedTip.isSelected = false;
    });
    this.selectedTips = [];
    this.selectedTipsForBet = [];
    this.showMinNoMatchesText = false;
    this.minNoMatches = 0;
    this.handleRowCount();
  }

  private clearTip(element) {
    element.tip.isSelected = false;
    const index = this.selectedTipsForBet.indexOf(element);
    this.selectedTipsForBet.splice(index, 1);
    this.selectedTips.splice(index, 1);
    this.sortTip(this.selectedTips);
    this.handleRowCount(index);
    this.handleMinNoOfMatches();
  }

  private onChangeSelectedTip(keyName, value, id) {
    const selectedTip = this.selectedTips.find((x) => x.id === id);
    if (selectedTip) {
      if (keyName === 'BetsPrice') {
        selectedTip.price = value;
      } else {
        selectedTip.status = value;
      }
    }
    this.handleRowCount();
  }

  private handleRowCount(currentIndex?, isStakeUpdated?) {
    const length = this.selectedTipsForBet.length;
    let rowCount = this.selectedTipsForBet && this.selectedTipsForBet.length > 0 ? 1 : 0;
    const rowCountObject = this.count(this.selectedTipsForBet, (item) => {
      return item.tip.fixtureId;
    });
    Object.values(rowCountObject).map((value: any) => {
      rowCount *= value;
    });
    const stakeNumber = length * this.minimumStakePerRow;
    if (stakeNumber > this.minimumStake && rowCount > 1) {
      const totalStake = rowCount / this.minimumStake;
      if (totalStake > this.minimumStake) {
        this.totalStake = totalStake;
      }
    }
    if (!length && !isStakeUpdated) {
      this.totalStake = this.minimumStake;
    }
    this.handleBetType(rowCountObject, rowCount, currentIndex);
    this.rowCount = rowCount;
  }

  private onSubmitPlaceBet() {
    const token = this.$cookies.get('bet1_session');
    if (token) {
      const request = this.serializePlacebetRequest();
      authAPI.placeBet(request, token).then((response) => {
        this.ticketId = request.mt;
        const liveCount = this.selectedTipsForBet.find((item) => {
          return item.tip.isLive;
        });
        if (liveCount) {
          this.showTimer();
        } else {
          this.selectedTips = [];
          this.selectedTipsForBet = [];
          this.handleRowCount();
          this.$bvModal.show('view-ticket');
        }
      });
    } else {
      alert(i18n.t('Please Sign In'));
    }
  }

  private handleBetType(rowCountObject, rowCount, currentIndex?) {
    let betType = '';
    let totalOdd;
    let possibleWinnings;
    const maxOddPerTicket = Number(this.getBetSlipConfig.maximum_odds_per_ticket);
    const totalFixtureCount = Object.keys(rowCountObject).length;
    const rowCountValues: number[] = Object.values(rowCountObject);
    const maxCount = Math.max(...rowCountValues);
    const selectedTipCount = this.selectedTipsForBet.length;
    if (selectedTipCount === 1) {
      betType = BET_TYPES.SIGNLE;
      totalOdd = this.selectedTipsForBet[0].tip.price;
      possibleWinnings = totalOdd * this.totalStake;
    } else if (totalFixtureCount > 1 && maxCount === 1) {
      betType = BET_TYPES.COMBINATIONS;
      let oddPriceTotal = 1;
      this.selectedTipsForBet.map((selectedTip) => {
        oddPriceTotal = oddPriceTotal * selectedTip.tip.price;
      });
      totalOdd = oddPriceTotal;
      possibleWinnings = totalOdd * this.totalStake;
    } else {
      if (this.selectedTipsForBet.length) {
        const oddCountObject = this.count(this.selectedTipsForBet, (item) => {
          return item.tip.marketId;
        });
        let isExtMutliway = false;
        let tempFixtureId;
        for (const odd in oddCountObject) {
          if (oddCountObject.hasOwnProperty(odd)) {
            const fixtureId = odd.split('_')[0];
            if (fixtureId !== tempFixtureId) {
              isExtMutliway = true;
            } else {
              isExtMutliway = false;
              break;
            }
            tempFixtureId = fixtureId;
          }
        }
        const groupByFixtureData = _.chain(this.selectedTipsForBet).groupBy('tip.fixtureId')
          .map((value, key) => ({
            id: key, markets: value,
          })).value();
        if (!isExtMutliway) {
          const marketTips = [];
          let oddPriceTotal = 1;
          groupByFixtureData.map((fixture) => {
            let totalOddInFixture = 0;
            const groupByMarketData = _.chain(fixture.markets).groupBy('tip.marketName')
              .map((value, key) => ({
                id: key, maxOddPrice: Math.max.apply(Math, value.map((o) => o.tip.price)),
              })).value();
            groupByMarketData.map((marketItem) => {
              totalOddInFixture = marketItem.maxOddPrice + totalOddInFixture;
            });
            oddPriceTotal = oddPriceTotal * totalOddInFixture;
          });
          totalOdd = oddPriceTotal;
          possibleWinnings = totalOdd * (this.totalStake / rowCount);
          betType = BET_TYPES.EXTMULTIWAY;
        } else {
          let oddPriceTotal = 1;
          groupByFixtureData.map((fixture) => {
            const maxOddPrice = Math.max.apply(Math, fixture.markets.map((o) => o.tip.price));
            oddPriceTotal = maxOddPrice * oddPriceTotal;
          });
          totalOdd = oddPriceTotal;
          possibleWinnings = totalOdd * (this.totalStake / rowCount);
          betType = BET_TYPES.MULTIWAY;
        }
      }
    }
    const roundedTotalOdd = totalOdd ? Number(totalOdd).toFixed(2) : totalOdd;
    if (this.selectedTips.length) {
      if (roundedTotalOdd <= maxOddPerTicket) {
        this.totalOdd = roundedTotalOdd;
        this.possibleWinnings = possibleWinnings ? possibleWinnings.toFixed(2) : possibleWinnings;
        this.betType = betType;
      } else {
        alert(`Max odds per ticket is ${maxOddPerTicket}`);
        this.selectedTipsForBet.splice(currentIndex, 1);
        this.selectedTips.splice(currentIndex, 1);
      }
    } else {
      this.betType = '';
      this.possibleWinnings = null;
      this.totalOdd = null;
      this.minNoMatches = 0;
      this.showMinNoMatchesText = false;
    }
  }

  private handleMinNoOfMatches() {
    const betslipData = this.$store.state.config.betslip.betslip;
    const leagueList = this.$store.state.config.betslip.league;
    if (leagueList && leagueList.length) {
      if (this.selectedTipsForBet.length === 0) {
        this.showMinNoMatchesText = false;
        return;
      }
      this.selectedTipsForBet.filter((selectedTip) => {
        const leagueId = selectedTip.fixture.LeagueId;
        const leagueData = leagueList.find((league) => {
          return league.league_id === leagueId;
        });
        if (selectedTip.tip.isLive) {
          selectedTip.min_no_matches = 1;
        } else {
          if (leagueData) {
            selectedTip.min_no_matches = leagueData.min_no_matches;
          } else {
            selectedTip.min_no_matches = betslipData.min_no_matches;
          }
        }
      });
      const maxValue = Math.max.apply(Math, this.selectedTipsForBet.map((item) => {
        return item.min_no_matches;
      }));
      if (this.selectedTipsForBet.length < maxValue) {
        const missingCount = maxValue - this.selectedTipsForBet.length;
        this.showMinNoMatchesText = true;
        this.minNoMatches = missingCount;
      } else {
        this.showMinNoMatchesText = false;
        this.minNoMatches = 0;
      }
    }
  }

  private count(ary, classifier) {
    classifier = classifier || String;
    return ary.reduce((counter, item) => {
      const p = classifier(item);
      counter[p] = counter.hasOwnProperty(p) ? counter[p] + 1 : 1;
      return counter;
    }, {});
  }

  private onChangeStake(updatedStake) {
    this.totalStake = updatedStake;
    this.handleRowCount(null, true);
  }

  private serializePlacebetRequest() {
    this.selectedTipsForBet.map((selectedTipForBet) => {
      if (selectedTipForBet.tip.marketName.startsWith('Under-')) {
        selectedTipForBet.tip.marketName = selectedTipForBet.tip.marketName.replace('-', '/');
      }
    });
    return {
      total_stake: this.totalStake.toString(),
      bet_type: this.betType,
      total_odds: this.totalOdd.toString(),
      possible_winnings: this.possibleWinnings,
      mt: moment().valueOf().toString(),
      row: this.rowCount.toString(),
      odd_arr: this.getData('tip', 'price').toString(),
      odd_name_arr: this.getData('tip', 'name').toString(),
      match_time_arr: this.getTime().toString(),
      team_1_name_arr: this.getData('fixture', 'ParticipantsName1').toString(),
      team_2_name_arr: this.getData('fixture', 'ParticipantsName2').toString(),
      team_1_score_arr: this.getData('fixture', 'ParticipantsValue1').toString(),
      team_2_score_arr: this.getData('fixture', 'ParticipantsValue2').toString(),
      market_name_arr: this.getData('tip', 'marketName').toString(),
      extra_arr: this.getExtraMarket().toString(),
      market_id_arr: this.getAllMarket(false),
      event_id_arr: this.getEvents().toString(),
      all_market: this.getAllMarket(true),
      tip_arr: this.getData('tip', 'name').toString(),
      match_type_arr: this.getMatchType().toString(),
      extended: '',
      tax: '0.00',
    };
  }

  private getData(keyName1, keyName2?) {
    const result = this.selectedTipsForBet.map((item) => {
      return item[keyName1][keyName2];
    });
    return result ? result : [];
  }

  private getExtraMarket() {
    const result = this.selectedTipsForBet.map((item) => {
      const splitedValue = item.tip.id.split('_');
      const length = splitedValue.length;
      if (length > 3) {
        const extraKey = splitedValue[2];
        if (extraKey.indexOf(':') === -1 && extraKey.indexOf('.') === -1) {
          return `${extraKey[0]}.${extraKey[1] ? extraKey[1] : 0}`;
        } else {
          return extraKey;
        }
      }
      return 0;
    });
    return result ? result : [];
  }

  private getTime() {
    const result = this.selectedTipsForBet.map((item) => {
      let time;
      if (item.tip.isLive) {
        time = item.fixture.Time;
      } else {
        const startDate = item.fixture.StartDate;
        time = moment.unix(Number(startDate)).format('HH:mm');
      }
      return time;
    });
    return result ? result : [];
  }

  private getEvents() {
    const result = this.selectedTipsForBet.map((item) => {
      const keyName = item.tip.isLive ? 'fixtureId' : 'FixtureId';
      return item.fixture[keyName];
    });
    return result ? result : [];
  }

  private getMatchType() {
    const result = this.selectedTipsForBet.map((item) => {
      return item.tip.isLive ? 'live' : 'pre';
    });
    return result ? result : [];
  }

  private getAllMarket(doSeperator) {
    let result = '';
    let tempFixtureId;
    this.selectedTipsForBet.map((item, index) => {
      const keyName = item.tip.isLive ? 'fixtureId' : 'FixtureId';
      const fixtureId = item.fixture[keyName];
      let seperatorBy;
      const fullPath = fixtureId + item.tip.marketName.match(/\b\w/g).join('') + item.tip.name;
      if (tempFixtureId !== fixtureId && doSeperator) {
        seperatorBy = '#';
      } else {
        seperatorBy = ',';
      }
      if (index > 0) {
        result = result + seperatorBy + fullPath;
      } else {
        result = result + fullPath;
      }
      tempFixtureId = fixtureId;
    });
    return result;
  }


  private showTimer() {
    this.showTimerCount = true;
    const intervalTimer = setInterval(() => {
      this.timer = this.timer + 1;
      if (this.timer >= 6) {
        this.showTimerCount = false;
        this.selectedTips = [];
        this.selectedTipsForBet = [];
        this.timer = 0;
        this.handleRowCount();
        clearInterval(intervalTimer);
        this.$bvModal.show('view-ticket');
      }
    }, 1000);
  }
}
