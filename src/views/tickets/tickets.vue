<template>
<div id="tickets">
  <b-container class="w-100 h-100" fluid>
    <b-row>
      <b-col col lg="12" md="12" sm="12" xs="12" class="h-100">
        <div class="tickets h-100">
          <div class="table h-100">
            <div class="menu-list">
              <ul class="menu">
                <li class="item" v-for="date in filterByDates" @click="onSelectFilter(date)">
                  <a v-bind:class="{'active': activeFilter.label === date.label}">{{date.label}}</a>
                </li>
                <li class="item">
                  <b-dropdown text="Other" class="other-dropdown">
                    <template v-for="otherDate in filterByOtherDates">
                      <b-dropdown-item @click="onSelectFilter(otherDate)">
                        <a v-bind:class="{'active': activeFilter.label === otherDate.label}">{{otherDate.label}}</a>
                      </b-dropdown-item>
                    </template>
                  </b-dropdown>
                </li>
                <li class="item">
                  <b-dropdown text="View by types" class="view-dropdown">
                    <template v-for="filter in viewByFilters">
                      <b-dropdown-item @click="onSelectViewFilter(filter)">
                        <a v-bind:class="{'active': activeViewFilter === filter}">{{filter.label}}</a>
                      </b-dropdown-item>
                    </template>
                  </b-dropdown>
                </li>
              </ul>
            </div>
            <div class="ticket-details">
              <b-table id="tickets-table" :items="ticketList" :fields="fields" small show-empty>
                <template v-slot:cell(status)="ticketList">
                  <span>{{$t(ticketList.item.Status)}}</span>
                </template>
                <template v-slot:cell(action)="ticketList">
                  <b-button @click="viewTicket(ticketList.item.TicketsNo)" class="view-button">{{$t('View')}}</b-button>
                </template>
              </b-table>
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

<script lang="ts" src="./tickets.ts"></script>
<style lang="scss" scoped src="./tickets.scss"></style>
