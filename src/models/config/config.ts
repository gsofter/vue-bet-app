import { SportsModel } from '@/models/config/sports';
import { FlagsModel } from '@/models/config/flags';
export interface ConfigModel {
  logo: string;
  sports: SportsModel[];
  flags: FlagsModel[];
  sportsConfig: any;
  betslip: any;
  popup: any;
  livePopup: any;
}
