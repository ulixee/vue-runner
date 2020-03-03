// @ts-ignore
import App from 'dynamicAppTemplate';
import Vue from 'vue'

Vue.config.productionTip = false;

new Vue({
  render(h) {
    return h(App)
  },
}).$mount('#app');
