import { createApp, VueElement } from "vue";
import App from "./App.vue";
import "./index.css";
import VueClipboard from "vue3-clipboard";

const app = createApp(App);
app.use(VueClipboard, {
  autoSetContainer: true,
  appendToBody: true,
});
app.mount("#app");
