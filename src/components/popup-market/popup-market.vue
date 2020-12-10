<template>
<div id="popup-market">
  <div class="panel col-md-12">
    <div class="ft-ground" v-if="isFootball">
      <img class="bg" :src="require(`@/assets/images/football_ground.png`)" />
      <div class="match-info">
        <div class="participiant-name">{{fixture.ParticipantsName1}} - {{fixture.ParticipantsName2}}</div>
      </div>
      <div class="league-name">{{$t(fixture.LocationName)}} {{fixture.LeagueName}}</div>
      <div class="start-date">
        {{formatTime(fixture.StartDate,'HH:mm')}}
        <template v-if="isToday(fixture.StartDate)">
          {{$t('Today')}}
        </template>
        <template v-else>
          {{formatDate(fixture.StartDate,'DD:MM')}}
        </template>
      </div>
    </div>
    <table class="table" v-else>
      <tbody>
        <tr>
          <td colspan="8">{{fixture.LeagueName}}</td>
          <td><i class="fa fa-futbol-o" aria-hidden="true"></i></td>
          <td><strong>HT</strong></td>
          <td><img :src="require(`@/assets/images/ic_14.png`)" /> </td>
          <td><img :src="require(`@/assets/images/ic_15.png`)" /> </td>
          <td><img :src="require(`@/assets/images/ic_16.png`)" /> </td>
        </tr>
        <tr>
          <td colspan="8">{{fixture.ParticipantsName1}}</td>
          <td><strong>0</strong></td>
          <td><strong>0</strong></td>
          <td><strong>0</strong></td>
          <td><strong>0</strong></td>
          <td><strong>0</strong></td>
        </tr>
        <tr>
          <td colspan="8">{{fixture.ParticipantsName2}}</td>
          <td><strong>0</strong></td>
          <td><strong>0</strong></td>
          <td><strong>0</strong></td>
          <td><strong>0</strong></td>
          <td><strong>0</strong></td>
        </tr>
      </tbody>
    </table>
    <div class="all">
      <h4>{{$t('All')}}</h4>
    </div>
    <div class="extra-markets">
      <component v-for="(market,index) in popupMarkets" :key="index" :is="market.type" v-on:onSelectTip="onSelectTip" v-bind:selectedTips="selectedTips" v-bind:sportId="sportId" v-bind:market="market">
      </component>
    </div>
  </div>
  <span class="close" title="Close" @click="close()">
    <i class="icon"></i>
  </span>
</div>
</template>
<script lang="ts" src="./popup-market.ts"></script>
<style lang="scss" scoped src="./popup-market.scss"></style>
