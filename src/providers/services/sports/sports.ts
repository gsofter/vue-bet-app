import { sportsSerializer } from '@/providers/serializers/sports/sports';
import { db } from '@/main';
import moment from 'moment';
import _ from 'lodash';
export class SportsService {

  static get instance() {
    return this.INSTANCE;
  }
  private static INSTANCE = new SportsService();

  private sportsConfig = null;

  public parseFixturesData(fixtures: any, config: any) {
    const sportsList = this.groupSports(fixtures);
    this.setConfig(config);
    sportsList.forEach((sport) => {
      sport.countries = this.groupCountries(sport.countries);
      sport.countries.forEach((country) => {
        country.leagues = this.groupLeagues(country.leagues);
      });
    });
    return sportsSerializer.normalizeSportsModel(sportsList, this.getSportsConfig());
  }

  public parseMarketData(fixtureId, markets: any, config: any) {
    const marketData: any = [];
    markets.forEach((market) => {
      Object.keys(market).forEach((key) => {
        const marketObject = {
          label: key,
          odds: [],
          type: '',
        };
        const marketValue = market[key];
        delete marketValue.pre_order;
        delete marketValue.outcome_id;
        const configValue = config[key];
        const fixtureIdAndMarketName = `${fixtureId}_${key}`;
        if (configValue) {
          marketObject.type = configValue.type;
          if (marketObject.type === 'row') {
            configValue.odds.forEach((oddkey) => {
              if (marketValue[oddkey]) {
                marketObject.odds.push({
                  id: `${fixtureIdAndMarketName}_${oddkey}`,
                  name: oddkey,
                  fixtureId,
                  marketId: fixtureIdAndMarketName,
                  marketName: key,
                  price: marketValue[oddkey].BetsPrice,
                });
              }
            });
            marketObject.odds = _.chunk(marketObject.odds, 4); // chunk array into 4 columns
          } else if (marketObject.type === 'clubed') {
            Object.keys(marketValue).forEach((marketKey) => {
              const newParentObject = {};
              newParentObject[marketKey] = marketValue[marketKey];
              marketObject.odds.push({
                id: `${fixtureIdAndMarketName}_${marketKey}`,
                name: marketKey,
                fixtureId,
                marketId: fixtureIdAndMarketName,
                marketName: key,
                price: marketValue[marketKey].BetsPrice,
              });
            });
            marketObject.odds = _.chunk(marketObject.odds, 4); // chunk array into 4 columns
          } else if (marketObject.type === 'multirow') {
            Object.keys(marketValue).forEach((marketKey) => {
              const oddMarket = marketValue[marketKey];
              if (configValue && configValue.odds) {
                marketObject.type = configValue.type;
                if (!oddMarket.hasOwnProperty('BetsPrice')) {
                  const newParentObject = {};
                  const oddMarkets = [];
                  configValue.odds.forEach((odd) => {
                    oddMarkets.push({
                      id: `${fixtureIdAndMarketName}_${marketKey}_${odd}`,
                      name: odd,
                      fixtureId,
                      marketId: fixtureIdAndMarketName,
                      marketName: key,
                      price: oddMarket[odd].BetsPrice,
                    });
                  });
                  newParentObject[marketKey] = _.chunk(oddMarkets, 4);
                  marketObject.odds.push(newParentObject);
                }
              }
            });
          }
        } else {
          Object.keys(marketValue).forEach((oddMarketKey) => {
            const oddMarket = marketValue[oddMarketKey];
            if (oddMarket.hasOwnProperty('BetsPrice')) {
              marketObject.type = 'row';
              marketObject.odds.push({
                id: `${fixtureIdAndMarketName}_${oddMarketKey}`,
                name: oddMarketKey,
                fixtureId,
                marketId: fixtureIdAndMarketName,
                marketName: key,
                price: marketValue[oddMarketKey].BetsPrice,
              });
            }
          });
          marketObject.odds = _.chunk(marketObject.odds, 4); // chunk array into 4 columns
        }
        marketData.push(marketObject);
      });
    });
    return marketData;
  }

  public groupSports(data: any) {
    return _.chain(data).groupBy('SportId')
      .map((value, key) => ({ SportId: key, SportName: value[0] ? value[0].SportName : null, countries: value }))
      .value();
  }

  public groupCountries(countries: any) {
    return _.chain(countries).groupBy('LocationId')
      .map((value, key) => ({
        LocationId: key,
        LocationName: value[0] ? value[0].LocationName : null,
        LocationSequence: value[0] ? value[0].LocationSequence : null,
        leagues: value,
      }))
      .orderBy((group) => Number(group.LocationSequence), ['asc'])
      .value();
  }

  public groupLeagues(countries: any) {
    return _.chain(countries).groupBy('LeagueId')
      .map((value, key) => ({
        SportId: value[0] ? value[0].SportId : null,
        LeagueId: key,
        LeagueName: value[0] ? value[0].LeagueName : null,
        LeaugeSequence: value[0] ? value[0].LeaugeSequence : null,
        fixtures: value ? value.sort(this.compare) : [],
      }))
      .orderBy((group) => Number(group.LeaugeSequence), ['asc'])
      .value();
  }

  public getTodayFixtureList(sports: any) {
    const sportsCopy = _.cloneDeep(sports);
    return sportsCopy.filter((sport) => {
      return sport.countries.filter((country) => {
        const leagues = country.leagues.filter((league) => {
          const todayFixtures = league.fixtures.filter((fixture) => {
            return fixture.isToday;
          });
          league.fixtures = todayFixtures;
          const totalCount = country.totalFixtures ? country.totalFixtures : 0;
          country.totalFixtures = totalCount + todayFixtures.length;
          return league;
        });
        country.totalLeagues = leagues.length;
      });
    });
  }

  public getLiveFixtures(fixtures: any) {
    const fixturesCopy = _.cloneDeep(fixtures);
    const config = this.getSportsConfig();
    const liveFixtures = fixturesCopy.filter((fixture) => {
      return fixture.event_ordering === '1';
    });
    const groupData = _.groupBy(liveFixtures, (data) => {
      return data.LeagueId + '-' + data.StartDate;
    });
    const resultUnsorted = _.map(groupData, (value, key) => ({
      sportId: value[0] ? value[0].SportId : null,
      leagueId: value[0] ? value[0].LeagueId : null,
      countryId: value[0] ? value[0].LocationId : null,
      countryName: value[0] ? value[0].LocationName : null,
      leagueName: value[0] ? value[0].LeagueName : null,
      startDate: value[0] ? value[0].StartDate : null,
      fixtures: value,
    }));
    const sortedList = _.orderBy(resultUnsorted, 'startDate');
    const serializedData = sportsSerializer.normalizeLiveFixtures(sortedList, config);
    return _.chain(serializedData).groupBy('sportId')
      .map((value, key) => ({
        sportId: key,
        leagues: value,
      }))
      .value();
  }

  private compare(a, b) {
    if (a.StartDate > b.StartDate) { return 1; }
    if (a.StartDate < b.StartDate) { return -1; }
  }

  private setConfig(configData: any) {
    this.sportsConfig = configData.sportsConfig;
  }

  private getSportsConfig() {
    return this.sportsConfig;
  }

}

export const sportsService = SportsService.instance;
