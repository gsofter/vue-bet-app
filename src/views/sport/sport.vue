<template>
<div id="sport">
  <template v-if="selectedSport">
    <header>
      <sport-countries-list v-on:onSelectLiveMatch="onSelectLiveMatch" v-on:onSelectTodayMatch="onSelectTodayMatch" v-on:onSelectCountry="onSelectCountry" v-bind:sportId="selectedSport.sportId"></sport-countries-list>
    </header>
    <section>
      <b-container class="w-100" fluid>
        <b-row>
          <b-col>
            <section class="today-matches" v-bind:class="{'active': showTodayMatch}">
              <div class="country-item" v-bind:class="{hide:country.leagues.length === 0}" v-for="country in todayFixtures.countries" v-if="country.totalFixtures">
                <div class="country-name">
                  <h4>{{$t(country.countryName)}}
                  </h4>
                </div>
                <league-container-list v-bind:countryId="country.countryId" :showTodayMatch="true" v-on:onClearLeague="onClearLeague" v-on:onSelectLeague="onSelectLeague" v-bind:selectedTips="selectedTips" v-on:onSelectTip="onSelectTip"
                  v-bind:sportId="selectedSport.sportId" v-if="country.leagues" v-bind:leagues="country.leagues">
                </league-container-list>
              </div>
            </section>
            <template>
              <section class="live-matches" v-bind:class="{'active':!showTodayMatch && showLiveMatch}">
                <live-fixture-table v-bind:countryId="country.countryId" v-bind:selectedTips="selectedTips" v-on:onChangeSelectedTip="onChangeSelectedTip" v-on:onSelectTip="onSelectTip" v-bind:sportId="selectedSport.sportId"></live-fixture-table>
              </section>
              <section class="live-matches" v-bind:class="{'active': showPreLiveMatch}">
                <pre-live-fixture-table v-bind:selectedTips="selectedTips" v-on:onSelectTip="onSelectTip" v-bind:sportId="selectedSport.sportId"></pre-live-fixture-table>
              </section>
            </template>
            <section class="pre-matches" v-bind:class="{'active': !showPreLiveMatch && !showTodayMatch}">
              <league-container-list :showTodayMatch="false" v-on:onSelectLeague="onSelectLeague" v-on:onSelectTip="onSelectTip" v-bind:selectedTips="selectedTips" v-bind:sportId="selectedSport.sportId" v-if="country.leagues"
                v-bind:leagues="country.leagues">
              </league-container-list>
            </section>
          </b-col>
          <b-col>
            <bet-slip v-on:onSubmitPlaceBet="onSubmitPlaceBet" :showMinNoMatchesText="showMinNoMatchesText" :minNoMatches="minNoMatches" v-on:onChangeStake="onChangeStake" v-bind:totalStake="totalStake" v-bind:rowCount="rowCount"
              v-bind:betType="betType" v-bind:possibleWinnings="possibleWinnings" v-bind:totalOdd="totalOdd" v-bind:selectedTips="selectedTipsForBet" v-on:clearTip="clearTip" v-on:clearAllTips="clearAllTips">
            </bet-slip>
          </b-col>
        </b-row>
      </b-container>
    </section>
    <div class="refresh-prompt" v-if="showRefreshPrompt" v-bind:class="{ active: showRefreshPrompt }">
      <div class="backdrop"></div>
      <div class="backgound-image"></div>
      <div class="content">
        <h3>
          Now Redirecting
        </h3>
        <div class="action">
          <b-button variant="primary" @click="onRefresh()">Okay</b-button>
        </div>
      </div>
    </div>
    <div class="countdown" v-if="showTimerCount">
      {{timer}}
    </div>
    <b-modal id="view-ticket">
      <view-ticket :ticketId="ticketId"></view-ticket>
    </b-modal>
  </template>
</div>
</template>

<script lang="ts" src="./sport.ts"></script>
<style lang="scss" scoped src="./sport.scss"></style>
