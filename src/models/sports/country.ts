import { LeagueModel } from '@/models/sports/league';
export interface CountryModel {
  countryId: string;
  countryName: string;
  leagues: LeagueModel[];
  isActive?: boolean;
}
