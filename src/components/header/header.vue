<template>
<div id="app-header">
  <b-container class="header-container">
    <b-row>
      <b-col>
        <img src="@/assets/images/bet-one.jpg">
      </b-col>
      <b-col class="no-padding">
        <ul class="nav">
          <li v-for="(sport,index) in sports" v-bind:key="index">
            <router-link :to="{ name: 'sport', params: { sportName: sport.displayName }}" replace @click.native="onSelectSport(sport)">{{ $t(sport.displayName)}}
              <br />
              <img :src="require(`@/assets/images/${toLowerCase(sport.displayName)}.png`)" />
            </router-link>
          </li>
          <li>
            <router-link :to="{ name: 'livecasino'}" replace>{{$t('Live Casino')}}
              <br />
              <span><i class="fa fa-cloud"></i></span>
            </router-link>
          </li>
          <li>
            <router-link :to="{ name: 'livebingo'}" replace>{{$t('Live Bingo')}}
              <br />
              <span><i class="fa fa-cloud"></i></span>
            </router-link>
          </li>
          <li>
            <router-link :to="{ name: 'casino'}" replace>{{$t('Casino')}}
              <br />
              <span><i class="fa fa-cloud"></i></span>
            </router-link>
          </li>
          <li class="disable">
            <a>
              {{currentTime}}
              <br />
              <img :src="require(`@/assets/images/casino.png`)" />
            </a>
          </li>
        </ul>
      </b-col>
      <b-col class="right-panel">
        <b-dropdown variant="black" class="language-btn pull-right">
          <template slot="button-content">
            <img :src="`${selectedLanguage.imageName}`" />
          </template>
          <b-dropdown-item v-for="language in languages" :key="language.id" :value="language.id" @click.prevent="onSelectLanguage(language)">
            <img :src="`${language.imageName}`" />
          </b-dropdown-item>
        </b-dropdown>
        <div class="account-info" v-if="isLoggedIn">
          <b-dropdown :text="$t('My Account')" variant="black" class="pull-right account-dropdown-list">
            <b-dropdown-item>
              <router-link to="/payout">{{$t('Payout')}}</router-link>
            </b-dropdown-item>
            <b-dropdown-item>
              <router-link to="/tickets">{{$t('Tickets')}}</router-link>
            </b-dropdown-item>
            <b-dropdown-item>
              <router-link to="/account-statement">{{$t('Account Statement')}}</router-link>
            </b-dropdown-item>
            <b-dropdown-item>
              <router-link to="/change-password">{{$t('Change Password')}}</router-link>
            </b-dropdown-item>
            <b-dropdown-item @click="logout()">
              <span class="text-white">{{$t('Logout')}}</span>
            </b-dropdown-item>
          </b-dropdown>
          <span>{{profile.username}} {{userBalance}} ({{profile.currency}})</span>
        </div>
        <template v-else>
          <b-button variant="black" @click="showLogin()" class="sign-in-btn pull-right">{{ $t('Sign In')}}</b-button>
        </template>
        <div class="btn group">
          <b-dropdown variant="black" class="theme-btn pull-right">
            <template slot="button-content">
              <span>{{selectedTheme.label}}</span>
            </template>
            <b-dropdown-item v-for="theme in themes" :key="theme.id" :value="theme.id" @click.prevent="onSelectTheme(theme)">
              <span>{{theme.label}}</span>
            </b-dropdown-item>
          </b-dropdown>
          <b-button class="full-screen-btn" @click="fullScreenMode()" variant="light" size="sm">
            <i class="fa fa-expand"></i>
          </b-button>
        </div>
      </b-col>
    </b-row>
  </b-container>
  <login :show="isShow" v-on:onCloseLogin="onCloseLogin" v-on:isLogInSuccess="isLogInSuccess"></login>
</div>
</template>
<script lang="ts" src="./header.ts"></script>
<style lang="scss" scoped src="./header.scss"></style>
