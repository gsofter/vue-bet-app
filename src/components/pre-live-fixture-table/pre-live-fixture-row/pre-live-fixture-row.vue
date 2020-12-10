<template>
<div id="pre-live-fixture-row">
  <div class="row fixture">
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
          <div class="row-item" @click="onSelectTip(odd)" v-bind:class="{selected:arrayContains(selectedTips,'id',odd.id)}" v-for="(odd,index) in odds">
            {{odd.price}}
          </div>
        </div>
      </template>
    </div>
    <template v-if="fixture.markets.length < 4">
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
    <b-modal :id="`pre-popup-market-modal-${fixture.FixtureId}`" scrollable>
      <popup-market :type="'pre'" v-bind:selectedTips="selectedTips" v-on:onSelectTip="onSelectTip" :sportId="fixture.SportId" :fixture="selectedFixture"></popup-market>
    </b-modal>
  </div>
</div>
</template>
<script lang="ts" src="./pre-live-fixture-row.ts"></script>
<style lang="scss" scoped src="./pre-live-fixture-row.scss"></style>
