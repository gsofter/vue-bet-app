<template>
<div id="live-popup-market">
  <div class="panel col-md-12">
    <table class="table">
      <tbody>
        <tr>
          <td colspan="8">{{translate($i18n.locale,fixture,'LocationName')}} {{fixture.LeagueName}}</td>
          <td><i class="fa fa-futbol-o" aria-hidden="true"></i></td>
          <td><strong>HT</strong></td>
          <td><img :src="require(`@/assets/images/ic_14.png`)" /> </td>
          <td><img :src="require(`@/assets/images/ic_15.png`)" /> </td>
          <td><img :src="require(`@/assets/images/ic_16.png`)" /> </td>
        </tr>
        <tr>
          <td colspan="8">{{translate($i18n.locale,fixture,'ParticipantsName1')}}</td>
          <td><strong>{{fixture.HG_AG}}</strong></td>
          <td><strong>{{fixture.Goal_H1}}</strong></td>
          <td><strong>{{fixture.Corners1}}</strong></td>
          <td><strong>{{fixture.Yellow_cards1}}</strong></td>
          <td><strong>{{fixture.Red_cards1}}</strong></td>
        </tr>
        <tr>
          <td colspan="8">{{translate($i18n.locale,fixture,'ParticipantsName2')}}</td>
          <td><strong>{{fixture.HG_AG}}</strong></td>
          <td><strong>{{fixture.Goal_H2}}</strong></td>
          <td><strong>{{fixture.Corners2}}</strong></td>
          <td><strong>{{fixture.Yellow_cards2}}</strong></td>
          <td><strong>{{fixture.Red_cards2}}</strong></td>
        </tr>
      </tbody>
    </table>
    <div class="all">
      <h4>{{$t('All')}}</h4>
    </div>
    <div class="extra-markets">
      <component v-bind:selectedTipList="selectedTipList" v-for="(market,index) in popupMarkets" :key="index" v-on:onSelectTip="onSelectTip" ref="component" :is="market.type" v-bind:sportId="fixture.SportId" v-bind:market="market">
      </component>
    </div>
  </div>
  <span class="close" title="Close" @click="close()">
    <i class="icon"></i>
  </span>
</div>
</template>
<script lang="ts" src="./live-popup-market.ts"></script>
<style lang="scss" scoped src="./live-popup-market.scss"></style>
