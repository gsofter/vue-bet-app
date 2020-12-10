<template>
<div id="change-password" class="h-100">
  <b-container class="w-100 h-100" fluid>
    <b-row class="h-100">
      <b-col col lg="12" md="12" sm="12" xs="12" class="h-100">
        <div class="password-container h-100">
          <div class="table h-100">
            <div class="title">
              <span class="title-txt">{{$t('Change Password')}}</span>
            </div>
            <div class="change-password-form">
              <div class="h-100">
                <b-row>
                  <b-col col lg="6" md="8" sm="12" xs="12" class="align-left">
                    <b-row>
                      <span class="d-flex" v-if="status == 'success' && successMessage"><i class="fa fa-check status-icon success"></i><span class="msg">{{successMessage}}</span></span>
                      <span class="d-flex" v-if="status === 'error' && successMessage"><i class="fa fa-times status-icon error"></i><span class="msg">{{successMessage}}</span></span>
                    </b-row>
                    <b-row>
                      <b-col col lg="5" md="6" sm="5" xs="5">
                        <label for="amount">{{$t('Old Password')}}</label>
                      </b-col>
                      <b-col col lg="1" md="1" sm="1" xs="1">
                        <span>:</span>
                      </b-col>
                      <b-col col lg="5" md="5" sm="6" xs="6">
                        <input v-model="oldPassword" type="password" name="oldPassword">
                      </b-col>
                    </b-row>
                    <b-row>
                      <b-col col lg="5" md="6" sm="5" xs="5">
                        <label for="amount">{{$t('New Password')}}</label>
                      </b-col>
                      <b-col col lg="1" md="1" sm="1" xs="1">
                        <span>:</span>
                      </b-col>
                      <b-col col lg="5" md="5" sm="6" xs="6">
                        <input v-model="newPassword" type="password" name="newPassword" @input="passwordCheck">
                      </b-col>
                    </b-row>
                    <b-row>
                      <b-col col lg="5" md="6" sm="5" xs="5">
                        <label for="amount">{{$t('Confirm Password')}}</label>
                      </b-col>
                      <b-col col lg="1" md="1" sm="1" xs="1">
                        <span>:</span>
                      </b-col>
                      <b-col col lg="5" md="5" sm="6" xs="6">
                        <input v-model="confirmPassword" type="password" name="confirmPassword" @input="passwordCheck">
                        <span v-if="isMismatch" class="text-danger">password not match</span>
                      </b-col>
                    </b-row>
                    <b-row>
                      <div class="btn-container">
                        <button class="submit-btn" v-bind:class="{ disabled: !oldPassword || !newPassword || !confirmPassword }" @click="changePassword()" type="submit">{{$t('Submit')}}</button>
                      </div>
                    </b-row>
                  </b-col>
                </b-row>
              </div>
            </div>
          </div>
        </div>
      </b-col>
    </b-row>
  </b-container>
  <div v-if="isLoading" class="app-spinner">
    <b-spinner variant="white" label="Spinner"></b-spinner>
  </div>
</div>
</template>

<script lang="ts" src="./change-password.ts"></script>
<style lang="scss" scoped src="./change-password.scss"></style>
