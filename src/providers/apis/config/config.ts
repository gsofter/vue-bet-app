import { http } from '@/providers/apis/http';
import { configSerializer } from '@/providers/serializers/config/config';
/**
 *
 * This Config DataSet API Provider
 *
 */
export class ConfigDataSetAPI {

  private static INSTANCE = new ConfigDataSetAPI();

  static get instance() {
    return this.INSTANCE;
  }

  private configDataSetNamespace: string = 'sportsapi/appconfig';

  public getConfig(): Promise<any> {
    const endpoint = this.configDataSetNamespace;
    return http.get(endpoint).then((response: any) => {
      return configSerializer.configModelSerializer(response.data);
    });
  }
}

export const configDataSetAPI = ConfigDataSetAPI.instance;
