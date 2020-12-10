<template>
<div id="bet-slip">
  <div class="header">
    <h4>
      {{$t('Bet Slip')}}
      <span class="close-all pull-right" @click="clearAllTips()">
        <i class="fa fa-times"></i>
      </span>
    </h4>
  </div>
  <div class="bet-list">
    <div class="tip-container">
      <div class="row" v-for="selectedTip in selectedTips" v-bind:class="{disable:selectedTip.tip.status !== 1 && selectedTip.tip.isLive,live:selectedTip.tip.isLive}">
        <div class="top-item">
          <div class="fixture-name" v-if="selectedTip.tip.fixture_show === 1">{{selectedTip.fixture.ParticipantsName1}} v {{selectedTip.fixture.ParticipantsName2}}</div>
        </div>
        <div class="detail-item">
          <div class="info">
            <div class="market-info">
              {{getMarketNameFromId(selectedTip.fixture.SportId,selectedTip.tip.id)}} <template v-if="selectedTip.tip.isLive">({{selectedTip.fixture.ParticipantsValue1}}:{{selectedTip.fixture.ParticipantsValue2}})</template>
            </div>
            <div class="tip-info">
              <strong>{{$t('Tip')}}: {{translateTipName(selectedTip.tip.name)}}</strong>
              <strong class="price pull-right">{{selectedTip.tip.price}}</strong>
            </div>
          </div>
          <div class="close" @click="clearTip(selectedTip)">
            <i class="fa fa-times"></i>
          </div>
        </div>
      </div>
      <template v-if="showMinNoMatchesText">
        <div class="message-row" v-for="count in minNoMatches">
          <h1>Missing tip</h1>
        </div>
      </template>
    </div>
  </div>
  <div class="total-stock">
    <b-row class="stake">
      <b-col class="no-padding">
        <strong>{{$t('System')}}</strong>
      </b-col>
      <b-col class="no-padding" @click="decreaseStake()">
        <a><i class="fa fa-minus"></i></a>
      </b-col>
      <b-col class="no-padding">
        <a v-b-modal="'stake-calculator-modal'">{{$t('Total stake')}} {{totalStake}}</a>
      </b-col>
      <b-col class="no-padding" @click="increaseStake()">
        <a><i class="fa fa-plus"></i></a>
      </b-col>
    </b-row>
    <div class="bet-type">
      <b-row>
        <b-col>
          <label>{{$t('Row')}} {{rowCount}} {{$t('Bet type')}}</label>
        </b-col>
        <b-col>
          <input v-model="betType" class="form-control" readonly>
        </b-col>
      </b-row>
    </div>
    <div class="bet-type">
      <b-row>
        <b-col>
          <label>{{$t('Tip')}} {{selectedTips.length}} {{$t('Total odds')}}</label>
        </b-col>
        <b-col>
          <input v-model="totalOdd" placeholder="0.000" class="form-control" readonly>
        </b-col>
      </b-row>
    </div>
    <div class="bet-type">
      <b-row>
        <b-col>
          <label>{{$t('Possible winnings')}}</label>
        </b-col>
        <b-col>
          <input v-model="possibleWinnings" placeholder="0.000" class="form-control" readonly>
        </b-col>
      </b-row>
    </div>
    <button type="button" @click="onSubmitPlaceBet" :disabled="isDisabled > 0" class="btn btn-success place-button">{{$t('Place Bet')}}</button>
  </div>
  <b-modal id="stake-calculator-modal">
    <div class="stake-calc">
      <input type="number" v-model="stakeNumber" class="form-control">
      <div class="input-buttons">
        <div class="number-input" @click="addNumber(index)" v-for="index in 9" :key="index">
          {{index}}
        </div>
        <div class="number-input" @click="addNumber(0)">0</div>
        <div class="clear-input" @click="clearInput()">C</div>
      </div>
    </div>
    <button type="submit" @click="submit()" class="btn submit btn-success">{{$t('Submit')}}</button>
  </b-modal>
</div>
</template>

<script lang="ts" src="./bet-slip.ts"></script>
<style lang="scss" scoped src="./bet-slip.scss"></style>
