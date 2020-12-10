import Vue from 'vue';
import VueCookies from 'vue-cookies-ts';
import * as firebase from 'firebase/app';
import 'firebase/database';
import App from '@/app/app.vue';
import router from './router';
import store from './store/';
import i18n from './i18n';
import VueMaterialIcon from 'vue-material-icon';
import {
  toLowerCase,
  formatTime,
  isOverUnder,
  formatDate,
  isToday,
  translateTipName,
  translateMarketName,
  getMarketNameFromId,
  arrayContains,
  translate,
  subtract,
} from '@/helper/helper';
Vue.config.productionTip = false;
Vue.use(VueCookies);
Vue.mixin({
  methods: {
    toLowerCase,
    formatTime,
    isOverUnder,
    formatDate,
    isToday,
    translateTipName,
    translateMarketName,
    getMarketNameFromId,
    arrayContains,
    translate,
    subtract,
  },
});
Vue.component(VueMaterialIcon.name, VueMaterialIcon);
const firebaseConfig = {
  apiKey: 'AIzaSyCey_2G2w74l36LWTbAdOj4SKkX2tYZvRg',
  authDomain: 'betone-c6f67.firebaseapp.com',
  // databaseURL: 'https://betone-c6f67.firebaseio.com',
  databaseURL: 'https://betone-c6f67-64ef7.firebaseio.com',
  projectId: 'betone-c6f67',
  storageBucket: 'betone-c6f67.appspot.com',
  messagingSenderId: '441439100088',
  appId: '1:441439100088:web:cacb17aa63c3dfba28684d',
};
firebase.initializeApp(firebaseConfig);

new Vue({
  router,
  store,
  i18n,
  render: (h) => h(App),
}).$mount('#app');

export const db = firebase.database();
