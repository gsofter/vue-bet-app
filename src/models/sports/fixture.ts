export interface FixtureModel {
  fixtureId: string;
  sportId: string;
  sportName: string;
  countryName: string;
  countryId: string;
  countrySequence: string;
  leagueName: string;
  leagueId: string;
  leagueSequence: string;
  firstParticipantId: string;
  secondParticipantId: string;
  firstParticipantName: string;
  secondParticipantName: string;
  eventOrdering: string;
  startDate: string;
  oddCount: string;
  markets: any[];
  isToday: boolean;
}
