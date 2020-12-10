import { http } from '@/providers/apis/http';
import { sportsService } from '@/providers/services/sports/sports';

/**
 *
 * This Sports DataSet API Provider
 *
 */
export class SportsDataSetAPI {

  private static INSTANCE = new SportsDataSetAPI();

  static get instance() {
    return this.INSTANCE;
  }
  private sportMarketNameSpace: string = 'sportsapi/index.php/allmarket';

  private sportsDataSetNamespace: string = 'sportsapi/allsports';

  private liveSportsDataSetNamespace: string = 'sportsapi/prelive';

  public getAllSportFixtures(): Promise<any> {
    const endpoint = this.sportsDataSetNamespace;
    return http.get(endpoint).then((response: any) => {
      return response.data;
    });
  }

  public getLiveSportFixtures(): Promise<any> {
    const endpoint = this.liveSportsDataSetNamespace;
    return http.get(endpoint).then((response: any) => {
      return response.data;
    });
  }

  public getMarketsByFixtureId(fixtureId: string, popupConfig: any) {
    const endpoint = `${this.sportMarketNameSpace}/${fixtureId}`;
    return http.get(endpoint).then((response: any) => {
      return sportsService.parseMarketData(fixtureId, response.data, popupConfig);
    });
  }
}

export const sportsDataSetAPI = SportsDataSetAPI.instance;
