import { ConfigModel } from '@/models/config/config';
import { SportsModel } from '@/models/config/sports';
import { FlagsModel } from '@/models/config/flags';


/**
 *
 * This Config serializer is responsible for converting the Raw format to model.
 *
 */
export class ConfigSerializer {
  private static INSTANCE = new ConfigSerializer();

  public imagePath: string = `${process.env.VUE_APP_API_URL}/newapp`;

  static get instance() {
    return this.INSTANCE;
  }

  public configModelSerializer(res: any) {
    const result: ConfigModel = {
      flags: this.flagsModelSerializer(res.topmenu.flags),
      sports: this.normalizeSportsModel(res.topmenu.sports),
      betslip: res.betslip,
      popup: res.layout.popup_config,
      livePopup: res.layout.live_popup_config,
      logo: res.topmenu.logo,
      sportsConfig: res.layout.sports,
    };
    return result;
  }

  private normalizeSportsModel(sports: any) {
    return sports.map((sport: any) => {
      const result: SportsModel = {
        sportId: sport.SportId,
        displayName: sport.display_name,
      };
      return result;
    });
  }

  private flagsModelSerializer(flags: any) {
    return flags.map((flag: any) => {
      const result: FlagsModel = {
        id: flag.id,
        imageName: `${this.imagePath}/${flag.img}`,
      };
      return result;
    });
  }
}

export const configSerializer = ConfigSerializer.instance;
