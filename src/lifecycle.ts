import browser, {Menus, Tabs} from 'webextension-polyfill';
import {MENU_ITEM_ID} from './util';
import {Listeners} from './listeners';
import Tab = Tabs.Tab;
import OnClickData = Menus.OnClickData;

export class Lifecycle {
  init(onclick: (info: OnClickData, target: Tab) => void): void {
    browser.menus.create(
      {
        id: MENU_ITEM_ID,
        type: 'normal',
        contexts: ['tab'],
        title: browser.i18n.getMessage('labelCloseTabsToLeft'),
        onclick: onclick,
      },
      this.onCreated,
    );
  }

  onCreated(): void {
    browser.menus.onShown.addListener(Listeners.updateEnabledState);
    browser.menus.onHidden.addListener(Listeners.resetMenuInstanceState);
  }
}
