<template>
<div id="view-ticket">
  <div class="panel">
    <div v-if="isLoading" class="white-spinner">
      <b-spinner variant="black" label="Spinner"></b-spinner>
    </div>
    <template v-else>
      <div class="logo">
        <img :src="logoPath" />
      </div>
      <div class="basic-info">
        <font size="2" class="text-center">{{$t(ticket.address)}}</font>
        <strong>{{ticket.user_name}} ({{$t('Code')}} {{ticket.code}}) {{ticket.date_time}}</strong>
      </div>
      <div class="bet-info">
        <font size="2">{{ticket.bet_type}}</font>
        <div class="row">
          <font size="2">{{$t('Amount per bet')}}</font>
          <span>{{ticket.amount_per_bet}}</span>
        </div>
        <div class="row">
          <font size="2">{{$t('Tax')}}:</font>
          <span>{{ticket.tax}}</span>
        </div>
        <div class="row" v-bind:class="ticket.result">
          <font size="2">{{$t('Result')}}:</font>
          <font size="2">{{$t(ticket.result)}}</font>
        </div>
      </div>
      <div class="match-info">
        <div v-for="tip of tips" v-bind:class="{'border-line':tip.showFixtureName === 0 || tip.count.length === 1}">
          <div class="row" v-if="tip.showFixtureName === 1">
            <font size="2" class="team-name bold">{{tip.team_1_name}} - {{tip.team_2_name}} <template v-if="tip.live">({{tip.team_1_score_arr}} - {{tip.team_2_score_arr}})</template> ({{tip.FixtureId}}) ({{tip.sport_name}}):</font>
            <font size="2" class="bold" v-if="tip.SET"> SET {{tip.SET}}</font>
            <font size="2" class="bold" v-else><template v-if="tip.HT">&nbsp; HT {{tip.HT}} </template> <br> <template v-if="tip.FT">&nbsp; FT {{tip.FT}} </template> </font>
          </div>
          <div class="row" v-bind:class="tip.tip_status">
            <div>
              <span v-if="tip.live"><img :src="getLivePath(tip.live)" /></span>&nbsp;
              <font size="2">{{translateMarketName(getSportId(tip.sport_name),tip.market_name)}} / {{tip.extra}} {{$t('Tip')}} {{translateTipName(tip.tip)}}</font>
            </div>
            <span>{{tip.odds}}</span>
          </div>
          <font size="2">{{tip.match_time}} {{$t(tip.tip_status)}}</font>
        </div>
      </div>
      <div class="summary">
        <div class="row">
          <font size="2">{{$t('Total odds')}}:</font>
          <span>{{ticket.total_odds}}</span>
        </div>
        <div class="row">
          <strong>{{$t('Total Stake')}}:</strong>
          <span class="bold">{{ticket.total_stake}}</span>
        </div>
        <div class="row">
          <strong>{{$t('Possible Winnings')}}:</strong>
          <span class="bold">{{ticket.possible_winnings}}</span>
        </div>
      </div>
      <div class="com">
        <div class="row" v-for="com of comList">
          <div class="grid-row" v-for="item of com">
            <template v-if="isArray(item)">
              <div class="item" v-for="i of item">{{i}}</div>
            </template>
            <strong v-else>{{item}}</strong>
          </div>
        </div>
      </div>
      <div class="bar-code">
        <img :src="barCodePath" />
      </div>
    </template>
  </div>
  <span class="close" title="Close" @click="close()">
    <i class="icon"></i>
  </span>
</div>
</template>
<script lang="ts" src="./view-ticket.ts"></script>
<style lang="scss" scoped src="./view-ticket.scss"></style>
