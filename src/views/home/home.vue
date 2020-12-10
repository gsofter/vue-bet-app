<template>
<div id="home">
  <div v-if="isLoading" class="app-spinner">
    <b-spinner variant="white" label="Spinner"></b-spinner>
  </div>
  <template v-else>
    <header>
      <app-header v-bind:isLoggedIn="isLoggedIn" v-on:isLogInSuccess="isLogInSuccess" v-on:logout="logout"></app-header>
    </header>
    <div class="body-container">
      <router-view :isLoggedIn="isLoggedIn" />
    </div>
  </template>
</div>
</template>

<script lang="ts" src="./home.ts"></script>
<style lang="scss" scoped src="./home.scss"></style>
