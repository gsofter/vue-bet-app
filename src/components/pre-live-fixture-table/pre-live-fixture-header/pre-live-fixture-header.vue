<template>
<div id="pre-live-fixture-header">
  <div class="row header">
    <div class="free-space">
      <span class="country-name">{{$t(countryName)}} - {{$t(leagueName)}}</span>
    </div>
    <div class="item" v-for="market in markets">
      <template v-for="(data, marketName) in market">
        <div class="market-name">{{translateMarketName(sportId,marketName,true)}}</div>
        <div class="sub-row">
          <template v-for="odd in data.odds">
            <div class="sub-item">{{translateTipName(odd)}}</div>
          </template>
        </div>
      </template>
    </div>
    <div class="last-item"></div>
  </div>
</div>
</template>
<script lang="ts" src="./pre-live-fixture-header.ts"></script>
<style lang="scss" scoped src="./pre-live-fixture-header.scss"></style>
