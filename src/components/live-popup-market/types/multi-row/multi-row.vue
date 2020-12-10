<template>
<div id="popup-multi-row-market-type">
  <div class="row" v-for="odd in market.odds">
    <template v-for="(value, key) in odd">
      <div class="market-name">{{translateMarketName(sportId,market.name)}} {{key}}</div>
      <div class="sub-markets">
        <template v-for="betKey in odd">
          <div class="sub-row" v-bind:class="[`count-${data.length}`]" v-for="data in betKey">
            <div class="sub-market" v-bind:class="[`row-${index + 1}`]" v-for="(oddData,index) in data">
              <div class="sub-market-name">{{translateTipName(oddData.name)}}</div>
              <div class="sub-market-price" @click="onSelectTip(oddData)" v-bind:class="{'locked':oddData.status !==1, selected:arrayContains(selectedTipList,'id',oddData.id)}" :ref="oddData.id">
                <template v-if="oddData.status === 1">
                  {{oddData.price}}
                </template>
                <template v-else>
                  <img :src="require(`@/assets/images/lock.png`)" />
                </template>
              </div>
            </div>
          </div>
        </template>
      </div>
    </template>
  </div>
</div>
</template>
<script lang="ts" src="./multi-row.ts"></script>
<style lang="scss" scoped src="./multi-row.scss"></style>
