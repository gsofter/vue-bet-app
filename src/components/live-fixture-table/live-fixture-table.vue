<template>
<div id="live-fixture-table">
  <div v-if="isLoading" class="app-spinner">
    <b-spinner variant="white" label="Spinner"></b-spinner>
  </div>
  <template v-else>
    <template v-for="(fixture,index) in liveFixturesData">
      <template v-if="fixture">
        <live-fixture-header v-bind:class="{'hide': !countryIsSame(fixture.LocationId)}" :ref="fixture.fixtureId" v-if="fixture.country_show === 1" :sportId="sportId" :markets="markets" :fixture="fixture">
        </live-fixture-header>
        <live-fixture-row v-bind:class="{'hide': !countryIsSame(fixture.LocationId)}" :key="fixture.fixtureId" v-bind:selectedTipList="selectedTips" v-on:onSelectTip="onSelectTip" v-on:onChangeSelectedTip="onChangeSelectedTip" v-bind:fixtureId="fixture.fixtureId"
          v-on:onDisableChange="onDisableChange" v-on:onStatusChange="onStatusChange" v-bind:config="config">
        </live-fixture-row>
      </template>
    </template>
  </template>
</div>
</template>
<script lang="ts" src="./live-fixture-table.ts"></script>
<style lang="scss" scoped src="./live-fixture-table.scss"></style>
