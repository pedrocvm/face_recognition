import Vue from 'vue';
import VueRouter, { RouteConfig } from 'vue-router';
import Home from '@/views/Home.vue';
import Auth from '@/views/Auth.vue';

Vue.use(VueRouter);

const routes: Array<RouteConfig> = [
  {
    path: '/',
    redirect() {
      return { path: '/dashboard' };
    },
    component: Home,
  },
  {
    path: '/dashboard',
    name: 'Home',
    component: Home,
  },
  {
    path: '/auth',
    name: 'Auth',
    component: Auth,
  },
];

const router = new VueRouter({
  mode: 'history',
  base: process.env.BASE_URL,
  routes,
});

// router.beforeEach((to, from, next) => {
//   const isAuthenticated = localStorage.accessToken;

//   if (to.name !== 'Auth' && !isAuthenticated) {
//     next({ name: 'Auth' });
//   } else if (to.name === 'Auth' && isAuthenticated) {
//     next({ name: 'Home' });
//   } else next();
// });

export default router;
