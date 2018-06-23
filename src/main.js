import Vue from "nativescript-vue";

import Liczba from "./components/Liczba";

import "./styles.scss";

Vue.config.silent = false;

new Vue({
  render: h => h(Liczba)
}).$start();
