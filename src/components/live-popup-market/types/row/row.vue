<template>
<div id="popup-row-market-type">
  <div class="row">
    <div class="market-name">{{translateMarketName(sportId,market.name)}}</div>
    <div class="sub-markets">
      <div class="sub-row" v-bind:class="[`count-${odd.length}`]" v-for="odd in market.odds">
        <div class="sub-market" v-bind:class="[`row-${index + 1}`]" v-for="(data,index) in odd">
          <div class="sub-market-name">{{translateTipName(data.name)}}</div>
          <div class="sub-market-price" @click="onSelectTip(data)" v-bind:class="{'locked':data.status !== 1, selected:arrayContains(selectedTipList,'id',data.id)}" :ref="data.id">
            <template v-if="data.status === 1">
              {{data.price}}
            </template>
            <template v-else>
              <img :src="require(`@/assets/images/lock.png`)" />
            </template>
          </div>
        </div>
      </div>
    </div>
  </div>
</div>
</template>
<script lang="ts" src="./row.ts"></script>
<style lang="scss" scoped src="./row.scss"></style>
