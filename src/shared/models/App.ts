import AppApi from "../apis/AppApi";
import AppStore from "../stores/AppStore";
import UiStore from "../stores/UiStore";

export class MainApp {
  store: AppStore;
  api: AppApi;
  ui: UiStore;

  constructor() {
    this.store = new AppStore(this);
    this.api = new AppApi(this.store);
    this.ui = new UiStore();
  }

  get properties() {
    return { store: this.store, api: this.api, ui: this.ui };
  }
}
