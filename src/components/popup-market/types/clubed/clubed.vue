<template>
<div id="popup-clubed-market-type">
  <div class="row">
    <div class="market-name">{{translateMarketName(sportId,market.label)}}</div>
    <div class="sub-markets">
      <div class="sub-row" v-bind:class="[`count-${odd.length}`]" v-for="odd in market.odds">
        <div class="sub-market" v-bind:class="[`row-${index + 1}`]" v-for="(data,index) in odd">
          <div class="sub-market-name">{{translateTipName(data.name)}}</div>
          <div class="sub-market-price" @click="onSelectTip(data)" v-bind:class="{selected:arrayContains(selectedTips,'id',data.id)}">
            {{data.price}}
          </div>
        </div>
      </div>
    </div>
  </div>
</div>
</template>
<script lang="ts" src="./clubed.ts"></script>
<style lang="scss" scoped src="./clubed.scss"></style>
