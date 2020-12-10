import Vue from 'vue';
import i18n from '@/i18n';
import Router from 'vue-router';
import jwt from 'jsonwebtoken';
Vue.use(Router);

const routes = [
  {
    path: '/',
    name: 'home',
    component: () => import('./views/home/home.vue'),
    children: [
      {
        path: 'sport/:sportName',
        name: 'sport',
        component: () => import('./views/sport/sport.vue'),
      }, {
        path: 'livebingo',
        name: 'livebingo',
        component: () => import('./views/livebingo/livebingo.vue'),
        meta: { isRequiredAuth: true },
      }, {
        path: 'livecasino',
        name: 'livecasino',
        component: () => import('./views/livecasino/livecasino.vue'),
        meta: { isRequiredAuth: true },
      }, {
        path: 'casino',
        name: 'casino',
        component: () => import('./views/casino/casino.vue'),
        meta: { isRequiredAuth: true },
      }, {
        path: 'payout',
        name: 'payout',
        component: () => import('./views/payout/payout.vue'),
        meta: { isRequiredAuth: true },
      }, {
        path: 'account-statement',
        name: 'statement',
        component: () => import('./views/account-statement/account-statement.vue'),
        meta: { isRequiredAuth: true },
      }, {
        path: 'change-password',
        name: 'change-password',
        component: () => import('./views/change-password/change-password.vue'),
        meta: { isRequiredAuth: true },
      }, {
        path: 'tickets',
        name: 'tickets',
        component: () => import('./views/tickets/tickets.vue'),
        meta: { isRequiredAuth: true },
      },
    ],
  }];

const router = new Router({
  linkExactActiveClass: 'active',
  mode: 'history',
  base: process.env.BASE_URL,
  routes,
});


router.beforeEach((to, from, next) => {
  const token = Vue.cookies.get('bet1_session');
  if (to.meta.isRequiredAuth && !token) {
    next({ path: '/sport/Football' });
    alert(i18n.t('Please Sign In'));
  } else {
    next();
  }
});

export default router;
