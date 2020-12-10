import { CountryModel } from '@/models/sports/country';
export interface SportModel {
  sportId: string;
  sportName: string;
  countries: CountryModel[];
}
