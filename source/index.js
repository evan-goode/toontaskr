import Vue from "vue";

import App from "./components/App";

new Vue({
  el: "main",
  render: hyperscript => hyperscript(App)
});
