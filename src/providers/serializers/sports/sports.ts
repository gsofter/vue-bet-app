import { CountryModel } from '@/models/sports/country';
import { FixtureModel } from '@/models/sports/fixture';
import { LeagueModel } from '@/models/sports/league';
import { SportModel } from '@/models/sports/sport';
import { isToday } from '@/helper/helper';
import { UNDER_OVER_VALUE_MAP, MARKET_NAMES } from '@/utils/constants';
import _ from 'lodash';


/**
 *
 * This Sports serializer is responsible for converting the Raw format to model.
 *
 */
export class SportsSerializer {

  static get instance() {
    return this.INSTANCE;
  }

  private static INSTANCE = new SportsSerializer();

  /**
   * This method used to normalize sports data
   */
  public normalizeSportsModel(sports: any, config: any) {
    return sports.map((sport: any) => {
      const result: SportModel = {
        sportId: sport.SportId,
        sportName: sport.SportName,
        countries: this.normalizeCountryModel(sport.countries, config),
      };
      return result;
    });
  }

  /**
   * This method used to normalize countries data
   */
  public normalizeCountryModel(countries: any, config: any) {
    return countries.map((country: any) => {
      const result: CountryModel = {
        countryId: country.LocationId,
        countryName: country.LocationName,
        leagues: this.leagueModelSerializer(country.leagues, config),
      };
      return result;
    });
  }

  /**
   * This method used to normalize live fixtures from API
   */
  public normalizeLiveFixtures(list: any, config: any) {
    return list.map((data: any) => {
      return {
        sportId: data.sportId,
        countryId: data.countryId,
        countryName: data.countryName,
        leagueId: data.leagueId,
        leagueName: data.leagueName,
        fixtures: this.fixtureModelSerializer(data.fixtures, config),
        markets: this.getMarketLabelsBySportId(data.sportId, config),
      };
    });
  }

  /**
   * This method used to get markets for live fixtures
   */
  public getMarketsLabelForLive(fixture, config) {
    const sportId = fixture.sportId;
    const sportConfig = config[sportId];
    const liveDisplayConfig = sportConfig.live_display_config;
    const markets = [];
    Object.keys(liveDisplayConfig).forEach((marketName, index) => {
      if (index % 2 === 0) {
        const marketObject = {};
        const market = _.cloneDeep(liveDisplayConfig[marketName]);
        if (marketName === 'Under/Over') {
          market.odds = ['O/U'].concat(market.odds);
        }
        marketObject[marketName] = market;
        markets.push(marketObject);
      }
    });
    return markets;
  }

  public getMarketsForLive(fixture, config: any) {
    const fixtureId = fixture.fixtureId;
    const goalH1 = Number(fixture.Goal_H1);
    const goalH2 = Number(fixture.Goal_H2);
    const markets = [];
    if (!config) {
      return markets;
    }
    const liveDisplayConfig = config.live_display_config;
    if (liveDisplayConfig) {
      Object.keys(liveDisplayConfig).forEach((marketName, index) => {
        const newMarketObject = {
          name: marketName,
          odds: [],
          isUnderOver: false,
          marketIndex: null,
        };
        if (marketName === 'Under/Over') {
          marketName = 'Under-Over';
        }
        const market = fixture[marketName];
        if (marketName === 'Under-Over') {
          marketName = 'Under/Over';
        }
        const fixtureIdAndMarketName = `${fixtureId}_${marketName}`;
        const odds = liveDisplayConfig[marketName].odds;
        if (market) {
          delete market.MarketsId;
          switch (marketName) {
            case MARKET_NAMES.UNDER_OVER:
            case MARKET_NAMES.UNDER_OVER_FIRST_PERIOD:
              const shiftedValue = this.shifting('Under-Over', market, goalH1, goalH2);
              const shiftedMarket = market[shiftedValue];
              const underOverOddList = [];
              underOverOddList.push({
                id: `${fixtureIdAndMarketName}_shifted`,
                fixtureId,
                name: 'shifted',
                marketName,
                status: 1,
                marketId: fixtureIdAndMarketName,
                price: `${shiftedValue[0]}.${shiftedValue[1]}`,
              });
              odds.forEach((oddName) => {
                const uniqueId = `${fixtureId}_${marketName}_${shiftedValue}_${oddName}`;
                const oddDataValue = shiftedMarket ? shiftedMarket[oddName] : null;
                underOverOddList.push({
                  id: uniqueId,
                  fixtureId,
                  name: oddName,
                  marketId: fixtureIdAndMarketName,
                  marketName,
                  status: oddDataValue ? oddDataValue.BetsStatus : null,
                  price: oddDataValue ? oddDataValue.BetsPrice : null,
                });
              });
              newMarketObject.isUnderOver = true;
              newMarketObject.odds = underOverOddList;
              break;
            case MARKET_NAMES.NEXT_GOAL_FIRST_PERIOD:
            case MARKET_NAMES.NEXT_GOAL:
              const keyList = Object.keys(market);
              const keyName = keyList[keyList.length - 1];
              const lastUpdatedObject = market[keyName];
              const nextGoalOddList = [];
              if (lastUpdatedObject) {
                odds.forEach((oddName) => {
                  if (oddName === 'X') {
                    oddName = 'No Goal';
                  }
                  const uniqueId = `${fixtureId}_${marketName}_${keyName}_${oddName}`;
                  const oddDataValue = lastUpdatedObject[oddName];
                  nextGoalOddList.push({
                    id: uniqueId,
                    fixtureId,
                    name: oddName,
                    marketId: fixtureIdAndMarketName,
                    marketName,
                    status: oddDataValue.BetsStatus,
                    price: oddDataValue.BetsPrice,
                  });
                });
              }
              newMarketObject.odds = nextGoalOddList;
              break;
            case MARKET_NAMES.REMAINING_MATCH:
            case MARKET_NAMES.REMAINING_FIRST_HALF:
              const remainingMatchKeyList = Object.keys(market);
              const remainingMatchKeyName = remainingMatchKeyList[remainingMatchKeyList.length - 1];
              const lastUpdatedRemainingMatchObj = market[remainingMatchKeyName];
              const remainingMatchOddList = [];
              if (lastUpdatedRemainingMatchObj) {
                odds.forEach((oddName) => {
                  const uniqueId = `${fixtureId}_${marketName}_${remainingMatchKeyName}_${oddName}`;
                  const oddDataValue = lastUpdatedRemainingMatchObj[oddName];
                  remainingMatchOddList.push({
                    id: uniqueId,
                    fixtureId,
                    name: oddName,
                    marketId: fixtureIdAndMarketName,
                    marketName,
                    status: oddDataValue.BetsStatus,
                    price: oddDataValue.BetsPrice,
                  });
                });
              }
              newMarketObject.odds = remainingMatchOddList;
              break;
            default:
              const oneXTwoMatchOddList = [];
              odds.forEach((oddName) => {
                const uniqueId = `${fixtureId}_${marketName}_${oddName}`;
                const oddDataValue = market[oddName];
                oneXTwoMatchOddList.push({
                  id: uniqueId,
                  fixtureId,
                  name: oddName,
                  marketName,
                  marketId: fixtureIdAndMarketName,
                  status: oddDataValue.BetsStatus,
                  price: oddDataValue.BetsPrice,
                });
              });
              newMarketObject.odds = oneXTwoMatchOddList;
              break;
          }
        } else {
          if (marketName === MARKET_NAMES.UNDER_OVER
            || marketName === MARKET_NAMES.UNDER_OVER_FIRST_PERIOD) {
            newMarketObject.odds.push({
              name: 'O/U',
              status: null,
              price: null,
            });
          }
          odds.forEach((oddName) => {
            newMarketObject.odds.push({
              id: `${fixtureIdAndMarketName}_${oddName}`,
              name: oddName,
              marketName,
              marketId: fixtureIdAndMarketName,
              fixtureId,
              status: null,
              price: null,
            });
          });
        }
        // // Check whether index value is even or not if not next item will consider as halfMarket for previous item
        if (index % 2 === 0) {
          newMarketObject.marketIndex = index;
          markets.push(newMarketObject);
        } else {
          const previousIndex = index - 1;
          const previousMarketData = markets.find((marketItem) => marketItem.marketIndex === previousIndex);
          previousMarketData.child = newMarketObject;
        }
      });
    }
    return markets;
  }

  public check(cstr, filtered) {
    const price = parseFloat(filtered[cstr].Over.BetsPrice);
    if (price < 1.3) {
      return 1;
    }
    if (price > 3) {
      return -1;
    } else {
      return 0;
    }
  }

  public shifting(market, data, g1, g2) {
    const filtered = {};
    const keys = [];
    const leftKeys = [];
    const rightKeys = [];
    // Combined Goal
    const totalGoal = g1 + g2;
    // Pre Betline selection
    const current = market === 'Under-Over' ? (totalGoal < 2 ? 2.5 : (totalGoal + 0.5)) : (totalGoal + 0.5);
    let currentStr = UNDER_OVER_VALUE_MAP[current];
    // Storing the value for calculation only over status is active
    for (const key in data) {
      if (key !== 'MarketsId' && data[key].Over && data[key].Over.BetsStatus === 1) {
        keys.push(key);
        filtered[key] = data[key];
      }
    }
    // sort keys
    keys.sort();
    if (keys.length > 0) {
      for (const k of keys) {
        if (k < currentStr) {
          leftKeys.push(k);
        } else if (k > currentStr) {
          rightKeys.push(k);
        }
      }
      if (leftKeys.length > 1) {
        leftKeys.sort((a, b) => (b - a));
      }
      if (keys.includes(currentStr)) {
        const t = this.check(currentStr, filtered);
        if (t > 0) {
          for (const a of rightKeys) {
            const s = this.check(a, filtered);
            if (s === 0) {
              currentStr = a;
              break;
            }
          }
        } else if (t < 0) {
          for (const b of leftKeys) {
            const m = this.check(b, filtered);
            if (m === 0) {
              currentStr = b;
              break;
            }
          }
        }
      } else {
        const st = currentStr;
        let tmp = currentStr;
        for (const a of rightKeys) {
          const s = this.check(a, filtered);
          tmp = a;
          if (s === 0) {
            currentStr = a;
            break;
          }
        }
        for (const b of leftKeys) {
          const m = this.check(b, filtered);
          tmp = b;
          if (m === 0) {
            currentStr = b;
            break;
          }
        }
        if (st === currentStr) {
          currentStr = tmp;
        }
      }
    }
    return currentStr;
  }

  public getPopupMarketsForLive(fixture, popupConfig: any) {
    const marketData: any = [];
    const fixtureId = fixture.fixtureId;
    Object.keys(popupConfig).forEach((marketName) => {
      const configValue = popupConfig[marketName];
      if (marketName === 'Under/Over') {
        marketName = 'Under-Over';
      }
      let marketValue = fixture[marketName];
      if (marketName === 'Under-Over') {
        marketName = 'Under/Over';
      }
      if (marketValue) {
        delete marketValue.MarketsId;
        const marketObject = {
          name: marketName,
          odds: [],
          type: configValue.type,
        };
        let fixtureIdAndMarketName = `${fixtureId}_${marketName}`;
        if (configValue) {
          if (marketObject.type === 'row') {
            let innerChild = false;
            Object.keys(marketValue).forEach((marketOddKey) => {
              const oddMarketData = marketValue[marketOddKey];
              if (!oddMarketData.hasOwnProperty('BetsPrice')) {
                innerChild = true;
              }
            });
            if (innerChild) {
              const keyList = Object.keys(marketValue);
              const keyName = keyList[keyList.length - 1];
              fixtureIdAndMarketName = `${fixtureIdAndMarketName}_${keyName}`;
              marketValue = marketValue[keyName];
            }
            configValue.odds.forEach((oddKey) => {
              if ((marketName === 'Next Goal'
                || marketName === 'Next Goal 1st Period')
                && oddKey === 'X') {
                oddKey = 'No Goal';
              }
              const oddDataValue = marketValue[oddKey];
              if (oddDataValue) {
                marketObject.odds.push({
                  id: `${fixtureIdAndMarketName}_${oddKey}`,
                  fixtureId,
                  name: oddKey,
                  marketName,
                  marketId: fixtureIdAndMarketName,
                  status: oddDataValue.BetsStatus,
                  price: oddDataValue.BetsPrice,
                });
              }
            });
            marketObject.odds = _.chunk(marketObject.odds, 4); // chunk array into 4 columns
          } else if (marketObject.type === 'clubed') {
            Object.keys(marketValue).forEach((marketKey) => {
              const oddDataValue = marketValue[marketKey];
              if (oddDataValue) {
                marketObject.odds.push({
                  id: `${fixtureIdAndMarketName}_${marketKey}`,
                  fixtureId,
                  marketId: fixtureIdAndMarketName,
                  name: marketKey,
                  marketName,
                  status: oddDataValue.BetsStatus,
                  price: oddDataValue.BetsPrice,
                });
              }
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
                    const oddMarketObject = {};
                    const oddDataValue = oddMarket[odd];
                    if (oddDataValue) {
                      oddMarkets.push({
                        id: `${fixtureIdAndMarketName}_${marketKey}_${odd}`,
                        fixtureId,
                        marketName,
                        marketId: fixtureIdAndMarketName,
                        name: odd,
                        status: oddDataValue.BetsStatus,
                        price: oddDataValue.BetsPrice,
                      });
                    }
                  });
                  if (marketName.startsWith('Under') || marketName.startsWith('Over')) {
                    marketKey = `${marketKey[0]}.${marketKey[1]}`;
                  }
                  newParentObject[marketKey] = _.chunk(oddMarkets, 4);
                  marketObject.odds.push(newParentObject);
                }
              }
            });
          }
        } else {
          Object.keys(marketValue).forEach((oddMarketKey) => {
            const oddMarket = marketValue[oddMarketKey];
            const oddMarketObject = {};
            if (oddMarket.hasOwnProperty('BetsPrice')) {
              const oddDataValue = marketValue[oddMarketKey];
              marketObject.type = 'row';
              if (oddDataValue) {
                marketObject.odds.push({
                  id: `${fixtureIdAndMarketName}_${oddMarketKey}`,
                  fixtureId,
                  marketName,
                  marketId: fixtureIdAndMarketName,
                  name: oddMarketKey,
                  status: oddDataValue.BetsStatus,
                  price: oddDataValue.BetsPrice,
                });
              }
            }
          });
          marketObject.odds = _.chunk(marketObject.odds, 4); // chunk array into 4 columns
        }
        marketData.push(marketObject);
      }
    });
    return marketData;
  }

  public getMarketsAndOdds(data: any, config: any) {
    const sportId = data.SportId;
    const fixtureId = data.FixtureId;
    const markets = [];
    if (!config) {
      return markets;
    }
    const sportConfig = config[sportId] || config;
    const preDisplayConfig = sportConfig.pre_display_config;
    Object.keys(preDisplayConfig).forEach((displayMarket, index) => {
      const marketObject = {};
      const displayMarketConfig = preDisplayConfig[displayMarket];
      let odds = displayMarketConfig.odds;
      if (displayMarket === 'First Team To Score') {
        odds = ['1', 'X', '2'];
      }
      const displayMarketData = data[displayMarket];
      const marketOdds = [];
      let isLookedUp = false;
      const fixtureIdAndMarketName = `${fixtureId}_${displayMarket}`;
      odds.forEach((odd) => {
        if (displayMarket === 'First Team To Score') {
          if (odd === 'X') {
            odd = 'No Goal';
          }
        }
        const oddData = displayMarketData[odd];
        if (oddData) {
          if (displayMarket === 'Under/Over Including Overtime') {
            if (!isLookedUp) {
              const oddObject = {
                name: 'O/U',
                price: '',
              };
              isLookedUp = true;
              marketOdds.push(oddObject);
            }
          }
          marketOdds.push({
            id: `${fixtureIdAndMarketName}_${odd}`,
            name: odd,
            fixtureId,
            marketName: displayMarket,
            marketId: fixtureIdAndMarketName,
            status: null,
            price: oddData,
          });
        } else {
          const keys = Object.keys(displayMarketData);
          const values = Object.values(displayMarketData);
          if (displayMarket === 'Under/Over'
            || displayMarket === 'Under/Over Games') {
            keys.forEach((key) => {
              if (!isLookedUp) {
                const oddObject = {
                  name: 'O/U',
                  price: key,
                };
                isLookedUp = true;
                marketOdds.push(oddObject);
              }
            });
          }
          values.forEach((value, i) => {
            marketOdds.push({
              id: `${fixtureIdAndMarketName}_${keys[i]}_${odd}`,
              name: odd,
              fixtureId,
              marketName: displayMarket,
              marketId: fixtureIdAndMarketName,
              status: null,
              price: value[odd],
            });
          });
        }
      });
      marketObject[displayMarket] = marketOdds;
      markets.push(marketObject);
    });
    return markets;
  }

  private leagueModelSerializer(leagues: any, config: any) {
    return leagues.map((league: any) => {
      const result: LeagueModel = {
        leagueId: league.LeagueId,
        leagueName: league.LeagueName,
        fixtures: this.fixtureModelSerializer(league.fixtures, config),
        markets: this.getMarketLabelsBySportId(league.SportId, config),
      };
      return result;
    });
  }

  private fixtureModelSerializer(fixtures: any, config: any) {
    return fixtures.map((fixture: any) => {
      fixture.markets = this.getMarketsAndOdds(fixture, config);
      fixture.isToday = isToday(fixture.StartDate);
      return fixture;
    });
  }

  private getMarketLabelsBySportId(sportId: string, config: any) {
    const sportConfig = config[sportId];
    const preDisplayConfig = sportConfig.pre_display_config;
    const markets = [];
    Object.keys(preDisplayConfig).forEach((marketName, index) => {
      const marketObject = {};
      const market = _.cloneDeep(preDisplayConfig[marketName]);
      if (marketName === 'Under/Over'
        || marketName === 'Under/Over Games'
        || marketName === 'Under/Over Including Overtime') {
        market.odds = ['O/U'].concat(market.odds);
      } else if (marketName === 'First Team To Score') {
        market.odds = ['1', 'X', '2'];
      }
      marketObject[marketName] = market;
      markets.push(marketObject);
    });
    return markets;
  }
}

export const sportsSerializer = SportsSerializer.instance;
