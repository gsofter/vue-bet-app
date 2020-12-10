<template>
<div id="pre-live-fixture-table">
  <template v-for="preFixture in preLiveFixtures">
    <template v-if="preFixture">
      <pre-live-fixture-header v-if="preFixture.country_show === 1" :sportId="sportId" :markets="markets" :leagueName="preFixture.LeagueName" :countryName="preFixture.LocationName">
      </pre-live-fixture-header>
      <pre-live-fixture-row v-bind:selectedTips="selectedTips" :key="preFixture.FixtureId" v-on:onSelectTip="onSelectTip" :fixture="preFixture" :config="config"></pre-live-fixture-row>
    </template>
  </template>
</div>
</template>
<script lang="ts" src="./pre-live-fixture-table.ts"></script>
<style lang="scss" scoped src="./pre-live-fixture-table.scss"></style>
