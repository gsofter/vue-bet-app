<template>
<div id="login">
  <section>
    <b-container class="w-100" fluid>
      <b-row>
        <b-col col lg="12" md="12" sm="12" xs="12">
          <div class="signup-container" v-bind:class="{ active: show }">
            <div class="signup-form">
              <b-row>
                <b-col col lg="12" md="12" sm="12" xs="12">
                  <div>
                    <h3>{{ $t('Sign In')}}</h3>
                    <div class="close-btn" @click="closeLogin()">+</div>
                  </div>
                  <b-row class="content-center">
                    <b-col col lg="4" md="6" sm="8" xs="10" class="login">
                      <label for="userName">{{$t('Username')}}</label>
                      <input type="text" v-model="userName" name="userName" autocomplete="username" class="login-input">
                      <label for="userName">{{$t('Password')}}</label>
                      <input type="password" v-model="password" name="password" autocomplete="new-password" class="login-input">
                    </b-col>
                  </b-row>
                </b-col>
              </b-row>
              <b-row class="content-center">
                <b-col col lg="4" md="6" sm="8" xs="10">
                  <b-row>
                    <b-col col lg="9" md="9" sm="9" xs="8" class="link pad-0">
                      <a>{{$t('Forgot your password')}}</a> &nbsp;
                      <a>{{$t('Create an account')}}</a>
                    </b-col>
                    <b-col col lg="3" md="3" sm="3" xs="4" class="btn-container pad-0">
                      <button type="submit" @click="login()" v-bind:class="{ disabled: !userName || !password }">{{ $t('Sign In')}}</button>
                    </b-col>
                  </b-row>
                </b-col>
              </b-row>
            </div>
            <div class="form-close">
              <i class="fa fa-chevron-up" @click="closeLogin()"></i>
            </div>
          </div>
        </b-col>
      </b-row>
    </b-container>
    <div v-if="isLoading" class="app-spinner">
      <b-spinner variant="white" label="Spinner"></b-spinner>
    </div>
  </section>
</div>
</template>

<script lang="ts" src="./login.ts"></script>
<style lang="scss" scoped src="./login.scss"></style>
