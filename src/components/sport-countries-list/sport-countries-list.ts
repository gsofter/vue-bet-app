import { Component, Vue, Prop, Watch } from 'vue-property-decorator';
import { CountryModel } from '@/models/sports/country';
import { SportModel } from '@/models/sports/sport';
import { isCompatibleVW } from '@/utils/utils';
import { SCREEN_SIZES } from '@/utils/constants';
import _ from 'lodash';
import i18n from '@/i18n';

@Component({
  name: 'sport-countries-list',
})
export default class SportCountriesList extends Vue {

  get filteredCountries() {
    if (this.searchText && this.searchText.length > 1) {
      const cloneObject = _.cloneDeep(this.currentSport);
      const countries = cloneObject ? cloneObject.countries : [];
      return countries.filter((country) => {
        const translatedCountryName: any = i18n.t(country.countryName);
        return translatedCountryName.toLowerCase().indexOf(this.searchText.toLowerCase()) >= 0;
      });
    }
    return [];
  }
  @Prop()
  private sportId: string;

  private isPaginate: boolean = false;

  private countries: CountryModel[] = [];

  private currentPage: number = 1;

  private totalPages: number = 0;

  private pageLimit: number = 14;

  private isTodayMatch: boolean = false;

  private isLiveMatch: boolean = false;

  private searchText: string = '';

  private currentSport: SportModel = {
    sportId: '',
    sportName: '',
    countries: [],
  };

  private selectedCountry: CountryModel = {
    countryId: '',
    countryName: '',
    leagues: [],
    isActive: false,
  };

  @Watch('sportId')
  public onSportChange(value: string, oldValue: string) {
    this.loadData();
  }

  public doPaginate() {
    const cloneObject = _.cloneDeep(this.currentSport);
    const countries = cloneObject ? cloneObject.countries : [];
    const totalItems = countries.length;
    const totalPageValue = (totalItems / this.pageLimit);
    const totalPages = Number.isInteger(totalPageValue) ? totalPageValue : Math.trunc(totalPageValue + 1);
    this.totalPages = totalPages;
    if (totalItems > this.pageLimit) {
      this.isPaginate = true;
      const firstPosition = (this.currentPage - 1) * this.pageLimit;
      this.countries = countries.splice(firstPosition, this.pageLimit);
    } else {
      this.countries = countries;
      this.isPaginate = false;
    }
  }

  public next() {
    if (this.currentPage < this.totalPages) {
      this.currentPage = this.currentPage + 1;
      this.doPaginate();
    }
  }

  public previous() {
    if (this.currentPage > 1) {
      this.currentPage = this.currentPage - 1;
      this.doPaginate();
    }
  }
  public selectCountry(country: CountryModel) {
    this.selectedCountry = country;
    this.isTodayMatch = false;
    this.isLiveMatch = false;
    this.$emit('onSelectCountry', country);
    this.scrollTop();
  }

  public selectTodayMatch() {
    this.isTodayMatch = true;
    this.isLiveMatch = false;
    this.$emit('onSelectTodayMatch');
    this.scrollTop();
  }

  public selectLiveMatch() {
    this.isLiveMatch = true;
    this.isTodayMatch = false;
    this.$emit('onSelectLiveMatch');
    this.currentPage = 1;
    this.doPaginate();
    this.scrollTop();
  }

  private selectAutoSuggestItem(item) {
    const cloneObject = _.cloneDeep(this.currentSport);
    const countries = cloneObject ? cloneObject.countries : [];
    const selectedIndex = countries.findIndex((country) => {
      return country.countryId === item.countryId;
    });
    const pageValue = (selectedIndex / this.pageLimit);
    const pageCount = Number.isInteger(pageValue) ? (pageValue + 1) : Math.trunc(pageValue + 1);
    this.currentPage = pageCount;
    this.searchText = '';
    this.doPaginate();
    this.selectCountry(item);
  }

  private mounted() {
    // Based on width we are setting page limit
    const eleRef: any = this.$refs.countriesContainerRef;
    const clientWidth = eleRef.clientWidth;
    const extraSpace = 125;
    const countLimit = (clientWidth - extraSpace) / 140;
    this.pageLimit = Math.floor(countLimit) * 2;
    this.loadData();
  }

  private loadData() {
    const sports = this.$store.state.sports.sports;
    this.currentPage = 1;
    this.currentSport = sports.find((sport: SportModel) => {
      return sport.sportId === this.sportId;
    });
    this.selectLiveMatch();
    this.doPaginate();
  }
  private scrollTop() {
    const element = document.documentElement;
    element.scrollIntoView();
  }
}
