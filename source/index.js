import Vue from "vue";
import "babel-polyfill";
import "whatwg-fetch";

import App from "./components/App";

new Vue({
  el: "main",
  render: hyperscript => hyperscript(App)
});
