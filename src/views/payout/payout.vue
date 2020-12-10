<template>
<div id="payout" class="h-100">
  <b-container class="w-100 h-100" fluid>
    <b-row class="h-100">
      <b-col col lg="12" md="12" sm="12" xs="12" class="h-100">
        <div class="payout-container h-100">
          <div class="table h-100">
            <div class="header"></div>
            <div class="title">
              <span class="title-txt">{{$t('Payout')}}</span>
            </div>
            <div class="payout-form">
              <div class="h-100">
                <b-row>
                  <b-col col lg="6" md="8" sm="10" xs="10" class="align-left">
                    <b-row>
                      <b-col col lg="5" md="6" sm="6" xs="6">
                        <label for="amount">{{$t('Amount Available')}}</label>
                      </b-col>
                      <b-col col lg="1" md="1" sm="1" xs="1">
                        <span>:</span>
                      </b-col>
                      <b-col col lg="5" md="5" sm="5" xs="5">
                        <span>{{userBalance}}</span>
                      </b-col>
                    </b-row>
                    <b-row>
                      <b-col col lg="5" md="6" sm="6" xs="6">
                        <label for="request">{{$t('Request Payout')}}</label>
                      </b-col>
                      <b-col col lg="1" md="1" sm="1" xs="1">
                        <span>:</span>
                      </b-col>
                      <b-col col lg="5" md="5" sm="5" xs="5">
                        <input type="number" name="payout" v-model="requestPayout">
                      </b-col>
                    </b-row>
                    <b-row>
                      <div class="btn-container">
                        <button class="payout-btn" @click="payoutSubmit()" v-bind:class="{ disabled: !requestPayout }" type="submit">{{$t('Next')}}</button>
                      </div>
                    </b-row>
                  </b-col>
                </b-row>
              </div>
            </div>
            <b-modal id="show-payout-modal" hide-footer @hide="onClose()">
              <div class="payout-success-form lg-12">
                <div class="h-100">
                  <b-row>
                    <b-col col lg="6" md="8" sm="10" xs="10" class="align-left">
                      <b-row>
                        <b-col col lg="12" md="12" sm="12" xs="12" class="mb-2">
                          <span>{{$t(payoutSuccessMsg)}}</span>
                        </b-col>
                        <b-col col lg="5" md="6" sm="6" xs="6">
                          <label for="amount">{{$t('Amount Available')}}</label>
                        </b-col>
                        <b-col col lg="1" md="1" sm="1" xs="1">
                          <span>:</span>
                        </b-col>
                        <b-col col lg="5" md="5" sm="5" xs="5">
                          <span>{{userBalance}}</span>
                        </b-col>
                      </b-row>
                      <b-row v-if="password">
                        <b-col col lg="5" md="6" sm="6" xs="6">
                          <label for="request">{{$t('Password')}}</label>
                        </b-col>
                        <b-col col lg="1" md="1" sm="1" xs="1">
                          <span>:</span>
                        </b-col>
                        <b-col col lg="5" md="5" sm="5" xs="5">
                          <span v-model="password">{{password}}</span>
                        </b-col>
                      </b-row>
                    </b-col>
                  </b-row>
                </div>
              </div>
            </b-modal>
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

<script lang="ts" src="./payout.ts"></script>
<style lang="scss" scoped src="./payout.scss"></style>
