import Vue from 'vue';
import App from './App.vue';
import ElementUI from 'element-ui';
import locale from 'element-ui/lib/locale/lang/en';

import 'element-ui/lib/theme-chalk/index.css';
import './registerServiceWorker';
import router from './router';
import store from './store';
import api from '@/services/api.service';

Vue.config.productionTip = false;
api.init(process.env.VUE_APP_BASE_URL);
Vue.use(ElementUI, { locale });

Vue.filter('capitalize', (value: string) => {
  if (!value) return '';
  value = value.toString();
  return value.charAt(0).toUpperCase() + value.slice(1);
});

new Vue({
  router,
  store,
  render: (h) => h(App),
}).$mount('#app');
