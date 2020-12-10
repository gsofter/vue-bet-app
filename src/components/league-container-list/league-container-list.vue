<template>
<div id="league-container-list">
  <ul class="nav nav-tabs">
    <template>
      <li v-for="league in leagues"
        v-bind:class="[{ active: league.leagueId === selectedLeague.leagueId},{hide: league.fixtures.length === 0 || !showTodayMatch && (league.leagueId === selectedLeague.leagueId && selectedLeague.fixtures.length === 0)}]"
        @click="selectLeague(league)">
        <a>{{ $t(league.leagueName)}}</a>
      </li>
    </template>
  </ul>
  <div class="tbl">
    <div class="row header" v-bind:class="{hide: !showTodayMatch && selectedLeague.fixtures.length === 0}">
      <div class="free-space"></div>
      <div class="item" v-for="market in selectedLeague.markets">
        <template v-for="(data, marketName) in market">
          <div class="market-name">{{translateMarketName(sportId,marketName)}}</div>
          <div class="sub-row">
            <template v-for="odd in data.odds">
              <div class="sub-item" v-bind:class="`count-${data.odds ? data.odds.length : 0}`">{{translateTipName(odd)}}</div>
            </template>
          </div>
        </template>
      </div>
      <template v-if="selectedLeague.markets.length < 4">
        <div class="item empty-content"></div>
      </template>
      <div class="last-item"></div>
    </div>
    <div class="row fixture" v-for="fixture in selectedLeague.fixtures">
      <div class="free-space info">
        <div class="start-time">
          {{formatTime(fixture.StartDate,'HH:mm')}}
          <template v-if="isToday(fixture.StartDate)">
            {{$t('Today')}}
          </template>
          <template v-else>
            {{formatDate(fixture.StartDate,'DD:MM')}}
          </template>
        </div>
        <div class="participant-name">{{fixture.ParticipantsName1}}</div>
        <div class="score-board"><span>0</span><span>:</span><span>0</span></div>
        <div class="participant-name">{{fixture.ParticipantsName2}}</div>
      </div>
      <div class="item" v-for="market in fixture.markets">
        <template v-for="(odds,key) in market">
          <div :class="`sub-row ${isOverUnder(key)}`">
            <div class="row-item" v-bind:class="[{selected:arrayContains(selectedTips,'id',odd.id)},`count-${odds ? odds.length : 0}`]" v-for="(odd,index) in odds" @click="onSelectTip(odd,fixture)">
              {{odd.price}}
            </div>
          </div>
        </template>
      </div>
      <template v-if="selectedLeague.markets.length < 4">
        <div class="item empty-content">
          <div class="sub-row">
            <div class="row-item border-right"></div>
          </div>
        </div>
      </template>
      <div class="last-item count">
        <a @click="openPopupMarket(fixture)">+{{fixture.OddCount}}</a>
        <a @click="openBetRadar(fixture.BetRadarId)"><i class="fa fa-bar-chart"></i></a>
      </div>
      <template v-if="selectedFixture">
        <b-modal :id="`popup-market-modal-${fixture.FixtureId}`" scrollable>
          <popup-market v-bind:selectedTips="selectedTips" v-on:onSelectTip="onSelectTip" :sportId="fixture.SportId" :fixture="selectedFixture"></popup-market>
        </b-modal>
      </template>
    </div>
  </div>
</div>
</template>

<script lang="ts" src="./league-container-list.ts"></script>
<style lang="scss" scoped src="./league-container-list.scss"></style>
