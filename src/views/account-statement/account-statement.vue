<template>
<div id="ac-statement" class="h-100">
  <b-container class="w-100 h-100" fluid>
    <b-row class="h-100">
      <b-col col lg="12" md="12" sm="12" xs="12" class="h-100">
        <div class="account-container h-100">
          <div class="table h-100">
            <div class="title">
              <span class="title-txt">{{$t('Account Statement')}}</span>
            </div>
            <div class="statement-details">
              <b-table id="accounts-table" :items="statementList" :per-page="perPage" :current-page="currentPage" small>
                <template v-slot:cell(Statement)="statementList">
                  <span class="cursor-pointer" v-bind:class="{'disable':isDisable(statementList.item.Statement)}" @click="viewTicket(statementList.item.Statement)">{{statementList.item.Statement}}</span>
                </template>
              </b-table>
              <b-pagination v-model="currentPage" :total-rows="rows" :per-page="perPage">
              </b-pagination>
            </div>
          </div>
        </div>
      </b-col>
    </b-row>
  </b-container>
  <b-modal id="view-ticket">
    <view-ticket :ticketId="selectedTicketIdToView"></view-ticket>
  </b-modal>
  <div v-if="isLoading" class="app-spinner">
    <b-spinner variant="white" label="Spinner"></b-spinner>
  </div>
</div>
</template>

<script lang="ts" src="./account-statement.ts"></script>
<style lang="scss" scoped src="./account-statement.scss"></style>
