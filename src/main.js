import { createApp } from 'vue'
import App from './App.vue'
import router from './router'
import store from './store'
import axios from "axios";
import VueAxios from "vue-axios";
import CoreuiVue from '@coreui/vue'
import CIcon from '@coreui/icons-vue'
import { iconsSet as icons } from '@/assets/icons'
import DocsExample from '@/components/DocsExample'
import ApiService from '@/store/api.service'
import Select2 from 'vue3-select2-component';
import VueApexCharts from "vue3-apexcharts";
import { OhVueIcon  } from "oh-vue-icons";
import VueSignaturePad  from "vue-signature-pad";
import JsonExcel from "vue-json-excel3";
import '@/styles/main.scss';


import Toast from "vue-toastification";
import "vue-toastification/dist/index.css";
import 'vue-loading-overlay/dist/css/index.css';
import "vue3-toastify/dist/index.css";

import mitt from 'mitt';
const emitter = mitt();


const app = createApp(App)
app.use(store)
app.use(router)
app.use(VueAxios, axios);
app.use(CoreuiVue)
app.use(Toast);
app.use(VueSignaturePad);

app.provide('icons', icons)
app.component('CIcon', CIcon)
app.component('DocsExample', DocsExample)
app.component('Select2', Select2)
app.component("v-icon", OhVueIcon);
app.component("downloadExcel", JsonExcel);

app.use(VueApexCharts);

app.config.globalProperties.emitter = emitter;

ApiService.init();
app.mount('#app')
