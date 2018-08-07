// The Vue build version to load with the `import` command
// (runtime-only or standalone) has been set in webpack.base.conf with an alias.
import Vue from 'vue'
import App from './App'
import router from './router'
import 'bootstrap';
import 'jquery';
import axios from 'axios';
import VueAxios from 'vue-axios';
import * as VueGoogleMaps from 'vue2-google-maps';

Vue.config.productionTip = false;
Vue.use(VueAxios, axios);
Vue.use(VueGoogleMaps, {
  load: {
    key: 'AIzaSyCgx0VI6SXUs8cmy1vNNONCpOvLIh_Zi1Y',
    libraries: 'places',
  },
});
/* eslint-disable no-new */
new Vue({
  el: '#app',
  router,
  components: { App },
  template: '<App/>'
})
