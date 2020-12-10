<template>
<div id="live-fixture-row">
  <template v-if="fixture">
    <div class="overBall" v-bind:class="fixture.goal">
      <div class="ballBox"><span>
          <table class="White goalFont">
            <tr>
              <td>
                <img :src="require(`@/assets/images/ball1.png`)" />
              </td>
              <td> {{$t('Goal')}}
                <b v-show="fixture.goal_team == 1" class="Yellow">{{fixture.ParticipantsName1}}</b>
                <b v-show="fixture.goal_team == 2" class="Yellow">{{fixture.ParticipantsName2}}</b>
                {{$t('Score')}}
              </td>
            </tr>
          </table>
        </span></div>
    </div>
    <div class="row fixture">
      <div class="free-space">
        <div class="info">
          <div class="start-time">
            <template v-if="fixture.CurrentPeriod === 80">
              {{$t('HT')}}
            </template>
            <template v-else-if="(fixture.CurrentPeriod === 35 || fixture.CurrentPeriod === 20) && fixture.Time > 90">
              90+{{subtract(fixture.Time,90)}}
            </template>
            <template v-else-if="(fixture.CurrentPeriod === 30 || fixture.CurrentPeriod === 10) && fixture.Time > 45">
              45+{{subtract(fixture.Time,45)}}
            </template>
            <template v-else>
              {{fixture.Time}}
            </template>
          </div>
          <div class="participant-name">{{translate($i18n.locale,fixture,'ParticipantsName1')}}</div>
          <div class="score-board">
            <span>{{fixture.ParticipantsValue1}}</span>
            <span>:</span>
            <span>{{fixture.ParticipantsValue2}}</span>
          </div>
          <div class="participant-name">{{translate($i18n.locale,fixture,'ParticipantsName2')}}</div>
        </div>
        <div class="league-name-container" v-if="fixture.CurrentPeriod === 10 || fixture.CurrentPeriod === 30">
          <div class="league-name right ellipsis">{{fixture.LeagueName}}</div>
          <div class="text left">{{$t('1st Half')}}</div>
        </div>
      </div>
      <div class="items">
        <div class="match-end-animation" v-bind:class="{'active': showMatchEndAnimation}">
          <span>Match Finish</span>
        </div>
        <div class="item" v-for="market in fixture.markets">
          <div class="sub-row" v-bind:class="{ 'over-under': market.isUnderOver }">
            <div class="row-item" v-bind:class="{selected:arrayContains(selectedTipList,'id',odd.id),locked:odd.status !== 1}" :ref="odd.id" v-for="(odd,index) in market.odds" @click="onSelectTip(odd)">
              <template v-if="odd.status === 1">
                {{odd.price}}
              </template>
              <template v-else>
                <vue-material-icon name="lock"></vue-material-icon>
                <!-- <img :src="require(`@/assets/images/lock.png`)" /> -->
              </template>
            </div>
          </div>
          <div class="sub-row" v-if="fixture.CurrentPeriod === 10 || fixture.CurrentPeriod === 30" v-bind:class="{ 'over-under': market.isUnderOver }">
            <div class="row-item" v-bind:class="{selected:arrayContains(selectedTipList,'id',odd.id),locked:odd.status !== 1}" v-for="(odd,index) in market.child.odds" @click="onSelectTip(odd)">
              <template v-if="odd.status === 1">
                {{odd.price}}
              </template>
              <template v-else>
                <vue-material-icon name="lock"></vue-material-icon>
                <!-- <img :src="require(`@/assets/images/lock.png`)" /> -->
              </template>
            </div>
          </div>
        </div>
        <div class="last-item count">
          <a @click="openPopupMarket()">+20</a>
          <a><i class="fa fa-bar-chart"></i></a>
        </div>
      </div>
      <b-modal :id="`live-popup-market-modal-${fixture.fixtureId}`" class="popup" scrollable>
        <live-popup-market v-on:onChangeSelectedTip="onChangeSelectedTip" v-bind:selectedTips="selectedTips" v-bind:selectedTipList="selectedTipList" v-on:onSelectTip="onSelectTip" :fixture="fixture"></live-popup-market>
      </b-modal>
    </div>
</template>
</div>
</template>
<script lang="ts" src="./live-fixture-row.ts"></script>
<style lang="scss" scoped src="./live-fixture-row.scss"></style>
