<template>
<div id="sport-countries-list">
  <div class="countries-container" ref="countriesContainerRef" lg="12" sm="12" md="12">
    <ul class="left-panel">
      <li v-if="sportId && currentSport" v-bind:class="{ active: isLiveMatch}">
        <a class="ellipsis" @click="selectLiveMatch()"> {{ $t(`${currentSport.sportName} Live`)}}</a>
      </li>
      <li v-if="sportId && currentSport" v-bind:class="{ active: isTodayMatch}">
        <a class="ellipsis" @click="selectTodayMatch()"> {{ $t(`${currentSport.sportName} Today`)}}</a>
      </li>
      <li v-for="country in countries" v-bind:class="{ active: country.countryId === selectedCountry.countryId && !isLiveMatch && !isTodayMatch}">
        <a class="ellipsis" @click="selectCountry(country)"> {{ $t(country.countryName)}}</a>
      </li>
    </ul>
    <template v-if="isPaginate">
      <ul class="right-panel">
        <li class="search">
          <b-form-input v-model="searchText" placeholder="Search"></b-form-input>
          <div class="auto-suggest">
            <div class="item" @click="selectAutoSuggestItem(country)" v-for="country in filteredCountries">
              {{ $t(country.countryName)}}
            </div>
          </div>
        </li>
        <li class="btn group no-padding">
          <b-button class="prev-btn" @click="previous()" size="sm">
            <i class="fa fa-chevron-left"></i>
          </b-button>
          <span> {{currentPage}}/{{totalPages}} </span>
          <b-button class="next-btn" @click="next()" size="sm">
            <i class="fa fa-chevron-right"></i>
          </b-button>
        </li>
      </ul>
    </template>
  </div>
</div>
</template>

<script lang="ts" src="./sport-countries-list.ts"></script>
<style lang="scss" scoped src="./sport-countries-list.scss"></style>
